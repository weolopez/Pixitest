import { Component, OnInit, NgZone, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as PIXI from 'pixi.js';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnChanges {
  static stage: PIXI.Container;
  static renderer: any;
  static blobs: Array<PIXI.Sprite> = [];
  static loader: PIXI.loaders.Loader;
  static treasure: PIXI.Sprite;
  static resources: PIXI.loaders.Resource;
  static TREASUREID = 'treasure.png';

  @Input('sprites') public static sprites = {};
  @Output('update') public update = new EventEmitter<any>();

  gridRef: AngularFireList<any>;
  grid: Observable<any[]>;
  spriteRef: AngularFireList<any>;
  spriteObservable: Observable<any[]>;

  Texture = PIXI.Texture;
  Sprite = PIXI.Sprite;

  dungeon: PIXI.Sprite;
  explorer: PIXI.Sprite;
  door: PIXI.Sprite;

  constructor(public ngZone: NgZone, db: AngularFireDatabase) {
    this.gridRef = db.list('grid/0');
    this.grid = this.gridRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

    this.spriteRef = db.list('sprites');
    this.spriteObservable = this.spriteRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

    GameComponent.loader = new PIXI.loaders.Loader();
    GameComponent.stage = new PIXI.Container();
    GameComponent.renderer = PIXI.autoDetectRenderer(512, 512);
    GameComponent.loader
      .add('gameResouces', '../assets/images/treasureHunter.json')
      .load((localLoader, resources: PIXI.loaders.Resource) => {
        GameComponent.resources = resources;
        GameComponent.add('dungeon', 'dungeon.png');
        GameComponent.add('door', 'door.png', 32, 0);
        GameComponent.add('blob1', 'blob.png');
        GameComponent.sprites['blob1']['vy'] = 3;
        this.update.emit(GameComponent.sprites);
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
    const blob = GameComponent.sprites['blobs1'];

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

  static add = function(name: string, image: string, X?: number, Y?: number) {
    const TEXTURE = PIXI.utils.TextureCache[image];
    GameComponent.sprites[name] = new PIXI.Sprite(TEXTURE);
    GameComponent.sprites[name].name = name;
    if (X !== undefined && Y !== undefined) {
      GameComponent.sprites[name].position.set(X, Y);
    }
    //  = SPRITE;
    GameComponent.stage.addChild(GameComponent.sprites[name]);
  };

  public static getSprites = function() {
    return GameComponent.sprites;
  };

  ngOnChanges(changes: SimpleChanges): void {
    console.dir(changes);
  }

  init(grid) {
    // this.gridRef.push(this.grid);
    this.gridRef.set('0', grid);
  }

  addItem(newName: string) {
    this.gridRef.push({ text: newName });
  }

  updateItem(key: string, newText: string) {
    this.gridRef.update(key, { text: newText });
  }
  deleteItem(key: string) {
    this.gridRef.remove(key);
  }
  deleteEverything() {
    this.gridRef.remove();
  }
}
