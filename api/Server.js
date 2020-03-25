// MOFU-RADIO REQUIREMENTS
const { Config } = require('./Data.js');
const Log = require('./Log.js');
const { CurrentSong, NextSong, CurrentQueue } = require('./QueueHandler.js');

// BASIC REQUIREMENTS
const { Readable } = require('stream');
const http = require('http');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// REQUIRING NODE-LAME
const { Lame } = require('node-lame');

const LameOptions = {
    output: 'buffer',
    cbr: true
};

// REQUIRING NANOTIMER
const NanoTimer = require('nanotimer');

// DEFINING FILE READABLE STREAM
class FileReadable extends Readable {
    constructor(source, options) {
        super(options);

        this['fileSource'] = source;
    }

    _read(size) {
        let buffer = this['fileSource'].slice(0, size);
        this['fileSource'] = this['fileSource'].slice(size);

        // CHECKING FOR EMPTY BUFFER
        if (this['fileSource'].length === 0)
            this.emit('end');

        return buffer;
    }
}

// GLOBAL VARIABLES
const map = {
	'.ico': 'image/x-icon',
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.json': 'application/json',
	'.css': 'text/css',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.wav': 'audio/wav',
	'.mp3': 'audio/mpeg',
	'.svg': 'image/svg+xml',
};

var listeners = [];
var fileStream = null;
var nextFileStream = null;
var backBuffer = [];
var metadata = {};
var currentSong = null;

// INITIALIZING WEB SERVER METHODS
var server = http.createServer(
    function onRequest(req, res) {
        Log('received request for ' + req.url, 4);
        

        // PARSING GET REQUEST
        const get = req.url.split('?');
        const webPath = get[0] || '';
        const args = get[1] || '';

        switch (webPath) {
            case '/stream.mp3':
                res.writeHead(200, {
                    'Accept-Ranges': 'none',
                    'Cache-Control': 'no-cache,no-store,must-revalidate,max-age=0',
                    'Connection': 'keep-alive',
                    'Content-Type': 'audio/mpeg',
                    'icy-name': Config('icy.name'),
                    'icy-description': Config('icy.description'),
                    'icy-genre': Config('icy.genre'),
                    'icy-metaint': (Config('audio.bitrate') / 8) * 1000 * Config('audio.chunkTime')
                });

                // CHECK ICY HEADER
                let isIcy = (req.headers['icy-metadata'] || '0') === '1';

                // WRITING BACK BUFFER
                let dataSent = 0;
                backBuffer.forEach(obj => {
                    let buffer;
                    if (isIcy)
                        buffer = Buffer.concat([ obj.chunk, obj.metadata ]);
                    else
                        buffer = obj.chunk;

                    res.write(buffer);
                    dataSent += buffer.length;
                });

                // ADDING USER TO LISTENERS
                listeners.push({
                    isIcy: isIcy,
                    res: res,
                    dataSent: dataSent
                });
                
                Log(`received new listener on stream (listeners: ${listeners.length})`, 4);

                UpdateListenerCount(listeners.length);

                break;
            default:
                // ACCESSING FILES IN DIST
                let pathName = path.normalize('./dist/' + webPath);
                const ext = path.parse(webPath).ext;
                res.setHeader('Access-Control-Allow-Origin', 'none');

                fs.access(pathName, fs.constants.F_OK, (err) => {
                    if (err) {
                        res.writeHead(200, { 'Content-type': 'text/html' });
                        res.end(`404: File ${webPath} not found!`);
                        return;
                    }

                    if (fs.statSync(pathName).isDirectory())
                        pathName += 'index.html';

                    fs.readFile(pathName, (err, data) => {
                        if (err) {
                            res.statusCode = 500;
                            res.end(`500: Internal server error.`);
                        }
                        else {
                            res.writeHead(200, { 'Content-type': map[ext] || 'text/html' });
                            res.end(data);
                        }
                    });
                });
                break;
        }
    }
);

async function sendChunk(listener, chunk, metadata) {
    if (listener.isIcy)
        listener.res.write(Buffer.concat([ chunk, metadata ]));
    else
        listener.res.write(chunk);
    listener.dataSent += chunk.length;
}

async function sendChunkBulk(chunk, metadata) {
    for (let listener of listeners)
        sendChunk(listener, chunk, metadata)
}

function handleChunk() {
    // CREATING BUFFER
    let chunkSize = (Config('audio.bitrate') / 8) * 1000 * Config('audio.chunkTime');
    let chunk = Buffer.alloc(chunkSize);
    chunk.fill(fileStream._read(chunkSize));

    // CREATE METADATA
    let metaString = `StreamURL='https://mofu.piyo.cafe/';StreamTitle='${CurrentSong().title} (${CurrentSong().artist})';`;
    let metaSize = Math.ceil(Buffer.byteLength(Buffer.from(metaString, 'utf8')) / 16);
    let sizeBuffer = Buffer.alloc(1);
    sizeBuffer[0] = metaSize;

    let metaBuffer = Buffer.alloc(metaSize * 16);
    metaBuffer.write(metaString);

    let metadata = Buffer.concat([ sizeBuffer, metaBuffer ]);

    // ADDING CHUNK TO BACK BUFFER
    backBuffer.push({ chunk, metadata });
    if (Config('audio.backBufferLength') / Config('audio.chunkTime') < backBuffer.length)
        backBuffer.shift();

    // SENDING CURRENT CHUNK
    sendChunkBulk(chunk, metadata);

    // LISTENER CLEANUP
    let isCleaned = false;
    for (let i = listeners.length - 1; i >= 0; i--) {
        if (listeners[i].res.socket.writable === false) {
            Log(`cleaning up dead listener (data sent: ${listeners[i].dataSent} bytes) (listeners: ${listeners.length - 1})`, 4);
            listeners.splice(i, 1);
            isCleaned = true;
        }
    }
    if (isCleaned)
        UpdateListenerCount(listeners.length);
}

function encode(input, callback) {
    Log(`encoding "${input}"`, 4);

    // COPYING FILE TO TMP
    if (!fs.existsSync(Config('directories.tmp')))
        fs.mkdirSync(Config('directories.tmp'));
    fs.copyFileSync(`${Config('directories.disc')}/${input}`, `${Config('directories.tmp')}/${input}`);
    
    // STRIPPING ID3 TAGS
    execSync(`id3v2 --delete-all "${Config('directories.tmp')}/${input}"`);

    // RUNNING LAME ENCODER
    let encoder = new Lame({
        bitrate: Config('audio.bitrate'),
        resample: Config('audio.sampleFreq'),
        ...LameOptions
    }).setFile(`${Config('directories.tmp')}/${input}`);
    encoder.encode().then(function onEncoded() {
        // DELETE TMP FILE
        fs.unlinkSync(`${Config('directories.tmp')}/${input}`);

        callback(encoder.getBuffer());
    }).catch(function onEncodeErr(err) {
        Log(err, 1);
    });
}

function nextSong() {
    Log(`now playing "${currentSong.artist} - ${currentSong.title}"`, 3);

    // RETRIEVE QUEUE FROM QUEUEHANDLER
    let queue = CurrentQueue();

    wsBroadcast({
        type: 'UPDATE_SONG',
        currentSong: {
            ...currentSong,
            start: Date.now() + Config('backBufferLength') * 1000
        },
        queue: queue
    });

    if (fileStream === null)
        Log('file stream is null', 1);

    // LISTENER LOOP
    let timer = new NanoTimer();
    timer.setInterval(handleChunk, '', `${Config('audio.chunkTime')}s`);

    // PRELOADING NEXT SONG IN QUEUE
    encode(queue[0].file, function onEncoded(buffer) {
        nextFileStream = new FileReadable(buffer);
    });

    // END STATE
    fileStream.on('end', function onStreamEnd() {
        // CLEANING UP
        timer.clearInterval();
        fileStream.destroy();

        // LOADING PRELOADED STREAM
        fileStream = nextFileStream;

        // RETRIEVING NEXT SONG
        currentSong = NextSong();

        nextSong();
    });
}

server.listen(Config('network.port'),
    function onListen() {
        Log(`server is listening on ${Config('network.port')}`, 3);

        // ADDING FIRST SONG
        currentSong = NextSong();

        encode(currentSong.file, function onEncoded(buffer) {
            fileStream = new FileReadable(buffer);

            // CREATING BACK BUFFER
            for (let i = 0; i < Config('audio.backBufferLength') / Config('audio.chunkTime'); i++)
                handleChunk();

            nextSong();
        });
    }
);

module.exports = server;

// REQUIRING WSBROADCAST AFTER SERVER INITIALIZATION
const { wsBroadcast, wsBroadcastImmediate, UpdateListenerCount } = require('./WebSocket.js');
