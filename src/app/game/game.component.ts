import { Component, OnInit, NgZone, Input, SimpleChanges } from '@angular/core';
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
  static resources: Array<any>;
  private static _sprites = {};

  @Input('sprites') private static sprites = {};

  static TREASUREID = 'treasure.png';

  gridRef: AngularFireList<any>;
  grid: Observable<any[]>;

  Texture = PIXI.Texture;
  Sprite = PIXI.Sprite;

  dungeon: PIXI.Sprite;
  explorer: PIXI.Sprite;
  door: PIXI.Sprite;

  constructor(public ngZone: NgZone, db: AngularFireDatabase) {
    this.gridRef = db.list('grid/0');
    // Use snapshotChanges().map() to store the key
    this.grid = this.gridRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
    GameComponent.loader = new PIXI.loaders.Loader();
    GameComponent.stage = new PIXI.Container();
    GameComponent.renderer = PIXI.autoDetectRenderer(512, 512);
    //const loader = PIXI.loader.add('../assets/images/treasureHunter.json');

    //setup); .load( this.loader
    GameComponent.loader
      .add('gameResouces', '../assets/images/treasureHunter.json')
      .load((localLoader, resources) => {
        //this.getStage();
        GameComponent.add('dungeon', 'dungeon.png');
        GameComponent.add('door', 'door.png', 32, 0);
        GameComponent.add('blob1', 'blob.png');
        //   GameComponent.stage.addChild(
        //     this.getExplorer(localLoader, GameComponent.stage.height)
        //   );
      });

    GameComponent.loader.onComplete.add(() => {
      // this.ngZone.runOutsideAngular(() => this.gameLoop());
      document.body.appendChild(GameComponent.renderer.view);
      //GameComponent.renderer.render(GameComponent.stage);
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
    GameComponent.blobs.forEach(blob => {
      // Move the blob
      //ERROR should vy be a separate global variable
      // or a movable character type
      blob.y += blob['vy'];

      // Check the blob's screen boundaries
      const blobHitsWall = GameComponent.contain(blob, {
        x: 28,
        y: 10,
        width: 488,
        height: 480
      });

      // If the blob hits the top or bottom of the stage, reverse
      if (blobHitsWall === 'top' || blobHitsWall === 'bottom') {
        blob['vy'] *= -1;
      }
    });
  };

  static gameLoop = function() {
    requestAnimationFrame(GameComponent.gameLoop);
    GameComponent.play();
    // Render the stagestage
    //GameComponent.treasure.x = GameComponent.treasure.x - 10;
    GameComponent.addTreasure();
    GameComponent.renderer.render(GameComponent.stage);
  };
  static addTreasure = function() {
    GameComponent.sprites['blob1'].x = 64;
    GameComponent.sprites['blob1'].y = 64;
  };
  //   const TREASUREID = GameComponent.TREASUREID;
  //   if (!GameComponent.sprites[TREASUREID]) {
  //     GameComponent.add(
  //       TREASUREID,
  //       GameComponent.stage.width -
  //         GameComponent.sprites[TREASUREID].width -
  //         48,
  //       GameComponent.stage.height / 2 -
  //         GameComponent.sprites[TREASUREID].height / 2
  //     );
  //   }
  // };

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
  public static getSprites = function () {
    return GameComponent.sprites;
  };
  getExplorer = function(stageLoader, height: number): PIXI.Sprite {
    // 2. Access the texture using throuhg the loader's `resources`:
    const explorer = new PIXI.Sprite(
      stageLoader.resources['../assets/images/treasureHunter.json'][
        'explorer.png'
      ]
    );
    explorer.x = 68;
    // Center the explorer vertically
    explorer.y = height / 2 - explorer.height / 2;

    return explorer;
  };

  getStage(): PIXI.Container {
    const gameComponent = GameComponent;
    const stageLoader = gameComponent.loader;
    const stage = gameComponent.stage; // new PIXI.Container();

    // 3. Create an optional alias called `id` for all the texture atlas
    // frame id textures.
    const id = stageLoader.resources['../assets/images/treasureHunter.json'];

    // Make the treasure box using the alias
    //const treasure = new PIXI.Sprite(id['treasure.png']);
    // stage.addChild(treasure);

    // Make the treasure box using the alias
    //const treasure = new PIXI.Sprite(id['treasure.png']);
    //stage.addChild(treasure);

    // There are 3 ways to make sprites from textures atlas frames
    // 1. Access the `TextureCache` directly

    // const numberOfBlobs = 2;

    // //  Position the treasure next to the right edge of the canvas
    // treasure.x = stage.width - treasure.width - 48;
    // treasure.y = stage.height / 2 - treasure.height / 2;
    // stage.addChild(treasure);
    // //  Make the exit door
    // const door = new PIXI.Sprite(id['door.png']);
    // door.position.set(32, 0);
    // stage.addChild(door);

    // // Make the blobs
    // const spacing = 48,
    //   xOffset = 150,
    //   speed = 3,
    //   direction = 1;
    // // Make as many blobs as there are `numberOfBlobs`
    // for (let i = 0; i < numberOfBlobs; i++) {
    //   // Make a blob
    //   GameComponent.blobs[i] = new PIXI.Sprite(id['blob.png']);
    //   const x = spacing * i + xOffset;
    //   const y = gameComponent.randomInt(
    //     0,
    //     stage.height - GameComponent.blobs[i].height
    //   );
    //   // Set the blob's position
    //   GameComponent.blobs[i].x = x;
    //   GameComponent.blobs[i].y = y;

    //   //ERROR
    //   GameComponent.blobs[i]['vy'] = speed * direction;

    //   // ERROR should direction be a global varaible
    //   //direction *= -1;

    //   // Add the blob sprite to the stage
    //   stage.addChild(GameComponent.blobs[i]);

    // }
    return stage;
  }

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
