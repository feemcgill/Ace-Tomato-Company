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

import Kaleidoscope from './vibes/kscope.js'
import PhotoJam from './vibes/photojam.js'
import VidVibe from './vibes/vidvibe.js'
const state = {}



pixi_app.loader
.add('dp_1', dp_1)
.add('dp_2', dp_2)
.add('dp_2_bg', dp_2_bg)
.add('vid', vid)
.add('dp_3', dp_3)
.add('dp_4', dp_4)
.load((loader, resources) => {



  function start_her_up() {
    initAudio();
    pixi_app.stage.interactive = true;
    pixi_app.stage
        .on('mousemove', handleMove)
        .on('touchmove', handleMove)
        .on('click', handleClick);  
  



    const pj_container = new PIXI.Container();
    pixi_app.stage.addChild(pj_container)

    const pj = new PhotoJam(resources.dp_1.texture, () => {
      console.log('pj callback');
    })
    pj.transitionIn();

    pj_container.addChild(pj)
    

    const vv = new VidVibe(vid, () => {
      console.log('vv callback');
    })
    vv.transitionIn();
    pixi_app.stage.addChild(vv)
    //vv.blendMode = 1;
    vv.alpha = 0;


    const brt = new PIXI.BaseRenderTexture(pixi_app.renderer.width, pixi_app.renderer.height, PIXI.SCALE_MODES.LINEAR, 1);
    const rt = new PIXI.RenderTexture(brt);
    const rsprite = new PIXI.Sprite(rt);
    rsprite.x = 0;
    rsprite.y = 0;    
    pixi_app.stage.addChild(rsprite);

    vv.mask = rsprite


    const ks_container = new PIXI.Container();
    pixi_app.stage.addChild(ks_container)
    const kscope = new Kaleidoscope(resources.dp_3.texture, ks_container)
    kscope.draw()
    ks_container.alpha = 0;

    pixi_app.ticker.add(() => {
      pixi_app.renderer.render(pj_container, rt);
    });
  



    TweenMax.to(vv, 30, {alpha: 1, delay: 60})
    setTimeout(() => {
      pj.fadeToWhite(20);
    }, 62000);
    TweenMax.to(ks_container, 15, {alpha: 1, delay: 90})

    function handleMove(e) {}
  
    function handleClick(e) {}
    
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
  
  }
  
  
  
  
  var go_button = document.getElementById('go-button');
  go_button.addEventListener('click', function (event) {
    start_her_up();
  });


});


export {state}