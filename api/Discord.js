const { discord, Config } = require('./Data.js');
const Log = require('./Log.js');
const { CurrentSong, CurrentQueue } = require('./QueueHandler.js');

// REQUIRING HTTP
const http = require('http');

const Discord = require('discord.js');
const client = new Discord.Client();

var broadcast = null;

client.on('ready', () => {
    Log(`logged in as ${client.user.tag}`, 3);

    broadcast = client.voice.createBroadcast();
    broadcast.play(`http://localhost:${Config('network.port')}/stream.mp3`);

    Log(`connecting audio stream to Discord broadcast`, 4);
});

client.on('message', async msg => {
    if (msg.author.id === client.user.id)
        return;

    const serverID = msg.guild.id;
    var server = discord.get('servers').find({ id: serverID }) || discord.get('servers').push({ id: serverID }).write();

    const prefix = server.prefix || 'm!';
    if (msg.content.substring(0, prefix.length) != prefix)
        return;

    msg.content = msg.content.substring(prefix.length);

    switch (msg.content.split(' ')[0]) {
        case 'play':
            if (!msg.member.voice.channel) {
                msg.channel.send(RichEmbed().setDescription(`Please join a channel first, <@${msg.author.id}>!`));
                return;
            }

            const connection = await msg.member.voice.channel.join();
            connection.play(broadcast);
            msg.channel.send(RichEmbed().setDescription(`Started playing the radio in <#${msg.member.voice.channel.id}>.`));

            break;
        case 'stop':
            if (!msg.member.voice.channel) {
                msg.channel.send(RichEmbed().setDescription(`Please join a channel first, <@${msg.author.id}>!`));
                return;
            }

            msg.member.voice.channel.leave();
            msg.channel.send(RichEmbed().setDescription(`Stopped playing the radio in <#${msg.member.voice.channel.id}>.`));

            break;
        case 'queue':
            msg.channel.send(RichEmbed().setTitle('Current Queue').addFields(
                { name: `${CurrentSong().title}`, value: `${CurrentSong().artist}\n${CurrentSong().tags || ''}` },
                { name: '\u200B', value: '\u200B' },
                ...CurrentQueue().map((song, index) => ({ name: song.title, value: `${song.artist}\n${song.tags || ''}` }))
            ));
            break;
    }
});

async function InitDiscord() {
    if (Config('discordToken'))
        await client.login(Config('discordToken'));
}

var title = '';
var listenerCount = 0;

function UpdatePresence() {
    if (client.user)
        client.user.setPresence({ activity: { type: 'LISTENING', name: `"${title}" | Listeners:${listenerCount} | mofu.piyo.cafe` }, status: 'dnd' });
}

function SetTitle(newTitle) {
    title = newTitle;
    UpdatePresence();
}
function SetListenerCount(newListenerCount) {
    listenerCount = newListenerCount;
    UpdatePresence();
}

function RichEmbed() {
    return new Discord.MessageEmbed()
        .setColor('#ff1491')
        .setFooter('mofu-radio', client.user.avatarURL());
}

module.exports = { InitDiscord, SetTitle, SetListenerCount };
