import * as PIXI from 'pixi.js'
import { TweenMax, TimelineLite } from 'gsap/TweenMax'
import pixi_app from '../base/pixi/app'
import { getWindowSize, backgroundSize, debounce } from '../base/utils/helpers'

import Kaleidoscope from '../vibes/kscope.js'
import PhotoJam from '../vibes/photojam.js'
import VidVibe from '../vibes/vidvibe.js'
import appState from '../base/state.js'
import config from '../config.js'

export default class Tacit extends PIXI.Container {
  constructor() {
    super()
    this.timeline = null
  }
  load() {
    pixi_app.loader
      .add('PIC_1', config.asset_url + '/062821/alpha/Tacit/000301480010.jpg')
      .add('PIC_2', config.asset_url + '/062821/alpha/Tacit/000421580031.jpg')
      .add('PIC_3', config.asset_url + '/062821/alpha/Tacit/000421580032.jpg')
      .add('VIDEO', config.asset_url + '/062821/vids/Tacit%204%20B.mp4')
      .load((loader, resources) => {
        this.run()
      })
  }
  run() {


    // Pic 1
    const pic_1_container = new PIXI.Container()
    this.addChild(pic_1_container)

    const pic_1 = new PhotoJam(pixi_app.loader.resources.PIC_1.texture, {
      blendMode: 0,
      moveData: [11, 12, 13, 14],
      amplify: [1, 1.5],
      moveSpeed: 10,
      size: 'cover',
    })
    pic_1.transitionIn()
    pic_1_container.addChild(pic_1)
    pic_1_container.alpha = 0

    // Pic 2
    const pic_2_container = new PIXI.Container()
    this.addChild(pic_2_container)

    const pic_2 = new PhotoJam(pixi_app.loader.resources.PIC_2.texture, {
      blendMode: 0,
      moveData: [11, 12, 13, 14],
      amplify: [1, 1.5],
      moveSpeed: 10,
      size: 'cover',
    })
    pic_2.transitionIn()
    pic_2_container.addChild(pic_2)
    pic_2_container.alpha = 0

    // Pic 3
    const pic_3_container = new PIXI.Container()
    this.addChild(pic_3_container)

    const pic_3 = new PhotoJam(pixi_app.loader.resources.PIC_3.texture, {
      blendMode: 0,
      moveData: [11, 12, 13, 14],
      amplify: [1, 1.5],
      moveSpeed: 10,
      size: 'cover',
    })
    pic_3.transitionIn()
    pic_3_container.addChild(pic_3)
    pic_3_container.alpha = 0

    // Kaleidascope 1
    const ks_1_container = new PIXI.Container()
    this.addChild(ks_1_container)

    const kscope_1 = new Kaleidoscope(pixi_app.loader.resources.PIC_1.texture, {
      blendMode: 3,
      moveData: [40, 132],
    })
    kscope_1.draw()
    ks_1_container.addChild(kscope_1)
    ks_1_container.alpha = 0

    // Kaleidascope 2
    const ks_2_container = new PIXI.Container()
    this.addChild(ks_2_container)

    const kscope_2 = new Kaleidoscope(pixi_app.loader.resources.PIC_2.texture, {
      blendMode: 3,
      moveData: [40, 132],
    })
    kscope_2.draw()
    ks_2_container.addChild(kscope_2)
    ks_2_container.alpha = 0

    // Kaleidascope 3
    const ks_3_container = new PIXI.Container()
    this.addChild(ks_3_container)

    const kscope_3 = new Kaleidoscope(pixi_app.loader.resources.PIC_3.texture, {
      blendMode: 3,
      moveData: [40, 132],
    })
    kscope_3.draw()
    ks_3_container.addChild(kscope_3)
    ks_3_container.alpha = 0

    // The Video
    const the_video = new VidVibe(pixi_app.loader.resources.VIDEO.url)
    the_video.transitionIn()
    this.addChild(the_video)
    the_video.blendMode = 3
    the_video.alpha = 1






    

    pixi_app.ticker.add(() => {})


    this.timeline = new TimelineLite({onComplete:() => {
      this.timeline.restart()
    }})

    // Pic 1 IN
    this.timeline.fromTo(pic_1_container, 10, { rotation: -2, alpha: 0}, { rotation: 0, alpha: 1, ease: Power1.easeInOut })
    this.timeline.fromTo(ks_1_container, 10, { alpha: 0 }, { alpha: 1 }, '0')
    
    // Pic 1 OUT
    this.timeline.to(pic_1_container, 10, { rotation: 2, alpha: 0, ease: Power1.easeInOut }, '20')
    this.timeline.to(ks_1_container, 5, { alpha: 0 }, '20')

    // Pic 2 IN
    this.timeline.fromTo(pic_2_container, 10, { rotation: -2, alpha: 0}, { rotation: 0, alpha: 1, ease: Power1.easeInOut }, '20')
    this.timeline.fromTo(ks_2_container, 10, { alpha: 0 }, { alpha: 1 }, '20')

    // Pic 2 OUT
    this.timeline.to(pic_2_container, 10, { rotation: 2, alpha: 0, ease: Power1.easeIn }, '40')
    this.timeline.to(ks_2_container, 5, { alpha: 0 }, '40')

    // Pic 3 IN
    this.timeline.fromTo(pic_3_container, 10, { rotation: -2, alpha: 0}, { rotation: 0, alpha: 1, ease: Power1.easeInOut }, '40')
    this.timeline.fromTo(ks_3_container, 10, { alpha: 0 }, { alpha: 1 }, '40')

    // Pic 3 OUT
    this.timeline.to(pic_3_container, 10, { rotation: 2, alpha: 0, ease: Power1.easeIn }, '70')
    this.timeline.to(ks_3_container, 5, { alpha: 0 }, '70')




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
