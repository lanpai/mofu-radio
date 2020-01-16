import store from './store';

let imgCache = [];

function UpdateSong(currentSong, queue) {
    for (let song of queue) {
        if (song.options) {
            imgCache.push(new Image());
            imgCache[imgCache.length - 1].src = `https://coverartarchive.org/release/${queue[0].options.coverArtArchive}/front`;
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

function PushQueue(song) {
    store.dispatch({
        type: 'PUSH_QUEUE',
        payload: {
            song: song
        }
    });
}

export {
    UpdateSong, UpdateTop, UpdateNew, UpdateList, UpdateListeners, UpdateVolume,
    TogglePlay, ToggleJP,
    PushQueue
};
