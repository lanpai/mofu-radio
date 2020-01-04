// MOFU-RADIO REQUIREMENTS
const { db, Config, CanRequest } = require('./api/Data.js');
const Log = require('./api/Log.js');
const { queue, NextSong, Request } = require('./api/QueueHandler.js');

// BASIC REQUIREMENTS
const fs = require('fs');
const { Readable } = require('stream');
const http = require('http');
const { execSync } = require('child_process');

// REQUIRING WS
const WebSocket = require('ws');

// REQUIRING NODE-LAME
const { Lame } = require('node-lame');

const LameOptions = {
    output: 'buffer',
    cbr: true
};

// REQUIRING FUSE.JS
const Fuse = require('fuse.js');
const fuseOptions = {
    shouldSort: true,
    threshold: 0.8,
    location: 0,
    distance: 10,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        'artist', 'title', 'tags',
        'en.artist', 'en.title', 'en.tags'
    ]
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
        const path = get[0] || '';
        const args = get[1] || '';

        switch (path) {
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

                // WRITING BACK BUFFER
                let backBufferConcat = Buffer.concat(backBuffer);
                res.write(backBufferConcat);

                // ADDING USER TO LISTENERS
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

// INITIALIZING WEBSOCKET SERVER
const wss = new WebSocket.Server({ server });

wss.on('connection', function onWSConnection(ws, req) {
    let remoteAddr = req.connection.remoteAddress;
    Log(`received new socket connection (${remoteAddr})`, 4);

    // SENDING INITIAL DATA
    ws.send(JSON.stringify({ type: 'UPDATE_SONG', currentSong: currentSong, queue, queue }));

    ws.on('message', function onIncomingMessage(message) {
        try {
            try {
                message = JSON.parse(message);
            }
            catch (e) {
                Log(`failed to parse message JSON (${remoteAddr})\n` + e, 3);
                return;
            }

            switch (message.type) {
                case 'FETCH_LIST':
                    // FUZZY SEARCHING THROUGH DATABASE
                    let filter = message.filter || '';
                    let fuse = new Fuse(db.read().get('songs').value(), fuseOptions);
                    let result = fuse.search(filter);
                    ws.send(JSON.stringify({
                        type: 'UPDATE_LIST',
                        list: result
                    }));
                    return;
                case 'REQUEST':
                    if (message.id) {
                        // CHECKING IS USER CAN REQUEST
                        let canRequest = CanRequest(message.id, remoteAddr);
                        if (canRequest === true) {
                            Request(message.id, remoteAddr);
                            ws.send(JSON.stringify({
                                type: 'MESSAGE',
                                message: 'Song has been requested'
                            }));
                        }
                        else {
                            ws.send(JSON.stringify({
                                type: 'MESSAGE',
                                message: canRequest
                            }));
                        }
                    }
                    return;
                default:
                    Log('failed to determine type of socket message', 3)
                    return;
            }
        }
        catch (e) {
            Log(`error on socket message(${remoteAddr})\n` + e, 2);
        }
    });

    // CHECKING FOR VALID CONNECTION
    let alive = true;
    ws.on('pong', function pong() {
        alive = true;
    });
    const pingInterval = setInterval(function ping() {
        if (alive === false) return ws.terminate();

        alive = false;
        ws.ping(function noop() {});
    }, 3000);
});

async function wsBroadcast(message) {
    setTimeout(function onDelay() {
        let jsonMsg = JSON.stringify(message);
        wss.clients.forEach(function send(ws) {
            ws.send(jsonMsg);
        })
    }, Config('audio.backBufferLength') * 1000);
}

function interlaceIcyChunk(chunk, subchunk, stride, offset) {
    //return Buffer;
}

async function sendChunk(listener, chunk) {
    // interlace if necessary here
    listener.res.write(chunk);
    listener.dataSent += chunk.length;
}

async function sendChunkBulk(chunk) {
    for (let listener of listeners) {
        sendChunk(listener, chunk)
    }
}

function handleChunk() {
    // CREATING BUFFER
    let chunkSize = (Config('audio.bitrate') / 8) * 1000 * Config('audio.chunkTime');
    let chunk = fileStream._read(chunkSize);

    // ADDING CHUNK TO BACK BUFFER
    backBuffer.push(chunk);
    if (Config('audio.backBufferLength') / Config('audio.chunkTime') < backBuffer.length)
        backBuffer.shift();

    // SENDING CURRENT CHUNK
    sendChunkBulk(chunk);

    // LISTENER CLEANUP
    for (let i = listeners.length - 1; i >= 0; i--) {
        if (listeners[i].res.socket.writable === false) {
            Log(`cleaning up dead listener (data sent: ${listeners[i].dataSent} bytes) (listeners: ${listeners.length - 1})`, 4);
            listeners.splice(i, 1);
        }
    }
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
