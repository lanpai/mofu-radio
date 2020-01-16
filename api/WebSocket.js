// MOFU-RADIO REQUIREMENTS
const { CurrentSong, CurrentQueue, Request, GetSong } = require('./QueueHandler.js');
const Log = require('./Log.js');
const server = require('./Server.js');
const { db, Config, CanRequest } = require('./Data.js');

// REQUIRING WS
const WebSocket = require('ws');

// REQUIRING FUSE.JS
const Fuse = require('fuse.js');
const fuseOptions = {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 8,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        'artist', 'title', 'tags',
        'en.artist', 'en.title', 'en.tags'
    ]
};

// INITIALIZING WEBSOCKET SERVER
const wss = new WebSocket.Server({ server });

wss.on('connection', function onWSConnection(ws, req) {
    let remoteAddr = req.headers['x-real-ip'] || req.connection.remoteAddress;
    Log(`received new socket connection (${remoteAddr})`, 4);

    // SENDING INITIAL DATA
    ws.send(JSON.stringify({ type: 'UPDATE_SONG', currentSong: CurrentSong(), queue: CurrentQueue() }));

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
                    let filter = message.filter || '*';
                    let result = [];
                    if (filter === '*')
                        result = db.read().get('songs').value();
                    else {
                        let fuse = new Fuse(db.read().get('songs').value(), fuseOptions);
                        result = fuse.search(filter);
                    }
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
                            wsBroadcastImmediate({
                                type: 'PUSH_QUEUE',
                                song: GetSong(message.id)
                            });
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

async function wsBroadcastImmediate(message) {
    let jsonMsg = JSON.stringify(message);
    wss.clients.forEach(function send(ws) {
        ws.send(jsonMsg);
    })
}

module.exports = {
    wsBroadcast, wsBroadcastImmediate
};
