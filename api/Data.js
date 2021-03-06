// REQUIRING AND INITIALIZING LOWDB
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
var db = low(new FileSync('db.json'));
var config = low(new FileSync('config.json'));
var submissions = low(new FileSync('submissions.json'));
var discord = low(new FileSync('discord.json'));

db.defaults({
    songs: [],
    requests: [],
    users: []
}).write();

config.defaultsDeep({
    version: 'pre-alpha-34ki',
    databaseVersion: '1.0',
    queue: {
        size: 5
    },
    directories: {
        disc: 'disc',
        queue: 'queue',
        tmp: 'tmp',
        submissions: 'submissions'
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
        backBufferLength: 15,
        stripMetadata: true
    },
    cooldowns: {
        request: 5,
        song: 15,
        submit: 1,
        dailySubmissionCap: 10
    },
    submissions: {
        maxSubmissions: 800,
        maxUploadSize: 50,
        bypass: ''
    },
    discordToken: ''
}).write();

submissions.defaults({
    songs: []
}).write();

discord.defaults({
    servers: []
}).write();

function DB(path) {
    return db.get(path).value();
}

function Config(path) {
    return config.read().get(path).value();
}

function ReloadConfig() {
    config.read();
}

function AddSong(options) {
    // RELOADING DATABASE
    db.read();

    // FETCHING ID
    let latest = db.get('songs').sortBy('id').last().value();
    let id = (latest ? latest['id'] : 0) + 1;

    // PUSHING SONG
    db.get('songs').push({
        id: id,
        ...options
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
            return `Song is on cooldown for ${Math.floor(Config('cooldowns.song') - timeSincePlayed) + 1} more minute(s)`;
    }

    // CHECKING IF USER IS ON COOLDOWN
    if (db.get('requests').filter({ ip: ip }).size().value() > 0) {
        let timeSinceRequest = (Date.now() -
            db.get('requests').filter({ ip: ip }).sortBy('timestamp').last().value().timestamp) / 1000 / 60;
        if (timeSinceRequest < Config('cooldowns.request'))
            return `User on cooldown for ${Math.floor(Config('cooldowns.request') - timeSinceRequest) + 1} more minute(s)`;
    }

    return true;
}

function AddRequest(id, ip) {
    db.read().get('requests').push({
        id: id,
        ip: ip,
        timestamp: Date.now()
    }).write();
    let song = db.get('songs').find({ id: id });
    song.assign({ timesReq: song.value().timesReq ? song.value().timesReq + 1 : 1 }).write();
}

function CanSubmit(ip) {
    // CHECKING IF USER IS ON COOLDOWN
    if (submissions.get('songs').filter({ ip: ip }).size().value() > 0) {
        let timeSinceRequest = (Date.now() -
            submissions.get('songs').filter({ ip: ip }).sortBy('timestamp').last().value().timestamp) / 1000 / 60;
        if (timeSinceRequest < Config('cooldowns.submit'))
            return `User on cooldown (Once every ${Config('cooldowns.submit')} minute(s))`;

        if (submissions.get('songs').filter((song) => {
                return song.ip === ip && ((Date.now() - song.timestamp) / 1000 / 60) < 1440;
            }).size().value() >= Config('cooldowns.dailySubmissionCap'))
            return `User on cooldown (${Config('cooldowns.dailySubmissionCap')} every 24 hours)`;
    }

    return true;
}

function AddSubmission(data) {
    // FETCHING ID
    let latest = submissions.get('songs').sortBy('id').last().value();
    let id = (latest ? latest['id'] : 0) + 1;

    submissions.read().get('songs').push({
        id,
        ...data,
        status: 'TBD'
    }).write();
}

function CountSubmissions() {
    return submissions.read().get('songs').filter({ status: 'TBD' }).size().value();
}

module.exports = {
    db, config, submissions, discord,
    DB, Config,
    ReloadConfig,
    AddSong,
    CanRequest, AddRequest,
    CanSubmit, AddSubmission, CountSubmissions
};
