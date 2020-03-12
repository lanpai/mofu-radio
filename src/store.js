import { createStore } from 'redux';
import update from 'immutability-helper';

const initialState = {
    playing: false,
    jp: localStorage.getItem('jp') === 'true',
    currentSong: {
    },
    queue: [],
    stats: {
        listeners: 0
    },
    list: [],
    top: [],
    new: [],
    volume: parseFloat(localStorage.getItem('volume')) || 0.5,
    favorites: JSON.parse(localStorage.getItem('favorites')) || []
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
        case 'UPDATE_TOP':
            return update(state, {
                top: {
                    $set: action.payload.list
                }
            });
        case 'UPDATE_NEW':
            return update(state, {
                new: {
                    $set: action.payload.list
                }
            });
        case 'UPDATE_LISTENERS':
            return update(state, {
                stats: {
                    listeners: {
                        $set: action.payload.count
                    }
                }
            });
        case 'UPDATE_VOLUME':
            localStorage.setItem('volume', action.payload.volume);
            return update(state, {
                volume: {
                    $set: action.payload.volume
                }
            });
        case 'TOGGLE_PLAY':
            return update(state, {
                $toggle: [ 'playing' ]
            });
        case 'TOGGLE_JP':
            localStorage.setItem('jp', !state.jp);
            return update(state, {
                $toggle: [ 'jp' ]
            });
        case 'TOGGLE_FAVORITE':
            let newState;
            let index = state.favorites.indexOf(action.payload.id);
            if (index == -1) {
                newState = update(state, {
                    favorites: {
                        $push: [ action.payload.id ]
                    }
                });
            }
            else {
                newState = update(state, {
                    favorites: {
                        $splice: [[ index, 1 ]]
                    }
                });
            }
            localStorage.setItem('favorites', JSON.stringify(newState.favorites));
            return newState;
        case 'PUSH_QUEUE':
            return update(state, {
                queue: {
                    $push: [ action.payload.song ]
                }
            });
        default:
            return state;
    }
}

const store = createStore(reducer);

export default store;
