import { Events } from './../event/event.service';
import * as PIXI from 'pixi.js';
import TileUtilities from 'pixi-tile-utilities';
import { Injectable } from '@angular/core';
import { Bump } from './bump';
import { SpriteObject } from '../../player/player';
import { Container } from '../../pixi/container';

@Injectable()
export class PixiService {

  stage: PIXI.Container;
  renderer: any;

  loader: PIXI.loaders.Loader;
  playerSprite: PIXI.Sprite;
  resources: PIXI.loaders.Resource;
  world: TileUtilities;
  app: PIXI.Application;
  ourMap: any;
  delta: number;
  stuff: Array<PIXI.Sprite> = [];
  bump: any;

  constructor(public events: Events) {
    const me = this;
    this.bump = new Bump();
    this.loader = PIXI.loader;
    this.app = new PIXI.Application(window.innerWidth - 10, window.innerHeight - 10, {
      backgroundColor: 0x000000,
      transparent: false
    });
    this.renderer = this.app.renderer;
    this.stage = this.app.stage;
    this.world = new TileUtilities();
    this.loader
      .add('gameResources', 'assets/images/treasureHunter.json')
      .add('assets/images/testmap.json')
      .add('space', 'assets/images/space.png')
      .add('jet', 'assets/images/jet.png')
      .add('boss', 'assets/images/boss.png')
      .add('alien', 'assets/images/alien.png')
      .add('asteroid', 'assets/images/asteroid.png')
      .add('assets/images/fantasy.png')
      .load((localLoader, resources: PIXI.loaders.Resource) => {
        this.resources = resources;
        let background = new PIXI.Sprite(PIXI.utils.TextureCache["space"]);  // this.world.makeTiledWorld('assets/images/testmap.json', 'assets/images/fantasy.png');
        background.scale.set(4, 4);
        background.position.set(0, 0);
        background.x = -2048;
        background.y = -2048;
        this.stage.addChild(background);

        this.ourMap = this.getWorld(); // this.world.makeTiledWorld('assets/images/testmap.json', 'assets/images/fantasy.png');

        this.addSprite(<SpriteObject>{
          filename: "asteroid",
          width: 32,
          height: 32,
          x: 200, y: 200,
          name: 'grass1'
        });
        this.addSprite(<SpriteObject>{
          filename: "asteroid",
          width: 32,
          height: 32,
          x: 1, y: 1,
          name: 'grass2'
        });
        this.stage.addChild(this.ourMap);
      });

    this.loader.onComplete.add(() => {
      events.publish('GAME_LOADED', this);
      document.body.appendChild(this.renderer.view);
      this.app.ticker.add(this.play, this);
      this.renderer.render(this.stage);
    });

    events.subscribe('WINDOW_ADDED', window => {
      me.playerSprite = window;
  });
     
    events.subscribe('SPRITE_ADD_COLLIDABLE', sprite => me.addSprite(sprite))
    events.subscribe('TICK', (game: PixiService) => me.moveStuff());
  }

  play(delta) {
    this.delta = delta;
    this.events.publish('TICK', this);
  }

  getWorld() {
    let world = new PIXI.Sprite();
    return world;
  }
  canMove(sprite) {
    return this.bump.hit(sprite, this.stuff, false, true, false);
  }
  
  addSprite(spriteObject: SpriteObject) {
    const me = this;
    const TEXTURE = PIXI.utils.TextureCache[spriteObject.filename];
    const sprite = <SpriteObject>new PIXI.Sprite(TEXTURE);

    for (const key of Object.keys(spriteObject)) {
      sprite[key] = spriteObject[key];
    }
    sprite['name'] = spriteObject.name;
    sprite['keys'] = spriteObject;
    sprite.mass = .1;

    this.getRandomAngle(sprite);
    sprite.anchor.set(.5);

    let text = <PIXI.Text>Container.getText('init');
    text.x = text.x - 50;
    text.y = text.y - 30;
    text.style.fontSize = 16;
    sprite.addChild(text);
    me.ourMap.addChild(sprite);
    me.stuff.push(sprite);
    return sprite;
  }
  
  moveStuff() {
    this.stuff.forEach(sprite => this.moveSprite(sprite))
  }
  moveSprite(sprite) {
    let me = this;
    if (sprite.filename === 'asteroid') { 
      sprite.x += sprite.vx * 1;
      sprite.y += sprite.vy * 1;
      return;
    }
    if (sprite.N > 0) {
      sprite.N -= 1;

      this.say(sprite);
      sprite.x += sprite.vx * 1;
      sprite.y += sprite.vy * 1;
      this.canMove(sprite);
    } else {
      let target = me.playerSprite;
      this.goto(target, sprite);
      sprite.N = 100;
    }
  }
  say(sprite) {
    let text = sprite.children[0];
      if (sprite.say) {
        text.text = sprite.say;
        text.alpha = 1;
        sprite.say = undefined;
      }

      if (text.alpha > 0) {
        text.alpha -= .01;
      }
  }  
  goto(target, sprite) {
    if (!target) return;

    const deltaX = target.x - sprite.x;
    const deltaY = target.y - sprite.y;

    let rotation = Math.atan2(deltaY, deltaX);
    sprite.vy = Math.sin(rotation);
    sprite.vx = Math.cos(rotation);

    if (sprite.vy > 0) sprite.vy += sprite.N;
    if (sprite.vy < 0) sprite.vy -= sprite.N;
    if (sprite.vx > 0) sprite.vx += sprite.N;
    if (sprite.vx < 0) sprite.vx -= sprite.N;

    rotation = (rotation - (Math.PI / 2)) - (Math.PI / 2);
    sprite.rotation = rotation;
  }
  getRandomAngle(sprite) {
    sprite.rotation = Math.random() * Math.PI;
    sprite.vy = Math.sin(sprite.rotation);
    sprite.vx = Math.cos(sprite.rotation);
  }
}
