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

    this.addChild(top_left)
    this.containers.push(top_left)

    var top_right = new PIXI.Sprite(PIXI.Texture.WHITE)

    this.addChild(top_right)
    this.containers.push(top_right)

    var bottom_right = new PIXI.Sprite(PIXI.Texture.WHITE)

    this.addChild(bottom_right)
    this.containers.push(bottom_right)

    var bottom_left = new PIXI.Sprite(PIXI.Texture.WHITE)

    this.addChild(bottom_left)
    this.containers.push(bottom_left)

    this.sizeandScale()

    const vv = new VidVibe(pixi_app.loader.resources.d5_vid.url)
    vv.alpha = 0
    this.addChild(vv)

    const pj_defaults = {
      blendMode: 3,
      moveData: [3, 4, 6, 6],
      amplify: [1, 1.5],
      size: 'cover',
      mousemove_factor: 0,
      mousemove_time: 2.2,
      mousemove_delay: 0.3,
      //rotation_const: 0,
    }

    const pj_1 = new PhotoJam(pixi_app.loader.resources.d5_1.texture, {
      ...pj_defaults,
      ...{ rotation_const: 0.004, container: top_left, moveData: [143, 144, 60, 68] },
    })
    this.addChild(pj_1)
    this.photos.push(pj_1)
    //pj_1.initial_rotate = 2

    const pj_2 = new PhotoJam(pixi_app.loader.resources.d5_3.texture, {
      ...pj_defaults,
      ...{ rotation_const: 0.002, container: top_right, moveData: [60, 69, 143, 144] },
    })
    this.addChild(pj_2)
    this.photos.push(pj_2)
    //pj_2.initial_rotate = 4

    const pj_3 = new PhotoJam(pixi_app.loader.resources.d5_2.texture, {
      ...pj_defaults,
      ...{ rotation_const: 0.003, container: bottom_right, moveData: [60, 69, 143, 144] },
    })
    this.addChild(pj_3)
    this.photos.push(pj_3)
    //pj_3.initial_rotate = 5

    const pj_4 = new PhotoJam(pixi_app.loader.resources.d5_4.texture, {
      ...pj_defaults,
      ...{ rotation_const: 0.004, container: bottom_left, moveData: [144, 143, 238, 191] },
    })
    this.addChild(pj_4)
    this.photos.push(pj_4)
    //pj_4.initial_rotate = 1

    for (let i = 0; i < this.photos.length; i++) {
      const pic = this.photos[i]
      pic.state.canRotatePointer = false
      pic.transitionIn()
      pic.alpha = 0
    }

    const vv2 = new VidVibe(pixi_app.loader.resources.d5_vid.url)
    this.addChild(vv2)
    vv2.scale_factor = 3
    vv2.blendMode = 3
    vv2.alpha = 0
    vv2.offset.y = 2.5

    const vv3 = new VidVibe(pixi_app.loader.resources.d5_vid.url)
    this.addChild(vv3)
    vv3.scale_factor = 3
    vv3.blendMode = 3
    vv3.alpha = 0
    vv3.offset.y = 2.5
    vv3.transitionIn()

    pixi_app.ticker.add(() => {})

    this.timeline = new TimelineLite()

    this.timeline.add(() => {
      pj_1.scaleTo(1.5, 0.1)
      pj_3.scaleTo(1.5, 0.3)
      pj_2.scaleTo(1.5, 0.2)
      pj_4.scaleTo(1.5, 0.05)
    }, '0')

    this.timeline.add(() => {
      for (let i = 0; i < this.photos.length; i++) {
        const pic = this.photos[i]
        pic.initial_rotate = 0.001
        TweenMax.to(pic, 5, { alpha: 1 })
      }
    }, '1')

    this.timeline.add(() => {
      vv3.scale.x = vv3.scale.x * -1
      vv2.transitionIn()
      TweenMax.to(vv2, 30, { alpha: 0.7 })
      TweenMax.to(vv3, 26, { alpha: 0.5 })
    }, '100')

    this.timeline.add(() => {
      for (let i = 0; i < this.photos.length; i++) {
        const pic = this.photos[i]
        pic.settings.mousemove_factor = 20
      }
      vv.transitionIn()
      TweenMax.to(vv, 15, { alpha: 1 })
    }, '150')

    this.timeline.add(() => {
      vv2.transitionIn()
      TweenMax.to(vv2, 40, { alpha: 0 })
      TweenMax.to(vv3, 36, { alpha: 0 })
    }, '200')

    this.timeline.add(() => {
      pj_1.scaleTo(0.2, 30) // 30
      pj_2.scaleTo(0.19, 30) // 30
      pj_3.scaleTo(0.14, 30) // 30
      pj_4.scaleTo(0.23, 30) // 30

      setTimeout(() => {
        for (let i = 0; i < this.photos.length; i++) {
          const pic = this.photos[i]
          pic.state.canRotatePointer = true
          pic.settings.mousemove_factor = 100
        }
      }, 1500) // 1500
    }, '220') // 220

    this.timeline.add(() => {
      for (let i = 0; i < this.photos.length; i++) {
        const pic = this.photos[i]
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

    //this.timeline.timeScale(10)

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
