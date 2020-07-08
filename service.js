import TrackPlayer from 'react-native-track-player';

import { Play, Pause } from './app/actions.js';

module.exports = async function() {
    TrackPlayer.addEventListener('remote-play', () => {
        Play();
    });

    TrackPlayer.addEventListener('remote-pause', () => {
        Pause();
    });

    TrackPlayer.addEventListener('remote-next', () => {
    });

    TrackPlayer.addEventListener('remote-previous', () => {
    });

    TrackPlayer.addEventListener('remote-stop', () => {
    });
};
