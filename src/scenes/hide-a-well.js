import * as PIXI from 'pixi.js'
import { Graphics } from 'pixi.js'
import { TweenMax, TimelineLite, Power4 } from 'gsap/TweenMax'
import pixi_app from '../base/pixi/app'
import { getWindowSize, backgroundSize, debounce } from '../base/utils/helpers'

import Kaleidoscope from '../vibes/kscope.js'
import PhotoJam from '../vibes/photojam.js'
import VidVibe from '../vibes/vidvibe.js'
import appState from '../base/state.js'
import config from '../config.js'

export default class HideAWell extends PIXI.Container {
  constructor() {
    super()
    this.timeline = null
  }
  load() {
    pixi_app.loader
      .add('haw_1', config.asset_url + '/062821/alpha/Somewhere It Hides A well/Libya.A2005027.1140.250m.jpg')
      .add('haw_2', config.asset_url + '/062821/alpha/Somewhere It Hides A well/MiddleEast.A2003031.0820.1km.jpg')
      .add('haw_3', config.asset_url + '/062821/alpha/Somewhere It Hides A well/Sahara.A2001313.1005.2km.jpg')
      .add('haw_4', config.asset_url + '/062821/alpha/Somewhere It Hides A well/Taklimakan.A2005176.0525.250m.jpg')
      .add('haw_vid', config.asset_url + '/062821/vids/l7_egypt_settlement.mp4')

      .load((loader, resources) => {
        this.run()
      })
  }
  run() {
    var black_bg = new PIXI.Sprite(PIXI.Texture.WHITE)
    black_bg.width = window.innerWidth
    black_bg.height = window.innerHeight
    black_bg.tint = 0x000000 //Change with the color wanted

    this.addChild(black_bg)

    const stars_container = new PIXI.Container()
    stars_container.alpha = 0
    this.addChild(stars_container)
    const starTexture = PIXI.Texture.from('/assets/images/star.png')
    const starAmount = 2000
    let cameraZ = 0
    const fov = 20
    const baseSpeed = 0.025
    let speed = 0
    let warpSpeed = { speed: 3 }
    const starStretch = 5
    const starBaseSize = 0.05

    // Create the stars
    const stars = []
    for (let i = 0; i < starAmount; i++) {
      const star = {
        sprite: new PIXI.Sprite(starTexture),
        z: 0,
        x: 0,
        y: 0,
      }
      star.sprite.anchor.x = 0.5
      star.sprite.anchor.y = 0.7
      randomizeStar(star, true)
      stars_container.addChild(star.sprite)
      stars.push(star)
    }

    function randomizeStar(star, initial) {
      star.z = initial ? Math.random() * 2000 : cameraZ + Math.random() * 1000 + 2000

      // Calculate star positions with radial random coordinate so no star hits the camera.
      const deg = Math.random() * Math.PI * 2
      const distance = Math.random() * 50 + 1
      star.x = Math.cos(deg) * distance
      star.y = Math.sin(deg) * distance
    }

    pixi_app.ticker.add((delta) => {
      // Simple easing. This should be changed to proper easing function when used for real.
      speed += (warpSpeed.speed - speed) / 20
      cameraZ += delta * 10 * (speed + baseSpeed)
      for (let i = 0; i < starAmount; i++) {
        const star = stars[i]
        if (star.z < cameraZ) randomizeStar(star)

        // Map star 3d position to 2d with really simple projection
        const z = star.z - cameraZ
        star.sprite.x = star.x * (fov / z) * window.innerWidth + window.innerWidth / 2
        star.sprite.y = star.y * (fov / z) * window.innerWidth + window.innerHeight / 2

        // Calculate star scale & rotation.
        const dxCenter = star.sprite.x - window.innerWidth / 2
        const dyCenter = star.sprite.y - window.innerHeight / 2
        const distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter)
        const distanceScale = Math.max(0, (2000 - z) / 2000)
        star.sprite.scale.x = distanceScale * starBaseSize
        // Star is looking towards center so that y axis is towards center.
        // Scale the star depending on how fast we are moving, what the stretchfactor is and depending on how far away it is from the center.
        star.sprite.scale.y = distanceScale * starBaseSize + (distanceScale * speed * starStretch * distanceCenter) / window.innerWidth
        star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2
      }
    })


    // Video 1
    const vv = new VidVibe(pixi_app.loader.resources.haw_vid.url)
    vv.transitionIn()
    this.addChild(vv)
    vv.blendMode = 0
    vv.alpha = 1



    // Kaleidscope
    const ks_container = new PIXI.Container()
    this.addChild(ks_container)

    const kscope = new Kaleidoscope(pixi_app.loader.resources.haw_3.texture, {
      blendMode: 1,
      moveData: [30, 26],
    })

    kscope.draw()
    ks_container.addChild(kscope)
    ks_container.alpha = 0



    
    // White cover
    var white_cover = new PIXI.Sprite(PIXI.Texture.WHITE)
    white_cover.width = window.innerWidth
    white_cover.height = window.innerHeight
    white_cover.alpha = 0

    this.addChild(white_cover)




    // Kaleidscope2
    const ks_container2 = new PIXI.Container()
    this.addChild(ks_container2)

    const kscope2 = new Kaleidoscope(pixi_app.loader.resources.haw_4.texture, {
      blendMode: 0,
      moveData: [30, 26],
    })

    kscope2.draw()
    ks_container2.addChild(kscope2)
    ks_container2.alpha = 0



    // PJ 1
    const pj_mask_gpx = new Graphics()
    pj_mask_gpx.beginFill(0xff0000)
    pj_mask_gpx.lineStyle(0)
    pj_mask_gpx.drawCircle(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 5)
    pj_mask_gpx.endFill()

    const pj_mask_texture = pixi_app.renderer.generateTexture(pj_mask_gpx)
    
    const pj_mask = new PIXI.Sprite(pj_mask_texture)
    pj_mask.anchor.set(0.5)
    pj_mask.x = pixi_app.renderer.width / 2
    pj_mask.y = pixi_app.renderer.height / 2
    pj_mask.scale.set(0)
    this.addChild(pj_mask)

    const pj_container = new PIXI.Container()
    this.addChild(pj_container)

    const pj = new PhotoJam(pixi_app.loader.resources.haw_4.texture, {
      blendMode: 0,
      moveData: [18, 20, 22, 24, 26, 28],
      amplify: [1, 1.5],
      moveSpeed: 0.5,
      size: 'cover',
      rotation_const: 0.0001,
      mousemove_factor: 60,
      mousemove_time: 2.7,
      mousemove_delay: -0.7,
    })
    pj.state.canRotatePointer = false
    pj.mask = pj_mask
    pj.transitionIn()

    pj_container.addChild(pj)
    pj_container.addChild(pj_mask)


    // Kaleidscope3
    const ks_container3 = new PIXI.Container()
    this.addChild(ks_container3)

    const kscope3 = new Kaleidoscope(pixi_app.loader.resources.haw_4.texture, {
      blendMode: 0,
      moveData: [30, 26],
    })

    kscope3.draw()
    ks_container3.addChild(kscope3)
    ks_container3.alpha = 0


    // PJ 2
    const pj2_mask_gpx = new Graphics()
    pj2_mask_gpx.beginFill(0xff0000)
    pj2_mask_gpx.lineStyle(0)
    pj2_mask_gpx.drawCircle(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 6)
    pj2_mask_gpx.endFill()

    const pj2_mask_texture = pixi_app.renderer.generateTexture(pj2_mask_gpx)
    
    const pj2_mask = new PIXI.Sprite(pj2_mask_texture)
    pj2_mask.anchor.set(0.5)
    pj2_mask.x = pixi_app.renderer.width / 2
    pj2_mask.y = pixi_app.renderer.height / 2
    pj2_mask.scale.set(0)
    this.addChild(pj2_mask)

    const pj2_container = new PIXI.Container()
    this.addChild(pj2_container)

    const pj2 = new PhotoJam(pixi_app.loader.resources.haw_1.texture, {
      blendMode: 0,
      moveData: [18, 20, 22, 24, 26, 28],
      amplify: [1, 1.5],
      moveSpeed: 0.5,
      size: 'cover',
      rotation_const: 0.0001,
      mousemove_factor: 60,
      mousemove_time: 2.7,
      mousemove_delay: -0.7,
    })
    pj2.state.canRotatePointer = false
    pj2.mask = pj2_mask
    pj2.transitionIn()

    pj2_container.addChild(pj2)
    pj2_container.addChild(pj2_mask)

    

    
    // Kaleidscope4
    const ks_container4 = new PIXI.Container()
    this.addChild(ks_container4)

    const kscope4 = new Kaleidoscope(pixi_app.loader.resources.haw_2.texture, {
      blendMode: 3,
      moveData: [30, 26],
    })

    kscope4.draw()
    ks_container4.addChild(kscope4)
    ks_container4.alpha = 0


    // PJ 3
    const pj3_mask_gpx = new Graphics()
    pj3_mask_gpx.beginFill(0xff0000)
    pj3_mask_gpx.lineStyle(0)
    pj3_mask_gpx.drawCircle(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 6)
    pj3_mask_gpx.endFill()

    const pj3_mask_texture = pixi_app.renderer.generateTexture(pj3_mask_gpx)
    
    const pj3_mask = new PIXI.Sprite(pj3_mask_texture)
    pj3_mask.anchor.set(0.5)
    pj3_mask.x = pixi_app.renderer.width / 2
    pj3_mask.y = pixi_app.renderer.height / 2
    pj3_mask.scale.set(0)
    this.addChild(pj3_mask)

    const pj3_container = new PIXI.Container()
    this.addChild(pj3_container)

    const pj3 = new PhotoJam(pixi_app.loader.resources.haw_2.texture, {
      blendMode: 0,
      moveData: [18, 20, 22, 24, 26, 28],
      amplify: [1, 1.5],
      moveSpeed: 0.5,
      size: 'cover',
      rotation_const: 0.0001,
      mousemove_factor: 60,
      mousemove_time: 2.7,
      mousemove_delay: -0.7,
    })
    pj3.state.canRotatePointer = false
    pj3.mask = pj3_mask
    pj3.transitionIn()

    pj3_container.addChild(pj3)
    pj3_container.addChild(pj3_mask)




    // Video 2
    const vv2 = new VidVibe(pixi_app.loader.resources.haw_vid.url)
    vv2.transitionIn()
    this.addChild(vv2)
    vv2.blendMode = 3
    vv2.alpha = 0


    // Kaleidscope
    const ks_container5 = new PIXI.Container()
    this.addChild(ks_container5)

    const kscope5 = new Kaleidoscope(pixi_app.loader.resources.haw_3.texture, {
      blendMode: 1,
      moveData: [30, 26],
    })

    kscope5.draw()
    ks_container5.addChild(kscope5)
    ks_container5.alpha = 0
    



    /// TIMELINE
    this.timeline = new TimelineLite()
    this.timeline.to(ks_container, 30, { alpha: 0.5 }, '5')
    this.timeline.to(white_cover, 10, { alpha: 1 }, '30')

    this.timeline.add(() => {
      ks_container.alpha = 0
      vv.alpha = 0
      TweenMax.to(white_cover, 5, { alpha: 0 })
      TweenMax.to(stars_container, 5, { alpha: 1 })  
    })

    
    this.timeline.to(warpSpeed, 10, { speed: 0, ease: Power4.easeOut })
    this.timeline.to(pj_mask.scale, 15, { x: 1, y: 1, ease: Power4.easeOut }, '-=10')
    this.timeline.to(ks_container2, 15, { alpha: 0.15 }, '-=15')

    this.timeline.to(warpSpeed, 20, { speed: 3, ease: Power4.easeIn })
    this.timeline.to(pj_mask.scale, 20, { x: 5, y: 5, ease: Power4.easeIn }, '-=20')

    this.timeline.add(() => {
      ks_container2.alpha = 0
    })

    this.timeline.to(pj_container, 5, { alpha: 0, ease: Power4.easeIn }, '+=2')

    this.timeline.to(warpSpeed, 10, { speed: 0, ease: Power4.easeOut })
    this.timeline.to(pj2_mask.scale, 15, { x: 1, y: 1, ease: Power4.easeOut }, '-=10')
    this.timeline.to(ks_container3, 15, { alpha: 0.15 }, '-=15')

    this.timeline.to(warpSpeed, 20, { speed: 3, ease: Power4.easeIn })
    this.timeline.to(pj2_mask.scale, 20, { x: 5, y: 5, ease: Power4.easeIn }, '-=20')

    this.timeline.add(() => {
      ks_container3.alpha = 0
    })

    this.timeline.to(pj2_container, 5, { alpha: 0, ease: Power4.easeIn }, '+=2')

    this.timeline.to(warpSpeed, 10, { speed: 0, ease: Power4.easeOut })
    this.timeline.to(pj3_mask.scale, 15, { x: 1, y: 1, ease: Power4.easeOut }, '-=10')
    this.timeline.to(ks_container4, 15, { alpha: 0.15 }, '-=15')

    this.timeline.to(warpSpeed, 20, { speed: 3, ease: Power4.easeIn })
    this.timeline.to(pj3_mask.scale, 20, { x: 5, y: 5, ease: Power4.easeIn }, '-=20')

    this.timeline.add(() => {
      ks_container4.alpha = 0
    })

    this.timeline.to(vv2, 5, { alpha: 1 })
    this.timeline.to(ks_container5, 30, { alpha: 0.5 }, '-=5')
    

    // this.timeline.timeScale(10)
    if (process.env.DEBUG == 'true') {
      this.timeline.timeScale(10)
    }

    window.addEventListener(
      'resize',
      debounce(function (e) {
        black_bg.width = window.innerWidth
        black_bg.height = window.innerHeight

        pj_mask.x = pixi_app.renderer.width / 2
        pj_mask.y = pixi_app.renderer.height / 2

      }, 500)
    )
  }
}
