// MOFU-RADIO REQUIREMENTS
const { Config } = require('./api/Data.js');
const Log = require('./api/Log.js');

// BASIC REQUIREMENTS
const fs = require('fs');
const { Readable } = require('stream');
const http = require('http');

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
var listeners = [];
var fileStream = null;
var backBuffer = [];
var metadata = {};

// INITIALIZING WEB SERVER METHODS
var server = http.createServer(
    function onRequest(req, res) {
        Log('received request for ' + req.url, 4);
        

        // PARSE GET REQUEST
        const get = req.url.split('?');
        const path = get[0] || '';
        const args = get[1] || '';

        switch (path) {
            case '/stream':
                res.writeHead(200, {
                    'Accept-Ranges': 'none',
                    'Cache-Control': 'no-cache,no-store,must-revalidate,max-age=0',
                    'Connection': 'close',
                    'Content-Type': 'audio/mpeg',
                    'icy-name': Config('icy.name'),
                    'icy-description': Config('icy.description'),
                    'icy-genre': Config('icy.genre'),
                    'icy-metaint': (Config('audio.bitrate') / 8) * 1000 * Config('audio.chunkTime')
                });

                // WRITE BACK BUFFER
                let backBufferConcat = Buffer.concat(backBuffer);
                res.write(backBufferConcat);

                // ADD USER TO LISTENERS
                listeners.push({
                    isIcy: (req.headers['icy-metadata'] || 0) === 1,
                    res: res,
                    dataSent: backBufferConcat.length
                });
                
                Log(`received new listener on stream (listeners: ${listeners.length})`, 4);

                break;
            default:
                res.writeHead(404);
                res.end();
                break;
        }
    }
);

function interlaceIcyChunk(chunk, subchunk, stride, offset) {
    //return Buffer;
}

function sendChunk(chunk) {
    for (let listener of listeners) {
        // interlace if necessary here
        listener.res.write(chunk);
        listener.dataSent += chunk.length;
    }
}

function nextSong() {
    fileStream = new FileReadable(fs.readFileSync('disc/MYTH & ROID - STYX HELIX.mp3'));
    fileStream.on('end', function onStreamEnd() {
        fileStream.destroy();
        nextSong();
    });
}

function listenerLoop() {
    // ALLOCATE BUFFER
    let chunkSize = (Config('audio.bitrate') / 8) * 1000 * Config('audio.chunkTime');
    let chunk = Buffer.alloc(chunkSize);

    // RETRIEVE CHUNK FROM STREAM
    let readChunk = fileStream._read(chunkSize);
    chunk.fill(readChunk, 0, readChunk.length);

    // ADD CHUNK TO BACK BUFFER
    backBuffer.push(chunk);
    if (Config('audio.backBufferLength') / Config('audio.chunkTime') < backBuffer.length)
        backBuffer.shift();

    // SEND CURRENT CHUNK
    sendChunk(chunk);

    // LISTENER CLEANUP
    for (let i = listeners.length - 1; i >= 0; i--) {
        if (listeners[i].res.socket.writable === false) {
            listeners.splice(i, 1);
            Log(`cleaning up dead listener (listeners: ${listeners.length})`, 4);
        }
    }
}

server.listen(Config('network.port'),
    function onListen() {
        Log(`server is listening on ${Config('network.port')}`, 3);

        // ADD FIRST SONG
        nextSong();

        // CREATE EMPTY BACK BUFFER
        for (let i = 0; i < Config('audio.backBufferLength') / Config('audio.chunkTime'); i++)
            listenerLoop();

        // LISTENER LOOP
        let timer = new NanoTimer();
        timer.setInterval(listenerLoop, '', `${Config('audio.chunkTime')}s`);
    }
);