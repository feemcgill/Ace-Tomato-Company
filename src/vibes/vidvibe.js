import * as PIXI from 'pixi.js'
import { TweenMax } from 'gsap/TweenMax'
import pixi_app from '../base/pixi/app'
import { mapRange, backgroundSize, getWindowSize, debounce } from '../base/utils/helpers'
import appState from '../base/state.js'
import { analyser, dataArray } from '../base/audio/audioInit'

const defaults = {
  callback: null,
  parent: null,
}
export default class VidVibe extends PIXI.Sprite {
  constructor(vid, options_in) {
    super()
    this.settings = { ...defaults, ...options_in }
    this.vid = vid
    this.sprite_array = []
    this.rotation_factor = 0.00005
    this.rotation_factor_reverse = -0.0005
    this.interactive = true
    this.parent = this.settings.parent
    this.on('mousemove', this.handleMove).on('touchmove', this.handleMove)
    this.bg = null
    this.scale_factor = 1
    this.offset = { x: 1, y: 1 }
  }

  transitionOut() {
    if (this.settings.callback) {
      this.settings.callback()
    }
    this.removeChildren()
  }

  transitionIn() {
    this.bg = PIXI.Texture.from(this.vid)
    let coke_size = backgroundSize(pixi_app.renderer.width, pixi_app.renderer.height, this.bg.baseTexture.width, this.bg.baseTexture.height)
    this.scale.x = coke_size.scale * this.scale_factor
    this.scale.y = coke_size.scale * this.scale_factor
    this.bg.baseTexture.resource.source.loop = true
    this.bg.baseTexture.resource.source.muted = true
    //const coke = new PIXI.Sprite(bg);
    this.bg.baseTexture.on('loaded', () => {
      coke_size = backgroundSize(pixi_app.renderer.width, pixi_app.renderer.height, this.bg.baseTexture.width, this.bg.baseTexture.height)
      this.scale.x = coke_size.scale * this.scale_factor
      this.scale.y = coke_size.scale * this.scale_factor
    })
    this.texture = this.bg
    this.x = (pixi_app.renderer.width / 2) * this.offset.x
    this.y = (pixi_app.renderer.height / 2) * this.offset.y
    this.anchor.x = 0.5
    this.anchor.y = 0.5
    this.preload = 'auto'
    window.addEventListener(
      'resize',
      debounce((e) => {
        this.resize()
      }, 1500)
    )
    // window.addEventListener('resize', (e) => {

    // })

    // Listen for orientation changes
    // window.addEventListener(
    //   'orientationchange',
    //   () => {
    //   },
    //   false
    // )
  }

  handleMove(e) {}

  handleClick(e) {}
  resize() {
    const size = getWindowSize()
    const w = size.width
    const h = size.height

    const coke_size = backgroundSize(w, h, this.bg.baseTexture.width, this.bg.baseTexture.height)

    this.scale.x = coke_size.scale * this.scale_factor
    this.scale.y = coke_size.scale * this.scale_factor

    this.x = (w / 2) * this.offset.x
    this.y = (h / 2) * this.offset.y
  }
}
