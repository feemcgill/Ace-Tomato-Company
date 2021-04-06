import * as PIXI from 'pixi.js'
import {TweenMax} from "gsap/TweenMax";
import pixi_app from '../base/pixi/app'
import {mapRange, backgroundSize} from '../base/utils/helpers'
import appState from '../base/state.js';
import {analyser, dataArray } from '../base/audio/audioInit';

export default class PhotoJam extends PIXI.Sprite {
  constructor(texture, callback) {
    super();
    this.callback = callback;
    this.tex = texture;
    this.sprite_array = [];
    this.rotation_factor = 0.00005;
    this.rotation_factor_reverse = -0.0005;
    this.interactive = true;
    this.whitewash = new PIXI.Graphics();
    this.on('mousemove', this.handleMove)
    .on('touchmove', this.handleMove)
  }

  transitionOut(){
    this.callback();
    this.removeChildren()   
  }

  transitionIn() {
    //const whitewash = new PIXI.Graphics();
    this.whitewash.beginFill(0xffffff);
    this.whitewash.drawRect(0,0,pixi_app.renderer.width, pixi_app.renderer.height)
    this.whitewash.endFill();
    
    const sprite_size = backgroundSize(pixi_app.renderer.width, pixi_app.renderer.height, 796, 1200)
    const sprite = new PIXI.Sprite(this.tex);
    
    sprite.scale.x = sprite_size.scale;
    sprite.scale.y = sprite_size.scale;
    
    sprite.x = pixi_app.renderer.width / 2;
    sprite.y = pixi_app.renderer.height / 2;
    //sprite.blendMode = 1;

    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    //this.addChild(sprite);

    for (let index = 0; index < 6; index++) {
      const sprite = new PIXI.Sprite(this.tex);
    
      sprite.scale.x = sprite_size.scale;
      sprite.scale.y = sprite_size.scale;
      
      sprite.x = pixi_app.renderer.width / 2;
      sprite.y = pixi_app.renderer.height / 2 + (index * 10);
      
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 0.5;
      // sprite.alpha = 0.6;
      sprite.blendMode = 1;
      // if(index % 2 == 0) {
      //   sprite.scale.y = -sprite_size.scale;
      //   sprite.scale.x = -sprite_size.scale;
      // } 

      this.sprite_array.push(sprite)
      this.addChild(sprite);
    }
    
    this.sprite_array[0].blendMode = 0;
    this.addChild(this.whitewash);
    this.whitewash.alpha = 0;
    pixi_app.ticker.add(() => {  
      if (appState.audioKicking) {
        analyser.getByteFrequencyData(dataArray); 
        //analyser.getByteTimeDomainData(dataArray); 

        const sprite_size = backgroundSize(pixi_app.renderer.width, pixi_app.renderer.height, 796, 1200)
         
        for (let i = 0; i < this.sprite_array.length; i++) {

          const sprite = this.sprite_array[i];
          let r = mapRange(dataArray[(i * 5) + 3], 0, 255, sprite_size.scale * 0.95, sprite_size.scale * 1.5);
          TweenMax.to(sprite.scale, 1, {x:r, y:r});      
          sprite.rotation += this.rotation_factor * (i + 1);
          // if(i % 2 == 0) {
          //   sprite.rotation += this.rotation_factor_reverse * (i + 1);
          // } 
        }
      }      
    });    
  }
  fadeToWhite(time) {
    TweenMax.to(this.whitewash, time, {alpha: 1})
  }
  handleMove(e) {
    var rotation_const = 0.0005;
    var move_const = 100;
    var x = e.data.global.x;
    var y = e.data.global.y;
  
    this.rotation_factor =  mapRange(x, 0, pixi_app.renderer.width, -rotation_const, rotation_const);
    this.rotation_factor_reverse =  mapRange(x, 0, pixi_app.renderer.width, rotation_const, -rotation_const);
    var moveFactorX = mapRange(x, 0, pixi_app.renderer.width, (pixi_app.renderer.width/2) - move_const, (pixi_app.renderer.width/2) + move_const)
    var moveFactorY = mapRange(y, 0, pixi_app.renderer.height, (pixi_app.renderer.height/2) - move_const, (pixi_app.renderer.height/2) + move_const)
    TweenMax.staggerTo(this.sprite_array, 10, {x: moveFactorX, y: moveFactorY}, -0.3);
    // rsprite.x = x;
    // rsprite.y = y;
  }
  
  handleClick(e) {
    // for (let i = 0; i < this.sprite_array.length; i++) {
    //   const sprite = this.sprite_array[i];
    //   setTimeout(() => {
    //     sprite.texture = (sprite.texture == resources.dp_1.texture) ? resources.dp_4.texture : resources.dp_1.texture;
    //   }, i * 60);
    // }
  }  
  resize() {
  }

}









