import * as PIXI from 'pixi.js'

import { Linear, TweenMax } from 'gsap/TweenMax'

import pixi_app from './base/pixi/app'
import { debounce, getWindowSize, mapRange, backgroundSize } from './base/utils/helpers'
import { initAudio, audioContext, analyser, dataArray } from './base/audio/audioInit'
import { trackSource, playTrack } from './base/audio/playTrack.js'
import appState from './base/state.js'

import ShootinSkip from './scenes/shootin-skip.js'
import DawnPatrol from './scenes/dawn-patrol.js'
import Apparatus from './scenes/apparatus'
import WolfTickles from './scenes/wolf-tickles'
import DownOnAllFives from './scenes/down-on-all-fives.js'
import NewJersey from './scenes/new-jersey'
import HideAWell from './scenes/hide-a-well'
import Tacit from './scenes/tacit'
import HitTheSheets from './scenes/hit-the-sheets.js'
import SleepyHead from './scenes/sleepy-head'

import config from './config.js'
import Vizzies from './vibes/vizziesweep.js'
/** Dom Interface Stuff **/

var title_screen = document.getElementById('title-screen')
var interface_button = document.getElementById('start-button')
var info_button = document.getElementById('info-button')
var the_interface = document.getElementById('interface')
var canvas = document.getElementById('canvas-root')
var info = document.getElementById('info')
var tracklist_element = document.getElementById('tracklist')
var info_close = document.getElementById('info-close')
var stop_track_button = document.getElementById('stop_track')
var next_track_button = document.getElementById('next_track')
var prev_track_button = document.getElementById('prev_track')

var currentScene = null
var currentTrack = null
var interface_timeout = null
var title_timeout = null

var curtain = new PIXI.Graphics()
curtain.beginFill(0xffffff)
curtain.drawRect(pixi_app.renderer.width, pixi_app.renderer.height)

var stageContainer = new PIXI.Container()
var fgContainer = new PIXI.Container()
pixi_app.stage.addChild(stageContainer)
pixi_app.stage.addChild(fgContainer)

const vizzies = new Vizzies()
//fgContainer.addChild(vizzies);
vizzies.zIndex = 1000

function stopIt() {
  console.log('stop IT')
  if (currentScene) {
    currentScene.parent.alpha = 0
    currentScene.destroy()
    stageContainer.removeChildren()
    currentScene = null
  }
  stageContainer.removeChildren()
  appState.audioKicking = false
}

function playScene(track) {
  //Clear the table
  if (!appState.audioInitiated) {
    initAudio()
    vizzies.init()
  }
  if (interface_timeout) {
    clearTimeout(interface_timeout)
  }

  if (title_timeout) {
    clearTimeout(title_timeout)
  }

  stopIt()

  // Find the scene
  switch (track) {
    case 0:
      currentScene = new ShootinSkip()
      break
    case 1:
      currentScene = new DawnPatrol()
      break
    case 2:
      currentScene = new Apparatus()
      break
    case 3:
      currentScene = new WolfTickles()
      break
    case 4:
      currentScene = new DownOnAllFives()
      break
    case 5:
      currentScene = new NewJersey()
      break
    case 6:
      currentScene = new HideAWell()
      break
    case 7:
      currentScene = new Tacit()
      break
    case 8:
      currentScene = new SleepyHead()
      break
    case 9:
      currentScene = new HitTheSheets()
      break
  }

  // Play the scene
  stageContainer.addChild(currentScene)
  currentScene.parent.alpha = 0

  if (config.tracks[track].loaded) {
    currentScene.run()
  } else {
    currentScene.load()
    config.tracks[track].loaded = true
  }

  // Play the track
  playTrack(config.asset_url + '/' + config.tracks[track].mp3, endScene)
  console.log(config.asset_url + '/' + config.tracks[track].mp3, 'THE TRACK')
  TweenMax.to(currentScene.parent, 2.5, { alpha: 1 })

  currentTrack = track

  //title_screen.style.opacity = 0
  title_screen.innerHTML = '<h1>' + config.tracks[track].name + '</h1>'
  title_screen.style.opacity = 1

  title_timeout = setTimeout(() => {
    title_screen.style.opacity = 0
    title_timeout = null
  }, 3000)

  setTimeout(() => {
    document.getElementById('nowplaying').classList.add('show')
  }, 0)

  interface_button.classList.remove('start')
  info_button.classList.add('dim')

  var tracklist_tracks = document.querySelectorAll('.tracklist-song'),
    i
  for (i = 0; i < tracklist_tracks.length; ++i) {
    console.log(config.tracks[track].name, tracklist_tracks[i].innerHTML)
    if (tracklist_tracks[i].innerHTML == config.tracks[track].name) {
      tracklist_tracks[i].classList.add('playing')
    } else {
      tracklist_tracks[i].classList.remove('playing')
    }
  }

  console.log('----------------------------')
  console.log('--------PLAYSCENE(' + track + ')--------')
  console.log(track, currentScene, pixi_app, currentTrack)
  console.log('----------------------------')
}

function endScene() {
  if (!appState.userStopped) {
    TweenMax.to(currentScene.parent, 0.5, {
      alpha: 0,
      onComplete: function () {
        //document.getElementById('now-playing').innerHTML = ''
        if (currentTrack + 1 == config.tracks.length) {
          playScene(0)
        } else {
          playScene(currentTrack + 1)
        }
      },
    })
  }
}

interface_button.addEventListener('click', function (event) {
  the_interface.classList.toggle('hide')
  info_button.classList.remove('dim')
  if (!appState.audioInitiated) {
    initAudio()
  }
})

info_button.addEventListener('click', function (event) {
  info.classList.toggle('hide')
})

info_close.addEventListener('click', function (event) {
  info.classList.add('hide')
  info_button.classList.add('dim')
})

info.addEventListener('click', function (event) {
  console.log('info click')
  the_interface.classList.add('hide')
})

canvas.addEventListener('click', function (event) {
  the_interface.classList.add('hide')
  info.classList.add('hide')
  info_button.classList.add('dim')
})

stop_track_button.addEventListener('click', function (event) {
  stopIt()
  if (title_timeout) {
    clearTimeout(title_timeout)
  }
  //title_screen.innerHTML = '<h1> The Square Community </h1>'
  //title_screen.style.opacity = 1
})

next_track_button.addEventListener('click', function (event) {
  if (currentTrack + 1 == config.tracks.length) {
    playScene(0)
  } else {
    playScene(currentTrack + 1)
  }
})

prev_track_button.addEventListener('click', function (event) {
  if (currentTrack == 0) {
    playScene(config.tracks.length - 1)
  } else {
    playScene(currentTrack - 1)
  }
})

if ('ontouchstart' in window) {
  canvas.addEventListener('touchstart', function (event) {
    the_interface.classList.add('hide')
    info.classList.add('hide')
    info_button.classList.add('dim')
  })
}

tracklist_element.innerHTML = ''
for (let i = 0; i < config.tracks.length; i++) {
  const track = config.tracks[i]
  var a = document.createElement('a')
  a.classList.add('tracklist-song')
  var linkText = document.createTextNode(track.name)
  a.appendChild(linkText)
  a.href = '#'
  a.addEventListener('click', function (event) {
    event.preventDefault()
    playScene(i)
    interface_timeout = setTimeout(() => {
      the_interface.classList.add('hide')
      interface_timeout = null
    }, 700)
  })
  tracklist_element.appendChild(a)
}

window.addEventListener(
  'resize',
  debounce((e) => {
    const size = getWindowSize()
    const w = size.width
    const h = size.height

    // Scale renderer
    pixi_app.renderer.view.style.width = w + 'px'
    pixi_app.renderer.view.style.height = h + 'px'
    pixi_app.renderer.resize(w, h)
  }, 500)
)

if (process.env.WORKING_ON) {
  console.log(process.env.WORKING_ON, typeof process.env.WORKING_ON)
  setTimeout(() => {
    playScene(parseInt(process.env.WORKING_ON))
    the_interface.classList.add('hide')
  }, 100)
}
