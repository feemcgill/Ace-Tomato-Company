

import * as PIXI from 'pixi.js'
import {TweenMax} from "gsap/TweenMax";
import pixi_app from '../base/pixi/app'
import {mapRange, backgroundSize, getWindowSize} from '../base/utils/helpers'
import appState from '../base/state.js';
import {analyser, dataArray } from '../base/audio/audioInit';

export default class Vizzies extends PIXI.Container {
  constructor(vid, callback, parent) {
    super();
  }

  init() {


    var vizzies = [];


    for (let i = 0; i < dataArray.length; i++) {
      const e = dataArray[i];
      var guy = new PIXI.Sprite(PIXI.Texture.WHITE);
      guy.width = pixi_app.renderer.width / dataArray.length;
      guy.height = 50;

      guy.x = (guy.width * i);
      //guy.y = pixi_app.renderer.height / 2;

      guy.tint = 0xffff00;
      if(i % 2 == 0) {
        guy.tint = 0x00ff00;
      }

      guy.interactive = true;
      guy.on('mousedown', onDown);
      function onDown (eventData) {
        console.log(i, guy);
      }
      //guy.blendMode = 3;

      vizzies.push(guy)

      this.addChild(guy)

    }
   
    

    // const brt = new PIXI.BaseRenderTexture(pixi_app.renderer.width, pixi_app.renderer.height, PIXI.SCALE_MODES.LINEAR, 1);
    // const rt = new PIXI.RenderTexture(brt);
    // const rsprite = new PIXI.Sprite(rt);

    // rsprite.x = pixi_app.renderer.width / 2;
    // rsprite.y = pixi_app.renderer.height;
    // rsprite.anchor.x = 0.5;
    // //rsprite.anchor.y = 0.5;  
    // rsprite.rotation = 3.14159;
    
    // viz_container.addChild(rsprite);





    pixi_app.ticker.add(() => {
          



      if (appState.audioKicking) {

        //analyser.getByteTimeDomainData(dataArray); 

        analyser.getByteFrequencyData(dataArray); 


          for (let i = 0; i < vizzies.length; i++) {
            var e = vizzies[i];
            let t = mapRange(dataArray[i], 0, 255, 0, 50);
            TweenMax.to(e.scale, 0.5, {y:t});
          }

      }      
    });
      
  }
}
