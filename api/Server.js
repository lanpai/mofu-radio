// MOFU-RADIO REQUIREMENTS
const { db, Config, CanSubmit, AddSubmission, CountSubmissions } = require('./Data.js');
const Log = require('./Log.js');
const { CurrentSong, NextSong, CurrentQueue } = require('./QueueHandler.js');
const { InitDiscord, SetTitle } = require('./Discord.js');

// BASIC REQUIREMENTS
const { Readable } = require('stream');
const http = require('http');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// REQUIRING EXPRESS
const express = require('express');
const app = express();
const multer = require('multer');

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
    '.m3u': 'application/octet-stream',
    '.pls': 'application/octet-stream'
};

var listeners = [];
var fileStream = null;
var nextFileStream = null;
var backBuffer = [];
var metadata = {};
var currentSong = null;

// INITIALIZING WEB SERVER METHODS
app.use(express.static('dist'));
app.use(express.json());

app.get('/stream.mp3', (req, res) => {
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

    let remoteAddr = req.headers['x-real-ip'] || req.connection.remoteAddress;

    // ADDING USER TO LISTENERS
    listeners.push({
        ip: remoteAddr,
        isIcy: isIcy,
        res: res,
        dataSent: dataSent,
        proxyKey: req.headers['proxy-key'] || ''
    });
    
    const newListenerCount = listeners.reduce((acc, curr) => (acc + ((curr.ip === '::1' || curr.ip === '::ffff:127.0.0.1') ? 0 : 1)), 0);
    Log(`received new listener on stream (listeners: ${newListenerCount})`, 4);

    UpdateListenerCount(newListenerCount);
});

const upload = multer({
    dest: '/tmp/uploads',
    limits: { fileSize: Config('submissions.maxUploadSize') * 1048576, parts: 8 }
});
const fileUpload = upload.single('file');
app.post('/api/submit', fileUpload, (req, res) => {
    let remoteAddr = req.headers['x-real-ip'] || req.connection.remoteAddress;
    let timestamp = Date.now();

    function badRequest() {
        res.status(400).end();
        if (req.file)
            fs.unlinkSync(path.join(req.file.destination, req.file.filename));
    }

    req.body.artist = req.body.artist.trim();
    req.body.title = req.body.title.trim();
    req.body.tags = req.body.tags.trim();
    req.body.musicbrainz = req.body.musicbrainz.trim();
    req.body.comments = req.body.comments.trim();

    if (CountSubmissions() >= Config('submissions.maxSubmissions')) {
        badRequest();
        return;
    }
    if (!req.file) {
        badRequest();
        return;
    }
    if (req.body.artist === '') {
        badRequest();
        return;
    }
    if (req.body.title === '') {
        badRequest();
        return;
    }
    if (req.body.type !== 'addition' && req.body.type !== 'replacement') {
        badRequest();
        return;
    }

    if (!(req.body.bypass === Config('submissions.bypass') && Config('submissions.bypass') !== '')) {
        let canSubmit = CanSubmit(remoteAddr);
        if (canSubmit !== true) {
            res.status(429).end(canSubmit);
            fs.unlinkSync(path.join(req.file.destination, req.file.filename));
            return;
        }
    }

    let fileName = `${req.body.artist} - ${req.body.title} ${timestamp}`.replace(/[\\\/:*?"<>|]/gi, '');
    if (req.file.originalname.split('.').pop() === 'mp3')
        fileName += '.mp3';
    else if (req.file.originalname.split('.').pop() === 'flac')
        fileName += '.flac';
    else {
        badRequest();
        return;
    }

    if (!fs.existsSync(Config('directories.submissions')))
        fs.mkdirSync(Config('directories.submissions'));
    fs.copyFileSync(req.file.path, path.join(Config('directories.submissions'), fileName));
    fs.unlinkSync(req.file.path);
    
    let data = {
        file: fileName,
        artist: req.body.artist,
        title: req.body.title,
        tags: req.body.tags,
        ip: remoteAddr,
        timestamp
    }

    if (req.body.musicbrainz)
        data.musicbrainz = req.body.musicbrainz;
    if (req.body.comments)
        data.comments = req.body.comments;

    AddSubmission(data);

    res.status(200).end('Successfully added song to submission queue');
});

app.get('/list', (req, res) => {
    const rows = db.read().get('songs').map(song => {
        return `
            <tr>
                <td class="center">${song.id}</td>
                <td>${song.artist}<br />${song.en && song.en.artist ? song.en.artist : ''}</td>
                <td>${song.title}<br />${song.en && song.en.title ? song.en.title : ''}</td>
                <td>${song.tags ? song.tags : ''}<br />${song.en && song.en.tags ? song.en.tags : ''}</td>
                <td class="center">${song.stats && song.stats.count ? song.stats.count : 0}</td>
                <td class="center">${song.stats && song.stats.lastPlayed ? new Date(song.stats.lastPlayed).toLocaleString("en-US") : ''}</td>
            </tr>
        `;
    }).value().join('');
    const template = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <title>Songs List (mofu-radio)</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500&display=swap');
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    td, th {
                        border: 1px solid black;
                        padding: 4px;
                        font-family: 'Noto Sans JP', sans-serif;
                        font-size: 13px;
                    }
                    tr:nth-child(even) {
                        background-color: #dddddd;
                    }
                    .center {
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <table>
                    <thead>
                        <tr>
                            <th onClick="sortTable(0)">ID</th>
                            <th>Artist</th>
                            <th>Title</th>
                            <th>Tags</th>
                            <th>Play Count</th>
                            <th>Last Played</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </body>
        </html>
    `;
    res.status(200).end(template);
});

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

var lastReadTime;
function handleChunk() {
    // CREATING BUFFER
    let chunkSize = (Config('audio.bitrate') / 8) * 1000 * Config('audio.chunkTime');
    let chunk = fileStream._read(chunkSize);

    // CHECKING FOR EOF (LOAD NEXT SONG)
    if (chunk.length < chunkSize)
        chunk = Buffer.concat([ chunk, fileStream._read(chunkSize - chunk.length) ]);

    // CREATE METADATA
    let metaString = `StreamURL='https://mofu.piyo.cafe/';StreamTitle='${CurrentSong().artist} - ${CurrentSong().title}`;
    if (CurrentSong().tags)
        metaString += ` (${CurrentSong().tags})`;
    metaString += '\';';
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
            Log(`cleaning up dead listener (data sent: ${listeners[i].dataSent} bytes)`, 4);
            listeners.splice(i, 1);
            isCleaned = true;
        }
    }
    if (isCleaned) {
        const newListenerCount = listeners.reduce((acc, curr) => (acc + ((curr.ip === '::1' || curr.ip === '::ffff:127.0.0.1') ? 0 : 1)), 0);
        Log(`removed dead listener(s) (listeners: ${newListenerCount})`, 4);

        UpdateListenerCount(newListenerCount);
    }
}

function encode(input, callback) {
    Log(`encoding "${input.file}"`, 4);

    // COPYING FILE TO TMP
    if (!fs.existsSync(Config('directories.tmp')))
        fs.mkdirSync(Config('directories.tmp'));
    fs.copyFileSync(`${Config('directories.disc')}/${input.file}`, `${Config('directories.tmp')}/${input.file}`);
    
    // STRIPPING ID3 TAGS
    if (Config('audio.stripMetadata'))
        execSync(`id3v2 --delete-all "${Config('directories.tmp')}/${input.file}"`);

    // RUNNING LAME ENCODER
    let encoder = new Lame({
        bitrate: Config('audio.bitrate'),
        resample: Config('audio.sampleFreq'),
        ...LameOptions
    }).setFile(`${Config('directories.tmp')}/${input.file}`);
    encoder.encode().then(function onEncoded() {
        // ESTIMATE DURATION
        let stats = fs.statSync(`${Config('directories.tmp')}/${input.file}`);
        let kbSize = stats.size / 125;
        input.estDuration = kbSize / Config('audio.bitrate');

        // DELETE TMP FILE
        fs.unlinkSync(`${Config('directories.tmp')}/${input.file}`);

        callback(encoder.getBuffer());
    }).catch(function onEncodeErr(err) {
        Log(err, 1);
    });
}

function nextSong(iter) {
    Log(`now playing #${iter} "${currentSong.artist} - ${currentSong.title}"`, 3);
    SetTitle(currentSong.title);

    // RETRIEVE QUEUE FROM QUEUEHANDLER
    let queue = CurrentQueue();

    if (iter == 0)
        currentSong.start = Date.now();
    else
        currentSong.start = Date.now() + Config('audio.backBufferLength') * 1000;

    wsBroadcast({
        type: 'UPDATE_SONG',
        currentSong: currentSong,
        queue: queue
    });

    if (fileStream === null)
        Log('file stream is null', 1);

    // PRELOADING NEXT SONG IN QUEUE
    encode(queue[0], function onEncoded(buffer) {
        nextFileStream = new FileReadable(buffer);
    });

    // END STATE
    fileStream.on('end', function onStreamEnd() {
        // CLEANING UP
        fileStream.destroy();

        // LOADING PRELOADED STREAM
        fileStream = nextFileStream;

        // RETRIEVING NEXT SONG
        currentSong = NextSong();

        nextSong(++iter);
    });
}

const server = http.createServer();

function InitServer() {
    // ADDING FIRST SONG
    currentSong = NextSong();

    encode(currentSong, async function onEncoded(buffer) {
        fileStream = new FileReadable(buffer);

        // CREATING BACK BUFFER
        for (let i = 0; i < Config('audio.backBufferLength') / Config('audio.chunkTime'); i++)
            handleChunk();

        server.listen(Config('network.port'), () => {
            Log(`server is listening on ${Config('network.port')}`, 3);
        });
        await InitDiscord();
        nextSong(0);

        // LISTENER LOOP
        var timer = new NanoTimer();
        var timeHandledChunk;
        timer.setInterval(() => {
            while (!timeHandledChunk || Date.now() - timeHandledChunk >= 1000 * Config('audio.chunkTime')) {
                if (timeHandledChunk)
                    timeHandledChunk += 1000 * Config('audio.chunkTime');
                else
                    timeHandledChunk = Date.now();
                handleChunk();
            }
        }, '', `${Config('audio.chunkTime')}s`);
    });
}

server.on('request', app);

module.exports = { server, InitServer };

// REQUIRING WSBROADCAST AFTER SERVER INITIALIZATION
const { wsBroadcast, wsBroadcastImmediate, UpdateListenerCount } = require('./WebSocket.js');
