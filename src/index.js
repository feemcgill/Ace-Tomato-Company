import * as PIXI from 'pixi.js'

import {Linear, TweenMax} from "gsap/TweenMax"

import pixi_app from './base/pixi/app'
import {debounce, getWindowSize, mapRange, backgroundSize} from './base/utils/helpers'
import { initAudio, audioContext,  analyser, dataArray } from './base/audio/audioInit';
import {trackSource, playTrack} from './base/audio/playTrack.js';
import appState from './base/state.js';

import DawnPatrol from './scenes/dawn-patrol.js'
import Apparatus from './scenes/apparatus'
import config from './config.js'

const state = {}





  var currentScene = null;
  var currentTrack = null;
  
  function playScene(track) {
    if (!appState.audioInitiated) {
      console.log('init audio');
      initAudio();
    }
    console.log('PLAY', track);
    pixi_app.stage.removeChildren();
    appState.audioKicking = false;

    switch (track) {
      case 0:
        currentScene = new DawnPatrol();
        break;
      case 1:
        currentScene = new Apparatus();
    }
    pixi_app.stage.addChild(currentScene);
    currentScene.parent.alpha = 1;
    if (config.tracks[track].loaded) {
      currentScene.run();
    } else {
      currentScene.load();
      config.tracks[track].loaded = true;
    }
    playTrack(config.tracks[track].mp3, endScene)

    document.getElementById('now-playing').innerHTML = config.tracks[track].name;
    document.getElementById("nowplaying").classList.add("show");
    setTimeout(() => {
      document.getElementById("interface").classList.add("hide");
    }, 3000);
    currentTrack = track;
  }

  function endScene(nextTrack) {
    TweenMax.to(currentScene.parent, 0.5, {alpha: 0, onComplete: function(){
      pixi_app.stage.removeChildren();
      document.getElementById('now-playing').innerHTML = "";
      if (currentTrack + 1 == config.tracks.length) {
        console.log('play first')
        playScene(0);
      } else {
        console.log('play next')
        playScene(currentTrack + 1)
      }       
    }})
  }
  
  var interface_button = document.getElementById('button');
  interface_button.addEventListener('click', function (event) {
    document.getElementById("interface").classList.toggle("hide");
  });

  var tracklist_element = document.getElementById('tracklist');

  for (let i = 0; i < config.tracks.length; i++) {
    const track = config.tracks[i];
    var a = document.createElement('a');
    var linkText = document.createTextNode(track.name);
    a.appendChild(linkText);
    a.href = "#";
    a.addEventListener('click', function (event) {
      playScene(i)
    });
    tracklist_element.appendChild(a);    
  }


  /** RESIZE **/
  /** RESIZE **/
  /** RESIZE **/
  window.addEventListener("resize",function(e){
    const size = getWindowSize();
    const w = size.width;
    const h = size.height;
    
    // Scale renderer
    pixi_app.renderer.view.style.width = w + "px";    
    pixi_app.renderer.view.style.height = h + "px";      
    pixi_app.renderer.resize(w,h); 
  });

export {state}