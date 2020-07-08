import { UpdateSong, UpdateList, UpdateListeners, PushQueue } from './actions.js';

import SplashScreen from 'react-native-splash-screen';
import TrackPlayer from 'react-native-track-player';

var ws;

function FetchList(filter) {
    ws.send(JSON.stringify({
        type: 'FETCH_LIST',
        filter: filter === '' ? '*' : filter
    }));
}

function RequestSong(id) {
    ws.send(JSON.stringify({
        type: 'REQUEST',
        id: id
    }));
}

let iteration = 0;
let splashShown = true;
function ConnectSocket() {
    console.log('connecting to socket');
    ws = new WebSocket('wss://mofu.piyo.cafe');

    let firstConnect = iteration++ === 0;
    let connected = false;

    ws.onmessage = function onWSMessage(e) {
        let message = JSON.parse(e.data);
        switch (message.type) {
            case 'MESSAGE':
                alert(message.message);
                break;
            case 'UPDATE_SONG':
                UpdateSong(message.currentSong, message.queue);
                break;
            case 'UPDATE_LIST':
                UpdateList(message.list);
                if (!connected) {
                    if (splashShown) {
                        SplashScreen.hide();
                        splashShown = false;
                    }
                    if (!firstConnect) {
                        alert('Successfully reconnected to server!');
                    }
                }
                break;
            case 'UPDATE_LISTENERS':
                UpdateListeners(message.count);
                break;
            case 'PUSH_QUEUE':
                PushQueue(message.song);
                break;
            default:
                console.error('could not recognize message type ' + message.type);
                break;
        }
    }

    ws.onclose = function onWSClose(e) {
        console.log('socket closed: attempting reconnect in 5 second');
        setTimeout(ConnectSocket, 5000);
    }

    ws.onerror = function onWSError(e) {
        console.log('socket error: closing socket');
        if (!splashShown) {
            SplashScreen.show();
            splashShown = true;
        }
        TrackPlayer.reset();
        ws.close();
    }

    ws.onopen = function onWSOpen(e) {
        FetchList('*');
    }
}

export { ConnectSocket, FetchList, RequestSong };
