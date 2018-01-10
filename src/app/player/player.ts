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
    playerSprite: SpriteObject;
    text: PIXI.Text;
    hit: boolean;
    constructor(events: Events) {
        const player = this;
        events.subscribe('GAME_LOADED', (game: PixiService) => {
            const TEXTURE = PIXI.utils.TextureCache[this.sprite.filename];
            this.player = <SpriteObject> new PIXI.Sprite();
            this.playerSprite = <SpriteObject>new PIXI.Sprite(TEXTURE);

            for (const key of Object.keys(this.sprite)) {
                this.player[key] = this.sprite[key];
            }
            this.player['name'] = this.sprite.name;
            this.player['keys'] = this.sprite;
            
            game.ourMap.addChild(this.player);
            // game.stage.addChild(this.player);
            events.publish('SPRITE_ADDED', this.player);

            events.publish('PLAYER_ADDED', this.player);
            this.player.addChild(this.playerSprite);
            this.text = <PIXI.Text>Container.getText('init');
            this.text.x = this.text.x - 50;
            this.text.y = this.text.y - 30;
            this.text.style.fontSize = 16;
            this.playerSprite.addChild(this.text);

        });
        events.subscribe('TICK', (game: PixiService) => {
            const p = player.player;
            if (p.N-- < 0) { return; }
            let x = p.x;
            let y = p.y;
            p.x = Math.floor(p.x + p.vx);
            p.y = Math.floor(p.y + p.vy);
            let temp = new PIXI.Sprite();
            temp.x = p.x;
            temp.y = p.y
            temp.width = 32;
            temp.height = 32;
            let hit = game.canMove(temp);
            p.say = 'hit: ' + hit;
            if (!hit) {
                events.publish('MOVED_PLAYER', game);
                // player.addGrass(game);
            }
            else {
                 p.x = x;
                 p.y = y;
            }
        });
        events.subscribe('MOVED_PLAYER', (game: PixiService) => {
            const p = player.player;
            game.stage.pivot.x = (p.x - window.innerWidth / 2);
            p.sx = -game.stage.pivot.x + p.x;
            game.stage.pivot.y = (p.y - window.innerHeight / 2);
            p.sy = -game.stage.pivot.y + p.y;
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
        events.subscribe('TICK', (game: PixiService) => {

          //  this.hit = game.world.hitTestTile(this.player, game.ourMap.getObject("walls").data, 0, game.ourMap, "every").hit;

            if (!this.hit) {
                const TEXTURE = PIXI.utils.TextureCache["grass.png"];
                let wall = <SpriteObject>new PIXI.Sprite(TEXTURE);
                wall.y = this.player.y;
                wall.x = this.player.x;
         //       this.player.say = wall.x + ' : ' + wall.y;
         //       game.ourMap.getObject('ground').addChild(wall);
            }
        });
    }
    addGrass(game) {
        const TEXTURE = PIXI.utils.TextureCache["grass.png"];
        let wall = <SpriteObject>new PIXI.Sprite(TEXTURE);
        wall.y = this.player.y;
        wall.x = this.player.x;
        wall.width = 32;
        wall.height = 32;
        this.player.parent.addChild(wall);
        game.stuff.push(wall);
    }
}
