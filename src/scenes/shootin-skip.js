import * as PIXI from 'pixi.js'
import { TweenMax, TimelineLite } from 'gsap/TweenMax'
import pixi_app from '../base/pixi/app'
import { getWindowSize, backgroundSize, debounce } from '../base/utils/helpers'

import Kaleidoscope from '../vibes/kscope.js'
import PhotoJam from '../vibes/photojam.js'
import VidVibe from '../vibes/vidvibe.js'
import appState from '../base/state.js'
import config from '../config.js'

export default class ShootinSkip extends PIXI.Container {
  constructor() {
    super()
    this.timeline = null
  }

  load() {
    pixi_app.loader
      .add('ss_1', config.asset_url + '/062821/alpha/Shootin Skip /000324000014.jpg')
      .add('ss_2', config.asset_url + '/062821/alpha/Shootin Skip /000324000017.jpg')
      .add('ss_3', config.asset_url + '/062821/alpha/Shootin Skip /000324000018.jpg')
      .add('ss_4', config.asset_url + '/062821/alpha/Shootin Skip /000324000024.jpg')
      .add('ss_vid', config.asset_url + '/062821/vids/Shootin Skip 4 B.mp4')
      .load((loader, resources) => {
        this.run()
      })
  }
  run() {
    pixi_app.ticker.add(() => {})

    this.timeline = new TimelineLite()

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
