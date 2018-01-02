import * as PIXI from 'pixi.js';
import { RowContainer, IRowContainer, RowItem } from './row-container';
import { IContainer, Container } from './container';
import { Button, IButton } from './button';
import { DefaultTheme } from './default-theme';
import { WindowPIXI } from './window';

export interface IListPanel extends Container {
    panels?: Array<PIXI.Container>;
    panel?: PIXI.Container;
    currentPanel?: number;
}
export type getRowItem = (key, value) => Container;

export class ListPanel extends WindowPIXI {

    panels?: Array<PIXI.Container>;
    panel?: PIXI.Container;
    currentPanel?: number = 0;

    static window = {

        color: 0x051C38,
        y: 50,
        x: -5,
        height: 445,
        visible: false,
        header: <RowContainer>{
            left: [],
            right: <Array<RowItem>>[
                { Button: <IButton>{ text: '>', event: 'PAGE_RIGHT' } },
                { Button: <IButton>{ text: '<', event: 'PAGE_LEFT' } }
            ]
        },
    }
    win: WindowPIXI;
    constructor() {
        super();

    }
    static init(gui): ListPanel {
        const listPanel = new ListPanel();
        listPanel.win = WindowPIXI.init(ListPanel.window);
        listPanel.addChild(listPanel.win);
        return listPanel;
    }

    addObjectProperties(obj: Object, fn: getRowItem) {
        this.win.visible = true;
        let count = 0;
        let component = this;
        let panels = [];
        let panel = Container.init({});
        let rowCount = Math.ceil(this.height / 55)-2;
        for (let key of Object.keys(obj)) {
            count += 1;
            if (count % rowCount == 0) {
                count = 1;
                panels.push(panel);
                panel = Container.init({});
            }
            panel.add(fn(key, obj[key]), {}, (c) => {
                c.position.set(c.x, (c.y + 53) * count);
                return c;
            });
        }
        panels.push(panel);
        Container.events.subscribe('PAGE_RIGHT', (str) => {
            if (component.panels.length - 1 > component.currentPanel) {
                component.win.removeChildAt(1);
                component.currentPanel++;
                component.win.addChild(component.panels[component.currentPanel]);
            }
        });

        Container.events.subscribe('PAGE_LEFT', (str) => {
            if (0 < component.currentPanel) {
                component.win.removeChildAt(1);
                component.currentPanel--;
                component.win.addChild(component.panels[component.currentPanel]);
            }
        });
        component.panels = panels;
        this.win.addChild(panels[this.currentPanel]);
    }
}