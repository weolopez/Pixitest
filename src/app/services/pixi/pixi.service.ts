import { Events } from './../event/event.service';
import * as PIXI from 'pixi.js';
import TileUtilities from 'pixi-tile-utilities';
import { Injectable } from '@angular/core';
import { Bump } from './bump';

@Injectable()
export class PixiService {

  stage: PIXI.Container;
  renderer: any;

  loader: PIXI.loaders.Loader;
  treasure: PIXI.Sprite;
  resources: PIXI.loaders.Resource;
  world: TileUtilities;
  app: PIXI.Application;
  ourMap: any;
  delta: number;
  stuff: Array<PIXI.Sprite> = [];
  bump: any;

  constructor(public events: Events) {
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

        this.stage.addChild(this.ourMap);

      });

    this.loader.onComplete.add(() => {
      events.publish('GAME_LOADED', this);
      document.body.appendChild(this.renderer.view);
      this.app.ticker.add(this.play, this);
      this.renderer.render(this.stage);
    });
  }

  play(delta) {
    this.delta = delta;
    this.events.publish('TICK', this);
  }

  getWorld() {
    const TEXTURE = PIXI.utils.TextureCache["grass.png"];
    let grass = new PIXI.Sprite(TEXTURE);
    let world = new PIXI.Sprite();
    grass.width = 32;
    grass.height = 32;
    // world.x = -512;
    // world.y = -512;
    world.addChild(grass);
    this.stuff.push(grass); 
    return world;
  }
  canMove(sprite) {
    return this.bump.hit(sprite, this.stuff, true, true, false);

    // return this.stuff.some(stuff => {
    //   console.dir(sprite.x + ':sprite' + sprite.y + ':' + sprite.width + ':' + sprite.height);
    //   console.dir(stuff.x + ':stuff' + stuff.y + ':' + stuff.width + ':' + stuff.height);
    //   return false;
    // })
  }
}
