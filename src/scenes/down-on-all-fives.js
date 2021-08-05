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
    var top_left = new PIXI.Sprite(PIXI.Texture.WHITE)
    top_left.tint = 0xff0000 //Change with the color wanted
    top_left.width = pixi_app.renderer.width / 2
    top_left.height = pixi_app.renderer.height / 2
    top_left.x = 0
    top_left.y = 0
    this.addChild(top_left)

    var top_right = new PIXI.Sprite(PIXI.Texture.WHITE)
    top_right.tint = 0xfff000 //Change with the color wanted
    top_right.width = pixi_app.renderer.width / 2
    top_right.height = pixi_app.renderer.height / 2
    top_right.x = pixi_app.renderer.width / 2
    top_right.y = 0
    this.addChild(top_right)

    var bottom_right = new PIXI.Sprite(PIXI.Texture.WHITE)
    bottom_right.tint = 0x0fff00 //Change with the color wanted
    bottom_right.width = pixi_app.renderer.width / 2
    bottom_right.height = pixi_app.renderer.height / 2
    bottom_right.x = pixi_app.renderer.width / 2
    bottom_right.y = pixi_app.renderer.height / 2
    this.addChild(bottom_right)

    var bottom_left = new PIXI.Sprite(PIXI.Texture.WHITE)
    bottom_left.tint = 0x00fff0 //Change with the color wanted
    bottom_left.width = pixi_app.renderer.width / 2
    bottom_left.height = pixi_app.renderer.height / 2
    bottom_left.x = 0
    bottom_left.y = pixi_app.renderer.height / 2
    this.addChild(bottom_left)

    const pj_defaults = {
      blendMode: 3,
      moveData: [1, 5, 10, 14],
      amplify: [1, 2.1],
      size: 'cover',
      mousemove_factor: 50,
      mousemove_time: 0.2,
      mousemove_delay: 0.03,
      rotation_const: 0.0005,
    }

    const pj_1 = new PhotoJam(pixi_app.loader.resources.d5_1.texture, { ...pj_defaults, ...{ container: top_left } })
    this.addChild(pj_1)
    pj_1.transitionIn()
    //pj_1.mask = top_left

    const pj_2 = new PhotoJam(pixi_app.loader.resources.d5_2.texture, { ...pj_defaults, ...{ container: top_right } })
    this.addChild(pj_2)
    pj_2.transitionIn()
    //pj_2.mask = top_right

    const pj_3 = new PhotoJam(pixi_app.loader.resources.d5_3.texture, { ...pj_defaults, ...{ container: bottom_right } })
    this.addChild(pj_3)
    pj_3.transitionIn()
    //pj_3.mask = bottom_right

    const pj_4 = new PhotoJam(pixi_app.loader.resources.d5_4.texture, { ...pj_defaults, ...{ container: bottom_left } })
    this.addChild(pj_4)
    pj_4.transitionIn()
    //pj_4.mask = bottom_left

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
        top_left.x = 50
        top_left.y = 50
      }, 50)
    )
  }
}
