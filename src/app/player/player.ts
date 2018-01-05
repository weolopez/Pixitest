import { GameComponent, SpriteObject } from './../game/game.component';
import { Events } from '../services/event/event.service';
import { PixiService } from '../services/pixi/pixi.service';
import { Container } from '../pixi/container';
import { PixiTextInput } from '../pixi/input';

export class Player {
    sprite = <SpriteObject> {
        filename: 'blob.png',
        x: 100,
        N: 1,
        y: 100,
        vx: 0,
        vy: 0,
        name: 'blob',
        interactive: true
    };
    say: any;
    player: SpriteObject;
    constructor(events: Events) {
        const player = this;
        events.subscribe('GAME_LOADED', (game: PixiService) => {
            const TEXTURE = PIXI.utils.TextureCache[this.sprite.filename];
            this.player = <SpriteObject>new PIXI.Sprite(TEXTURE);

            for (const key of Object.keys(this.sprite)) {
                this.player[key] = this.sprite[key];
            }
            this.player['name'] = this.sprite.name;
            this.player['keys'] = this.sprite;
            game.ourMap.getObject('objects').addChild(this.player);
            // game.stage.addChild(this.player);
            events.publish('SPRITE_ADDED', this.player);
            const text = Container.getText('test');
            text.x = text.x - 50;
            text.y = text.y - 45;
            text.style.fontSize = 16;
            this.player.addChild(text);

        });
        events.subscribe('TICK', (game: PixiService) => {
            const _ = player;
             if (_.player.N-- < 0 ) { return; }
            _.player.x = _.player.x + _.player.vx;
            _.player.y = _.player.y + _.player.vy;
            game.stage.pivot.x = (_.player.position.x - window.innerWidth / 2);
            _.player.sx = -game.stage.pivot.x + _.player.x;
            game.stage.pivot.y = (_.player.position.y - window.innerHeight / 2);
            _.player.sy = -game.stage.pivot.y + _.player.y;
        });
        events.subscribe('TICK', (game: PixiService) => {
            const text = <PixiTextInput> player.player.children[0];
            if (text.parent['say']) {
                text.setText(text.parent['say']);
                text.alpha = 1;
                text.parent['say'] = undefined;
            }

            if (text.alpha > 0) {
                text.alpha -= .01;
            }
        });
    }
}
