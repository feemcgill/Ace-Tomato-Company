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

    const pj = new PhotoJam(pixi_app.loader.resources.ata_1.texture, {
      blendMode: 0,
      moveData: [30, 26, 30, 26, 27, 31],
      amplify: [1, 1.5],
      moveSpeed: 10,
    })

    pj.initial_rotate = 0.00003

    const ks_container = new PIXI.Container()

    const kscope = new Kaleidoscope(pixi_app.loader.resources.ata_1.texture, {
      blendMode: 2,
      moveFactor: 10,
      moveData: [30, 26],
    })
    kscope.draw()
    ks_container.addChild(kscope)
    ks_container.alpha = 1

    const vv = new VidVibe(pixi_app.loader.resources.ata_vid.url)

    vv.blendMode = 3
    vv.alpha = 1

    pj_container.addChild(pj)
    pj.transitionIn()
    this.addChild(pj_container)
    this.addChild(ks_container)
    this.addChild(vv)

    vv.transitionIn()
    pixi_app.ticker.add(() => {})

    this.timeline = new TimelineLite()
    this.timeline.add(() => {
      TweenMax.to(vv, 2, {
        alpha: 0,
        onComplete: function () {
          vv.blendMode = 2
          TweenMax.to(vv, 10, { alpha: 0.3 })
        },
      })
    }, '90')
    this.timeline.to(ks_container, 60, { alpha: 0 })
    this.timeline.to(vv, 30, { alpha: 0, delay: 0 })
    this.timeline.to(ks_container, 10, { alpha: 0.2, delay: 50 })
    this.timeline.add(() => {
      pj.setAmplify([0.1, 0.4])
    })
    this.timeline.to(ks_container, 10, { alpha: 0, delay: 0 })

    if (process.env.DEBUG == 'true') {
      this.timeline.timeScale(10)
    }

    pixi_app.ticker.add(() => {})

    window.addEventListener(
      'resize',
      debounce(function (e) {}, 1000)
    )
  }
}
