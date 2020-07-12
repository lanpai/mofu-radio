import store from './store.js';

let nextImage = new Image();

function UpdateSong(currentSong, queue) {
    if (queue[0].options) {
        nextImage.src = queue[0].options.coverArtArchive ?
            `https://coverartarchive.org/release/${queue[0].options.coverArtArchive}/front` :
            '/default.png';
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

function UpdateTop(list) {
    store.dispatch({
        type: 'UPDATE_TOP',
        payload: {
            list: list
        }
    });
}

function UpdateNew(list) {
    store.dispatch({
        type: 'UPDATE_NEW',
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

function UpdateVolume(volume) {
    store.dispatch({
        type: 'UPDATE_VOLUME',
        payload: {
            volume: volume
        }
    });
}

function TogglePlay() {
    store.dispatch({
        type: 'TOGGLE_PLAY'
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
    UpdateSong, UpdateTop, UpdateNew, UpdateList, UpdateListeners, UpdateVolume,
    TogglePlay, ToggleJP, ToggleFavorite,
    PushQueue,
    UpdateTheme
};
