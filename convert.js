// MOFU-RADIO REQUIREMENTS
const { db, Config, AddSong } = require('./api/Data.js');

// BASIC REQUIREMENTS
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// CREATING DIRECTORIES
if (!fs.existsSync(Config('directories.queue')))
    fs.mkdirSync(Config('directories.queue'));

// CHECKING QUEUE DIRECTORY
const files = fs.readdirSync(Config('directories.queue'));

for (let file of files) {
    console.log(file);

    let filePath = path.parse(file);
    if (filePath.ext !== '.mp3') {
        execSync(`cd "${Config('directories.queue')}" && ffmpeg -i "${file}" -ab 320k -map_metadata 0 -id3v2_version 3 -y "${filePath.name}.mp3"`);
        fs.unlinkSync(Config('directories.queue') + '/' + file);
    }
}
