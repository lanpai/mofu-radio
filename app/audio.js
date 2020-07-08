import TrackPlayer from 'react-native-track-player';

import { store } from './store.js';

TrackPlayer.setupPlayer();
TrackPlayer.updateOptions({
    stopWithApp: true,
    playBuffer: 0,
    capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
    ],
    compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
    ]
});

let track = {};
let isPlaying = false;

store.subscribe(() => {
    let title = store.getState().reducer.currentSong.title || '';
    let artist = store.getState().reducer.currentSong.artist || '';
    let tags = store.getState().reducer.currentSong.tags || '';

    if (!store.getState().jp) {
        if (store.getState().reducer.currentSong.en) {
            title = store.getState().reducer.currentSong.en.title || title;
            artist = store.getState().reducer.currentSong.en.artist || artist;
            tags = store.getState().reducer.currentSong.en.tags || tags;
        }
    }

    let coverArt = '';
    if (store.getState().reducer.currentSong.options)
        if (store.getState().reducer.currentSong.options.coverArtArchive)
            coverArt = `https://coverartarchive.org/release/${store.getState().reducer.currentSong.options.coverArtArchive}/front`;

    track = {
        id: '0',
        url: 'https://mofu.piyo.cafe/stream.mp3',
        title: title,
        artist: artist,
        album: tags,
        artwork: coverArt
    };

    if (store.getState().reducer.playing && !isPlaying) {
        isPlaying = true;
        TrackPlayer.reset();
        TrackPlayer.add(track).then(() => {
            TrackPlayer.play();
        });
    }
    else if (!store.getState().reducer.playing && isPlaying) {
        isPlaying = false;
        TrackPlayer.pause();
    }
    else if (isPlaying) {
        TrackPlayer.updateMetadataForTrack('0', track);
    }
});

function Play() {
    if (!isPlaying) {
        isPlaying = true;
        TrackPlayer.reset();
        TrackPlayer.add(track).then(() => {
            TrackPlayer.play();
        });
    }
}

function Pause() {
    if (isPlaying) {
        isPlaying = false;
        TrackPlayer.pause();
    }
}

export { Play, Pause };
