import * as PIXI from 'pixi.js';
import { Events } from '../services/event/event.service';
import { RowContainer, RowItem } from './row-container';
import { Container, IContainer } from './container';
import { DefaultTheme } from './default-theme';

export interface IWindow extends IContainer {
    header?: RowContainer;
}
export class WindowPIXI extends Container {
    header: RowContainer;

    constructor() {
        super();
    }

    static init(gui?: IWindow): WindowPIXI {
        const header = gui.header;
        const window = <WindowPIXI>this.initilize(DefaultTheme.Window, gui);
        window.interactive = true;

        window.on('pointerdown', (event) => {
      //      event.preventDefault();
        });

        if (header) window.addChild(RowContainer.init(header));
        return window;
    }
}