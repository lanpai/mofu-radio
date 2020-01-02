// REQUIRING AND INITIALIZING LOWDB
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
var db = low(new FileSync('db.json'));
var config = low(new FileSync('config.json'));

config.defaultsDeep({
    version: 'pre-alpha-34ki',
    databaseVersion: '1.0',
    queue: {
        size: 5
    },
    directories: {
        disc: 'disc',
        queue: 'queue'
    },
    logging: {
        verbosity: 4
    },
    network: {
        port: 5127
    },
    icy: {
        name: 'mofu-radio',
        description: 'refactor of piyo-radio',
        genre: ''
    },
    audio: {
        bitrate: 320,
        sampleFreq: 44.1,
        chunkTime: 0.2,
        backBufferLength: 15
    }
}).write();

db.defaults({
    songs: [],
    requests: [],
    users: []
}).write();

function DB(path) {
    return db.get(path).value();
}

function Config(path) {
    return config.get(path).value();
}

function ReloadConfig() {
    config.read();
}

function AddSong(artist, title, file, options) {
    // RELOADING DATABASE
    db.read();

    // FETCHING ID
    let latest = db.get('songs').sortBy('id').last().value();
    let id = (latest ? latest['id'] : 0) + 1;

    // PUSHING SONG
    db.get('songs').push({
        id: id,
        file: file,
        artist: artist,
        title: title,
        options: options
    }).write();
}

module.exports = {
    db, config,
    DB, Config,
    ReloadConfig,
    AddSong
};
