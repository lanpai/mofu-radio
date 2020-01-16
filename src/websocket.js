import { UpdateSong, UpdateList, UpdateTop, UpdateNew, UpdateListeners, PushQueue } from './actions.js';

//WEBSOCKET
console.log('connecting to socket');
var ws;
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
            console.log('could not recognize message type ' + message.type);
            break;
    }
}

function FetchList(filter) {
    ws.send(JSON.stringify({
        type: 'FETCH_LIST',
        filter: filter === '' ? '*' : filter
    }));
}

ws.onopen = function onWSOpen(e) {
    FetchList('*');
}

function RequestSong(id) {
    ws.send(JSON.stringify({
        type: 'REQUEST',
        id: id
    }));
}

export { FetchList, RequestSong };
