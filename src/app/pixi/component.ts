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
    iconButton: typeValues;
    toolbar: typeValues;
    gui: PIXI.Graphics;
    constructor(public stage) {
        this.addType('window', 300, 300, 0x051C38);
        this.addType('button', 90, 40, 0x4B688B, 'button');
        this.addType('iconButton', 40, 40, 0x4B688B);
        this.addType('toolbar', 480, 50, 0x051C38);
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

        if (!this[type.type]) alert('Type Missing: '+ type.type)

        for (let key of Object.keys(type)) {
            component[key] = type[key];
        }

        let g2 = new PIXI.Graphics();
        // draw a rounded rectangle
        g2.name = component.id;
        g2['type'] = component.type;
        g2.lineStyle(2, component.color, 1);
        g2.beginFill(component.color, 0.8);
        g2.drawRoundedRect(0, 0, component.width, component.height, 15);
        g2.position.set(component.x,component.y);
        g2.endFill();
        if (component.text) {
            const style = new PIXI.TextStyle({
                align: 'center',
                fontFamily: 'Arial',
                fontSize: 36,
                fontStyle: 'italic',
                fontWeight: 'bold',
                fill: ['#ffffff', '#00ff99'], // gradient
                stroke: '#4a1850',
                strokeThickness: 5,
                dropShadow: true,
                dropShadowColor: '#000000',
                dropShadowBlur: 4,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 6,
                wordWrap: true,
                wordWrapWidth: 440
            });
            var basicText = new PIXI.Text(component.text, style);
            basicText.position.set(0, 0);
            
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
        return this.stage.addChild(this.gui);
    }
    addTo(id, newSprite) {
        let component = <PIXI.Container>this.gui.getChildByName(id);
        if (component['type'] === 'toolbar') {
            this.addToIconBar(component, newSprite);
        }
    }
    addToIconBar(component: PIXI.Container, sprite) {
        this.iconButton.text = '';
        let button = this.getGraphics(this.iconButton);
        button.addChild(sprite);
        sprite.position.set(5, 5)
        let newSprite = component.addChild(button);
        let count = component.children.length;

        newSprite.position.set((newSprite.x + 45) * count, newSprite.y);

    }
}