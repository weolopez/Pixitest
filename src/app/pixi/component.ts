import { Events } from "../services/event/event.service";
import * as PIXI from 'pixi.js';
import { PixiTextInput } from "./input";

export interface Panel extends PIXI.Container {
    panels?: Array<PIXI.Container>;
    panel: PIXI.Container;
    currentPanel: number;
}

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
    list: typeValues;
    item: typeValues;
    inputItem: typeValues;
    gui: PIXI.Graphics;
    style = {
        align: 'right',
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
        wordWrapWidth: 440
    }
    constructor(public stage, public events?: Events) {
        this.addType('window', 500, 500, 0x051C38);
        this.addType('button', 90, 40, 0x4B688B, 'button');
        this.addType('iconButton', 40, 40, 0x4B688B);
        this.addType('toolbar', 480, 50, 0x051C38);
        this.addType('list', 480, 380, 0x4B688B);
        this.addType('item', 470, 50, 0x4B688B, 'key');
        this.addType('inputItem', 470, 50, 0x4B688B, 'key');
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

        if (!this[type.type]) alert('Type Missing: ' + type.type)

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
        g2.position.set(component.x, component.y);
        g2.endFill();
        if (component.text) {
            const style = new PIXI.TextStyle(this.style);
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
        } else if (component['type'] === 'list') {
            this.addToProperyList(<Panel>component, newSprite);
        }
    }
    addToIconBar(component: PIXI.Container, sprite) {
        this.iconButton.text = '';
        let button = this.getGraphics(this.iconButton);
        button.addChild(sprite);
        sprite.position.set(5, 5)
        let newSprite = component.addChild(button);
        let count = component.children.length;

        newSprite.position.set((newSprite.x + 45) * count, newSprite.y + 5);
    }
    addToProperyList(component: Panel, keys) {
        let count = 0;
        let panels = [];
        let panel = this.copyContainer(component);
        for (let key of Object.keys(keys)) {
            count += 1;
            if (count % 7 == 0) {
                count = 1;
                component.addChild(panel);
                panels.push(panel);
                panel = this.copyContainer(component);
            }
            let item = this.addToInputItem(key, keys[key])
            panel.addChild(item);
            item.position.set(item.x, (item.y + 55) * count);
        }
        panels.push(panel);
        component.addChild(panel);
        component.panels = panels;
        let xButton = this.addToButton(component, 'X');
        xButton.position.set(component.x + component.width - 55, component.y - 100);
        xButton.interactive = true;
        xButton.on('pointerup', () => {
            this.events.publish('SPRITE_NAME_DELETE', keys.name);
        });
        if (component.panels.length > 0) {
            let lButton = this.addToButton(component, '<');
            let rButton = this.addToButton(component, '>');
            rButton.position.set(xButton.x - 55, xButton.y);
            lButton.position.set(rButton.x - 55, rButton.y);
            rButton.interactive = true;
            rButton.on('pointerup', () => {
                if (component.panels.length-1 > component.currentPanel  ) {
                    component.panels[component.currentPanel].visible = false;
                    component.currentPanel++;
                    component.panels[component.currentPanel].visible = true;
                }
            });
            lButton.interactive = true;
            lButton.on('pointerup', () => {
                if (0 < component.currentPanel) {
                    component.panels[component.currentPanel].visible = false;
                    component.currentPanel--;
                    component.panels[component.currentPanel].visible = true;
                }
            });
        }
        component.currentPanel = 0
        component.panels[component.currentPanel].visible = true;
        
    }
    addToButton(component, char) {
        let lButtonType = Object.assign({}, this.iconButton);
        lButtonType.text = char;
        let lButton = this.getGraphics(lButtonType);
        component.addChild(lButton);
        return lButton;
    }
    addToInputItem(key, value): PIXI.Container {
        let item = Object.assign({}, this.inputItem);
        item.text = key + ' : ';
        let newItem = this.getGraphics(item);
        let textWidth = (<PIXI.Graphics>newItem.getChildAt(0)).width;
        let input = new PixiTextInput(value, this.style, false, false);
        input.width = item.width - textWidth - 20;
        let newGraphic = newItem.addChild(input);
        newGraphic.position.set(textWidth, newItem.y + 2);
        return newItem;
    }
    copyContainer(c1): PIXI.Container {
        const returnContainer = new PIXI.Container();
        returnContainer.x = c1.x;
        returnContainer.x = c1.x;
        returnContainer.width = c1.width;
        returnContainer.height = c1.height;
        returnContainer.visible = false;
        return returnContainer
    }
}