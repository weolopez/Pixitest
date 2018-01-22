import { Events } from "../services/event/event.service";
import * as PIXI from 'pixi.js';
import { WindowPIXI, IWindow } from "../pixi/window";
import { RowContainer, RowItem, IRowContainer } from "../pixi/row-container";
import { IButton, Button } from "../pixi/button";
import { Container, ContainerChange } from "../pixi/container";
import { ListPanel } from "../pixi/list-panel";
import { PixiTextInput } from "../pixi/input";
import { DefaultTheme } from "../pixi/default-theme";

export interface ISprite extends PIXI.Sprite {
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
                type: ListPanel
            },
            sidePanel: {
                type: WindowPIXI,
                width: 250,
                height: 445,
                //   color: 0x748BA7,
                opacity: 0,
                y: 45,
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
    private selectedSpriteName: string;
    private selectedSprite: ISprite;
    constructor(private events: Events) {
        let me = this;

        events.subscribe('SPRITE_ADDED', sprite => {
            me.sprites.push(sprite)
        });
        events.subscribe('WINDOW_ADDED', (game_window: Container) => {
            me.win = Container.init(me.windowPIXI);
            me.win.x = -window.innerWidth / 2;
            me.win.y = -window.innerHeight / 2;
            me.events.subscribe('WINDOW_CLOSE', button => {
                me.win.visible = false
            });
            me.events.subscribe('MENU_OPEN', button => {
                me.openMenu(me.win.components.sidePanel)
            });
            game_window.addChild(me.win);
        });
        events.subscribe('SELECTD_SPRITE', e => {
            me.selectedSpriteName = e.children[0].text;
            me.editSpriteByName(me.selectedSpriteName);
            me.win.components.sidePanel.visible = false;
        });
        events.subscribe('SELECTED_SPRITE', e => {
            me.win.visible = true;
            me.selectedSpriteName = e.name;
            me.editSpriteByName(me.selectedSpriteName);
            me.win.components.sidePanel.visible = false;
        });
        events.subscribe('o', game => {
            me.win.visible = !me.win.visible;
        });
        events.subscribe('SPRITE_KEY', obj => {
            me.selectedSprite.keys[obj.key] = obj.value;
            if (me.selectedSprite.keys)
                me.events.publish('SPRITE_KEYS_UPDATED', me.selectedSprite);
        });
    }

    editSpriteByName(spriteName) {
        this.selectedSprite = <ISprite>this.sprites.find(s => s.name === spriteName);
        let editPanel = <ListPanel>this.win.components.editPanel;
        editPanel.addObjectProperties(this.selectedSprite.keys, Edit.createKeyContainer);
    }
    openMenu(sidePanel) {
        let me = this;
        sidePanel.visible = !sidePanel.visible;
        if (!sidePanel.visible) return;
        sidePanel.panel = Container.init({});
        this.sprites.forEach(sprite => Edit.addSprite(sidePanel, sprite));
    }
    static addSprite(sidePanel, sprite) {
        const btn = Button.init({ text: sprite.name, event: 'SELECTD_SPRITE', width: 220 });
        sidePanel.panel.addChild(btn);
        btn.y += 55 * sidePanel.panel.children.length;
        sidePanel.addChild(sidePanel.panel);
    }
    static createKeyContainer(key, value): RowContainer {
        let item = RowContainer.init({
            left: [{ text: key }],
            right: [{
                input: {
                    value: value, onChange: <ContainerChange>{
                        type: 'SPRITE_KEY',
                        value: { key: key, value: value }
                    }
                }
            }]
        });
        return item;
    }
}