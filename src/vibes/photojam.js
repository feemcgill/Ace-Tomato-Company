import * as PIXI from 'pixi.js'
import { TweenMax } from 'gsap/TweenMax'
import pixi_app from '../base/pixi/app'
import { debounce, mapRange, backgroundSize, backgroundContain, getWindowSize } from '../base/utils/helpers'
import appState from '../base/state.js'
import { analyser, dataArray } from '../base/audio/audioInit'

const defaults = {
  blendMode: 0,
  callback: null,
  moveData: [5, 10, 15],
  amplify: [0.95, 1.5],
  moveSpeed: 1,
  size: null,
  container: pixi_app.renderer,
  mousemove_factor: 50,
  mousemove_time: 10,
  mousemove_delay: -0.3,
  rotation_const: 0.0005,
}

export default class PhotoJam extends PIXI.Sprite {
  constructor(texture, options_in) {
    super()
    this.tex = texture
    this.settings = { ...defaults, ...options_in }
    this.sprite_array = []
    this.interactive = true
    this.whitewash = new PIXI.Graphics()
    this.sprite_size = null
    this.currentScaleFactor = 1
    this.rotation_factor = 0.0005

    this.state = {
      canScaleDance: true,
      canRotatePointer: true,
    }
    this.on('mousemove', this.handleMove).on('touchmove', this.handleMove)
  }

  transitionIn() {
    this.whitewash.beginFill(0xffffff)
    this.whitewash.drawRect(0, 0, this.settings.container.width, this.settings.container.height)
    this.whitewash.endFill()

    this.calculateSize()

    for (let index = 0; index < this.settings.moveData.length; index++) {
      const sprite = new PIXI.Sprite(this.tex)

      sprite.scale.x = this.sprite_size.scale * this.currentScaleFactor
      sprite.scale.y = this.sprite_size.scale * this.currentScaleFactor

      sprite.x = (this.settings.container.x || 0) + this.settings.container.width / 2
      sprite.y = (this.settings.container.y || 0) + this.settings.container.height / 2 + index * 10

      sprite.anchor.x = 0.5
      sprite.anchor.y = 0.5
      sprite.alpha = 0.6
      sprite.blendMode = this.settings.blendMode

      this.sprite_array.push(sprite)
      this.addChild(sprite)
    }

    this.sprite_array[0].blendMode = 0
    this.addChild(this.whitewash)
    this.whitewash.alpha = 0

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
            this.currentScaleFactor * this.sprite_size.scale * this.settings.amplify[0],
            this.currentScaleFactor * this.sprite_size.scale * this.settings.amplify[1]
          )
          if (this.state.canScaleDance) {
            TweenMax.to(sprite.scale, this.settings.moveSpeed, { x: r, y: r })
          }
          if (this.state.canRotatePointer) {
            sprite.rotation += this.rotation_factor * (i + 1)
          }
        }
      }
    })
    window.addEventListener(
      'resize',
      debounce((e) => {
        this.resize()
      }, 100)
    )
  }
  fadeToWhite(time = 10) {
    TweenMax.to(this.whitewash, time, { alpha: 1 })
  }
  fadeToJam(time = 10) {
    TweenMax.to(this.whitewash, time, { alpha: 0 })
  }
  rotateTo(rotate, time = 1, delay = -0.006, callback) {
    console.log('rotate to', this.sprite_array)
    this.state.canRotatePointer = false
    TweenMax.staggerTo(this.sprite_array, time, { rotation: rotate, onComplete: callback }, delay)
  }
  scaleTo(scale = 1, time = 1, delay = 0.2, callback = null, ease = 'power1.out') {
    this.state.canScaleDance = false
    //this.currentScaleFactor = this.sprite_size.scale * scale;
    for (let i = 0; i < this.sprite_array.length; i++) {
      const sprite = this.sprite_array[i]
      TweenMax.to(sprite.scale, time, {
        x: this.sprite_size.scale * scale,
        y: this.sprite_size.scale * scale,
        delay: i * delay,
        ease: ease,
        onComplete: () => {
          this.currentScaleFactor = scale
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
    var move_factor = this.settings.mousemove_factor
    var x = e.data.global.x
    var y = e.data.global.y
    this.rotation_factor = mapRange(x, 0, pixi_app.renderer.width, -this.settings.rotation_const, this.settings.rotation_const)

    var moveFactorX = mapRange(
      x,
      0,
      pixi_app.renderer.width,
      (this.settings.container.x || 0) + this.settings.container.width / 2 - move_factor,
      (this.settings.container.x || 0) + this.settings.container.width / 2 + move_factor
    )
    var moveFactorY = mapRange(
      y,
      0,
      pixi_app.renderer.height,
      (this.settings.container.y || 0) + this.settings.container.height / 2 - move_factor,
      (this.settings.container.y || 0) + this.settings.container.height / 2 + move_factor
    )
    TweenMax.staggerTo(this.sprite_array, this.settings.mousemove_time, { x: moveFactorX, y: moveFactorY }, this.settings.mousemove_delay)
  }

  calculateSize() {
    if (this.settings.size == 'contain') {
      this.sprite_size = backgroundContain(
        this.settings.container.width,
        this.settings.container.height,
        this.tex.baseTexture.width,
        this.tex.baseTexture.height
      )
    } else {
      this.sprite_size = backgroundSize(this.settings.container.width, this.settings.container.height, this.tex.baseTexture.width, this.tex.baseTexture.height)
    }
    return this.sprite_size
  }

  resize() {
    console.log('photojam resize')

    TweenMax.staggerTo(
      this.sprite_array,
      0.1,
      {
        x: (this.settings.container.x || 0) + this.settings.container.width / 2,
        y: (this.settings.container.y || 0) + this.settings.container.height / 2,
      },
      -0.05
    )

    this.calculateSize()

    for (let i = 0; i < this.sprite_array.length; i++) {
      const sprite = this.sprite_array[i]
      sprite.scale.x = this.sprite_size.scale * this.currentScaleFactor
      sprite.scale.y = this.sprite_size.scale * this.currentScaleFactor
    }
  }
  transitionOut() {
    if (this.settings.callback) {
      this.settings.callback()
    }
    this.removeChildren()
  }
}
