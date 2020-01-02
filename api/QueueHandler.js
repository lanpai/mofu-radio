// MOFU-RADIO REQUIREMENTS
const { db, Config, ReloadDB } = require('./Data.js');
const Log = require('./Log.js');

var queue = [];

function AddSong() {
    // OLDEST SONG
    let song = db.read().get('songs').sortBy(song => { return song.stats ? song.stats.lastPlayed : 0 }).head();

    // ADDING TO QUEUE
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
        AddSong();

    return queue.shift();
}

module.exports = {
    queue, NextSong
};
