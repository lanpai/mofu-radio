import store from './store';

var ctx = new AudioContext();
var audio = document.getElementById('audio');

// CHECKING FOR PLAY TOGGLE
let isPlaying = false
store.subscribe(function onStateChange() {
    if (store.getState().playing && !isPlaying) {
        isPlaying = true;
        audio.src = 'http://127.0.0.1:5127/stream.mp3';
        audio.play();
    }
    else if (!store.getState().playing && isPlaying) {
        isPlaying = false;
        audio.pause();
        audio.removeAttribute('src');
    }
});

export default audio;
