import * as PIXI from 'pixi.js'
const canvas = document.getElementById('canvas-root')

//Create the renderer
const pixi_app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0xffffff,
  backgroundAlpha: 0,
  // forceCanvas : true
})
export default pixi_app

canvas.appendChild(pixi_app.view)
