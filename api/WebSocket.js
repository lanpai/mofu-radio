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
    ws.send(JSON.stringify({ type: 'UPDATE_LISTENERS', count: listenerCount + proxyListenerCount }));

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
                case 'PING':
                    ws.send(JSON.stringify({
                        type: 'PONG'
                    }));
                    return;
                case 'FETCH_LIST':
                    // FUZZY SEARCHING THROUGH DATABASE
                    let filter = message.filter || '*';

                    let filtered = db.read().get('songs');
                    let result = [];

                    let filterArr = [];
                    let string = '';

                    function pushBack() {
                        if (string !== '')
                            filterArr.push(string);
                        string = '';
                    }

                    let inQuotes = false;
                    for (let character of filter) {
                        switch (character) {
                            case '"':
                                inQuotes = !inQuotes;
                                break;
                            case ':':
                                string += ':';
                                if (!inQuotes)
                                    pushBack();
                                break;
                            case ' ':
                                if (!inQuotes)
                                    pushBack();
                                else
                                    string += ' ';
                                break;
                            default:
                                string += character;
                        }
                    }
                    pushBack();

                    let take = 20;
                    let stride = 0;

                    filter = '';
                    for (let i = 0; i < filterArr.length; i++) {
                        let val = '';
                        switch (filterArr[i]) {
                            case 'id:':
                                val = filterArr[++i] || '';
                                val = val.split(',');
                                filtered = filtered.filter(song => {
                                    for (let id of val)
                                        if (id === `${song.id}`)
                                            return true;
                                    return false;
                                });
                                break;
                            case 'artist:':
                                val = filterArr[++i] || '';
                                val = val.toLowerCase();
                                filtered = filtered.filter(song => {
                                    return (
                                        (song.artist ? song.artist.toLowerCase().indexOf(val) != -1 : false) ||
                                        (song.en.artist ? song.en.artist.toLowerCase().indexOf(val) != -1 : false)
                                    );
                                });
                                break;
                            case 'title:':
                                val = filterArr[++i] || '';
                                val = val.toLowerCase();
                                filtered = filtered.filter(song => {
                                    return (
                                        (song.title ? song.title.toLowerCase().indexOf(val) != -1 : false) ||
                                        (song.en.title ? song.en.title.toLowerCase().indexOf(val) != -1 : false)
                                    );
                                });
                                break;
                            case 'tags:':
                                val = filterArr[++i] || '';
                                val = val.toLowerCase();
                                filtered = filtered.filter(song => {
                                    return (
                                        (song.tags ? song.tags.toLowerCase().indexOf(val) != -1 : false) ||
                                        (song.en.tags ? song.en.tags.toLowerCase().indexOf(val) != -1 : false)
                                    );
                                });
                                break;
                            case 'sort:':
                                val = filterArr[++i] || '';
                                val = val.toLowerCase();
                                switch (val) {
                                    case 'new':
                                        filtered = filtered.sortBy([ 'id' ]).reverse();
                                        break;
                                    case 'top':
                                        filtered = filtered.sortBy([ 'timesReq' ]).filter(song => { return song.timesReq > 0 }).reverse();
                                        break;
                                    case 'recent':
                                        filtered = filtered.sortBy(song => {
                                            if (song.stats)
                                                return song.stats.lastPlayed;
                                        }).filter(song => {
                                            if (song.stats)
                                                return song.stats.lastPlayed < Date.now();
                                        }).reverse();
                                        break;
                                }
                                break;
                            case 'take:':
                                val = filterArr[++i] || '';
                                val = parseInt(val);
                                if (val)
                                    take = Math.max(val, 1);
                                break;
                            case 'stride:':
                                val = filterArr[++i] || '';
                                val = parseInt(val);
                                if (val)
                                    stride = Math.max(val, 0);
                                break;
                            default:
                                filter += filterArr[i] + ' ';
                        }
                    }
                    filter = filter.trim();
                    
                    if (filter === '*' || filter == '')
                        result = filtered.value();
                    else {
                        let fuse = new Fuse(filtered.value(), fuseOptions);
                        result = fuse.search(filter);
                    }

                    result = result.slice(stride, stride + take);

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

var listenerCount = 0;
var proxyListenerCount = 0;
var proxyListeners = {};
function UpdateListenerCount(count) {
    listenerCount = count;
    wsBroadcastImmediate({
        type: 'UPDATE_LISTENERS',
        count: listenerCount + proxyListenerCount
    });
}

function UpdateProxyListenerCount(proxyKey, count) {
    if (count === 0)
        delete proxyListeners[proxyKey];
    else
        proxyListeners[proxyKey] = count;

    let newProxyListenerCount = 0;
    for (let proxyCount of Object.values(proxyListeners))
        newProxyListenerCount += proxyCount;

    if (proxyListenerCount !== newProxyListenerCount) {
        proxyListenerCount = newProxyListenerCount;

        wsBroadcastImmediate({
            type: 'UPDATE_LISTENERS',
            count: listenerCount + proxyListenerCount
        });
    }
}

module.exports = {
    wsBroadcast, wsBroadcastImmediate,
    UpdateListenerCount, UpdateProxyListenerCount
};
