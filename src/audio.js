import store from './store';

var ctx = new AudioContext();
var audio = document.getElementById('audio');

// CHECKING FOR PLAY TOGGLE
let isPlaying = false
store.subscribe(function onStateChange() {
    if (store.getState().playing && !isPlaying) {
        isPlaying = true;
        audio.src = '/stream.mp3';
        audio.play();
    }
    else if (!store.getState().playing && isPlaying) {
        isPlaying = false;
        audio.src = '';
    }
});

export default audio;
