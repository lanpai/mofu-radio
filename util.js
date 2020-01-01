// ffmpeg -i "96Neko - Uso no Hibana.mp3" -b:a 320k -map 0:a -map_metadata -1 -y "usonohibana.mp3"
//https://coverartarchive.org/release/${idCAA}/front
//https://musicbrainz.org/ws/2/release/${idCAA}?fmt=json

// MOFU-RADIO REQUIREMENTS
const { db, Config, ReloadDB, AddSong } = require('./api/Data.js');

// BASIC REQUIREMENTS
const fs = require('fs');
const path = require('path');

// REQUIRING READLINE
const rls = require('readline-sync');

console.log('- mofu-radio utility -');

// CREATING DIRECTORIES
if (!fs.existsSync(Config('directories.disc')))
    fs.mkdirSync(Config('directories.disc'));
if (!fs.existsSync(Config('directories.queue')))
    fs.mkdirSync(Config('directories.queue'));

// CHECKING QUEUE DIRECTORY
const files = fs.readdirSync(Config('directories.queue'));

for (let file of files) {
    console.log(`File: "${file}"`);

    if (rls.question('Skip this song? (y/n) [n]: ') === 'y')
        continue;

    if (path.extname(file) !== '.mp3') {
        console.log('File must be an mp3!');
        continue;
    }

    // RELOAD DATABASE
    ReloadDB();

    let options = {};

    // GATHERING METADATA
    let artist = rls.question('Artist: ', { encoding: 'utf8' });
    console.log(artist + '96猫');
    let title = rls.question('Title: ');

    let tags = rls.question('Tags: ');
    if (tags !== '')
        options.tags = tags;

    // COVERARTARCHIVE
    let idCAA = rls.question('CoverArtArchive Album ID: ');
    if (idCAA !== '')
        options.coverArtArchive = idCAA;

    // DETERMINING FILE NAME
    console.log(artist);
    console.log(`New File: "${artist} - ${title}.mp3"`);
    let newFile = `${`${artist} - ${title}`.replace(/[\\\/:*?"<>|]/gi, '')}.mp3`;
    console.log(`New File: ${newFile}`);

    // UPDATING EXISTING
    if (db.get('songs').filter({ artist: artist, title: title }).size().value() > 0) {
        if (rls.question('Given entry already exists! Would you like to update it? (y/n) [n]: ') == 'y') {
            fs.renameSync(`${Config('directories.queue')}/${file}`, `${Config('directories.disc')}/${newFile}`);
            db.get('songs').find({ artist: artist, title: title }).assign({ options: options }).write();
        }
        continue;
    }

    // ADD NEW SONG
    fs.renameSync(`${Config('directories.queue')}/${file}`, `${Config('directories.disc')}/${newFile}`);
    AddSong(artist, title, options);
}

//96猫
//嘘の火花
//恋と嘘
//0888764c-4e73-4fe9-b906-d3d25ca93b04