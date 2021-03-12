import * as PIXI from 'pixi.js'
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
import dp_1 from './../assets/dawn_patrol/dp-1.jpg'
import dp_2 from './../assets/dawn_patrol/dp-2.jpg'
import dp_3 from './../assets/dawn_patrol/dp-3.jpg'
import dp_4 from './../assets/dawn_patrol/dp-4.jpg'
const state = {}


function start_her_up() {
  initAudio();

  pixi_app.loader
  .add('dp_1', dp_1)
  .add('dp_2', dp_2)
  .add('vid', vid)
  .add('dp_3', dp_3)
  .add('dp_4', dp_4)
  .load((loader, resources) => {
    const sprite = new PIXI.Sprite(resources.dp_1.texture);
    const sprite_size = backgroundSize(pixi_app.renderer.width, pixi_app.renderer.height, 600, 400)
    sprite.width = sprite_size.h * 2;;
    sprite.height =sprite_size.h * 2;;
    sprite.x = pixi_app.renderer.width / 2;
    sprite.y = pixi_app.renderer.height / 2;
    
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;

    pixi_app.stage.addChild(sprite);

    pixi_app.ticker.add(() => {
        
    });


    const sprite_2 = new PIXI.Sprite(resources.dp_1.texture);
    const sprite_2_size = backgroundSize(pixi_app.renderer.width, pixi_app.renderer.height, 600, 400)
    sprite_2.width = sprite_2_size.h * 2;;
    sprite_2.height =sprite_2_size.h * 2;;
    sprite_2.x = pixi_app.renderer.width / 2;
    sprite_2.y = pixi_app.renderer.height / 2;
    
    sprite_2.anchor.x = 0.5;
    sprite_2.anchor.y = 0.5;

    pixi_app.stage.addChild(sprite_2);
    sprite_2.blendMode = 2;



    const sprite_3 = new PIXI.Sprite(resources.dp_1.texture);
    const sprite_3_size = backgroundSize(pixi_app.renderer.width, pixi_app.renderer.height, 600, 400)
    sprite_3.width = sprite_3_size.h * 2;;
    sprite_3.height =sprite_3_size.h * 2;;
    sprite_3.x = pixi_app.renderer.width / 2;
    sprite_3.y = pixi_app.renderer.height / 2;
    
    sprite_3.anchor.x = 0.5;
    sprite_3.anchor.y = 0.5;

    pixi_app.stage.addChild(sprite_3);
    sprite_3.blendMode = 2;




    const bg = PIXI.Texture.from(vid);
    bg.baseTexture.resource.source.loop = true;
    const coke = new PIXI.Sprite(bg);
    const coke_size = backgroundSize(pixi_app.renderer.width, pixi_app.renderer.height, 600, 400)
    coke.width = coke_size.h * 2;
    coke.height =coke_size.h * 2;;  
    coke.x = pixi_app.renderer.width / 2;
    coke.y = pixi_app.renderer.height / 2;
    coke.anchor.x = 0.5;
    coke.anchor.y = 0.5;  
    coke.preload = 'auto';

    pixi_app.stage.addChild(coke);
    coke.blendMode = 1;
    pixi_app.ticker.add(() => {
      
      // sprite.rotation += 0.003;
      // coke.rotation += 0.0001;
      // sprite_2.rotation -= 0.003;
      // sprite_3.rotation -= 0.005;

      
      if (appState.audioKicking) {

          analyser.getByteFrequencyData(dataArray); 

          let r = mapRange(dataArray[15], 0, 255, 1, 1.5);
          sprite.scale.x = r;
          sprite.scale.y = r;

          let s = mapRange(dataArray[10], 0, 255, 1, 1.5);
          sprite_2.scale.x = s;
          sprite_2.scale.y = s;

          let t = mapRange(dataArray[5], 0, 255, 1, 1.5);
          sprite_3.scale.x = t;
          sprite_3.scale.y = t;
        

          let u = mapRange(dataArray[0], 0, 255, 1, 1.5);
          coke.scale.x = u;
          coke.scale.y = u;


      }      
    });
  });


  playTrack(jam)


  /** MOUSE MOVE **/
  /** MOUSE MOVE **/
  /** MOUSE MOVE **/
  function handleMove(e) {
    var x = e.data.global.x;
    var y = e.data.global.y;
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
    
  window.addEventListener("resize",debounce(function(e){
    // Scale scenes
  }));  
}

var go_button = document.getElementById('go-button');
go_button.addEventListener('click', function (event) {
	start_her_up();
});

export {state}