import * as PIXI from 'pixi.js';
import { Events } from '../services/event/event.service';
import { DefaultTheme } from './default-theme';

export interface IContainer {
    color?: number;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    corner?: number;
    margin?: number;
    type?: any;
}
export type ModifyContainer = (c) => Container;
export class Container extends PIXI.Graphics {
    public id?: string;
    public type: any;
    public color: number;
    public corner: number;
    public margin: number;
    public opacity: number;
    public _width: number;
    public _height: number;
    public components: any;
    
    public static events = Events.getInstance();
    constructor() {
        super();
    }
    add(c: Container, p: any, modifyContainer: ModifyContainer) {
        c = Object.assign(c, p);
        c = modifyContainer(c);
        this.addChild(c);
    }
    static init(gui): Container {
        let root: Container;
        if (gui.type) root = <Container>gui.type.init(gui);
        else return new Container();
        if (gui.components) {
            for (let key of Object.keys(gui.components)) {
                gui.components[key] = Container.init(gui.components[key]);
                root.addChild(gui.components[key]);
            };
        }
        return root;
    }

    static initilize(defaults, gui) {
        let container = <Container>Object.assign(new Container(), DefaultTheme.Container);
        let properties = <Container>Object.assign(container, defaults);
        const g2 = <Container>Object.assign(properties, gui);
        g2.lineStyle(2, g2.color, 1);
        g2.beginFill(g2.color, g2.opacity);
        g2.drawRoundedRect(0, 0, g2._width, g2._height, g2.corner);
        g2.position.set(g2.x+g2.margin, g2.y+g2.margin);
        g2.endFill();
        return g2;
    }

    static getText(text): PIXI.Text {
        const style = new PIXI.TextStyle(DefaultTheme.textStyle);
        const basicText = new PIXI.Text(text, style);
        basicText.position.set(DefaultTheme.RowContainer.margin, DefaultTheme.RowContainer.margin);
        return basicText
    }
}