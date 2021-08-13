import * as PIXI from 'pixi.js'
import { TweenMax, TimelineLite } from 'gsap/TweenMax'
import pixi_app from '../base/pixi/app'
import { getWindowSize, backgroundSize, debounce } from '../base/utils/helpers'

import Kaleidoscope from '../vibes/kscope.js'
import PhotoJam from '../vibes/photojam.js'
import VidVibe from '../vibes/vidvibe.js'
import appState from '../base/state.js'
import config from '../config.js'

export default class SleepyHead extends PIXI.Container {
  constructor() {
    super()
    this.timeline = null
  }
  load() {
    /*
    062821/alpha/Sleepy Head/000046670016.jpg cait
    062821/alpha/Sleepy Head/000046670017.jpg cait vert
    062821/alpha/Sleepy Head/000245900026.jpg motel
    062821/alpha/Sleepy Head/000245900029.jpg motel
    062821/alpha/Sleepy Head/000245900030.jpg double MOTEL
    062821/alpha/Sleepy Head/Desert Guest House.jpg     
    2:45
     */
    pixi_app.loader
      .add('sh_1', config.asset_url + '/062821/alpha/Sleepy Head/000046670016.jpg')
      .add('sh_2', config.asset_url + '/062821/alpha/Sleepy Head/000245900030.jpg')
      .add('sh_3', config.asset_url + '/062821/alpha/Sleepy Head/000046670017.jpg')
      .add('sh_vid', config.asset_url + '/062821/vids/Sleepy 4 B.mp4')
      .load((loader, resources) => {
        this.run()
      })
  }
  run() {
    const pj = new PhotoJam(pixi_app.loader.resources.sh_2.texture, {
      blendMode: 3,
      moveData: [18, 20, 22, 24, 26, 28],
      amplify: [1, 1.2],
      moveSpeed: 0.5,
      size: 'cover',
    })

    const vv = new VidVibe(pixi_app.loader.resources.sh_vid.url)

    const kscope = new Kaleidoscope(pixi_app.loader.resources.sh_1.texture, {
      blendMode: 0,
      moveData: [40, 132],
    })

    const kscope_2 = new Kaleidoscope(pixi_app.loader.resources.sh_3.texture, {
      blendMode: 0,
      moveData: [60, 10],
    })

    kscope_2.slices = 20

    var half_L = new PIXI.Sprite(PIXI.Texture.WHITE)
    half_L.width = pixi_app.renderer.width / 2
    half_L.height = pixi_app.renderer.height / 2
    half_L.x = pixi_app.renderer.width / 2
    half_L.y = pixi_app.renderer.height / 2
    half_L.anchor.set(0.5)

    this.addChild(kscope_2)
    kscope_2.draw()

    this.addChild(kscope)
    kscope.draw()

    this.addChild(pj)
    pj.alpha = 0.3
    pj.transitionIn()

    //this.addChild(half_L)

    //kscope_2.mask = half_L

    vv.transitionIn()
    this.addChild(vv)
    vv.blendMode = 0

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
