import * as PIXI from 'pixi.js'
import { TweenMax, TimelineLite } from 'gsap/TweenMax'
import pixi_app from '../base/pixi/app'
import { getWindowSize, backgroundSize, debounce } from '../base/utils/helpers'

import Kaleidoscope from '../vibes/kscope.js'
import PhotoJam from '../vibes/photojam.js'
import VidVibe from '../vibes/vidvibe.js'
import appState from '../base/state.js'
import config from '../config.js'

export default class DownOnAllFives extends PIXI.Container {
  constructor() {
    super()
    this.timeline = null
  }
  load() {
    pixi_app.loader
      .add('d5_1', config.asset_url + '/062821/alpha/Down on All Fives/000304090003.jpg')
      .add('d5_2', config.asset_url + '/062821/alpha/Down on All Fives/000304090004.jpg')
      .add('d5_3', config.asset_url + '/062821/alpha/Down on All Fives/17190002.jpg')
      .add('d5_4', config.asset_url + '/062821/alpha/Down on All Fives/17190005.jpg')
      .add('d5_vid', config.asset_url + '/062821/vids/down on all for B.mp4')
      .load((loader, resources) => {
        this.run()
      })
  }
  run() {
    const debug = false
    const duration = appState.currentTrackSource

    const ks_container = new PIXI.Container()
    const kscope = new Kaleidoscope(pixi_app.loader.resources.d5_3.texture, {
      blendMode: 2,
      moveData: [30, 26],
    })
    kscope.draw()
    ks_container.addChild(kscope)
    ks_container.alpha = 1

    //this.addChild(ks_container)

    const vv = new VidVibe(pixi_app.loader.resources.d5_vid.url)
    vv.transitionIn()
    vv.blendMode = 3
    vv.alpha = 1

    //this.addChild(vv)

    var xprite = new PIXI.Sprite(PIXI.Texture.WHITE)
    xprite.tint = 0xff0000 //Change with the color wanted
    xprite.width = 500
    xprite.height = 500
    xprite.x = 100
    xprite.y = 100
    this.addChild(xprite)

    const pj_container = new PIXI.Container()
    this.addChild(pj_container)

    const pj_2 = new PhotoJam(pixi_app.loader.resources.d5_3.texture, {
      blendMode: 3,
      moveData: [11, 12, 13, 14],
      amplify: [1, 1.1],
      size: 'contain',
      container: xprite,
      mousemove_factor: 500,
      mousemove_time: 1.2,
      mousemove_delay: 0.3,
      rotation_const: 0.0005,
    })

    pj_container.addChild(pj_2)
    pj_2.transitionIn()
    pj_2.scale.set(0.5)
    pj_2.scaleTo(0.0, 0.1)
    setTimeout(() => {
      pj_2.scaleTo(1, 10)
    }, 2000)

    setTimeout(() => {
      pj_2.rotateTo(5, 2, 1, () => {
        pj_2.state.canRotatePointer = true
        pj_2.settings.rotation_const = 0.02
      })
    }, 4000)

    setTimeout(() => {
      pj_2.scaleTo(5, 2)
    }, 16000)

    pj_2.mask = xprite

    pixi_app.ticker.add(() => {})

    this.timeline = new TimelineLite()

    if (process.env.DEBUG) {
      console.log('we debuggin')
      this.timeline.timeScale(10)
    }

    pixi_app.ticker.add(() => {})

    window.addEventListener(
      'resize',
      debounce(function (e) {
        xprite.x = 50
        xprite.y = 50
      }, 50)
    )
  }
}
