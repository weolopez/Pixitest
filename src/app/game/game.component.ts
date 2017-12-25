import { Events } from './../services/event/event.service';
import { Component, OnInit, NgZone, Input, SimpleChanges, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import * as PIXI from 'pixi.js';
import TileUtilities from 'pixi-tile-utilities';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { resource } from 'selenium-webdriver/http';
import { BehaviorComponent } from '../components/behavior/behavior.component';

export interface SpriteObject {
  name: string;
  filename: string;
  x?: number;
  vx?: number;
  y?: number;
  vy?: number;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent {
  
  stage: PIXI.Container;
  renderer: any;

  loader: PIXI.loaders.Loader;
  treasure: PIXI.Sprite;
  resources: PIXI.loaders.Resource;
  world: TileUtilities;
  app: PIXI.Application;
  ourMap: any;

  @Output('init') public init = new EventEmitter<PIXI.loaders.Resource>();
  @ViewChild('gameElement') gameElement: ElementRef;

  constructor(public ngZone: NgZone, public events: Events) {

    this.loader = PIXI.loader;
    this.app = new PIXI.Application(512, 512);
    this.renderer = this.app.renderer;
    this.stage = this.app.stage;
    this.world = new TileUtilities();

    this.loader
      .add('gameResources', 'assets/images/treasureHunter.json')
      .add('assets/images/testmap.json')
      .add('assets/images/fantasy.png')
      .load((localLoader, resources: PIXI.loaders.Resource) => {
        this.resources = resources;
        this.init.emit(resources);
        this.ourMap = this.world.makeTiledWorld('assets/images/testmap.json', 'assets/images/fantasy.png');
        this.stage.addChild(this.ourMap);
        // const sprite: SpriteObject = <SpriteObject>{};
        // sprite.name = 'dungeon';
        // sprite.filename = 'dungeon.png';
        // this.add(sprite);
      });

    this.loader.onComplete.add(() => {
      events.publish('GAME_LOADED', this);
      this.gameElement.nativeElement.appendChild(this.renderer.view);
      this.app.ticker.add(this.play, this);
      this.renderer.render(this.stage);
    });
    events.subscribe('SPRITE_KEYS_UPDATED', sprite => {
      Object.keys(sprite).forEach(key => sprite[key] = sprite.keys[key]);
    });
    events.subscribe('SPRITE_DELETE', sprite => {
      this.stage.removeChild(sprite);
      events.publish('SPRITE_DELETED', sprite);
    });
    events.subscribe('SPRITE_ADD', sprite => {
      if (!this.ourMap) return;
      if (!this.ourMap.getObject('objects').children[sprite]) {
        this.add(sprite);
      }
    })
  }

  contain = function(sprite) {
    const container = {
      x: 28,
      y: 10,
      width: 488,
      height: 480
    };

    let collision = 'none';

    // Left
    if (sprite.x < container.x) {
      sprite.x = container.x;
      collision = 'left';
    }

    // Top
    if (sprite.y < container.y) {
      sprite.y = container.y;
      collision = 'top';
    }

    // Right
    if (sprite.x + sprite.width > container.width) {
      sprite.x = container.width - sprite.width;
      collision = 'right';
    }

    // Bottom
    if (sprite.y + sprite.height > container.height) {
      sprite.y = container.height - sprite.height;
      collision = 'bottom';
    }

    // Return the `collision` value
    return collision;
  };
  play() {
    const game = this;
    if (!game.ourMap) return;
    for (const key of Object.keys(game.ourMap.getObject('objects').children)) {
      const sprite = game.ourMap.getObject('objects').children[key];
      if (sprite.N <= 0 || sprite.N === undefined) {
        continue;
      } else {
        sprite.N -= 1;
      }
      if (sprite.vy) {
        sprite.y += sprite.vy;
      } else {
        continue;
      }
      if (sprite.vx) {
        sprite.x += sprite.vx;
      } else {
        continue;
      }
      const blobHitsWall = game.contain(sprite);
      if (blobHitsWall === 'top' || blobHitsWall === 'bottom') {
        sprite.vy *= -1;
      }
      if (blobHitsWall === 'left' || blobHitsWall === 'right') {
        sprite.vx *= -1;
      }
    }
  };

  randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  add = function(sprite: SpriteObject) {
    const TEXTURE = PIXI.utils.TextureCache[sprite.filename];
    const newSprite = new PIXI.Sprite(TEXTURE);

    for (const key of Object.keys(sprite)) {
      newSprite[key] = sprite[key];
    }
    newSprite['name'] = sprite.name;
    newSprite['keys'] = sprite;
    this.ourMap.getObject('objects').addChild(newSprite);
    
    this.events.publish('SPRITE_ADDED', newSprite);
  };
}
