import { createStore, combineReducers } from 'redux';
import update from 'immutability-helper';

import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import { MOMO } from './themes.js';

const initialStorageState = {
    jp: 'false',
    favorites: [],
    theme: MOMO
};

const initialState = {
    playing: false,
    currentSong: {},
    queue: [],
    stats: {
        listeners: 0
    },
    list: []
};

function storageReducer(state = initialStorageState, action) {
    switch (action.type) {
        case 'TOGGLE_JP':
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
            return newState;
        case 'UPDATE_THEME':
            return update(state, {
                theme: {
                    $set: action.payload.theme
                }
            });
        default:
            return state;
    }
}


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
        case 'UPDATE_LISTENERS':
            return update(state, {
                stats: {
                    listeners: {
                        $set: action.payload.count
                    }
                }
            });
        case 'TOGGLE_PLAY':
            return update(state, {
                $toggle: [ 'playing' ]
            });
        case 'PLAY':
            return update(state, {
                playing: {
                    $set: true
                }
            });
        case 'PAUSE':
            return update(state, {
                playing: {
                    $set: false
                }
            });
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

const PERSIST_CONFIG = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: [ 'storageReducer' ]
};

const store = createStore(persistReducer(PERSIST_CONFIG, combineReducers({ storageReducer: storageReducer, reducer: reducer })));
const persistor = persistStore(store);

export { store, persistor };
