import * as PIXI from 'pixi.js'
import { TweenMax, TimelineLite } from 'gsap/TweenMax'
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
      .add('hts_1', config.asset_url + '/hit_the_sheets/hts_1.jpg')
      .add('hts_2', config.asset_url + '/hit_the_sheets/hts_2.jpg')
      .add('hts_3', config.asset_url + '/hit_the_sheets/hts_3.jpg')
      .add('hts_4', config.asset_url + '/hit_the_sheets/hts_4.jpg')
      .add('hts_vid', config.asset_url + '/hit_the_sheets/hts.mp4')
      .load((loader, resources) => {
        this.run()
      })
  }
  run() {
    const debug = false
    const duration = appState.currentTrackSource

    const pj_container = new PIXI.Container()
    this.addChild(pj_container)

    const pj = new PhotoJam(pixi_app.loader.resources.hts_4.texture, {
      blendMode: 3,
      moveData: [11, 12, 13, 14],
      amplify: [1, 1.5],
      moveSpeed: 10,
    })
    pj.transitionIn()

    pj_container.addChild(pj)

    const ks_container = new PIXI.Container()
    this.addChild(ks_container)

    const kscope = new Kaleidoscope(
      pixi_app.loader.resources.hts_3.texture,
      2,
      [30, 26]
    )
    kscope.draw()
    ks_container.addChild(kscope)
    ks_container.alpha = 1

    const vv = new VidVibe(pixi_app.loader.resources.hts_vid.url, () => {})
    vv.transitionIn()
    this.addChild(vv)
    vv.blendMode = 3
    vv.alpha = 1

    pixi_app.ticker.add(() => {})

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

    if (appState.debug) {
      this.timeline.timeScale(10)
    }

    pixi_app.ticker.add(() => {})

    window.addEventListener(
      'resize',
      debounce(function (e) {}, 500)
    )
  }
}
