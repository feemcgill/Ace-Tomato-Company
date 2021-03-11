import Matter from 'matter-js';
import engine from './engine';
import pixi_app from './../pixi/app'

export default class Borders {
  constructor() {
    this.borderBodies = [];
    this.top = null
    this.left = null
    this.right = null
    this.bottom = null
    this.ramp_right = null
    this.ramp_left = null

  }
  createBorders() {
    const frame_offset = 10
    const borderThickness = 50

    this.top = Matter.Bodies.rectangle(pixi_app.renderer.width / 2, -frame_offset, pixi_app.renderer.width, borderThickness, { label: 'border-top',isStatic: true })
    this.left = Matter.Bodies.rectangle(-frame_offset, pixi_app.renderer.height / 2, borderThickness, pixi_app.renderer.height, { label: 'border-left', isStatic: true })
    this.right = Matter.Bodies.rectangle(pixi_app.renderer.width + frame_offset, pixi_app.renderer.height / 2, borderThickness, pixi_app.renderer.height, { label: 'border-right',isStatic: true })
    this.bottom = Matter.Bodies.rectangle(pixi_app.renderer.width / 2, pixi_app.renderer.height -frame_offset, pixi_app.renderer.width, borderThickness, { label: 'border-bottom',isStatic: true })
    
    

    this.borderBodies = [
      this.top,
      this.left,
      this.right,
      this.bottom,
    ]
    Matter.World.add(engine.world, this.borderBodies);
  }
  removeBorders() {
    if (this.borderBodies.length > 0) {
      Matter.Composite.remove(engine.world, this.borderBodies)
    }    
  }
}