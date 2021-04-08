import * as PIXI from 'pixi.js'

console.log('CREATE PIXI APP')
//Create the renderer
const pixi_app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor : 0xFFFFFF,
  backgroundAlpha: 0
  // forceCanvas : true
});
export default pixi_app;

document.body.appendChild(pixi_app.view);
