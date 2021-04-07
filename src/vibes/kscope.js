import * as PIXI from 'pixi.js'
import pixi_app from '../base/pixi/app'
import {TweenMax} from "gsap/TweenMax"

export default class Kaleidoscope extends PIXI.Container  {
    
    constructor(tex, blendMode = 0) {
        super();
        this.HALF_PI = Math.PI / 2;
        this.TWO_PI = Math.PI * 2;
        this.offsetRotation = 0.0;
        this.offsetScale = 1.0;
        this.offsetX = 0.0;
        this.offsetY = 0.0;
        this.radius = window.innerWidth / 2;
        this.slices = 12;
        this.zoom = 1.0;
        this.posX = window.innerWidth / 2;
        this.posY = window.innerHeight / 2;
        this.step = this.TWO_PI / this.slices;
        this.arcs = []
        this.spriteTiles = [];
        this.containers = [];
        this.image = tex;
        this.count = 0;
        this.interactiveMode = true;
        this.mouseX = 0;
        this.mouseY = 0;
        this.blendMode = blendMode;
    }

    draw() {
        let mainContainer = new PIXI.Container();
        mainContainer.interactive = true;
        mainContainer.mousemove = e => {
            const {x,y} = e.data.global;
            this.mouseX = x;
            this.mouseY = y;
        }
        for(let i = 0; i < this.slices; i++) {
            let arc = new PIXI.Graphics();
            let spriteTileArc = new PIXI.TilingSprite(this.image,1500 * 2 ,1500 * 2);
            const currentStep = this.step * i + 1;
            arc.beginFill('0x000000');
            arc.moveTo(this.posX,this.posY);
            arc.arc(this.posX,this.posY, this.radius * 1.3, -.5 * this.step, .5 * this.step);
            arc.endFill();
            spriteTileArc.mask = arc;
            spriteTileArc.blendMode = this.blendMode;

            var container = new PIXI.Container();
            container.addChild(arc);
            container.addChild(spriteTileArc);
            container.pivot.x = this.posX;
            container.pivot.y = this.posY;
            container.rotation = -currentStep;
            container.scale.x = i % 2 ? 1 : -1;
            this.spriteTiles.push(spriteTileArc);
            this.arcs.push(arc);
            this.containers.push(container);
            mainContainer.addChild(container);
        }
        mainContainer.x = this.posX;
        mainContainer.y = this.posY;
        //mainContainer.alpha = 0.5;
        this.addChild(mainContainer);


         pixi_app.ticker.add(() => {
            this.count += this.interactiveMode ? 0.05 : 0.005;
            for(let i = 0;i < this.spriteTiles.length; i++) {   
                if(this.interactiveMode) {
                    // this.spriteTiles[i].tilePosition.x = this.mouseX + Math.sin(this.count);
                    // this.spriteTiles[i].tilePosition.y = this.mouseY + Math.cos(this.count);
                    
                    // this.spriteTiles[i].tilePosition.x = this.mouseX + this.count;
                    // this.spriteTiles[i].tilePosition.y = this.mouseY + this.count;
                    TweenMax.to(this.spriteTiles[i].tilePosition, 35, {x:  this.mouseX + this.count, y: this.mouseY + this.count})
                    // this.spriteTiles[i].tilePosition.x = this.mouseX;
                    // this.spriteTiles[i].tilePosition.y = this.mouseY;                    
                } else {
                    this.spriteTiles[i].tilePosition.x += Math.sin(this.count);
                    this.spriteTiles[i].tilePosition.y += Math.cos(this.count);
                }
            }
        });
        
    }

    toggleInteractiveMode() {
        console.log('toggleinteractive', this.interactiveMode);
        this.interactiveMode = !this.interactiveMode;
    }
}