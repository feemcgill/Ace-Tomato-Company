import * as PIXI from 'pixi.js'
import { TweenMax, TimelineLite } from 'gsap/TweenMax'
import pixi_app from '../base/pixi/app'
import { getWindowSize, backgroundSize, debounce } from '../base/utils/helpers'

import Kaleidoscope from '../vibes/kscope.js'
import PhotoJam from '../vibes/photojam.js'
import VidVibe from '../vibes/vidvibe.js'
import appState from '../base/state.js'
import config from '../config.js'

export default class NewJersey extends PIXI.Container {
  constructor() {
    super()
    this.timeline = null
  }
  load() {
    pixi_app.loader
      .add('nj_1', config.asset_url + '/062821/alpha/New Jersey/Lectroid.jpg')
      .add('nj_2', config.asset_url + '/062821/alpha/New Jersey/New Jersey.jpg')
      .add('nj_3', config.asset_url + '/062821/alpha/New Jersey/banzai6.jpg')
      .add('nj_vid', config.asset_url + '/062821/vids/New Jersey for B.mp4')
      .load((loader, resources) => {
        this.run()
      })
  }
  run() {
    const debug = true
    const duration = appState.currentTrackSource

    const pj_container = new PIXI.Container()
    this.addChild(pj_container)

    //  const pj = new PhotoJam(pixi_app.loader.resources.nj_2.texture, {
    //     blendMode: 3,
    //     moveData: [11, 12, 13, 14],
    //     amplify: [1, 1.5],
    //     moveSpeed: 10,
    //   })

    const pj = new PhotoJam(pixi_app.loader.resources.nj_1.texture, {
      blendMode: 3,
      moveData: [110, 120, 130, 140],
      amplify: [1, 1.5],
      moveSpeed: 10,
    })

    pj.transitionIn()
    pj_container.addChild(pj)
    pj.alpha = 1

    const ks_container = new PIXI.Container()
    this.addChild(ks_container)

    const kscope = new Kaleidoscope(pixi_app.loader.resources.nj_1.texture, {
      blendMode: 2,
      moveData: [30, 26],
    })

    kscope.draw()
    ks_container.addChild(kscope)
    ks_container.alpha = 0

    const vv = new VidVibe(pixi_app.loader.resources.nj_vid.url)
    vv.transitionIn()
    this.addChild(vv)
    vv.blendMode = 2
    vv.alpha = 0

    // pj2
    const pj2_container = new PIXI.Container()
    this.addChild(pj2_container)
    const pj2 = new PhotoJam(pixi_app.loader.resources.nj_2.texture, {
      blendMode: 3,
      moveData: [11, 12, 13, 14],
      amplify: [0.5, 1],
      moveSpeed: 10,
    })
    pj2.transitionIn()
    pj2_container.addChild(pj2)
    pj2.alpha = 0

    pixi_app.ticker.add(() => {})

    this.timeline = new TimelineLite()
    this.timeline.to(ks_container, 30, { alpha: 0.3, delay: 10 })
    this.timeline.to(pj, 30, { alpha: 0 }, '-=25')
    this.timeline.to(vv, 30, { alpha: 1 }, '-=20')

    this.timeline.to(vv, 10, { alpha: 0 }, '95')
    this.timeline.to(ks_container, 10, { alpha: 0 }, '95')
    this.timeline.to(pj2, 10, { alpha: 1 }, '95')

    this.timeline.add(() => {
      pj.setAmplify([0.5, 3])
    })

    this.timeline.add(() => {
      pj.setAmplify([0.1, 0.4])
    })

    if (process.env.DEBUG == 'true') {
      // this.timeline.timeScale(10)
    }

    pixi_app.ticker.add(() => {})

    window.addEventListener(
      'resize',
      debounce(function (e) {}, 500)
    )
  }
}
