import { Events } from "../services/event/event.service";
import * as PIXI from 'pixi.js';

export interface typeValues {
    id?: string;
    type: string;
    width: number;
    height: number;
    x?: number;
    y?: number;
    color?: number;
    text?: string;
    children?: Array<typeValues>
}

export class Component {
    window: typeValues;
    button: typeValues;
    gui: PIXI.Graphics;
    constructor(public stage) {
        this.addType('window', 300, 300, 0x051C38);
        this.addType('button', 90, 40, 0x4B688B, 'button');
    }

    addType(type, width, height, color, text?) {
        this[type] = {
            type: type,
            width: width,
            height: height,
            x: 0,
            y: 0,
            color: color,
            text: text
        }
    }

    getGraphics(type: typeValues): PIXI.Graphics {
        const component = this[type.type];

        for (let key of Object.keys(type)) {
            component[key] = type[key];
        }

        let g2 = new PIXI.Graphics();
        // draw a rounded rectangle
        g2.lineStyle(2, component.color, 1);
        g2.beginFill(component.color, 0.8);
        g2.drawRoundedRect(0, 0, component.width, component.height, 15);
        g2.position.set(component.x,component.y);
        g2.endFill();
        if (component.text) {
            const style = new PIXI.TextStyle({
                align: "center",
                fill: ['white']
            });
            var basicText = new PIXI.Text(component.text, style);
            basicText.position.set(5, 5);
            
            g2.addChild(basicText);
        }
        if (component.children) component.children.forEach(element => {
            g2.addChild(this.getGraphics(element));
        }); 
        
        return g2;
    }
    getType(type: typeValues, overRides?: any): PIXI.Graphics {
        if (overRides) {
            for (let key of Object.keys(overRides)) {
                type[key] = overRides[key];
            }
        }
        return this.getGraphics(type);
    }
    add(gui: typeValues) {
        this.gui = this.getGraphics(gui);
        this.stage.addChild(this.gui);
    }
}