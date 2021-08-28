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
      mousemove_factor: 160,
      mousemove_time: 2,
      mousemove_delay: -0.2,
    })

    pj.state.canRotatePointer = false

    const pj_2 = new PhotoJam(pixi_app.loader.resources.ss_2.texture, {
      blendMode: 3,
      moveData: [18, 20, 22, 24, 26, 28],
      amplify: [1, 1.5],
      moveSpeed: 0.5,
      size: 'cover',
      rotation_const: 0,
      mousemove_factor: 60,
      mousemove_time: 0.7,
      mousemove_delay: 0.2,
    })
    pj_2.state.canRotatePointer = false

    const pj_3 = new PhotoJam(pixi_app.loader.resources.ss_3.texture, {
      blendMode: 3,
      moveData: [18, 20, 22, 24, 26, 28],
      amplify: [1, 1.5],
      moveSpeed: 0.5,
      size: 'cover',
      rotation_const: 0,
      mousemove_factor: 60,
      mousemove_time: 0.7,
      mousemove_delay: 0.2,
    })
    pj_3.state.canRotatePointer = false

    const pj_4 = new PhotoJam(pixi_app.loader.resources.ss_4.texture, {
      blendMode: 3,
      moveData: [18, 20, 22, 24, 26, 28],
      amplify: [1, 1.5],
      moveSpeed: 0.5,
      size: 'cover',
      rotation_const: 0,
      mousemove_factor: 60,
      mousemove_time: 2.7,
      mousemove_delay: -0.7,
    })
    pj_4.state.canRotatePointer = false

    this.addChild(vv)
    this.addChild(pj)
    this.addChild(pj_2)
    this.addChild(pj_4)
    this.addChild(pj_3)
    this.photos.push(pj, pj_2, pj_3, pj_4)

    pj.transitionIn()
    pj.mask = vv
    pj_2.currentScaleFactor = 0
    pj_3.currentScaleFactor = 0
    pj_4.currentScaleFactor = 0

    pixi_app.ticker.add(() => {})

    this.timeline = new TimelineLite()

    this.timeline.add(() => {
      pj_2.transitionIn()
      pj_2.scaleTo(1, 20, 5, () => {
        pj_4.transitionIn()
        pj_4.scaleTo(1, 20, 5, () => {})
      })
    }, '20')

    this.timeline.add(() => {
      pj_3.transitionIn()
      pj_3.scaleTo(1, 20, 5, () => {})
    }, '120')

    this.timeline.add(() => {
      for (let i = 0; i < this.photos.length; i++) {
        const pic = this.photos[i]
        pic.state.canRotatePointer = true
        pic.settings.rotation_const = 0.00005
        //pic.settings.mousemove_factor = 200
        pic.settings.amplify = [1, 1.5]
        //TweenMax.to(pic.settings, 30, { mousemove_factor: 0 })
      }
      pj.settings.blendMode = 0
    }, '120')

    this.timeline.add(() => {
      pj.mask = null
      pj_4.scaleTo(0, 0.5, 0.2, () => {})
    }, '160')

    this.timeline.add(() => {
      pj_2.scaleTo(0, 0.5, 0.2, () => {})
    }, '161')

    this.timeline.add(() => {
      pj.scaleTo(0, 0.5, 0.2, () => {})
    }, '161.5')

    this.timeline.add(() => {
      pj_3.scaleTo(0, 0.5, 0.2, () => {})
    }, '162')

    //this.timeline.timeScale(4)

    if (process.env.DEBUG == 'true') {
      //this.timeline.timeScale(10)
    }

    pixi_app.ticker.add(() => {})

    window.addEventListener(
      'resize',
      debounce(function (e) {}, 1000)
    )
  }
}
