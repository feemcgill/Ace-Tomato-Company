import * as PIXI from 'pixi.js'
import { TweenMax, TimelineLite, Elastic } from 'gsap/TweenMax'
import pixi_app from '../base/pixi/app'
import { getWindowSize, backgroundSize, debounce } from '../base/utils/helpers'

import Kaleidoscope from '../vibes/kscope.js'
import PhotoJam from '../vibes/photojam.js'
import VidVibe from '../vibes/vidvibe.js'
import appState from '../base/state.js'
import config from '../config.js'

export default class HitTheSheets extends PIXI.Container {
  constructor() {
    super()
    this.timeline = null
  }
  load() {
    pixi_app.loader
      .add('hts_1', config.asset_url + '/062821/alpha/Hit the Sheets/000014080020.jpg')
      .add('hts_2', config.asset_url + '/062821/alpha/Hit the Sheets/000060930004.jpg')
      .add('hts_3', config.asset_url + '/062821/alpha/Hit the Sheets/000060950012.jpg')
      .add('hts_4', config.asset_url + '/062821/alpha/Hit the Sheets/000060950014.jpg')
      .add('hts_vid', config.asset_url + '/062821/vids/hit the sheets 4 B.mp4')
      .load((loader, resources) => {
        this.run()
      })
  }
  run() {
    const debug = false
    const duration = appState.currentTrackSource

      // Video 2
      const vv2 = new VidVibe(pixi_app.loader.resources.hts_vid.url)
      vv2.transitionIn()
      this.addChild(vv2)
      vv2.blendMode = 0
      vv2.alpha = 0

    // Video 1
    const vv = new VidVibe(pixi_app.loader.resources.hts_vid.url)
    vv.transitionIn()
    this.addChild(vv)
    vv.blendMode = 0
    vv.alpha = 0.5



       // Kscope 1
       const ks1_container = new PIXI.Container()
       this.addChild(ks1_container)
   
       const kscope1 = new Kaleidoscope(pixi_app.loader.resources.hts_3.texture, {
         blendMode: 3,
         moveData: [30, 26],
       })
       kscope1.draw()
       ks1_container.addChild(kscope1)
       ks1_container.alpha = 0



    // Pic 1
    const pj1_container = new PIXI.Container()
    this.addChild(pj1_container)
    const pj1 = new PhotoJam(pixi_app.loader.resources.hts_1.texture, {
      blendMode: 0,
      moveData: [11, 12, 13, 14],
      amplify: [1, 1.5],
      moveSpeed: 10,
    })
    pj1.currentScaleFactor = 0.5
    pj1.transitionIn()
    pj1.state.canRotatePointer = false
    pj1_container.addChild(pj1)
    pj1_container.alpha = 0


    // Pic 2
    const pj2_container = new PIXI.Container()
    this.addChild(pj2_container)
    const pj2 = new PhotoJam(pixi_app.loader.resources.hts_2.texture, {
      blendMode: 0,
      moveData: [11, 12, 13, 14],
      amplify: [1, 1.5],
      moveSpeed: 10,
    })
    pj2.currentScaleFactor = 0.5
    pj2.transitionIn()
    pj2.state.canRotatePointer = false
    pj2_container.addChild(pj2)
    pj2_container.alpha = 0

    // Pic 3
    const pj3_container = new PIXI.Container()
    this.addChild(pj3_container)
    const pj3 = new PhotoJam(pixi_app.loader.resources.hts_3.texture, {
      blendMode: 0,
      moveData: [11, 12, 13, 14],
      amplify: [1, 1.5],
      moveSpeed: 10,
    })
    pj3.currentScaleFactor = 0.5
    pj3.transitionIn()
    pj3.state.canRotatePointer = false
    pj3_container.addChild(pj3)
    pj3_container.alpha = 0

    // Pic 4
    const pj4_container = new PIXI.Container()
    this.addChild(pj4_container)
    const pj4 = new PhotoJam(pixi_app.loader.resources.hts_4.texture, {
      blendMode: 0,
      moveData: [11, 12, 13, 14],
      amplify: [1, 1.5],
      moveSpeed: 10,
    })
    pj4.currentScaleFactor = 0.5
    pj4.transitionIn()
    pj4.state.canRotatePointer = false
    pj4_container.addChild(pj4)
    pj4_container.alpha = 0


    const pics = [pj1_container, pj2_container, pj3_container, pj4_container]
  

 


    
    

    pixi_app.ticker.add(() => {})




    this.timeline = new TimelineLite()


    function flickerBG() {
      let randomSpeed = Math.round(Math.random() * 3)
      TweenMax.set (vv2, { alpha: Math.random() })
      TweenMax.to (vv2, randomSpeed, { alpha: 0.2, onComplete: () => { flickerBG() } })
    }

    flickerBG()

    function flickerPic() {
      let randomPic = pics[Math.floor(Math.random() * pics.length)]
      let randomSpeed = Math.round(Math.random() * 2) + 1
      TweenMax.set (randomPic, { alpha: 1 })

      TweenMax.to (randomPic, randomSpeed, { alpha: 1, onComplete: () => { 
        let randomPause = (Math.random() * 2) + 0.5
        TweenMax.to (randomPic, randomPause/4, { alpha: 0 })
        TweenMax.to(randomPic, randomPause, { x: 0, onComplete: () => {
          flickerPic()
        } })
      } })
    }

    setTimeout(flickerPic, 5000)
    


    this.timeline.add(() => {
      TweenMax.to (ks1_container, 10, { alpha: 0.5, repeat: -1, yoyo: true })
    }, '15')
    
    

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
