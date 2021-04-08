import * as PIXI from 'pixi.js'
import {TweenMax} from "gsap/TweenMax";
import pixi_app from '../base/pixi/app'


import Kaleidoscope from '../vibes/kscope.js'
import PhotoJam from '../vibes/photojam.js'
import VidVibe from '../vibes/vidvibe.js'
import appState from '../base/state.js'


export default class Apparatus extends PIXI.Container {
  constructor() {
    super();
  }
  load() {
    pixi_app.loader      
    .add('ata_1', './../assets/apparatus/ata_1.jpg')
    .add('ata_2', './../assets/apparatus/ata_1.jpg')
    .add('ata_3', './../assets/apparatus/ata_1.jpg')
    .add('ata_4', './../assets/apparatus/ata_1.jpg')
    .add('ata_vid','./../assets/apparatus/ata.mp4')
  
    .load((loader, resources) => {
      this.run();
    });
  }
  run() {
 
    const debug = true;
    const duration = appState.currentTrackSource;
    console.log('TRACK DURATION', duration)

    const pj_container = new PIXI.Container();
    pixi_app.stage.addChild(pj_container)

    const pj = new PhotoJam(pixi_app.loader.resources.ata_4.texture, 3, () => {
      console.log('pj callback');
    })
    pj.transitionIn();

    pj_container.addChild(pj)
    



    const brt = new PIXI.BaseRenderTexture(pixi_app.renderer.width, pixi_app.renderer.height, PIXI.SCALE_MODES.LINEAR, 1);
    const rt = new PIXI.RenderTexture(brt);
    const rsprite = new PIXI.Sprite(rt);
    rsprite.x = 0;
    rsprite.y = 0;    
    pixi_app.stage.addChild(rsprite);

    //vv.mask = rsprite




    const ks_container = new PIXI.Container();
    pixi_app.stage.addChild(ks_container)

    const kscope = new Kaleidoscope(pixi_app.loader.resources.ata_3.texture, 2)
    kscope.draw()
    ks_container.addChild(kscope);
    ks_container.alpha = 0;



    const vv = new VidVibe(pixi_app.loader.resources.ata_vid.url, () => {
      console.log('vv callback');
    })
    vv.transitionIn();
    pixi_app.stage.addChild(vv)
    vv.blendMode = 3;
    vv.alpha = 0;





    pixi_app.ticker.add(() => {
      pixi_app.renderer.render(pj_container, rt);
      // if (appState.currentTrackSource) {
      //   console.log('TRACK DURATION', appState.currentTrackSource.buffer.duration)
      // }
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









