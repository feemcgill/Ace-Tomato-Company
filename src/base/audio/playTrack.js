import appState from './../state.js'
import { audioContext, analyser, gainNode } from './audioInit'

let trackSource
let the_buffer

const playTrack = function (track, callback) {
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
          if (!appState.audioKicking) {
            appState.userStopped = false
            trackSource = audioContext.createBufferSource()
            trackSource.buffer = the_buffer
            trackSource.connect(analyser)
            trackSource.connect(gainNode)
            trackSource.start()
            appState.audioInitiated = true
            appState.audioKicking = true
            appState.currentTrackSource = trackSource
            trackSource.onended = function () {
              if (callback) {
                callback()
              }
            }
          }
        },
        (error) => console.error(error)
      )
    )
    .catch((exception) => {
      console.error('Fetch exception: ', exception)
    })
    .then(function () {})
}

// var stop_track_button = document.getElementById('stop_track_button')
// stop_track_button.addEventListener('click', function (event) {
//   console.log(trackSource)
//   appState.userStopped = true
//   trackSource.stop()
// })

export { trackSource, playTrack }
