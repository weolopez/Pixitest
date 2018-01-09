import { Events } from '../services/event/event.service';
import { PixiService } from '../services/pixi/pixi.service';
import { Container } from '../pixi/container';
import { PixiTextInput } from '../pixi/input';

export class Screen extends PIXI.Container{
    static _screen = new PIXI.Sprite();
    constructor(events: Events) {
        super();

        // const screen = this;
        // events.subscribe('GAME_LOADED', (game: PixiService) => {
        //     game.screen = Screen._screen;
        //     game.stage.addChild(Screen._screen);
        // });
        // events.subscribe('MOVED_PLAYER', (game: PixiService) => {
        //     game.stage.pivot.x = (p.position.x - window.innerWidth / 2);
        //     p.sx = -game.stage.pivot.x + p.x;
        //     game.stage.pivot.y = (p.position.y - window.innerHeight / 2);
        //     p.sy = -game.stage.pivot.y + p.y;
        // });
    }
}
