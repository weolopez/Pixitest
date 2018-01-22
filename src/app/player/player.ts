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
    y: number;
    vy?: number;
    mass?: number;
    interactive: boolean;
    say?: string;
}
export class Player {
    sprite = <SpriteObject>{
        filename: '',
        x: 150,
        N: 1,
        y: 150,
        vx: 0,
        vy: 0,
        mass: .1,
        name: '',
        interactive: true
    };
    spriteKeys = <SpriteObject>{
        filename: 'jet',
        name: 'blobSprite',
        width: 32,
        height: 32,
        mass: .1
    };

    window: SpriteObject;
    playerSprite: SpriteObject;
    text: PIXI.Text;
    hit: boolean;
    map: any;
    stuff: any;
    sx: number;
    sy: number;
    constructor(events: Events) {
        const me = this;
        events.subscribe('GAME_LOADED', (game: PixiService) => {
            me.map = game.ourMap;
            me.stuff = game.stuff;
            me.window = me.addSprite(game.ourMap, me.sprite);
            me.playerSprite = me.addSprite(me.window, me.spriteKeys)
            me.playerSprite.anchor.set(.5);

            events.publish('WINDOW_ADDED', me.window);
            events.publish('SPRITE_ADDED', me.playerSprite);
        });

        events.subscribe('SPRITE_ADD', (spriteObject: SpriteObject) => {
            // let me = this;
            // let sprite = me.addSprite(me.map, spriteObject);
            events.publish('SPRITE_ADD_COLLIDABLE', spriteObject);
        });

        events.subscribe('TICK', (game: PixiService) => {
            const p = <SpriteObject>me.window;
            if (p.N-- < 0) { return; }
            let x = me.playerSprite.x;
            let y = me.playerSprite.y;
            me.playerSprite.x = Math.floor(p.x + p.vx);
            me.playerSprite.y = Math.floor(p.y + p.vy);
            let hit = game.canMove(me.playerSprite);
            if (!hit) {
                me.playerSprite.say = 'hit: ' + hit;
                events.publish('MOVED_PLAYER', game);
                p.x = me.playerSprite.x;
                p.y = me.playerSprite.y;
            }
            me.playerSprite.x = x;
            me.playerSprite.y = y;

        });
        events.subscribe('MOVED_PLAYER', (game: PixiService) => {
            const p = me.window;
            game.stage.pivot.x = (me.window.x - window.innerWidth / 2);
            me.sx = me.window.x - game.stage.pivot.x;
        
            game.stage.pivot.y = (me.window.y - window.innerHeight / 2);
            me.sy = me.window.y - game.stage.pivot.y;
        });

        events.subscribe('MOUSE_MOVED', point =>
            this.mouseMoved(point, me));
    }
    addSprite(parent, spriteObject: SpriteObject) {
        const me = parent;
        const TEXTURE = PIXI.utils.TextureCache[spriteObject.filename];
        const sprite = <SpriteObject>new PIXI.Sprite(TEXTURE);

        for (const key of Object.keys(spriteObject)) {
            sprite[key] = spriteObject[key];
        }
        sprite['keys'] = spriteObject;
        parent.addChild(sprite);

        return sprite;
    }

    mouseMoved(point: PIXI.Point, me) {
        const sprite = me.window;

        const deltaX = point.x - me.sx;
        const deltaY = point.y - me.sy;

        sprite.N = 2*Math.abs((deltaX + deltaY)) / 100;

        let rotation = Math.atan2(deltaY, deltaX);// - 1.5708;
        sprite.vy = Math.sin(rotation);
        sprite.vx = Math.cos(rotation);

        if (sprite.vy > 0) sprite.vy += sprite.N;
        if (sprite.vy < 0) sprite.vy -= sprite.N;
        if (sprite.vx > 0) sprite.vx += sprite.N;
        if (sprite.vx < 0) sprite.vx -= sprite.N;

        // if (rotation > Math.PI / 2) {
            rotation = (rotation - (Math.PI / 2)) - (Math.PI / 2);
        // }
        // if (rotation < -Math.PI / 2) {
        //     rotation = (Math.PI / 2) + (rotation + (Math.PI / 2)); //  - (Math.PI / 2)) ;
        // }
        me.playerSprite.rotation = rotation;
        sprite.N = 1;
    }
}
