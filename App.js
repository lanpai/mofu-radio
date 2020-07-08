import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';

import { Provider } from 'react-redux';
import { store, persistor } from './app/store.js';

import { NavigationContainer } from '@react-navigation/native';

import MainInterface from './app/container/MainInterface.js';

import { PersistGate } from 'redux-persist/integration/react';

import './app/audio.js';

class App extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Provider store={ store }>
                <PersistGate loading={null} persistor={persistor}>
                    <NavigationContainer>
                        <MainInterface />
                    </NavigationContainer>
                </PersistGate>
            </Provider>
        );
    }
}

export default App;
