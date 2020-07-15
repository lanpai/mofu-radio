//https://coverartarchive.org/release/${idCAA}/front
//https://musicbrainz.org/ws/2/release/${idCAA}?fmt=json

// MOFU-RADIO REQUIREMENTS
const { db, submissions, Config, AddSong } = require('./api/Data.js');

// BASIC REQUIREMENTS
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// REQUIRING READLINE
const rls = require('readline-sync');

console.log('- mofu-radio utility -');

// CREATING DIRECTORIES
if (!fs.existsSync(Config('directories.disc')))
    fs.mkdirSync(Config('directories.disc'));
if (!fs.existsSync(Config('directories.queue')))
    fs.mkdirSync(Config('directories.queue'));
if (!fs.existsSync(Config('directories.submissions')))
    fs.mkdirSync(Config('directories.submissions'));

switch (rls.question('Mode (new, submissions): ')) {
    case 'new':
        // CHECKING QUEUE DIRECTORY
        const files = fs.readdirSync(Config('directories.queue'));

        for (let file of files) {
            // NEW LINE
            console.log('');

            console.log(`File: "${file}"`);

            if (rls.question('Skip this song? (y/n) [n]: ') === 'y')
                continue;

            let filePath = path.parse(file);
            if (filePath.ext !== '.mp3') {
                console.log('File isn\'t an mp3!');
                continue;
            }

            let metadata = {
                options: {},
                en: {}
            };

            // GATHERING METADATA
            metadata.artist = rls.question('Artist: ');
            metadata.title = rls.question('Title: ');

            let tags = rls.question('Tags: ');
            if (tags !== '')
                metadata.tags = tags;

            // ENGLISH METADATA
            let enArtist = rls.question('EN Artist: ');
            if (enArtist !== '')
                metadata.en.artist = enArtist;

            let enTitle = rls.question('EN Title: ');
            if (enTitle !== '')
                metadata.en.title = enTitle;

            let enTags = rls.question('EN Tags: ');
            if (enTags !== '')
                metadata.en.tags= enTags;

            // COVERARTARCHIVE
            let idCAA = rls.question('MusicBrainz Release ID: ');
            if (idCAA !== '')
                metadata.options.coverArtArchive = idCAA;

            // DETERMINING FILE NAME
            let newFile = `${metadata.artist} - ${metadata.title}`.replace(/[\\\/:*?"<>|]/gi, '') + '.mp3';
            console.log(`New File: ${newFile}`);

            metadata.file = newFile;

            // ADD NEW SONG
            fs.renameSync(`${Config('directories.queue')}/${file}`, `${Config('directories.disc')}/${newFile}`);
            AddSong(metadata);
        }
        break;
    case 'submissions':
        for (let song of submissions.get('songs').filter({ status: 'TBD' }).value()) {
            // NEW LINE
            console.log('');

            console.log('File: ' + song.file);
            console.log('Artist: ' + song.artist);
            console.log('Title: ' + song.title);
            console.log('Tags: ' + song.tags);
            if (song.musicbrainz)
                console.log('MusicBrainz Release ID: ' + `https://musicbrainz.org/release/${song.musicbrainz}`);
            console.log('Comments: ' + song.comments);

            switch (rls.question('New status (accept/reject/silentreject) [accept]: ')) {
                default:
                case 'accept':
                    let metadata = {
                        options: {},
                        en: {}
                    };

                    // GATHERING METADATA
                    metadata.artist = rls.question(`Artist [${song.artist}]: `) || song.artist;
                    metadata.title = rls.question(`Title [${song.title}]: `) || song.title;
                    let tags = rls.question(song.tags ? `Tags [${song.tags}]: ` : 'Tags: ') || song.tags;
                    if (tags !== '')
                        metadata.tags = tags;

                    // ENGLISH METADATA
                    let enArtist = rls.question('EN Artist: ');
                    if (enArtist !== '')
                        metadata.en.artist = enArtist;

                    let enTitle = rls.question('EN Title: ');
                    if (enTitle !== '')
                        metadata.en.title = enTitle;

                    let enTags = rls.question('EN Tags: ');
                    if (enTags !== '')
                        metadata.en.tags= enTags;

                    // COVERARTARCHIVE
                    let idCAA = rls.question(song.musicbrainz ?
                        `MusicBrainz Release ID [https://musicbrainz.org/release/${song.musicbrainz}]: ` :
                        'MusicBrainz Release ID: ') || song.musicbrainz;
                    if (idCAA !== '')
                        metadata.options.coverArtArchive = idCAA;

                    // DETERMINING FILE NAME
                    let newFile = `${metadata.artist} - ${metadata.title}`.replace(/[\\\/:*?"<>|]/gi, '') + '.mp3';
                    console.log(`New File: ${newFile}`);

                    metadata.file = newFile;

                    submissions.read().get('songs').find({ id: song.id }).set('status', 'accepted').write();

                    let filePath = path.parse(song.file);
                    if (filePath.ext !== '.mp3') {
                        console.log('Converting file to MP3');
                        execSync(`cd "${Config('directories.submissions')}" && ffmpeg -i "${song.file}" -ab 320k -map_metadata 0 -id3v2_version 3 -y "${filePath.name}.mp3"`);
                        fs.unlinkSync(Config('directories.submissions') + '/' + song.file);
                        song.file = filePath.name + '.mp3';
                    }

                    // ADD NEW SONG
                    fs.renameSync(`${Config('directories.submissions')}/${song.file}`, `${Config('directories.disc')}/${newFile}`);
                    AddSong(metadata);
                    break;
                case 'reject':
                    submissions.get('songs').find({ id: song.id }).set('status', 'rejected').write();
                    break;
                case 'silentreject':
                    submissions.get('songs').find({ id: song.id }).set('status', 'silentrejected').write();
                    break;
            }
        }
        break;
}
