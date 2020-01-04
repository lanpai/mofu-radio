import { UpdateSong, UpdateList } from './actions.js';

//WEBSOCKET
console.log('connecting to socket');
var ws = new WebSocket('ws://' + location.host);

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
        default:
            console.log('could not recognize message type ' + message.type);
            break;
    }
}

function FetchList(filter) {
    ws.send(JSON.stringify({
        type: 'FETCH_LIST',
        filter: filter
    }));
}

function RequestSong(id) {
    ws.send(JSON.stringify({
        type: 'REQUEST',
        id: id
    }));
}

export { FetchList, RequestSong };
