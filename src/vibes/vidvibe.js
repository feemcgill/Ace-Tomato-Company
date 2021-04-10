
import * as PIXI from 'pixi.js'
import {TweenMax} from "gsap/TweenMax";
import pixi_app from '../base/pixi/app'
import {mapRange, backgroundSize, getWindowSize} from '../base/utils/helpers'
import appState from '../base/state.js';
import {analyser, dataArray } from '../base/audio/audioInit';

export default class VidVibe extends PIXI.Sprite {
  constructor(vid, callback, parent) {
    super();
    this.callback = callback;
    this.vid = vid;
    this.sprite_array = [];
    this.rotation_factor = 0.00005;
    this.rotation_factor_reverse = -0.0005;
    this.interactive = true;
    this.parent = parent;
    this.on('mousemove', this.handleMove)
    .on('touchmove', this.handleMove)
  }

  transitionOut(){
    this.callback();
    this.removeChildren()   
  }

  transitionIn() {
    const bg = PIXI.Texture.from(this.vid);
    console.log('VID VIBE', this.parent);
    let coke_size = backgroundSize(pixi_app.renderer.width, pixi_app.renderer.height, bg.baseTexture.width, bg.baseTexture.height)
    this.scale.x = coke_size.scale;
    this.scale.y = coke_size.scale;    
    bg.baseTexture.resource.source.loop = true;
    //const coke = new PIXI.Sprite(bg);
    bg.baseTexture.on('loaded', () => {
      coke_size = backgroundSize(pixi_app.renderer.width, pixi_app.renderer.height, bg.baseTexture.width, bg.baseTexture.height)
      this.scale.x = coke_size.scale;
      this.scale.y = coke_size.scale;      
    })
    this.texture = bg;
    this.x = pixi_app.renderer.width / 2;
    this.y = pixi_app.renderer.height / 2;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;  
    this.preload = 'auto';

    window.addEventListener("resize",(e) => {
      console.log('vidvibe resize')
      const size = getWindowSize();
      const w = size.width;
      const h = size.height;
            
      coke_size = backgroundSize(w, h,  bg.baseTexture.width, bg.baseTexture.height)

      this.scale.x = coke_size.scale;
      this.scale.y = coke_size.scale;
  
      this.x = w / 2;
      this.y = h / 2;

    });
  }

  handleMove(e) {
  }
  
  handleClick(e) {
  }  
  resize() {
  }

}









    
    
    
    
    

