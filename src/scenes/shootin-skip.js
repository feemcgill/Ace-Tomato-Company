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
    this.photos = []
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
    const vv = new VidVibe(pixi_app.loader.resources.ss_vid.url)

    vv.transitionIn()
    vv.alpha = 1

    const pj = new PhotoJam(pixi_app.loader.resources.ss_1.texture, {
      blendMode: 0,
      moveData: [18, 20, 22, 24, 26, 28],
      amplify: [1, 1.5],
      moveSpeed: 0.5,
      size: 'cover',
      rotation_const: 0.00005,
      mousemove_factor: 200,
      mousemove_time: 15,
      mousemove_delay: 2,
    })

    const pj_2 = new PhotoJam(pixi_app.loader.resources.ss_2.texture, {
      blendMode: 3,
      moveData: [18, 20, 22, 24, 26, 28],
      amplify: [1, 1],
      moveSpeed: 0.5,
      size: 'cover',
      rotation_const: 0,
    })

    const pj_4 = new PhotoJam(pixi_app.loader.resources.ss_4.texture, {
      blendMode: 3,
      moveData: [18, 20, 22, 24, 26, 28],
      amplify: [1, 1],
      moveSpeed: 0.5,
      size: 'cover',
      rotation_const: 0,
    })

    this.addChild(vv)
    this.addChild(pj)
    this.addChild(pj_2)
    this.addChild(pj_4)
    this.photos.push(pj, pj_2, pj_4)

    pj.transitionIn()
    pj.mask = vv
    pj_2.currentScaleFactor = 0
    pj_4.currentScaleFactor = 0

    pixi_app.ticker.add(() => {})

    this.timeline = new TimelineLite()

    this.timeline.add(() => {
      pj_2.transitionIn()
      pj_2.scaleTo(1, 20, 5, () => {
        pj_4.transitionIn()
        pj_4.scaleTo(1, 20, 5, () => {})
      })
    }, '30')

    this.timeline.add(() => {
      for (let i = 0; i < this.photos.length; i++) {
        const pic = this.photos[i]
        pic.state.canRotatePointer = true
        pic.settings.rotation_const = 0.00005
        pic.settings.mousemove_factor = 200
        pic.settings.amplify = [1, 1.5]
        TweenMax.to(pic.settings, 30, { mousemove_factor: 0 })
      }
      pj.settings.blendMode = 0
    }, '120')

    this.timeline.add(() => {
      pj.mask = null
      pj_4.scaleTo(0, 1, 0.5, () => {})
    }, '160')

    this.timeline.add(() => {
      pj_2.scaleTo(0, 1, 0.5, () => {})
    }, '161')

    this.timeline.add(() => {
      pj.scaleTo(0, 1, 0.5, () => {})
    }, '161.5')

    //this.timeline.timeScale(4)

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
