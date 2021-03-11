import Matter from 'matter-js';

const canvas = document.getElementById('canvas')
const box = document.getElementById('the-box')
const innerWidth = window.innerWidth
const innerHeight = window.innerHeight


// let matter_renderer = {
//   render: {
//     element: document.body,
//     canvas: canvas,
//     visble: true,
//     options: {
//       width: innerWidth,
//       height: innerHeight,
//       wireframes: true,
//       showAngleIndicator: true,
//       background: 'transparent',
//       wireframeBackground: 'transparent',   
//     }
//   }  
// }

const engine = Matter.Engine.create()

var render = Matter.Render.create({
  element: document.body,
  canvas: canvas,
  engine: engine,
  options: {
    width: innerWidth,
    height: innerHeight,
    wireframes: true,
    showAngleIndicator: true,
    background: 'transparent',
    wireframeBackground: 'transparent',       
  }
});



const mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: Matter.Mouse.create(box)
});
Matter.World.add(engine.world, mouseConstraint);

Matter.Engine.run(engine)
Matter.Render.run(render);

export default engine