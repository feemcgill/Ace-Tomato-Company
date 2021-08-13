import appState from './../state.js'
import { audioContext, analyser, gainNode } from './audioInit'

let trackSource
let the_buffer

const playTrack = function (track, callback) {
  // tackSource.buffer = null;
  if (appState.audioInitiated) {
    trackSource.buffer = null
  }
  window
    .fetch(track)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) =>
      audioContext.decodeAudioData(
        arrayBuffer,
        (audioBuffer) => {
          the_buffer = audioBuffer
        },
        (error) => console.error(error)
      )
    )
    .catch((exception) => {
      console.error('Fetch exception: ', exception)
    })
    .then(function () {
      if (!appState.audioKicking) {
        appState.userStopped = false
        trackSource = audioContext.createBufferSource()
        trackSource.buffer = the_buffer
        trackSource.connect(analyser)
        trackSource.start()
        trackSource.connect(gainNode)

        appState.audioInitiated = true
        appState.audioKicking = true
        appState.currentTrackSource = trackSource
        trackSource.onended = function () {
          if (callback) {
            callback()
          }
        }
      }
    })
}

// var stop_track_button = document.getElementById('stop_track_button')
// stop_track_button.addEventListener('click', function (event) {
//   console.log(trackSource)
//   appState.userStopped = true
//   trackSource.stop()
// })

export { trackSource, playTrack }
