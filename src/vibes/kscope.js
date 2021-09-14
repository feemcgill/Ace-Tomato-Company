import * as PIXI from 'pixi.js'
import pixi_app from '../base/pixi/app'
import { TweenMax } from 'gsap/TweenMax'
import { mapRange, debounce } from '../base/utils/helpers'
import { analyser, dataArray } from '../base/audio/audioInit'
import appState from '../base/state.js'

const defaults = {
  blendMode: 0,
  moveData: [5, 10],
  moveFactor: 100,
}

export default class Kaleidoscope extends PIXI.Container {
  // blendMode = 0, moveData
  constructor(tex, options_in) {
    super()
    this.settings = { ...defaults, ...options_in }
    this.HALF_PI = Math.PI / 2
    this.TWO_PI = Math.PI * 2
    this.offsetRotation = 0.0
    this.offsetScale = 1.0
    this.offsetX = 0.0
    this.offsetY = 0.0
    this.radius = window.innerWidth > window.innerHeight ? window.innerWidth / 2 : window.innerHeight / 2
    this.slices = 12
    this.zoom = 1.0
    this.posX = window.innerWidth / 2
    this.posY = window.innerHeight / 2
    this.step = this.TWO_PI / this.slices
    this.arcs = []
    this.spriteTiles = []
    this.image = tex
    this.count = 0
    this.interactiveMode = true
    this.mouseX = 0
    this.mouseY = 0
  }

  draw() {
    let mainContainer = new PIXI.Container()
    mainContainer.interactive = true

    mainContainer.mousemove = (e) => {
      const { x, y } = e.data.global
      this.mouseX = x
      this.mouseY = y
    }
    mainContainer.touchmove = (e) => {
      const { x, y } = e.data.global
      this.mouseX = x
      this.mouseY = y
    }
    const createKScope = () => {
      const radius = window.innerWidth > window.innerHeight ? window.innerWidth / 2 : window.innerHeight / 2
      for (let i = 0; i < this.slices; i++) {
        let spriteTileArc = new PIXI.TilingSprite(this.image, 1500 * 2, 1500 * 2)

        let arc = new PIXI.Graphics()
        const currentStep = this.step * i + 1
        arc.beginFill('0x000000')
        arc.moveTo(this.posX, this.posY)
        arc.arc(this.posX, this.posY, radius * 1.3, -0.5 * this.step, 0.5 * this.step)
        arc.endFill()
        spriteTileArc.mask = arc
        spriteTileArc.blendMode = this.settings.blendMode

        var container = new PIXI.Container()
        container.addChild(arc)
        container.addChild(spriteTileArc)
        container.pivot.x = this.posX
        container.pivot.y = this.posY
        container.rotation = -currentStep
        container.scale.x = i % 2 ? 1 : -1
        this.spriteTiles.push(spriteTileArc)
        this.arcs.push(arc)
        mainContainer.addChild(container)
      }
    }
    mainContainer.x = this.posX
    mainContainer.y = this.posY
    this.addChild(mainContainer)
    createKScope()

    pixi_app.ticker.add(() => {
      for (let i = 0; i < this.spriteTiles.length; i++) {
        TweenMax.to(this.spriteTiles[i].tilePosition, 35, {
          x: this.mouseX + this.settings.moveFactor,
          y: this.mouseY + this.settings.moveFactor,
        })
      }
      console.log(this.mouseX, this.mouseY)
      if (appState.audioKicking) {
        analyser.getByteFrequencyData(dataArray)

        let r = mapRange(dataArray[this.settings.moveData[0]], 0, 255, 0.95, 1.5)
        let s = mapRange(dataArray[this.settings.moveData[1]], 0, 255, 0.95, 1.5)
        TweenMax.to(mainContainer.scale, 2, { x: r, y: s })
      }
    })
    window.addEventListener(
      'resize',
      debounce((e) => {
        mainContainer.removeChildren()
        createKScope()
        TweenMax.to(mainContainer, 0.3, {
          x: pixi_app.renderer.width / 2,
          y: pixi_app.renderer.height / 2,
        })
      }, 1500)
    )
  }
}
