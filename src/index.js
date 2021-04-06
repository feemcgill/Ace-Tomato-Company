import * as PIXI from 'pixi.js'
import { PixiPlugin } from 'gsap/PixiPlugin';

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

import Kaleidoscope from './kscope.js'
const state = {}


function start_her_up() {
  initAudio();

  pixi_app.loader
  .add('dp_1', dp_1)
  .add('dp_2', dp_2)
  .add('dp_2_bg', dp_2_bg)
  .add('vid', vid)
  .add('dp_3', dp_3)
  .add('dp_4', dp_4)
  .load((loader, resources) => {

    pixi_app.stage.interactive = true;
    pixi_app.stage
        .on('mousemove', handleMove)
        .on('touchmove', handleMove)
        .on('click', handleClick);  

    var kaleidoscope = new Kaleidoscope(pixi_app, resources.dp_3.texture);
    kaleidoscope.draw();

    pixi_app.ticker.add(() => {});

    function handleMove(e) {}

    function handleClick(e) {}
    
  });


  playTrack(jam)



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
    
  window.addEventListener("resize",debounce(function(e){
    // Scale scenes
  }));  
}

var go_button = document.getElementById('go-button');
go_button.addEventListener('click', function (event) {
	start_her_up();
});

export {state}