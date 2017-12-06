import { Component, OnInit, NgZone, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as PIXI from 'pixi.js';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { resource } from 'selenium-webdriver/http';


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
export class GameComponent  {
  static stage: PIXI.Container;
  static renderer: any;
  static loader: PIXI.loaders.Loader;
  static treasure: PIXI.Sprite;
  static resources: PIXI.loaders.Resource;
  public static instance: GameComponent;

  @Input('sprites') public static sprites = {};
  @Output('update') public update = new EventEmitter<any>();
  @Output('init') public init = new EventEmitter<PIXI.loaders.Resource>();


  constructor(public ngZone: NgZone) {
    if (GameComponent.instance) {
      return;
    }
    GameComponent.instance = this;

    GameComponent.loader = new PIXI.loaders.Loader();
    GameComponent.stage = new PIXI.Container();
    GameComponent.renderer = PIXI.autoDetectRenderer(512, 512);
    GameComponent.loader
      .add('gameResources', 'assets/images/treasureHunter.json')
      .load((localLoader, resources: PIXI.loaders.Resource) => {
        GameComponent.resources = resources;
        this.init.emit(resources);
        const sprite: SpriteObject = <SpriteObject>{};
        sprite.name = 'dungeon';
        sprite.filename = 'dungeon.png';
        GameComponent.add(sprite);
        // sprite = <SpriteObject>{};
        // sprite.name = 'door';
        // sprite.filename = 'door.png';
        // sprite.x = 32;
        // sprite.y = 32;
        // GameComponent.add(sprite);
        // sprite = <SpriteObject>{};
        // sprite.name = 'blob1';
        // sprite.filename = 'blob.png';
        // sprite.x = 32;
        // sprite.y = 32;
        // sprite.vy = 3;
        // GameComponent.add(sprite);
      });

    GameComponent.loader.onComplete.add(() => {
      document.body.appendChild(GameComponent.renderer.view);
      GameComponent.gameLoop();
    });
  }

  static contain = function(sprite, container) {
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

  static play = function() {
    const blob = GameComponent.sprites['blob1'];
    if (!blob) return;
    GameComponent.sprites['blob1'].y += GameComponent.sprites['blob1']['vy'];

    // Check the blob's screen boundaries
    const blobHitsWall = GameComponent.contain(GameComponent.sprites['blob1'], {
      x: 28,
      y: 10,
      width: 488,
      height: 480
    });

    // If the blob hits the top or bottom of the stage, reverse
    if (blobHitsWall === 'top' || blobHitsWall === 'bottom') {
      GameComponent.sprites['blob1']['vy'] *= -1;
    }
  };

  static gameLoop = function() {
    requestAnimationFrame(GameComponent.gameLoop);
    GameComponent.play();
    GameComponent.renderer.render(GameComponent.stage);
  };

  static randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  static add = function(sprite: SpriteObject) {
    const TEXTURE = PIXI.utils.TextureCache[sprite.filename];
    GameComponent.sprites[sprite.name] = new PIXI.Sprite(TEXTURE);

    for (const key of Object.keys(sprite)) {
      GameComponent.sprites[sprite.name][key] = sprite[key];
    }
    GameComponent.sprites[sprite.name]['name'] = sprite.name;
    GameComponent.sprites[sprite.name]['keys'] = sprite;
    GameComponent.stage.addChild(GameComponent.sprites[sprite.name]);
    GameComponent.instance.update.emit(GameComponent.sprites[sprite.name]);
  };
}
