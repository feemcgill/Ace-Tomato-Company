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



    const sprite_container = new PIXI.Container;
    pixi_app.stage.addChild(sprite_container);
    const sprite_array = [];
    for (let index = 0; index < 20; index++) {
      const sprite = new PIXI.Sprite(resources.dp_1.texture);
      const sprite_size = backgroundSize(pixi_app.renderer.width, pixi_app.renderer.height, 1200, 796)
  
      sprite.scale.x = sprite_size.scale;
      sprite.scale.y = sprite_size.scale;
      
      sprite.x = pixi_app.renderer.width / 2;
      sprite.y = pixi_app.renderer.height / 2 + (index * 10);
      
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 0.5;
      sprite.alpha = 0.3;
      //sprite.blendMode = 2;
      sprite_array.push(sprite)
      sprite_container.addChild(sprite);
    }


    //sprite_array[0].blendMode = 0
    //sprite_array[4].blendMode = 1


    const viz_container = new PIXI.Container;
    pixi_app.stage.addChild(viz_container);
    //iz_container.tint = 0xf000f0;

    const viz_tex_container = new PIXI.Container;
    viz_container.addChild(viz_tex_container);


    var vizzies = [];


    for (let i = 0; i < dataArray.length; i++) {
      const e = dataArray[i];
      var guy = new PIXI.Sprite(PIXI.Texture.WHITE);
      guy.width = pixi_app.renderer.width / dataArray.length;
      guy.height = 50;

      guy.x = (guy.width * i);
      //guy.y = pixi_app.renderer.height / 2;

      guy.tint = 0xffffff;
      if(i % 2 == 0) {
        //guy.tint = 0x00ff00;
      }

      guy.interactive = true;
      guy.on('mousedown', onDown);
      function onDown (eventData) {
        console.log(i, guy);
      }
      //guy.blendMode = 3;

      vizzies.push(guy)
      viz_tex_container.addChild(guy);
      //viz_container_2.addChild(guy);

    }
   

    const brt = new PIXI.BaseRenderTexture(pixi_app.renderer.width, pixi_app.renderer.height, PIXI.SCALE_MODES.LINEAR, 1);
    const rt = new PIXI.RenderTexture(brt);
    const rsprite = new PIXI.Sprite(rt);

    rsprite.x = pixi_app.renderer.width / 2;
    rsprite.y = pixi_app.renderer.height;
    rsprite.anchor.x = 0.5;
    //rsprite.anchor.y = 0.5;  
    rsprite.rotation = 3.14159;
    
    viz_container.addChild(rsprite);


    const bg = PIXI.Texture.from(vid);
    bg.baseTexture.resource.source.loop = true;
    const coke = new PIXI.Sprite(bg);
    const coke_size = backgroundSize(pixi_app.renderer.width, pixi_app.renderer.height, 640, 480)
    
    coke.scale.x = coke_size.scale;
    coke.scale.y = coke_size.scale;

    coke.x = pixi_app.renderer.width / 2;
    coke.y = pixi_app.renderer.height / 2;
    coke.anchor.x = 0.5;
    coke.anchor.y = 0.5;  
    coke.preload = 'auto';

    pixi_app.stage.addChild(coke);
    //coke.blendMode = 2;
    coke.alpha = 1;

    TweenMax.to(coke, 30, {alpha: 1, delay: 5})





    const orange = new PIXI.Sprite(resources.dp_1.texture);
    const orange_size = backgroundSize(pixi_app.renderer.width, pixi_app.renderer.height, 1200, 796)

    orange.scale.x = orange_size.scale;
    orange.scale.y = orange_size.scale;
    
    orange.x = pixi_app.renderer.width / 2;
    orange.y = pixi_app.renderer.height / 2;
    
    orange.anchor.x = 0.5;
    orange.anchor.y = 0.5;
    orange.alpha = 1;
    pixi_app.stage.addChild(orange);

    //sprite_container.mask = orange;
    coke.mask = orange;


    //TweenMax.to(coke.scale, 16, {x: coke_size.scale, y: ≈, ease: "linear", delay: 0})
    let rotation_factor = 1;




    pixi_app.ticker.add(() => {
      



      if (appState.audioKicking) {
        analyser.getByteFrequencyData(dataArray); 


          const sprite_size = backgroundSize(pixi_app.renderer.width, pixi_app.renderer.height, 1200, 796)
         


        for (let i = 0; i < sprite_array.length; i++) {
          const sprite = sprite_array[i];
          let r = mapRange(dataArray[(i * 5) + 3], 0, 255, sprite_size.scale, sprite_size.scale * 2.5);
          TweenMax.to(sprite.scale, 1, {x:r, y:r});      
          sprite.rotation += rotation_factor * i;    
        }

        analyser.getByteTimeDomainData(dataArray); 


          // const coke_size = backgroundSize(pixi_app.renderer.width, pixi_app.renderer.height, 640, 480)
          // let u = mapRange(dataArray[25], 0, 255, coke_size.scale, coke_size.scale * 1);
          // TweenMax.to(coke.scale, 1, {x:u, y:u});

          for (let i = 0; i < vizzies.length; i++) {
            var e = vizzies[i];
            let t = mapRange(dataArray[i], 0, 255, 0, 10);
            TweenMax.to(e.scale, 0.5, {y:t});
          }
          pixi_app.renderer.render(viz_tex_container, rt);

      }      
    });

    function handleMove(e) {
      var x = e.data.global.x;
      var y = e.data.global.y;
    
      rotation_factor =  mapRange(x, 0, pixi_app.renderer.width, -0.00005, 0.00005);

      // rsprite.x = x;
      // rsprite.y = y;
    }

    function handleClick(e) {
      

      for (let i = 0; i < sprite_array.length; i++) {
        const sprite = sprite_array[i];
        setTimeout(() => {
          sprite.texture = (sprite.texture == resources.dp_1.texture) ? resources.dp_4.texture : resources.dp_1.texture;
        }, i * 60);
      }
    }
 
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