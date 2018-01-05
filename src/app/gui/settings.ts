import { Events } from '../services/event/event.service';
import * as PIXI from 'pixi.js';
import { GameComponent } from '../game/game.component';
import { WindowPIXI, IWindow } from '../pixi/window';
import { RowContainer, RowItem } from '../pixi/row-container';
import { IButton } from '../pixi/button';
import { Container } from '../pixi/container';

export class Settings {
    public windowPIXI = <IWindow> {
        id: 'settings',
        header: <RowContainer>{
            left: <Array<RowItem>>[
                { text: 'Settings' }
            ],
            right: <Array<RowItem>>[
                { Button: <IButton> { text: 'X', event: 'WINDOW_CLOSE' } }
            ]
        }
    };
    public win: WindowPIXI;
    constructor(private events: Events) {
        events.subscribe('GAME_LOADED', (game: GameComponent) => {
            this.win = WindowPIXI.init(this.windowPIXI);
            Container.events.subscribe('WINDOW_CLOSE', button => this.win.visible = false);
            game.stage.addChild(this.win);
            this.win.visible = false;
        });

        events.subscribe('p', game =>
            this.win.visible = !this.win.visible);
    }


}
