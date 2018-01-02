import * as PIXI from 'pixi.js';
import { Events } from '../services/event/event.service';
import { WindowPIXI } from './window';
import { Container, IContainer } from './container';
import { DefaultTheme } from './default-theme';

export interface IButton extends IContainer {
    event: string;
    text: string;
}
export class Button extends Container {
    event: string;
    text: string;
    constructor() {
        super();
    }

    static init(gui: IButton): Button {
        let button = <Button>this.initilize(DefaultTheme.Button, gui);
        
        if (gui.text) {
            let text = Container.getText(gui.text);
            button.addChild(text);
            text.x = 7;
            text.y = 0;
        }

        if (gui.event) {
            button.interactive = true;
            button.on('pointerup', () => {
                Container.events.publish(gui.event, button);
            });
        }

        return button;
    }
}