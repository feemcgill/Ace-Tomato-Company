import appState from '../state.js'

let audioContext = null
let analyser = null
let bufferLength = null
let dataArray = null
let gainNode = null

const initAudio = function (callback) {
  try {
    if (typeof AudioContext !== 'undefined') {
      audioContext = new AudioContext()
    } else if (typeof webkitAudioContext !== 'undefined') {
      audioContext = new webkitAudioContext()
    } else {
      appState.usingWebAudio = false
    }
  } catch (e) {
    appState.usingWebAudio = false
  }

  gainNode = audioContext.createGain()
  gainNode.gain.value = process.env.VOLUME || 1
  gainNode.connect(audioContext.destination)

  analyser = audioContext.createAnalyser()
  analyser.connect(gainNode)
  analyser.fftSize = 512
  bufferLength = analyser.frequencyBinCount
  dataArray = new Uint8Array(bufferLength)
  analyser.minDecibels = -90
  analyser.maxDecibels = -10
  analyser.smoothingTimeConstant = 0.9

  if (callback) {
    callback()
  }
}

window.changeVolume = function (el) {
  var fraction = parseInt(el.value) / parseInt(el.max)
  if (appState.audioInitiated) {
    gainNode.gain.value = fraction * fraction
  }
}

// var stop_track_button = document.getElementById('stop_track_button')
// stop_track_button.addEventListener('click', function (event) {
//   gainNode.gain.value = 0
// })

export { initAudio, audioContext, analyser, dataArray, gainNode }
