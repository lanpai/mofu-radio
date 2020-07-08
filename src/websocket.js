import { UpdateSong, UpdateList, UpdateTop, UpdateNew, UpdateListeners, PushQueue } from './actions.js';

//WEBSOCKET
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

function ConnectSocket() {
    console.log('connecting to socket');
    if (location.protocol === 'https:')
        ws = new WebSocket('wss://' + location.host);
    else
        ws = new WebSocket('ws://' + location.host);

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
        console.log('socket closed: attempting reconnect in 1 second');
        setTimeout(ConnectSocket, 1000);
    }

    ws.onerror = function onWSError(e) {
        console.error('socket error: closing socket');
        ws.close();
    }

    ws.onopen = function onWSOpen(e) {
        FetchList('sort:new');
    }
}

if (!(/bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent)))
    ConnectSocket();

export { FetchList, RequestSong };
