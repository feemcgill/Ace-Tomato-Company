import * as PIXI from 'pixi.js'
import { Graphics } from 'pixi.js'
import { TweenMax, TimelineLite } from 'gsap/TweenMax'
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

    const starTexture = PIXI.Texture.from('/assets/images/star.png');
    const starAmount = 1000;
    let cameraZ = 0;
    const fov = 20;
    const baseSpeed = 0.025;
    let speed = 0;
    let warpSpeed = { speed: 15 };
    const starStretch = 5;
    const starBaseSize = 0.05;


    // Create the stars
    const stars = [];
    for (let i = 0; i < starAmount; i++) {
        const star = {
            sprite: new PIXI.Sprite(starTexture),
            z: 0,
            x: 0,
            y: 0,
        };
        star.sprite.anchor.x = 0.5;
        star.sprite.anchor.y = 0.7;
        randomizeStar(star, true);
        this.addChild(star.sprite);
        stars.push(star);
    }

    function randomizeStar(star, initial) {
        star.z = initial ? Math.random() * 2000 : cameraZ + Math.random() * 1000 + 2000;

        // Calculate star positions with radial random coordinate so no star hits the camera.
        const deg = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 1;
        star.x = Math.cos(deg) * distance;
        star.y = Math.sin(deg) * distance;
    }


    pixi_app.ticker.add((delta) => {
      // Simple easing. This should be changed to proper easing function when used for real.
      speed += (warpSpeed.speed - speed) / 20;
      cameraZ += delta * 10 * (speed + baseSpeed);
      for (let i = 0; i < starAmount; i++) {
          const star = stars[i];
          if (star.z < cameraZ) randomizeStar(star);

          // Map star 3d position to 2d with really simple projection
          const z = star.z - cameraZ;
          star.sprite.x = star.x * (fov / z) * window.innerWidth + window.innerWidth / 2;
          star.sprite.y = star.y * (fov / z) * window.innerWidth + window.innerHeight / 2;

          // Calculate star scale & rotation.
          const dxCenter = star.sprite.x - window.innerWidth / 2;
          const dyCenter = star.sprite.y - window.innerHeight / 2;
          const distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
          const distanceScale = Math.max(0, (2000 - z) / 2000);
          star.sprite.scale.x = distanceScale * starBaseSize;
          // Star is looking towards center so that y axis is towards center.
          // Scale the star depending on how fast we are moving, what the stretchfactor is and depending on how far away it is from the center.
          star.sprite.scale.y = distanceScale * starBaseSize + distanceScale * speed * starStretch * distanceCenter / window.innerWidth;
          star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
      }
    })


    
    


    // Kaleidscope
    const ks_container = new PIXI.Container()
    this.addChild(ks_container)

    const kscope = new Kaleidoscope(pixi_app.loader.resources.haw_1.texture, {
      blendMode: 2,
      moveData: [30, 26],
    })

    kscope.draw()
    ks_container.addChild(kscope)
    ks_container.alpha = 0



    // Kaleidscope2
    const ks_container2 = new PIXI.Container()
    this.addChild(ks_container2)

    const kscope2 = new Kaleidoscope(pixi_app.loader.resources.haw_1.texture, {
      blendMode: 0,
      moveData: [30, 26],
    })

    kscope2.draw()
    ks_container2.addChild(kscope2)
    ks_container2.alpha = 0



    // PJ 1
    const pj_mask = new Graphics();
        pj_mask.beginFill(0x000000);
        pj_mask.lineStyle(0);
        pj_mask.drawCircle(window.innerWidth/2, window.innerHeight/2, window.innerWidth/4);
        pj_mask.endFill();
        

    const pj_container = new PIXI.Container()
    this.addChild(pj_container)

    const pj = new PhotoJam(pixi_app.loader.resources.haw_4.texture, {
      blendMode: 0,
      moveData: [18, 20, 22, 24, 26, 28],
      amplify: [0.75, 1],
      moveSpeed: 0.5,
      size: 'cover',
      rotation_const: 0.0001,
      mousemove_factor: 60,
      mousemove_time: 2.7,
      mousemove_delay: -0.7,
    })
    // pj.currentScaleFactor = 0
    pj.mask = pj_mask;
    pj.alpha = 0;
    pj.transitionIn()

    pj_container.addChild(pj)
    pj_container.addChild(pj_mask)



    // PJ 2
    const pj2_mask = new Graphics();
        pj2_mask.beginFill(0x000000);
        pj2_mask.lineStyle(0);
        pj2_mask.drawCircle(window.innerWidth/2, window.innerHeight/2, window.innerWidth/6);
        pj2_mask.endFill();
        

    const pj2_container = new PIXI.Container()
    this.addChild(pj2_container)

    const pj2 = new PhotoJam(pixi_app.loader.resources.haw_2.texture, {
      blendMode: 0,
      moveData: [18, 20, 22, 24, 26, 28],
      amplify: [0.75, 1],
      moveSpeed: 0.5,
      size: 'cover',
      rotation_const: 0.0001,
      mousemove_factor: 60,
      mousemove_time: 2.7,
      mousemove_delay: -0.7,
    })
    // pj2.currentScaleFactor = 0
    pj2.mask = pj2_mask;
    pj2.alpha = 0;
    pj2.transitionIn()

    pj2_container.addChild(pj2)
    pj2_container.addChild(pj2_mask)





    // PJ 3
    const pj3_mask = new Graphics();
        pj3_mask.beginFill(0x000000);
        pj3_mask.lineStyle(0);
        pj3_mask.drawCircle(window.innerWidth/2, window.innerHeight/2, window.innerWidth/5);
        pj3_mask.endFill();
        

    const pj3_container = new PIXI.Container()
    this.addChild(pj3_container)

    const pj3 = new PhotoJam(pixi_app.loader.resources.haw_3.texture, {
      blendMode: 0,
      moveData: [18, 20, 22, 24, 26, 28],
      amplify: [0.75, 1],
      moveSpeed: 0.5,
      size: 'cover',
      rotation_const: 0.0001,
      mousemove_factor: 60,
      mousemove_time: 2.7,
      mousemove_delay: -0.7,
    })
    // pj3.currentScaleFactor = 0
    pj3.mask = pj3_mask;
    pj3.alpha = 0;
    pj3.transitionIn()

    pj3_container.addChild(pj3)
    pj3_container.addChild(pj3_mask)












    this.timeline = new TimelineLite()
    this.timeline.to(ks_container, 5, { alpha: 0.5 })
    this.timeline.to(warpSpeed, 10, { speed: 0.1, ease: 'expo.in' }, '5')
    
    this.timeline.add(() => {
      TweenMax.to(pj, 15, { alpha: 1 })
      TweenMax.to(ks_container2, 15, { alpha: 0.15 })
    })

    this.timeline.add(() => {
      TweenMax.to(warpSpeed, 10, { speed: 10, ease: 'expo.in' })
      TweenMax.to(ks_container2, 10, { alpha: 0.5 })
      TweenMax.to(pj, 15, { alpha: 0 })
    }, '+=30')

    this.timeline.add(() => {
      TweenMax.to(warpSpeed, 10, { speed: 0.1, ease: 'expo.in' })
      TweenMax.to(ks_container2, 10, { alpha: 0.15 })
    }, '+=30')

    this.timeline.to(pj2, 15, { alpha: 1 }, '+=10')

    this.timeline.add(() => {
      TweenMax.to(warpSpeed, 10, { speed: 10, ease: 'expo.in' })
      TweenMax.to(ks_container2, 10, { alpha: 0.5 })
      TweenMax.to(pj2, 15, { alpha: 0 })
    }, '+=30')

    this.timeline.add(() => {
      TweenMax.to(warpSpeed, 10, { speed: 0.1, ease: 'expo.in' })
      TweenMax.to(ks_container2, 10, { alpha: 0.15 })
    }, '+=30')

    this.timeline.to(pj3, 15, { alpha: 1 }, '+=10')

    this.timeline.add(() => {
      TweenMax.to(warpSpeed, 10, { speed: 10, ease: 'expo.in' })
      TweenMax.to(ks_container2, 10, { alpha: 0.5 })
      TweenMax.to(pj3, 15, { alpha: 0 })
    }, '+=30')

    this.timeline.add(() => {
      TweenMax.to(warpSpeed, 30, { speed: 15 })
      TweenMax.to(ks_container2, 10, { alpha: 1 })
    }, '+=10')

    if (process.env.DEBUG == 'true') {
      this.timeline.timeScale(10)
    }



    window.addEventListener(
      'resize',
      debounce(function (e) {
        
        black_bg.width = window.innerWidth
        black_bg.height = window.innerHeight

        pj_mask.clear()
        pj_mask.beginFill(0x000000)
        pj_mask.lineStyle(0)
        pj_mask.drawCircle(window.innerWidth/2, window.innerHeight/2, window.innerWidth/4)
        pj_mask.endFill()

        pj2_mask.clear()
        pj2_mask.beginFill(0x000000);
        pj2_mask.lineStyle(0);
        pj2_mask.drawCircle(window.innerWidth/2, window.innerHeight/2, window.innerWidth/6);
        pj2_mask.endFill();
        
        pj3_mask.clear()
        pj3_mask.beginFill(0x000000);
        pj3_mask.lineStyle(0);
        pj3_mask.drawCircle(window.innerWidth/2, window.innerHeight/2, window.innerWidth/5);
        pj3_mask.endFill();


      }, 500)
    )
  }
}
