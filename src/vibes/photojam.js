import * as PIXI from 'pixi.js'
import { TweenMax } from 'gsap/TweenMax'
import pixi_app from '../base/pixi/app'
import { mapRange, backgroundSize, getWindowSize } from '../base/utils/helpers'
import appState from '../base/state.js'
import { analyser, dataArray } from '../base/audio/audioInit'

const defaults = {
  blendMode: 0,
  callback: null,
  moveData: [5, 10, 15],
  amplify: [0.95, 1.5],
  moveSpeed: 1,
  rotation_factor: 0.00005,
  rotation_factor_reverse: -0.0005,
}

export default class PhotoJam extends PIXI.Sprite {
  constructor(texture, options_in) {
    super()
    this.settings = { ...defaults, ...options_in }
    // this.settings.callback = this.settings.callback
    //this.blendMode = this.settings.blendMode
    //this.moveData = this.settings.moveData
    // this.amplify = this.settings.amplify
    // this.settings.moveSpeed = this.settings.moveSpeed
    // this.settings.rotation_factor = this.settings.rotation_factor
    // this.settings.rotation_factor_reverse = this.settings.rotation_factor_reverse

    this.tex = texture
    this.sprite_array = []

    this.interactive = true
    this.whitewash = new PIXI.Graphics()
    this.state = {
      canScaleDance: true,
      canRotatePointer: true,
    }
    this.on('mousemove', this.handleMove).on('touchmove', this.handleMove)
  }

  transitionOut() {
    if (this.settings.callback) {
      this.settings.callback()
    }
    this.removeChildren()
  }

  transitionIn() {
    this.whitewash.beginFill(0xffffff)
    this.whitewash.drawRect(
      0,
      0,
      pixi_app.renderer.width,
      pixi_app.renderer.height
    )
    this.whitewash.endFill()

    let sprite_size = backgroundSize(
      pixi_app.renderer.width,
      pixi_app.renderer.height,
      this.tex.baseTexture.width,
      this.tex.baseTexture.height
    )
    // const sprite = new PIXI.Sprite(this.tex);

    for (let index = 0; index < this.settings.moveData.length; index++) {
      const sprite = new PIXI.Sprite(this.tex)

      sprite.scale.x = sprite_size.scale
      sprite.scale.y = sprite_size.scale

      // sprite.x = this.width / 2
      // sprite.y = this.height / 2 + index * 10

      sprite.x = pixi_app.renderer.width / 2
      sprite.y = pixi_app.renderer.height / 2 + index * 10

      sprite.anchor.x = 0.5
      sprite.anchor.y = 0.5
      sprite.alpha = 0.6
      sprite.blendMode = this.settings.blendMode
      // if(index % 2 == 0) {
      //   sprite.scale.y = -sprite_size.scale;
      //   sprite.scale.x = -sprite_size.scale;
      // }
      // sprite.rotation += 2 * (index + 1)

      this.sprite_array.push(sprite)
      this.addChild(sprite)
    }

    this.sprite_array[0].blendMode = 0
    this.addChild(this.whitewash)
    this.whitewash.alpha = 0
    console.log(1.5 * this.settings.amplify)

    pixi_app.ticker.add(() => {
      if (appState.audioKicking) {
        analyser.getByteFrequencyData(dataArray)
        //analyser.getByteTimeDomainData(dataArray);

        for (let i = 0; i < this.sprite_array.length; i++) {
          let mover = dataArray[i * 5 + 3]
          if (this.settings.moveData[i]) {
            mover = dataArray[this.settings.moveData[i]]
          }
          const sprite = this.sprite_array[i]
          let r = mapRange(
            mover,
            0,
            255,
            sprite_size.scale * this.settings.amplify[0],
            sprite_size.scale * this.settings.amplify[1]
          )
          if (this.state.canScaleDance) {
            TweenMax.to(sprite.scale, this.settings.moveSpeed, { x: r, y: r })
          }
          if (this.state.canRotatePointer) {
            sprite.rotation += this.settings.rotation_factor * (i + 1)
          }
          // if(i % 2 == 0) {
          //   sprite.rotation += this.settings.rotation_factor_reverse * (i + 1);
          // }
        }
      }
    })

    window.addEventListener('resize', (e) => {
      const size = getWindowSize()
      // const w = this.width
      // const h = this.height
      const w = size.width
      const h = size.height

      sprite_size = backgroundSize(
        w,
        h,
        this.tex.baseTexture.width,
        this.tex.baseTexture.height
      )

      TweenMax.staggerTo(this.sprite_array, 0.1, { x: w / 2, y: h / 2 }, -0.05)

      // this.width = w;
      // this.height = h;

      // for (let i = 0; i < this.sprite_array.length; i++) {
      //   const sprite = this.sprite_array[i];
      //   sprite.x = w / 2;
      //   sprite.y = h / 2 + (i * 10);
      // }
      // this.x = pixi_app.renderer.width / 2;
      // this.y = pixi_app.renderer.height / 2;
    })
  }
  fadeToWhite(time = 10) {
    TweenMax.to(this.whitewash, time, { alpha: 1 })
  }
  fadeToJam(time = 10) {
    TweenMax.to(this.whitewash, time, { alpha: 0 })
  }
  rotateTo(rotate) {
    this.state.canRotatePointer = false
    TweenMax.staggerTo(this.sprite_array, 1, { rotation: rotate }, -0.06)
  }
  scaleTo(scale = 1, time = 1, callback = null) {
    this.state.canScaleDance = false
    for (let i = 0; i < this.sprite_array.length; i++) {
      const sprite = this.sprite_array[i]
      TweenMax.to(sprite.scale, time, {
        x: scale,
        y: scale,
        delay: i * 0.2,
        onComplete: () => {
          if (i + 1 == this.sprite_array.length) {
            this.state.canScaleDance = true
            if (callback) {
              callback()
            }
          }
        },
      })
    }
  }
  setAmplify(input = [1, 1.5]) {
    this.settings.amplify = input
  }
  handleMove(e) {
    var rotation_const = 0.0005
    var move_const = 200
    var x = e.data.global.x
    var y = e.data.global.y

    this.settings.rotation_factor = mapRange(
      x,
      0,
      pixi_app.renderer.width,
      -rotation_const,
      rotation_const
    )
    this.settings.rotation_factor_reverse = mapRange(
      x,
      0,
      pixi_app.renderer.width,
      rotation_const,
      -rotation_const
    )
    var moveFactorX = mapRange(
      x,
      0,
      pixi_app.renderer.width,
      // this.width / 2 - move_const,
      // this.width / 2 + move_const
      pixi_app.renderer.width / 2 - move_const,
      pixi_app.renderer.width / 2 + move_const
    )
    var moveFactorY = mapRange(
      y,
      0,
      pixi_app.renderer.height,
      // this.height / 2 - move_const,
      // this.height / 2 + move_const
      pixi_app.renderer.height / 2 - move_const,
      pixi_app.renderer.height / 2 + move_const
    )
    TweenMax.staggerTo(
      this.sprite_array,
      10,
      { x: moveFactorX, y: moveFactorY },
      -0.3
    )
  }

  handleClick(e) {
    // for (let i = 0; i < this.sprite_array.length; i++) {
    //   const sprite = this.sprite_array[i];
    //   setTimeout(() => {
    //     sprite.texture = (sprite.texture == resources.dp_1.texture) ? resources.dp_4.texture : resources.dp_1.texture;
    //   }, i * 60);
    // }
  }
  resize() {}
}
