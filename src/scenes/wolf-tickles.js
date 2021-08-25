import * as PIXI from 'pixi.js'
import { TweenMax, TimelineLite } from 'gsap/TweenMax'
import pixi_app from '../base/pixi/app'
import { getWindowSize, backgroundSize, debounce } from '../base/utils/helpers'

import Kaleidoscope from '../vibes/kscope.js'
import PhotoJam from '../vibes/photojam.js'
import VidVibe from '../vibes/vidvibe.js'
import appState from '../base/state.js'
import config from '../config.js'

export default class WolfTickles extends PIXI.Container {
  constructor() {
    super()
    this.timeline = null
  }
  load() {
    pixi_app.loader
      .add('wt_1', config.asset_url + '/062821/alpha/Wolf Tickles/000053620023.jpg')
      .add('wt_2', config.asset_url + '/062821/alpha/Wolf Tickles/000308290007.jpg')
      .add('wt_3', config.asset_url + '/062821/alpha/Wolf Tickles/000324000005.jpg')
      .add('wt_4', config.asset_url + '/062821/alpha/Wolf Tickles/000324000010.jpg')
      // .add('wt_vid', config.asset_url + '/062821/vids/Wolf Tickles 4 B.mp4')
      .add('wt_vid', config.asset_url + '/wolf-tickless.mp4')
      .load((loader, resources) => {
        this.run()
      })
  }
  run() {
    const debug = true
    const duration = appState.currentTrackSource

    // VidVibe
    const vv = new VidVibe(pixi_app.loader.resources.wt_vid.url)
    vv.transitionIn()
    this.addChild(vv)
    vv.blendMode = 0
    vv.alpha = 0

    // PJ 1
    const pj_container = new PIXI.Container()
    this.addChild(pj_container)

    const pj = new PhotoJam(pixi_app.loader.resources.wt_2.texture, {
      blendMode: 0,
      moveData: [11, 12, 13, 14],
      amplify: [0.5, 0.75],
      moveSpeed: 10,
    })
    pj.state.canRotatePointer = false
    pj.transitionIn()
    pj_container.addChild(pj)
    pj.alpha = 0

    // Kaleidscope
    const ks_container = new PIXI.Container()
    this.addChild(ks_container)

    const kscope = new Kaleidoscope(pixi_app.loader.resources.wt_1.texture, {
      blendMode: 2,
      moveData: [30, 26],
    })

    kscope.draw()
    ks_container.addChild(kscope)
    ks_container.alpha = 0

    // pj2
    const pj2_container = new PIXI.Container()
    this.addChild(pj2_container)
    const pj2 = new PhotoJam(pixi_app.loader.resources.wt_3.texture, {
      blendMode: 3,
      moveData: [11, 12, 13, 14],
      amplify: [0.5, 0.75],
      moveSpeed: 10,
    })
    pj2.transitionIn()
    pj2_container.addChild(pj2)
    pj2.alpha = 0

    // pj3
    const pj3_container = new PIXI.Container()
    this.addChild(pj3_container)
    const pj3 = new PhotoJam(pixi_app.loader.resources.wt_4.texture, {
      blendMode: 3,
      moveData: [11, 12, 13, 14],
      amplify: [0.5, 0.75],
      moveSpeed: 10,
    })
    pj3.state.canRotatePointer = false
    pj3.transitionIn()
    pj3_container.addChild(pj3)
    pj3.alpha = 0

    pixi_app.ticker.add(() => {})

    this.timeline = new TimelineLite()

    this.timeline.to(vv, 10, { alpha: 1 })
    this.timeline.to(ks_container, 10, { alpha: 0.75 }, '10')

    this.timeline.to(pj, 10, { alpha: 1 }, '15')
    this.timeline.to(pj, 10, { alpha: 0 }, '35')

    this.timeline.to(pj2, 10, { alpha: 1 }, '55')
    this.timeline.to(pj2, 10, { alpha: 0 }, '75')

    this.timeline.to(pj3, 10, { alpha: 1 }, '105')
    this.timeline.to(pj3, 10, { alpha: 0 }, '115')

    this.timeline.to(ks_container, 10, { alpha: 0 }, '120')

    if (process.env.DEBUG == 'true') {
      this.timeline.timeScale(10)
    }

    pixi_app.ticker.add(() => {})

    window.addEventListener(
      'resize',
      debounce(function (e) {}, 500)
    )
  }
}
