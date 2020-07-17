import TrackPlayer from 'react-native-track-player';

import { Play as PlayAction, Pause as PauseAction } from './app/actions.js';
import { Play, Pause, Stop } from './app/audio.js';

module.exports = async function() {
    TrackPlayer.addEventListener('remote-play', () => {
        PlayAction();
        Play();
    });

    TrackPlayer.addEventListener('remote-pause', () => {
        PauseAction();
        Pause();
    });

    TrackPlayer.addEventListener('remote-stop', () => {
        PauseAction();
        Stop();
    });
};
