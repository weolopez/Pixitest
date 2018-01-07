import { Events } from '../services/event/event.service';
import { PixiService } from '../services/pixi/pixi.service';
import { Container } from '../pixi/container';
import { PixiTextInput } from '../pixi/input';
export interface SpriteObject extends PIXI.Sprite {
    name: string;
    filename: string;
    x: number;
    N?: number;
    vx?: number;
    sx?: number;
    y: number;
    vy?: number;
    sy?: number;
    interactive: boolean;
    say?: string;
}
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
    player: SpriteObject;
    text: PIXI.Text;
    constructor(events: Events) {
        const player = this;
        events.subscribe('GAME_LOADED', (game: PixiService) => {
            const TEXTURE = PIXI.utils.TextureCache[this.sprite.filename];
            this.player = <SpriteObject> new PIXI.Sprite();
            const playerSprite = <SpriteObject>new PIXI.Sprite(TEXTURE);

            for (const key of Object.keys(this.sprite)) {
                this.player[key] = this.sprite[key];
            }
            this.player['name'] = this.sprite.name;
            this.player['keys'] = this.sprite;
            
            game.ourMap.getObject('objects').addChild(this.player);
            // game.stage.addChild(this.player);
            events.publish('SPRITE_ADDED', this.player);

            events.publish('PLAYER_ADDED', this.player);
            this.player.addChild(playerSprite);
            this.text = <PIXI.Text>Container.getText('init');
            this.text.x = this.text.x - 50;
            this.text.y = this.text.y - 30;
            this.text.style.fontSize = 16;
            playerSprite.addChild(this.text);

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
            if (player.player.say) {
                player.text.text = player.player.say;
                player.text.alpha = 1;
                player.player.say = undefined;
            }

            if (player.text.alpha > 0) {
                player.text.alpha -= .01;
            }
        });
    }
}
