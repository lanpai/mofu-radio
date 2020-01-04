// MOFU-RADIO REQUIREMENTS
const { db, Config, ReloadDB, AddRequest } = require('./Data.js');
const Log = require('./Log.js');

var queue = [];

function PickSong() {
    // OLDEST SONG
    return db.read().get('songs').sortBy(song => { return song.stats ? song.stats.lastPlayed : 0 }).head().value().id;
}

function AddSong(id) {
    // ADDING TO QUEUE
    let song = db.read().get('songs').find({ id: id });

    queue.push(song.value());
    Log(`added "${song.value().artist} - ${song.value().title}" to the queue`, 3);

    // UPDATING STATS
    song.defaultsDeep({
            stats: {
                count: 0,
                lastPlayed: 0
            }
        })
        .get('stats')
        .update('count', n => (n || 0) + 1)
        .assign({ lastPlayed: Date.now() })
        .write();
}

function NextSong() {
    // FILLING QUEUE
    let deltaSize = Config('queue.size') - queue.length + 1;
    for (let i = 0; i < deltaSize; i++)
        AddSong(PickSong());

    return queue.shift();
}

function Request(id, ip) {
    AddSong(id);
    AddRequest(id, ip);
}

module.exports = {
    queue, NextSong,
    Request
};
