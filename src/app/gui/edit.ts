import { Events } from "../services/event/event.service";
import * as PIXI from 'pixi.js';
import { GameComponent } from "../game/game.component";
import { WindowPIXI, IWindow } from "../pixi/window";
import { RowContainer, RowItem, IRowContainer } from "../pixi/row-container";
import { IButton, Button } from "../pixi/button";
import { Container } from "../pixi/container";
import { ListPanel } from "../pixi/list-panel";
import { PixiTextInput } from "../pixi/input";
import { DefaultTheme } from "../pixi/default-theme";

export interface ISprites extends PIXI.Sprite {
    keys: Array<any>;
}

export class Edit {
    public showSidePanel: boolean;
    public windowPIXI = <IWindow>{
        id: 'edit',
        type: WindowPIXI,
        visible: false,
        header: <RowContainer>{
            left: <Array<RowItem>>[,
                { Button: <IButton>{ text: '=', event: 'MENU_OPEN' } },
                { text: 'Edit Sprites' }
            ],
            right: <Array<RowItem>>[
                { Button: <IButton>{ text: 'X', event: 'WINDOW_CLOSE' } }
            ]
        },
        components: {
            editPanel: {
                type: ListPanel,
            },
            sidePanel: {
                type: WindowPIXI,
                width: 250,
                height: 445,
                color: 0x748BA7,
                opacity: 1,
                y: 50,
                x: -5,
                corner: 0,
                visible: false,
                header: <RowContainer>{
                    width: 250,
                    //  color: 0x051C38,
                    left: <Array<RowItem>>[
                        { text: 'Sprites' }
                    ],
                    right: <Array<RowItem>>[
                        { Button: <IButton>{ text: '+', event: 'ADD_SPRITE' } }
                    ]
                },
                components: {
                    spriteListPanel: {
                        type: WindowPIXI,
                        width: 250,
                        height: 390,
                        y: 50,
                        x: -5,
                        corner: 0,
                    }
                }
            },
        }
    }
    public win: Container;
    private sprites = <Array<PIXI.Sprite>>[];
    constructor(private events: Events) {
        events.subscribe('GAME_LOADED', (game: GameComponent) => {
            this.win = Container.init(this.windowPIXI);
            events.subscribe('SPRITE_ADDED', sprite => {
                this.sprites.push(sprite)
            });
            Container.events.subscribe('WINDOW_CLOSE', button => this.win.visible = false);
            Container.events.subscribe('MENU_OPEN', button => this.openMenu(this.win.components.sidePanel));
            game.stage.addChild(this.win);


        });
        Container.events.subscribe('test', e => {
            this.editSpriteByName(e.children[0].text);
            this.win.components.sidePanel.visible = false;
        }
        );
        events.subscribe('o', game => {
            this.win.visible = !this.win.visible;
            if (this.win.visible) this.editSpriteByName('blob');
        });
    }

    editSpriteByName(spriteName) {
        let sprite = <ISprites>this.sprites.find(s => s.name === spriteName);
        let editPanel = <ListPanel>this.win.components.editPanel;
        editPanel.addObjectProperties(sprite.keys, Edit.createKeyContainer);
    }
    openMenu(sidePanel) {
        sidePanel.visible = !sidePanel.visible;
        if (!sidePanel.visible) return;
        sidePanel.panel = Container.init({});
        this.sprites.forEach(sprite => Edit.addSprite(sidePanel, sprite));

    }
    static editSprite(editPanel, sprite) {

    }
    static addSprite(sidePanel, sprite) {
        // if (!sidePanel.panel)
        //     sidePanel.panel = Container.init({});
        const btn = Button.init({ text: sprite.name, event: 'test', width: 220 });
        sidePanel.panel.addChild(btn);
        btn.y += 55 * sidePanel.panel.children.length;
        sidePanel.addChild(sidePanel.panel);
    }


    static addToInputItem(key, value): PIXI.Container {
        let newItem = Container.init({ text: 'textWidth' });
        // let item = Object.assign({}, this.inputItem);
        // item.text = key + ' : ';
        // let newItem = this.getGraphics(item);
        // let textWidth = (<PIXI.Graphics>newItem.getChildAt(0)).width;
        // let input = new PixiTextInput(value, this.style, false, false);
        // input.width = item.width - textWidth - 20;
        // let newGraphic = newItem.addChild(input);
        // newGraphic.position.set(textWidth, newItem.y + 2);
        return newItem;
    }

    static createKeyContainer(key, value): RowContainer {
        let item = RowContainer.init({
            left: [{ text: key }],
            right: [{input: value}]
        });
        return item;
    }
}