import * as PIXI from 'pixi.js'
import { TweenMax, TimelineLite, Elastic } from 'gsap/TweenMax'
import pixi_app from '../base/pixi/app'
import { getWindowSize, backgroundSize, debounce } from '../base/utils/helpers'

import Kaleidoscope from '../vibes/kscope.js'
import PhotoJam from '../vibes/photojam.js'
import VidVibe from '../vibes/vidvibe.js'
import appState from '../base/state.js'
import config from '../config.js'

export default class HitTheSheets extends PIXI.Container {
  constructor() {
    super()
    this.timeline = null
  }
  load() {
    pixi_app.loader
      .add('hts_1', config.asset_url + '/082521/Hit the Sheets/000241310006.jpg')
      .add('hts_2', config.asset_url + '/082521/Hit the Sheets/000241310009.jpg')
      .add('hts_3', config.asset_url + '/062821/alpha/Hit the Sheets/000060950012.jpg')
      .add('hts_4', config.asset_url + '/062821/alpha/Hit the Sheets/000060950014.jpg')
      .add('hts_vid', config.asset_url + '/062821/vids/hit the sheets 4 B.mp4')
      .load((loader, resources) => {
        this.run()
      })
  }
  run() {
    const debug = false
    const duration = appState.currentTrackSource

    // Video 2
    const vv2 = new VidVibe(pixi_app.loader.resources.hts_vid.url)
    vv2.transitionIn()
    this.addChild(vv2)
    vv2.blendMode = 0
    vv2.alpha = 1

    // Video
    const vv_container = new PIXI.Container()
    this.addChild(vv_container)
    const vv = new VidVibe(pixi_app.loader.resources.hts_vid.url)
    vv.transitionIn()
    vv_container.addChild(vv)
    vv.blendMode = 3
    vv.alpha = 1

    // Pic 1
    const pj1_container = new PIXI.Container()
    this.addChild(pj1_container)
    const pj1 = new PhotoJam(pixi_app.loader.resources.hts_1.texture, {
      blendMode: 0,
      moveData: [11, 12, 13, 14],
      amplify: [1, 1.5],
      moveSpeed: 10,
    })
    pj1.currentScaleFactor = 1
    pj1.transitionIn()
    // pj1.state.canRotatePointer = false
    pj1_container.addChild(pj1)
    pj1_container.alpha = 0

    // Pic 2
    const pj2_container = new PIXI.Container()
    this.addChild(pj2_container)
    const pj2 = new PhotoJam(pixi_app.loader.resources.hts_2.texture, {
      blendMode: 0,
      moveData: [11, 12, 13, 14],
      amplify: [1, 1.5],
      moveSpeed: 10,
    })
    pj2.currentScaleFactor = 1
    pj2.transitionIn()
    // pj2.state.canRotatePointer = false
    pj2_container.addChild(pj2)
    pj2_container.alpha = 0

    // Pic 3
    const pj3_container = new PIXI.Container()
    this.addChild(pj3_container)
    const pj3 = new PhotoJam(pixi_app.loader.resources.hts_3.texture, {
      blendMode: 0,
      moveData: [11, 12, 13, 14],
      amplify: [1, 1.5],
      moveSpeed: 10,
    })
    pj3.currentScaleFactor = 1
    pj3.transitionIn()
    // pj3.state.canRotatePointer = false
    pj3_container.addChild(pj3)
    pj3_container.alpha = 0

    // Pic 4
    const pj4_container = new PIXI.Container()
    this.addChild(pj4_container)
    const pj4 = new PhotoJam(pixi_app.loader.resources.hts_4.texture, {
      blendMode: 0,
      moveData: [11, 12, 13, 14],
      amplify: [1, 1.5],
      moveSpeed: 10,
    })
    pj4.currentScaleFactor = 1
    pj4.transitionIn()
    // pj4.state.canRotatePointer = false
    pj4_container.addChild(pj4)
    pj4_container.alpha = 0

    // Kscope 1
    const ks1_container = new PIXI.Container()
    this.addChild(ks1_container)

    const kscope1 = new Kaleidoscope(pixi_app.loader.resources.hts_1.texture, {
      blendMode: 3,
      moveData: [30, 26],
    })
    kscope1.draw()
    ks1_container.addChild(kscope1)
    ks1_container.alpha = 0

    // Kscope 2
    const ks2_container = new PIXI.Container()
    this.addChild(ks2_container)

    const kscope2 = new Kaleidoscope(pixi_app.loader.resources.hts_2.texture, {
      blendMode: 3,
      moveData: [30, 26],
    })
    kscope2.draw()
    ks2_container.addChild(kscope2)
    ks2_container.alpha = 0

    // Kscope 3
    const ks3_container = new PIXI.Container()
    this.addChild(ks3_container)

    const kscope3 = new Kaleidoscope(pixi_app.loader.resources.hts_3.texture, {
      blendMode: 3,
      moveData: [30, 26],
    })
    kscope3.draw()
    ks3_container.addChild(kscope3)
    ks3_container.alpha = 0

    // Kscope 4
    const ks4_container = new PIXI.Container()
    this.addChild(ks4_container)

    const kscope4 = new Kaleidoscope(pixi_app.loader.resources.hts_4.texture, {
      blendMode: 3,
      moveData: [30, 26],
    })
    kscope4.draw()
    ks4_container.addChild(kscope4)
    ks4_container.alpha = 0

    pixi_app.ticker.add(() => {})

    // song is 240 seconds long

    this.timeline = new TimelineLite()

    this.timeline.to(ks1_container, 10, { alpha: 0.5 }, '15')

    this.timeline.to(vv2, 10, { alpha: 0 }, '30')
    this.timeline.to(vv_container, 10, { x: 10 }, '30')
    this.timeline.fromTo(pj1_container, 10, { alpha: 0, rotation: -2 }, { alpha: 1, rotation: 0, ease: Power1.easeInOut }, '30')
    this.timeline.to(ks1_container, 10, { alpha: 1 }, '30')

    this.timeline.to(pj1_container, 10, { alpha: 0, rotation: 2, ease: Power1.easeInOut }, '50')
    this.timeline.to(ks1_container, 10, { alpha: 0 }, '50')
    this.timeline.to(vv2, 10, { alpha: 1 }, '50')
    this.timeline.to(ks2_container, 10, { alpha: 0.5 }, '50')

    this.timeline.to(vv2, 10, { alpha: 0 }, '70')
    this.timeline.to(vv_container, 10, { x: 20 }, '70')
    this.timeline.fromTo(pj2_container, 10, { alpha: 0, rotation: -2 }, { alpha: 1, rotation: 0, ease: Power1.easeInOut }, '70')
    this.timeline.to(ks2_container, 10, { alpha: 1 }, '70')

    this.timeline.to(pj2_container, 10, { alpha: 0, rotation: 2, ease: Power1.easeInOut }, '90')
    this.timeline.to(ks2_container, 10, { alpha: 0 }, '90')
    this.timeline.to(vv2, 10, { alpha: 1 }, '90')
    this.timeline.to(ks3_container, 10, { alpha: 0.5 }, '90')

    this.timeline.to(vv2, 10, { alpha: 0 }, '110')
    this.timeline.to(vv_container, 10, { x: 30 }, '110')
    this.timeline.fromTo(pj3_container, 10, { alpha: 0, rotation: -2 }, { alpha: 1, rotation: 0, ease: Power1.easeInOut }, '110')
    this.timeline.to(ks3_container, 10, { alpha: 1 }, '110')

    this.timeline.to(pj3_container, 10, { alpha: 0, rotation: 2, ease: Power1.easeInOut }, '130')
    this.timeline.to(ks3_container, 10, { alpha: 0 }, '130')
    this.timeline.to(vv2, 10, { alpha: 1 }, '130')
    this.timeline.to(ks4_container, 10, { alpha: 0.5 }, '130')

    this.timeline.to(vv2, 10, { alpha: 0 }, '150')
    this.timeline.to(vv_container, 10, { x: 40 }, '150')
    this.timeline.fromTo(pj4_container, 10, { alpha: 0, rotation: -2 }, { alpha: 1, rotation: 0, ease: Power1.easeInOut }, '150')
    this.timeline.to(ks4_container, 10, { alpha: 1 }, '150')

    this.timeline.to(pj4_container, 10, { alpha: 0, rotation: 2, ease: Power1.easeInOut }, '170')
    this.timeline.to(ks4_container, 10, { alpha: 0 }, '170')
    this.timeline.to(vv2, 10, { alpha: 1 }, '170')
    this.timeline.to(vv_container, 70, { x: 100 }, '170')

    // this.timeline.timeScale(10)

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
