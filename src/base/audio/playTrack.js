import appState from './../state.js';
import {audioContext, analyser} from './audioInit';

let trackSource;
let the_buffer;

const playTrack = function(track) {
  // tackSource.buffer = null;

  window.fetch(track)
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer, 
    audioBuffer => {
      the_buffer = audioBuffer;
    }, 
    error => 
      console.error(error)
    )
  )
  .catch((exception) => {
    console.error('Fetch exception: ', exception)
  })    
  .then(function(){
    if (!appState.audioKicking) {
      trackSource = audioContext.createBufferSource();
      trackSource.buffer = the_buffer;
      trackSource.connect(analyser);
      trackSource.start();
      appState.audioInitiated = true;      
      appState.audioKicking = true;
    };
  });







}

export {trackSource, playTrack};
