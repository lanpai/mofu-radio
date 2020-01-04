import React from 'react';
import ReactDOM from 'react-dom';

import MainInterface from './js/container/MainInterface.jsx';
import css from './css/main.scss';

import { Provider } from 'react-redux';
import store from './store';

import audio from './audio.js';

const wrapper = document.getElementById('main-interface');
wrapper ? ReactDOM.render(
    <Provider store={ store }>
        <MainInterface />
    </Provider>,
    wrapper
) : false;

import './websocket.js';
