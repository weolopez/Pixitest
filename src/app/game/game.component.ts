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
  static stage: PIXI.Container;
  static renderer: any;
  static loader: PIXI.loaders.Loader;
  static treasure: PIXI.Sprite;
  static resources: PIXI.loaders.Resource;
  static world: TileUtilities;
  static app: PIXI.Application;
  public static instance: GameComponent;

  @Input('sprites') public static sprites = {};
  @Output('update') public update = new EventEmitter<any>();
  @Output('init') public init = new EventEmitter<PIXI.loaders.Resource>();
  @ViewChild('gameElement') gameElement: ElementRef;

  constructor(public ngZone: NgZone, public events: Events) {
    if (GameComponent.instance) {
      return;
    }
    GameComponent.instance = this;

    GameComponent.loader = PIXI.loader;
    GameComponent.app = new PIXI.Application(512, 512);
    GameComponent.renderer = GameComponent.app.renderer;
    GameComponent.stage = GameComponent.app.stage;
    GameComponent.world = new TileUtilities();
    GameComponent.loader
      .add('gameResources', 'assets/images/treasureHunter.json')
      .add('assets/images/testmap.json')
      .add('assets/images/fantasy.png')
      .load((localLoader, resources: PIXI.loaders.Resource) => {
        GameComponent.resources = resources;
        this.init.emit(resources);
        const ourMap = GameComponent.world.makeTiledWorld('assets/images/testmap.json', 'assets/images/fantasy.png');
        GameComponent.stage.addChild(ourMap);
        const sprite: SpriteObject = <SpriteObject>{};
        sprite.name = 'dungeon';
        sprite.filename = 'dungeon.png';
        GameComponent.add(sprite);
      });

    GameComponent.loader.onComplete.add(() => {
      this.gameElement.nativeElement.appendChild(GameComponent.renderer.view);
      GameComponent.app.ticker.add(GameComponent.play);
      GameComponent.gameLoop();
    });

    events.subscribe('SPRITE_DELETE', sprite => {
      GameComponent.stage.removeChild(sprite);
      events.publish('SPRITE_DELETED', sprite);
    });
  }

  static contain = function(sprite) {
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
  static play = function() {
    for (const key of Object.keys(GameComponent.sprites)) {
      const sprite = GameComponent.sprites[key];
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
      const blobHitsWall = GameComponent.contain(sprite);
      if (blobHitsWall === 'top' || blobHitsWall === 'bottom') {
        sprite.vy *= -1;
      }
      if (blobHitsWall === 'left' || blobHitsWall === 'right') {
        sprite.vx *= -1;
      }
    }
  };

  static gameLoop = function() {
    requestAnimationFrame(GameComponent.gameLoop);
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

    GameComponent.instance.events.publish('SPRITE_ADDED', GameComponent.sprites[sprite.name]);
  };
}
