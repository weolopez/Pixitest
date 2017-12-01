import { Component, OnInit, NgZone } from '@angular/core';
import * as PIXI from 'pixi.js';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  gridRef: AngularFireList<any>;
  grid: Observable<any[]>;
  
  loader = PIXI.loader;
  TextureCache = PIXI.utils.TextureCache;
  Texture = PIXI.Texture;
  Sprite = PIXI.Sprite;
  stage: PIXI.Container;
  renderer: any;
  
  dungeon: PIXI.Sprite;
  explorer: PIXI.Sprite;
  treasure: PIXI.Sprite;
  door: PIXI.Sprite;
  state = "play"; 
  blobs = [];

  constructor(public ngZone: NgZone, db: AngularFireDatabase) {
    this.gridRef = db.list('grid/0');
    // Use snapshotChanges().map() to store the key
    this.grid = this.gridRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }

  ngOnInit() {
    this.setupPixie();


  }

  setupPixie(){
    this.stage = new PIXI.Container(), this.renderer = PIXI.autoDetectRenderer(512, 512);
    document.body.appendChild(this.renderer.view);
    this.loader.add("../assets/images/treasureHunter.json").load(this.setupResources);

  }

  setupResources() {

    var numberOfBlobs = 2

    //There are 3 ways to make sprites from textures atlas frames
    //1. Access the `TextureCache` directly
    var dungeonTexture = this.TextureCache["dungeon.png"];
    this.dungeon = new this.Sprite(dungeonTexture);
    this.stage.addChild(this.dungeon);
    //2. Access the texture using throuhg the loader's `resources`:
    this.explorer = new this.Sprite(
      this.loader.resources["../assets/images/treasureHunter.json"].textures["explorer.png"]
    );
    this.explorer.x = 68;
    //Center the explorer vertically
    this.explorer.y = this.stage.height / 2 - this.explorer.height / 2;
    this.stage.addChild(this.explorer);
    //3. Create an optional alias called `id` for all the texture atlas 
    //frame id textures.
    var id = PIXI.loader.resources["../assets/images/treasureHunter.json"].textures; 
    
    //Make the treasure box using the alias
    this.treasure = new this.Sprite(id["treasure.png"]);
    this.stage.addChild(this.treasure);
    //Position the treasure next to the right edge of the canvas
    this.treasure.x = this.stage.width - this.treasure.width - 48;
    this.treasure.y = this.stage.height / 2 - this.treasure.height / 2;
    this.stage.addChild(this.treasure);
    //Make the exit door
    this.door = new this.Sprite(id["door.png"]); 
    this.door.position.set(32, 0);
    this.stage.addChild(this.door);
    //Make the blobs
    var spacing = 48,
        xOffset = 150,
        speed = 3,
        direction = 1;
    //Make as many blobs as there are `numberOfBlobs`
    for (var i = 0; i < numberOfBlobs; i++) {
      //Make a blob
      this.blobs[i] = new this.Sprite(id["blob.png"]);
      var x = spacing * i + xOffset;
      var y = this.randomInt(0, this.stage.height - this.blobs[i].height);
      //Set the blob's position
      this.blobs[i].x = x;
      this.blobs[i].y = y;
      this.blobs[i].vy = speed * direction;
      direction *= -1;
      //Add the blob sprite to the stage
      this.stage.addChild(this.blobs[i]);
    }
    this.ngZone.runOutsideAngular(() => this.gameLoop());
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


gameLoop(){
//Loop this function 60 times per second
requestAnimationFrame(this.gameLoop);
this.play();
//Render the stage
this.renderer.render(this.stage);
}

play() {

 this.blobs.forEach(blob => {
    //Move the blob
    blob.y += blob.vy;
    //Check the blob's screen boundaries
    var blobHitsWall = this.contain(blob, {x: 28, y: 10, width: 488, height: 480});
    //If the blob hits the top or bottom of the stage, reverse
    if (blobHitsWall === "top" || blobHitsWall === "bottom") {
      blob.vy *= -1;
    }

})

}

randomInt(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}

contain(sprite, container) {

  var collision = "none";

  //Left
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }

  //Top
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }

  //Right
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }

  //Bottom
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }

  //Return the `collision` value
  return collision;
}
}