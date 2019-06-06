// INITIALIZING WEBSOCKET AND HTTP SERVERS
const WebSocketServer = require('websocket').server;
const http = require('http');

// INITIALIZING UUID/V4
const uuidv4 = require('uuid/v4');

// INITIALIZING LOWDB
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = low(new FileSync('db.json'));
const config = low(new FileSync('config.json'));

config.defaults({
    version: 'pre-alpha-34ki',
    databaseVersion: '1.0',
    logging: {
        verbosity: 4
    },
    network: {
        port: 5127
    }
}).write();

db.defaults({
    songs: [],
    requests: [],
    users: []
}).write();

// INITIALIZING LOGGING
function log(log, verbosity) {
    if (config.get('logging.verbosity').value() >= verbosity) {
        var output = '';
        switch (verbosity) {
            case -1:
                output += '[SYSTEM]';
                break;
            case 0:
                output += '[FATAL]';
                break;
            case 1:
                output += '[ERROR]';
                break;
            case 2:
                output += '[WARNING]';
                break;
            case 3:
                output += '[INFO]';
                break;
            case 4:
                output += '[VERBOSE]';
                break;
        }
        output = output.padEnd(10, '.');
        var date = new Date();
        output += '[' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0') + '] : ' + log;
        console.log(output);
    }
}

// INITIALIZING WEB SERVER METHODS
var server = http.createServer(
    function onRequest(req, res) {
        log('received request for ' + req.url, 4);
        res.writeHead(404);
        res.end();
    }
);

server.listen(config.get('network.port').value(),
    function onListen() {
        log(`server is listening on ${config.get('network.port').value()}`, 3);
    }
);
