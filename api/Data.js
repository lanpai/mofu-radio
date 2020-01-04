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
        queue: 'queue',
        tmp: 'tmp'
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
        chunkTime: 0.1,
        backBufferLength: 15
    },
    cooldowns: {
        request: '5',
        song: '15'
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

function CanRequest(id, ip) {
    // RELOADING DATABASE
    db.read();

    // CHECKING IF SONG EXISTS
    if (db.get('songs').filter({ id: id }).size().value() <= 0)
        return 'Song does not exist';

    // CHECKING IF SONG IS ON COOLDOWN
    let song = db.get('songs').find({ id: id }).value();
    if (song.stats) {
        let timeSincePlayed = (Date.now() - 
            (db.get('songs').find({ id: id }).value().stats.lastPlayed || 0)) / 1000 / 60;
        if (timeSincePlayed < Config('cooldowns.song'))
            return `Song is on cooldown for ${Math.floor(Config('cooldowns.song') - timeSincePlayed) + 1} more minutes`;
    }

    // CHECKING IF USER IS ON COOLDOWN
    if (db.get('requests').filter({ ip: ip }).size().value() > 0) {
        let timeSinceRequest = (Date.now() -
            db.get('requests').filter({ ip: ip }).sortBy('timestamp').last().value().timestamp) / 1000 / 60;
        if (timeSinceRequest < Config('cooldowns.request'))
            return `User on cooldown for ${Math.floor(Config('cooldowns.request') - timeSinceRequest) + 1} more minutes`;
    }

    return true;
}

function AddRequest(id, ip) {
    db.read().get('requests').push({
        id: id,
        ip: ip,
        timestamp: Date.now()
    }).write();
}

module.exports = {
    db, config,
    DB, Config,
    ReloadConfig,
    AddSong,
    CanRequest, AddRequest
};
