
import * as PIXI from 'pixi.js'
import {TweenMax} from "gsap/TweenMax";
import pixi_app from '../base/pixi/app'
import {mapRange, backgroundSize, getWindowSize} from '../base/utils/helpers'
import appState from '../base/state.js';
import {analyser, dataArray } from '../base/audio/audioInit';

export default class VidVibe extends PIXI.Sprite {
  constructor(vid, callback) {
    super();
    this.callback = callback;
    this.vid = vid;
    this.sprite_array = [];
    this.rotation_factor = 0.00005;
    this.rotation_factor_reverse = -0.0005;
    this.interactive = true;
    this.on('mousemove', this.handleMove)
    .on('touchmove', this.handleMove)
  }

  transitionOut(){
    this.callback();
    this.removeChildren()   
  }

  transitionIn() {
    let coke_size = backgroundSize(pixi_app.renderer.width, pixi_app.renderer.height, 480, 360)
    const bg = PIXI.Texture.from(this.vid);
    bg.baseTexture.resource.source.loop = true;
    //const coke = new PIXI.Sprite(bg);
    
    this.texture = bg;
    this.scale.x = coke_size.scale;
    this.scale.y = coke_size.scale;

    this.x = pixi_app.renderer.width / 2;
    this.y = pixi_app.renderer.height / 2;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;  
    this.preload = 'auto';

    // this.addChild(coke);
    window.addEventListener("resize",(e) => {
      const size = getWindowSize();
      const w = size.width;
      const h = size.height;
            
      coke_size = backgroundSize(w, h,  640, 480)
      console.log('vid tho',  640, 480, coke_size.scale)

      this.scale.x = coke_size.scale;
      this.scale.y = coke_size.scale;
  
      this.x = w / 2;
      this.y = h / 2;

      // for (let i = 0; i < this.sprite_array.length; i++) {
      //   const sprite = this.sprite_array[i];
      //   sprite.x = w / 2;
      //   sprite.y = h / 2 + (i * 10);        
      // }
      // this.x = pixi_app.renderer.width / 2;
      // this.y = pixi_app.renderer.height / 2;
    });
  }

  handleMove(e) {
  }
  
  handleClick(e) {
  }  
  resize() {
  }

}









    
    
    
    
    

