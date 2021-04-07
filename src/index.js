import * as PIXI from 'pixi.js'

import {Linear, TweenMax} from "gsap/TweenMax"

import pixi_app from './base/pixi/app'
import {debounce, getWindowSize, mapRange, backgroundSize} from './base/utils/helpers'
import './base/setup/dom'
// import Matter from 'matter-js';
// import engine from './base/matter/engine';
import { initAudio, audioContext,  analyser, dataArray } from './base/audio/audioInit';
import {trackSource, playTrack} from './base/audio/playTrack.js';
import appState from './base/state.js';

import vid from './../assets/dawn_patrol/dp-1.mp4'
import jam from './../assets/dawn_patrol/dp.mp3'
//import jam from './../assets/test.mp3'
import dp_1 from './../assets/dawn_patrol/dp-1.jpg'
import dp_2 from './../assets/dawn_patrol/dp-2.jpg'
import dp_2_bg from './../assets/dawn_patrol/dp-2-bg.jpg'
import dp_3 from './../assets/dawn_patrol/dp-3.jpg'
import dp_4 from './../assets/dawn_patrol/dp-4.jpg'

import ata_1 from './../assets/apparatus/ata_1.jpg'
import ata_2 from './../assets/apparatus/ata_2.jpg'
import ata_3 from './../assets/apparatus/ata_3.jpg'
import ata_4 from './../assets/apparatus/ata_4.jpg'
import ata_vid from './../assets/apparatus/ata.mp4'
import ata_jam from './../assets/apparatus/ata.mp3'

import DawnPatrol from './scenes/dawn-patrol.js'
import Apparatus from './scenes/apparatus'

const state = {}



pixi_app.loader
.add('dp_1', './../assets/dawn_patrol/dp-1.jpg')
.add('dp_2', './../assets/dawn_patrol/dp-2.jpg')
.add('dp_2_bg', dp_2_bg)
.add('vid', vid)
.add('dp_3', dp_3)
.add('dp_4', dp_4)

.add('ata_1', ata_1)
.add('ata_2', ata_2)
.add('ata_3', ata_3)
.add('ata_4', ata_4)
.add('ata_vid', ata_vid)


.load((loader, resources) => {


  console.log(resources);
  function start_her_up() {
    console.log('START HER UP');
    initAudio();  
  }

  var currentScene = null;
  var currentSong = null;

  function playScene(track) {
    console.log('PLAY');
    pixi_app.stage.removeChildren();
    appState.audioKicking = false;
    switch (track) {
      case 'dawnpatrol':
        currentScene = new DawnPatrol(resources);
        currentSong = jam;
        break;
      case 'ata':
        console.log('ATA PLAY');
        currentScene = new Apparatus(resources);
        currentSong = ata_jam
    }
    console.log(currentScene, currentSong)
    pixi_app.stage.addChild(currentScene);
    currentScene.run();
    playTrack(currentSong, endScene)
  }

  function endScene(nextTrack) {
    console.log('END HER', currentScene, nextTrack)
    pixi_app.stage.removeChildren()
    // if (currentScene) {
    //   TweenMax.to(currentScene, 1, {alpha: 0, onComplete: function(){
    //     pixi_app.stage.removeChildren()
    //     if (nextTrack) {
    //       playScene(nextTrack);
    //     }
    //   }})
    // } else {
    //   if (nextTrack) {
    //     playScene(nextTrack);
    //   }
    // }
  }
  
  
  
  var go_button = document.getElementById('go-button');
  go_button.addEventListener('click', function (event) {
    start_her_up();
  });

  var ata_button = document.getElementById('ata-button');
  ata_button.addEventListener('click', function (event) {
    playScene('ata')
  });

  var dp_button = document.getElementById('dp-button');
  dp_button.addEventListener('click', function (event) {
    playScene('dawnpatrol')
  });


});
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