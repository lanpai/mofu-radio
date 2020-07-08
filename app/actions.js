import { Image } from 'react-native';

import { store } from './store.js';

function UpdateSong(currentSong, queue) {
    for (let song of queue) {
        if (song.options && song.options.coverArtArchive) {
            try {
                Image.prefetch(`https://coverartarchive.org/release/${song.options.coverArtArchive}/front`);
            }
            catch (err) {}
        }
    }

    store.dispatch({
        type: 'UPDATE_SONG',
        payload: {
            currentSong: currentSong,
            queue: queue
        }
    });
}

function UpdateList(list) {
    store.dispatch({
        type: 'UPDATE_LIST',
        payload: {
            list: list
        }
    });
}

function UpdateListeners(count) {
    store.dispatch({
        type: 'UPDATE_LISTENERS',
        payload: {
            count: count
        }
    });
}

function TogglePlay() {
    store.dispatch({
        type: 'TOGGLE_PLAY'
    });
}

function Play() {
    store.dispatch({
        type: 'PLAY'
    });
}

function Pause() {
    store.dispatch({
        type: 'PAUSE'
    });
}

function ToggleJP() {
    store.dispatch({
        type: 'TOGGLE_JP'
    });
}

function ToggleFavorite(id) {
    store.dispatch({
        type: 'TOGGLE_FAVORITE',
        payload: {
            id: id
        }
    });
}

function PushQueue(song) {
    store.dispatch({
        type: 'PUSH_QUEUE',
        payload: {
            song: song
        }
    });
}

function UpdateTheme(theme) {
    store.dispatch({
        type: 'UPDATE_THEME',
        payload: {
            theme: theme
        }
    });
}

export {
    UpdateSong, UpdateList, UpdateListeners,
    TogglePlay, Play, Pause,
    ToggleJP, ToggleFavorite,
    PushQueue,
    UpdateTheme
};
