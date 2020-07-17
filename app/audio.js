import TrackPlayer from 'react-native-track-player';

import { store } from './store.js';

TrackPlayer.setupPlayer();
TrackPlayer.updateOptions({
    stopWithApp: true,
    playBuffer: 0,
    capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP
    ],
    compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP
    ]
});

var track = {};
var status = 'stopped';

function Play() {
    TrackPlayer.reset();
    TrackPlayer.add(track).then(() => {
        status = 'playing';
        TrackPlayer.play();
    });
}

function Pause() {
    status = 'paused';
    TrackPlayer.pause();
}

function Stop() {
    isPlaying = 'stopped';
    TrackPlayer.reset();
}

function UpdateMetadata(metadata) {
    let coverArt = '';
    if (metadata.coverArt)
        coverArt = `https://coverartarchive.org/release/${metadata.coverArt}/front`;

    track = {
        id: '0',
        url: 'https://mofu.piyo.cafe/stream.mp3',
        title: metadata.title || '',
        artist: metadata.artist || '',
        album: metadata.tags || '',
        artwork: coverArt
    };

    if (status !== 'stopped')
        TrackPlayer.updateMetadataForTrack('0', track);
}

function UpdateCoverArt(coverArt) {
    track = {
        ...track,
        artwork: coverArt || ''
    };

    if (status !== 'stopped')
        TrackPlayer.updateMetadataForTrack('0', track);
}

export { Play, Pause, Stop, UpdateMetadata, UpdateCoverArt };
