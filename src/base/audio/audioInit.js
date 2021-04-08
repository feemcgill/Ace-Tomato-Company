import appState from '../state.js';

let audioContext = null;
let analyser = null;
let bufferLength = null;
let dataArray = null;
let gainNode = null;

// wtf
const initAudio = function(callback){
  try {
    if (typeof AudioContext !== 'undefined') {
        audioContext = new AudioContext();
    } else if (typeof webkitAudioContext !== 'undefined') {
        audioContext = new webkitAudioContext();
    } else {
        appState.usingWebAudio = false;
    }
  } catch(e) {
      appState.usingWebAudio = false;
  }

  gainNode = audioContext.createGain()
  gainNode.gain.value = 0.3;
  gainNode.connect(audioContext.destination)


  analyser = audioContext.createAnalyser();
  analyser.connect(gainNode);
  analyser.fftSize = 512;
  bufferLength = analyser.frequencyBinCount; 
  dataArray = new Uint8Array(bufferLength);
  analyser.minDecibels = -90;
  analyser.maxDecibels = -10;
  analyser.smoothingTimeConstant = 0.90;

  if (callback) {
    callback();
  }
}
window.changeVolume = function(el) {
  var fraction = parseInt(el.value) / parseInt(el.max);
  console.log(fraction * fraction)
  if (appState.audioInitiated) {
    gainNode.gain.value = fraction * fraction;  
  }
}

export {initAudio, audioContext, analyser, dataArray, gainNode };