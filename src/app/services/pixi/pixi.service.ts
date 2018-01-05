import { Events } from './../event/event.service';
import * as PIXI from 'pixi.js';
import TileUtilities from 'pixi-tile-utilities';
import { Injectable } from '@angular/core';

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

  constructor(public events: Events) {

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
      .add('assets/images/fantasy.png')
      .load((localLoader, resources: PIXI.loaders.Resource) => {
        this.resources = resources;
       this.ourMap = this.world.makeTiledWorld('assets/images/testmap.json', 'assets/images/fantasy.png');
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
}
