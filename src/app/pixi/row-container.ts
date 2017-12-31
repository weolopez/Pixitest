import * as PIXI from 'pixi.js';
import { Events } from '../services/event/event.service';
import { WindowPIXI } from './window';
import { Container, IContainer } from './container';
import { DefaultTheme } from './default-theme';
import { Button, IButton } from './button';
import { PixiTextInput } from './input';

export interface RowItem {
    text?: string;
    Button?: IButton;
    input?: string;
}
export interface IRowContainer extends IContainer {
    left?: Array<RowItem>;
    right?: Array<RowItem>;
}
export class RowContainer extends Container {

    public left?: Array<RowItem>=[];
    public right?: Array<RowItem>=[];

    constructor() {
        super();
    }
    static init(gui: IRowContainer): RowContainer {
        let row = <RowContainer>this.initilize(DefaultTheme.RowContainer , gui);
        if (row.left) row.addChild(RowContainer.add(row, 'left')); 
        if (row.right.length > 0)row.addChild(RowContainer.add(row, 'right')); 
        row.position.set(0, 0);
        return row;
    }
    static add(row, direction): PIXI.Graphics {
        let container = new PIXI.Graphics();
        let x = 5;
        let parent = row.left;
        if (direction === 'right') {
            parent = row.right;
            x = row.width-5;
        }
        parent.forEach(item => {
            const button = RowContainer.getItem(item);
            container.addChild(button);
            if (direction === 'right') {
                button.x = x - button.width;
                x -= button.width+5;
            } else {
                button.x = x;
                x += button.width+5;
            }
        });
        return container;
    }
    static getItem(item) {
        if (Object.keys(item)[0] === 'text') {
            return Container.getText(item.text);
        } else if (Object.keys(item)[0] === 'Button') {
            return Button.init(item.Button);
        } else if (Object.keys(item)[0] === 'input') {
            let text = new PixiTextInput(item.input, DefaultTheme.textStyle, false, false); 
            text.y = 7;
            return text;
        }
        
    }
}