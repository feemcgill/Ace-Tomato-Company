import * as PIXI from 'pixi.js'
import { TweenMax, TimelineLite } from 'gsap/TweenMax'
import pixi_app from '../base/pixi/app'
import { getWindowSize, backgroundSize, debounce } from '../base/utils/helpers'
import Kaleidoscope from '../vibes/kscope.js'
import PhotoJam from '../vibes/photojam.js'
import VidVibe from '../vibes/vidvibe.js'
import appState from '../base/state.js'
import config from '../config.js'

export default class DawnPatrol extends PIXI.Container {
  constructor() {
    super()
  }
  load() {
    pixi_app.loader
      .add('dp_1', config.asset_url + '/062821/alpha/Dawn Patrol/000046690004.jpg')
      .add('dp_2', config.asset_url + '/062821/alpha/Dawn Patrol/000046690016.jpg')
      .add('dp_3', config.asset_url + '/062821/alpha/Dawn Patrol/000046690018.jpg')
      .add('dp_4', config.asset_url + '/062821/alpha/Dawn Patrol/000046690019.jpg')
      .add('vid', config.asset_url + '/dawn_patrol/dp-1.mp4')

      .load((loader, resources) => {
        this.run()
      })
  }
  run() {
    const pj_container = new PIXI.Container()
    this.addChild(pj_container)
    //(blendMode = 0), callback, moveData, amplify, moveSpeed
    const pj = new PhotoJam(pixi_app.loader.resources.dp_4.texture, {
      blendMode: 1,
      moveData: [18, 20, 22, 24, 26, 28],
      amplify: [1, 1.2],
      moveSpeed: 0.5,
      size: 'cover',
    })
    pj.transitionIn()

    pj_container.addChild(pj)

    // pj.scale.x = 0.5;
    // pj.scale.y = 0.5;

    const vv = new VidVibe(pixi_app.loader.resources.vid.url)
    vv.transitionIn()
    this.addChild(vv)
    vv.blendMode = 1
    vv.alpha = 0

    let brt = new PIXI.BaseRenderTexture(pixi_app.renderer.width, pixi_app.renderer.height, PIXI.SCALE_MODES.NEAREST, 1)
    let rt = new PIXI.RenderTexture(brt)
    let rsprite = new PIXI.Sprite(rt)
    rsprite.x = 30
    rsprite.y = 30
    //this.addChild(rsprite);

    vv.mask = rsprite

    let rsprite2 = new PIXI.Sprite(rt)
    rsprite2.alpha = 1
    rsprite2.x = 200
    rsprite2.y = 200
    rsprite2.x = 0
    rsprite2.y = pixi_app.renderer.height
    rsprite2.blendMode = 3
    rsprite2.scale.x = 1
    rsprite2.scale.y = -1
    rsprite2.alpha = 0

    this.addChild(rsprite2)

    const ks_container = new PIXI.Container()
    this.addChild(ks_container)

    const kscope = new Kaleidoscope(pixi_app.loader.resources.dp_2.texture, {
      blendMode: 1,
      moveData: [40, 132],
    })
    kscope.draw()
    ks_container.addChild(kscope)
    ks_container.alpha = 0

    pixi_app.ticker.add(() => {
      pixi_app.renderer.render(pj_container, rt)
    })

    this.timeline = new TimelineLite()

    this.timeline.add(() => {
      TweenMax.to(rsprite2, 20, { alpha: 1, ease: 'power4.in' })
    }, '10')

    this.timeline.add(() => {
      TweenMax.to(vv, 30, { alpha: 1, ease: 'power4.in' })
    }, '30')

    this.timeline.add(() => {
      TweenMax.to(rsprite2, 10, { alpha: 0, ease: 'power4.in' })
    }, '100')

    this.timeline.add(() => {
      pj.setAmplify([1, 1.3])
      pj.fadeToWhite(40)
      TweenMax.to(ks_container, 60, {
        alpha: 1,
        delay: 8,
        ease: 'power4.in',
      })
    }, '120')

    this.timeline.add(() => {
      pj.fadeToJam(10)
    }, '180')

    if (process.env.DEBUG == 'true') {
      this.timeline.timeScale(10)
    }

    pixi_app.ticker.add(() => {
      pixi_app.renderer.render(pj_container, rt)
    })

    window.addEventListener(
      'resize',
      debounce(function (e) {
        vv.mask = null
        brt.destroy()
        rt.destroy()
        rsprite.destroy()
        brt = new PIXI.BaseRenderTexture(pixi_app.renderer.width, pixi_app.renderer.height, PIXI.SCALE_MODES.LINEAR, 1)
        rt = new PIXI.RenderTexture(brt)
        rsprite = new PIXI.Sprite(rt)
        rsprite.x = 0
        rsprite.y = 0
        vv.mask = rsprite
      }, 1000)
    )
  }
  fadeToWhite(time) {
    TweenMax.to(whitewash, time, { alpha: 1 })
  }
  handleMove(e) {}

  handleClick(e) {}
  resize() {}
}
