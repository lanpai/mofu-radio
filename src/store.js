import { createStore } from 'redux';
import update from 'immutability-helper';

const initialState = {
    playing: false,
    jp: true,
    currentSong: {
    },
    queue: [],
    stats: {
        listeners: 0
    },
    list: []
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_SONG':
            return update(state, {
                currentSong: {
                    $set: action.payload.currentSong
                },
                queue: {
                    $set: action.payload.queue
                }
            });
            break;
        case 'UPDATE_LIST':
            return update(state, {
                list: {
                    $set: action.payload.list
                }
            });
        case 'TOGGLE_PLAY':
            return update(state, {
                $toggle: [ 'playing' ]
            });
        case 'TOGGLE_JP':
            return update(state, {
                $toggle: [ 'jp' ]
            });
        default:
            return state;
    }
}

const store = createStore(reducer);

export default store;
