import * as PIXI from 'pixi.js'
import { TweenMax, TimelineLite } from 'gsap/TweenMax'
import pixi_app from '../base/pixi/app'
import { getWindowSize, backgroundSize, debounce } from '../base/utils/helpers'

import Kaleidoscope from '../vibes/kscope.js'
import PhotoJam from '../vibes/photojam.js'
import VidVibe from '../vibes/vidvibe.js'
import appState from '../base/state.js'
import config from '../config.js'

// 6:25
export default class DownOnAllFives extends PIXI.Container {
  constructor() {
    super()
    this.timeline = null
    this.containers = []
    this.photos = []
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
    // top_left.tint = 0xff0000 //Change with the color wanted

    this.addChild(top_left)
    this.containers.push(top_left)

    var top_right = new PIXI.Sprite(PIXI.Texture.WHITE)
    // top_right.tint = 0xfff000 //Change with the color wanted

    this.addChild(top_right)
    this.containers.push(top_right)

    var bottom_right = new PIXI.Sprite(PIXI.Texture.WHITE)
    // bottom_right.tint = 0x0fff00 //Change with the color wanted

    this.addChild(bottom_right)
    this.containers.push(bottom_right)

    var bottom_left = new PIXI.Sprite(PIXI.Texture.WHITE)

    this.addChild(bottom_left)
    this.containers.push(bottom_left)

    this.sizeandScale()

    const vv = new VidVibe(pixi_app.loader.resources.d5_vid.url)
    vv.alpha = 0
    this.addChild(vv)
    //vv.blendMode = 1

    const pj_defaults = {
      blendMode: 3,
      moveData: [1, 5, 10, 14],
      amplify: [1, 1.2],
      size: 'cover',
      mousemove_factor: 0,
      mousemove_time: 2.2,
      mousemove_delay: 0.3,
      //rotation_const: 0,
    }

    const pj_1 = new PhotoJam(pixi_app.loader.resources.d5_1.texture, { ...pj_defaults, ...{ rotation_const: 0.004, container: top_left } })
    this.addChild(pj_1)
    this.photos.push(pj_1)
    // pj_1.currentScaleFactor = 2
    pj_1.initial_rotate = 0.001
    pj_1.state.canRotatePointer = false
    pj_1.transitionIn()

    const pj_2 = new PhotoJam(pixi_app.loader.resources.d5_3.texture, { ...pj_defaults, ...{ rotation_const: 0.002, container: top_right } })
    this.addChild(pj_2)
    this.photos.push(pj_2)
    // pj_2.currentScaleFactor = 2
    pj_2.initial_rotate = 0.001

    pj_2.state.canRotatePointer = false
    pj_2.transitionIn()

    const pj_3 = new PhotoJam(pixi_app.loader.resources.d5_2.texture, { ...pj_defaults, ...{ rotation_const: 0.003, container: bottom_right } })
    this.addChild(pj_3)
    this.photos.push(pj_3)
    // pj_3.currentScaleFactor = 2
    pj_3.initial_rotate = 0.001

    pj_3.state.canRotatePointer = false
    pj_3.transitionIn()

    const pj_4 = new PhotoJam(pixi_app.loader.resources.d5_4.texture, { ...pj_defaults, ...{ rotation_const: 0.004, container: bottom_left } })
    this.addChild(pj_4)
    this.photos.push(pj_4)
    // pj_4.currentScaleFactor = 2
    pj_4.initial_rotate = 0.001

    pj_4.state.canRotatePointer = false
    pj_4.transitionIn()

    pixi_app.ticker.add(() => {})

    this.timeline = new TimelineLite()

    this.timeline.add(() => {
      pj_1.state.canRotatePointer = true
      pj_3.state.canRotatePointer = true
      pj_2.state.canRotatePointer = true
      pj_4.state.canRotatePointer = true
      pj_1.scaleTo(1.5, 0.1)
      pj_3.scaleTo(1.5, 0.3)
      pj_2.scaleTo(1.5, 0.2)
      pj_4.scaleTo(1.5, 0.05)
    }, '0')

    this.timeline.add(() => {
      for (let i = 0; i < this.photos.length; i++) {
        const pic = this.photos[i]
        //pic.state.canRotatePointer = true
        pic.settings.mousemove_factor = 100
      }
    }, '60')

    this.timeline.add(() => {
      pj_1.scaleTo(1.7, 60)
      pj_2.scaleTo(1.7, 61)
      pj_3.scaleTo(1.7, 62)
      pj_4.scaleTo(1.7, 63)
    }, '120')

    this.timeline.add(() => {
      pj_1.rotateTo(0, 0)
      pj_2.rotateTo(0, 0)
      pj_3.rotateTo(0, 0)
      pj_4.rotateTo(0, 0, () => {
        for (let i = 0; i < this.photos.length; i++) {
          const pic = this.photos[i]
          pic.state.canRotatePointer = false
        }
      })
    }, '220') // 220

    this.timeline.add(() => {
      vv.transitionIn()
      TweenMax.to(vv, 6, { alpha: 1 })
      pj_1.scaleTo(0.2, 30) // 30
      pj_2.scaleTo(0.19, 30) // 30
      pj_3.scaleTo(0.14, 30) // 30
      pj_4.scaleTo(0.23, 30) // 30

      setTimeout(() => {
        for (let i = 0; i < this.photos.length; i++) {
          const pic = this.photos[i]
          pic.state.canRotatePointer = false
          pic.settings.mousemove_factor = 100
        }
      }, 1500) // 1500
    }, '220') // 220

    this.timeline.add(() => {
      for (let i = 0; i < this.photos.length; i++) {
        const pic = this.photos[i]
        pic.state.canRotatePointer = true
        pic.settings.mousemove_factor = 3000
      }
    }, '320') // 320

    this.timeline.add(() => {
      for (let i = 0; i < this.photos.length; i++) {
        const pic = this.photos[i]
        pic.settings.mousemove_factor = 200
      }
    }, '321') // 325

    this.timeline.add(() => {
      for (let i = 0; i < this.photos.length; i++) {
        const pic = this.photos[i]
        pic.settings.mousemove_factor = 100
      }
    }, '350') // 350

    this.timeline.timeScale(1)

    if (process.env.DEBUG == 'true') {
    }

    pixi_app.ticker.add(() => {})

    window.addEventListener(
      'resize',
      debounce((e) => {
        this.sizeandScale()
      }, 1000)
    )
  }
  sizeandScale() {
    for (let i = 0; i < this.containers.length; i++) {
      const container = this.containers[i]
      container.width = pixi_app.renderer.width / 2
      container.height = pixi_app.renderer.height / 2
    }
    this.containers[0].x = 0
    this.containers[0].y = 0
    this.containers[1].x = pixi_app.renderer.width / 2
    this.containers[1].y = 0
    this.containers[2].x = pixi_app.renderer.width / 2
    this.containers[2].y = pixi_app.renderer.height / 2
    this.containers[3].x = 0
    this.containers[3].y = pixi_app.renderer.height / 2
  }
}
