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
      .add(
        'd5_1',
        config.asset_url + '/062821/alpha/Down on All Fives/000304090003.jpg'
      )
      .add(
        'd5_2',
        config.asset_url + '/062821/alpha/Down on All Fives/000304090004.jpg'
      )
      .add(
        'd5_3',
        config.asset_url + '/062821/alpha/Down on All Fives/17190002.jpg'
      )
      .add(
        'd5_4',
        config.asset_url + '/062821/alpha/Down on All Fives/17190005.jpg'
      )
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
      amplify: [1, 1],
      size: 'cover',
      container: xprite,
    })

    pj_container.addChild(pj_2)
    pj_2.transitionIn()

    // pj_2.scale.x = 0.5
    // pj_2.scale.y = 0.5
    // pj_2.anchor.x = 0.5
    // pj_2.anchor.y = 0.5
    // pj_2.x = pixi_app.renderer.width / 2
    // pj_2.y = pixi_app.renderer.height / 2

    // const pj_3 = new PhotoJam(
    //   pixi_app.loader.resources.d5_1.texture,
    //   3,
    //   null,
    //   [11, 12, 13, 14],
    //   [1, 2.5],
    //   3
    // )
    // pj_container.addChild(pj_3)
    // pj_3.transitionIn()
    // pj_3.scale.x = 0.5
    // pj_3.scale.y = 0.5
    // pj_3.anchor.x = 0.5
    // pj_3.anchor.y = 0.5
    // pj_3.x = 0
    // pj_3.y = pixi_app.renderer.height / 2

    // const pj_4 = new PhotoJam(
    //   pixi_app.loader.resources.d5_3.texture,
    //   3,
    //   null,
    //   [11, 12, 13, 14],
    //   [1, 1.5],
    //   10
    // )
    // pj_container.addChild(pj_4)
    // pj_4.transitionIn()
    // pj_4.scale.x = 0.5
    // pj_4.scale.y = 0.5
    // pj_4.anchor.x = 0.5
    // pj_4.anchor.y = 0.5
    // pj_4.x = 0
    // pj_4.y = pixi_app.renderer.height / 4.5

    pixi_app.ticker.add(() => {})

    this.timeline = new TimelineLite()

    // this.timeline.to(pj_4, 60, { alpha: 1 })
    // this.timeline.add(() => {
    //   pj_4.scaleTo(0.1, 1, () => {
    //     pj_4.setAmplify([0.1, 0.5])
    //   })
    //   pj_2.rotateTo(0)
    // })

    // this.timeline.to(vv, 30, { alpha: 0, delay: 0 })
    // this.timeline.add(() => {
    //   pj.setAmplify([0.5, 3])
    // })
    // this.timeline.to(ks_container, 10, { alpha: 0.05, delay: 50 })
    // this.timeline.add(() => {
    //   pj.setAmplify([0.1, 0.4])
    // })
    // this.timeline.to(ks_container, 10, { alpha: 0, delay: 0 })

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
