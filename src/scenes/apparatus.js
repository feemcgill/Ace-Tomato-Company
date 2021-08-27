import * as PIXI from 'pixi.js'
import { TweenMax, TimelineLite } from 'gsap/TweenMax'
import pixi_app from '../base/pixi/app'
import { getWindowSize, backgroundSize, debounce } from '../base/utils/helpers'

import Kaleidoscope from '../vibes/kscope.js'
import PhotoJam from '../vibes/photojam.js'
import VidVibe from '../vibes/vidvibe.js'
import appState from '../base/state.js'
import config from '../config.js'

export default class Apparatus extends PIXI.Container {
  constructor() {
    super()
    this.timeline = null
  }
  load() {
    console.log('LOAD APPARATUS')

    pixi_app.loader
      .add('ata_1', config.asset_url + '/082521/Apparatus/IMG_8560.jpg')
      .add('ata_2', config.asset_url + '/062821/alpha/All the Apparatus/000060940007.jpg')
      .add('ata_3', config.asset_url + '/062821/alpha/All the Apparatus/000060940008.jpg')
      .add('ata_4', config.asset_url + '/062821/alpha/All the Apparatus/000308310003.jpg')
      .add('ata_5', config.asset_url + '/062821/alpha/All the Apparatus/000323220024.jpg')
      .add('ata_6', config.asset_url + '/062821/alpha/All the Apparatus/000324000025.jpg')
      .add('ata_vid', config.asset_url + '/062821/vids/All the app 4 B.mp4')
      .load((loader, resources) => {
        this.run()
      })
    pixi_app.loader.onComplete.add(() => {
      //this.run();
    })
  }
  run() {
    const debug = false
    const duration = appState.currentTrackSource

    const pj_container = new PIXI.Container()
    this.addChild(pj_container)

    const pj = new PhotoJam(pixi_app.loader.resources.ata_1.texture, {
      blendMode: 3,
      moveData: [11, 12, 13, 14],
      amplify: [1, 1.5],
      moveSpeed: 10,
    })
    pj.transitionIn()

    pj_container.addChild(pj)

    //pj.alpha = 0;

    // let brt = new PIXI.BaseRenderTexture(pixi_app.renderer.width, pixi_app.renderer.height, PIXI.SCALE_MODES.LINEAR, 1);
    // let rt = new PIXI.RenderTexture(brt);
    // let rsprite = new PIXI.Sprite(rt);
    // rsprite.x = 0;
    // rsprite.y = 0;
    // this.addChild(rsprite);

    //vv.mask = rsprite

    const ks_container = new PIXI.Container()
    this.addChild(ks_container)

    const kscope = new Kaleidoscope(pixi_app.loader.resources.ata_1.texture, {
      blendMode: 2,
      moveData: [30, 26],
    })
    kscope.draw()
    ks_container.addChild(kscope)
    ks_container.alpha = 1

    const vv = new VidVibe(pixi_app.loader.resources.ata_vid.url)
    vv.transitionIn()
    this.addChild(vv)
    vv.blendMode = 3
    vv.alpha = 1

    pixi_app.ticker.add(() => {
      //pixi_app.renderer.render(pj_container, rt);
    })

    //WITH Timelines (cleaner, more versatile)
    this.timeline = new TimelineLite()
    this.timeline.to(ks_container, 60, { alpha: 0, delay: 60 })
    this.timeline.to(vv, 30, { alpha: 0, delay: 0 })
    this.timeline.add(() => {
      pj.setAmplify([0.5, 3])
    })
    this.timeline.to(ks_container, 10, { alpha: 0.05, delay: 50 })
    this.timeline.add(() => {
      pj.setAmplify([0.1, 0.4])
    })
    this.timeline.to(ks_container, 10, { alpha: 0, delay: 0 })
    // this.timeline.to(ks_container, 6, {alpha: 1, delay: 6});
    // this.timeline.to(pj, 6, {alpha: 1, delay: 6});

    // // then we can control the whole thing easily...
    // tl.pause();
    // tl.resume();
    // tl.seek(1.5);
    // tl.reverse();

    //this.timeline.timeScale(10);

    if (process.env.DEBUG == 'true') {
      this.timeline.timeScale(10)

      // TweenMax.to(vv, 1, {alpha: 1, delay: 1})
      // TweenMax.to(ks_container, 1, {alpha: 1, delay: 1})
    }

    pixi_app.ticker.add(() => {})

    window.addEventListener(
      'resize',
      debounce(function (e) {
        console.log('APPARATUS RESIZE')
        // vv.mask = null;
        // brt.destroy();
        // rt.destroy();
        // rsprite.destroy();
        // brt = new PIXI.BaseRenderTexture(pixi_app.renderer.width, pixi_app.renderer.height, PIXI.SCALE_MODES.LINEAR, 1);
        // rt = new PIXI.RenderTexture(brt);
        // rsprite = new PIXI.Sprite(rt);
        // rsprite.x = 0;
        // rsprite.y = 0;
        //vv.mask = rsprite;
      }, 1000)
    )
  }
}
