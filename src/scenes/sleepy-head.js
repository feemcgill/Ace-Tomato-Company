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
      .add('sh_2', config.asset_url + '/062821/alpha/Sleepy Head/000245900026.jpg')
      .add('sh_3', config.asset_url + '/062821/alpha/Sleepy Head/000046670017.jpg')
      .add('sh_vid', config.asset_url + '/062821/vids/Sleepy 4 B.mp4')
      .load((loader, resources) => {
        this.run()
      })
  }
  run() {
    const screen_size_graphix = new PIXI.Graphics()
    screen_size_graphix.beginFill(0xff0000)
    screen_size_graphix.lineStyle(0)
    screen_size_graphix.drawRect(0, 0, pixi_app.renderer.width, pixi_app.renderer.height)
    screen_size_graphix.endFill()
    const screen_size_tex = pixi_app.renderer.generateTexture(screen_size_graphix)

    var scope_2_mask = new PIXI.Sprite(screen_size_tex)
    scope_2_mask.x = pixi_app.renderer.width / 2
    scope_2_mask.y = pixi_app.renderer.height / 2
    scope_2_mask.anchor.set(0.5)
    scope_2_mask.scale.set(0)

    var pj_mask = new PIXI.Sprite(screen_size_tex)
    pj_mask.x = pixi_app.renderer.width / 2
    pj_mask.y = pixi_app.renderer.height / 2
    pj_mask.anchor.set(0.5)
    pj_mask.scale.set(0)

    var vid_mask = new PIXI.Sprite(screen_size_tex)
    vid_mask.x = pixi_app.renderer.width / 2
    vid_mask.y = pixi_app.renderer.height / 2
    vid_mask.anchor.set(0.5)
    vid_mask.scale.set(0)

    this.addChild(vid_mask)

    this.addChild(pj_mask)

    const pj = new PhotoJam(pixi_app.loader.resources.sh_2.texture, {
      blendMode: 3,
      moveData: [18, 20, 22, 24, 26, 28],
      amplify: [1, 1.2],
      moveSpeed: 5,
      size: 'cover',
      //container: pj_mask,
    })

    const vv = new VidVibe(pixi_app.loader.resources.sh_vid.url)

    console.log('vv', vv.scale.x, vv.scale.y)
    const kscope = new Kaleidoscope(pixi_app.loader.resources.sh_1.texture, {
      blendMode: 0,
      moveData: [40, 132],
      moveFactor: 10,
    })

    const kscope_2 = new Kaleidoscope(pixi_app.loader.resources.sh_3.texture, {
      blendMode: 0,
      moveData: [60, 10],
      moveFactor: 0,
    })

    kscope_2.slices = 20

    this.addChild(scope_2_mask)
    kscope_2.mask = scope_2_mask

    this.addChild(kscope)
    kscope.draw()

    this.addChild(kscope_2)
    kscope_2.draw()
    this.addChild(pj)

    pj.mask = pj_mask

    const filter = new PIXI.SpriteMaskFilter(vid_mask)

    this.addChild(vv)
    //vv.alpha = 0.2
    vv.filters = [filter]

    filter.blendMode = 3
    vv.transitionIn()

    //vv.mask = vid_mask

    pixi_app.ticker.add(() => {})
    this.timeline = new TimelineLite()
    this.timeline.to(scope_2_mask.scale, 60, { x: 1, y: 1 }, '5')
    this.timeline.to(kscope_2.settings, 60, { moveFactor: 10 }, '10')
    this.timeline.to(kscope.settings, 60, { moveFactor: 0.5 }, '20')

    this.timeline.to(vid_mask.scale, 60, { x: 1, y: 1 }, '30')

    this.timeline.add(() => {
      pj.transitionIn()
    }, '45')
    this.timeline.to(pj_mask.scale, 60, { x: 1, y: 1 }, '45')

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
