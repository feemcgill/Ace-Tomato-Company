import * as PIXI from 'pixi.js'
import {TweenMax} from "gsap/TweenMax";
import pixi_app from '../base/pixi/app'


import Kaleidoscope from '../vibes/kscope.js'
import PhotoJam from '../vibes/photojam.js'
import VidVibe from '../vibes/vidvibe.js'



export default class DawnPatrol extends PIXI.Container {
  constructor() {
    super();  
  }
  load() {
    pixi_app.loader
      .add('dp_1', './../../assets/dawn_patrol/dp-1.jpg')
      .add('dp_2', './../../assets/dawn_patrol/dp-2.jpg')
      .add('dp_2_bg', './../../assets/dawn_patrol/dp-2-bg.jpg')
      .add('vid', './../../assets/dawn_patrol/dp-1.mp4')
      .add('dp_3', './../../assets/dawn_patrol/dp-3.jpg')
      .add('dp_4', './../../assets/dawn_patrol/dp-4.jpg')
      .load((loader, resources) => {
        this.run();
      });    
  }
  run() {
    const debug = true;
    console.log('RUN DP');
    const pj_container = new PIXI.Container();
    pixi_app.stage.addChild(pj_container)

    const pj = new PhotoJam(pixi_app.loader.resources.dp_1.texture, 1, () => {
      console.log('pj callback');
    })
    pj.transitionIn();

    pj_container.addChild(pj)
    

    const vv = new VidVibe(pixi_app.loader.resources.vid.url, () => {
      console.log('vv callback');
    })
    vv.transitionIn();
    pixi_app.stage.addChild(vv)
    vv.blendMode = 1;
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

    const kscope = new Kaleidoscope(pixi_app.loader.resources.dp_3.texture, 1)
    kscope.draw()
    ks_container.addChild(kscope);
    ks_container.alpha = 0;

    pixi_app.ticker.add(() => {
      pixi_app.renderer.render(pj_container, rt);
    });



    if (debug) {
      TweenMax.to(vv, 1, {alpha: 1, delay: 1})
      TweenMax.to(ks_container, 1, {alpha: 1, delay: 1})      
    } else {
      TweenMax.to(vv, 30, {alpha: 1, delay: 60})
      setTimeout(() => {
        pj.fadeToWhite(20);
      }, 90000);
      TweenMax.to(ks_container, 15, {alpha: 1, delay: 90})
    }


    pixi_app.ticker.add(() => {      
    });
   
  }
  fadeToWhite(time) {
    TweenMax.to(whitewash, time, {alpha: 1})
  }
  handleMove(e) {

  }
  
  handleClick(e) {

  }  
  resize() {
  }

}









