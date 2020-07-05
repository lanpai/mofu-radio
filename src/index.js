import React from 'react';
import ReactDOM from 'react-dom';

import MainInterface from './js/container/MainInterface.jsx';
import css from './css/main.scss';

import { Provider } from 'react-redux';
import store from './store.js';

if (!(/bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent))) {
    const wrapper = document.getElementById('main-interface');
    wrapper ? ReactDOM.render(
        <Provider store={ store }>
            <MainInterface />
        </Provider>,
        wrapper
    ) : false;
}

import './websocket.js';
