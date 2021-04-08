import appState from './../state.js';
import {audioContext, analyser, gainNode} from './audioInit';

let trackSource;
let the_buffer;

const playTrack = function(track, callback) {
  // tackSource.buffer = null;
  if (appState.audioInitiated) {
    trackSource.buffer = null;
  }
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
      trackSource.connect(gainNode);

      appState.audioInitiated = true;      
      appState.audioKicking = true;
      appState.currentTrackSource = trackSource;
      console.log("UPDATE STATE", appState, trackSource)

      trackSource.onended = function() {
        console.log('song is ended');
        if (callback) {
          callback();
        }
      }

    };
  });

}

export {trackSource, playTrack};
