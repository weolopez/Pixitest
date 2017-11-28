import { Component } from '@angular/core';
import * as PIXI from 'pixi.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'box';

}

var resources = PIXI.loader.resources,
  TextureCache = PIXI.utils.TextureCache,
  Texture = PIXI.Texture,
  Sprite = PIXI.Sprite;

var stage = new PIXI.Container(), renderer = PIXI.autoDetectRenderer(512, 512);
document.body.appendChild(renderer.view);

PIXI.loader.add("../assets/images/treasureHunter.json").load(setup);
var numberOfBlobs = 2
var dungeon, explorer, treasure, door, id, state, blobs = [];

function setup() {
  //There are 3 ways to make sprites from textures atlas frames
  //1. Access the `TextureCache` directly
  var dungeonTexture = TextureCache["dungeon.png"];
  dungeon = new Sprite(dungeonTexture);
  stage.addChild(dungeon);
  //2. Access the texture using throuhg the loader's `resources`:
  explorer = new Sprite(
    resources["../assets/images/treasureHunter.json"].textures["explorer.png"]
  );
  explorer.x = 68;
  //Center the explorer vertically
  explorer.y = stage.height / 2 - explorer.height / 2;
  stage.addChild(explorer);
  //3. Create an optional alias called `id` for all the texture atlas 
  //frame id textures.
  id = PIXI.loader.resources["../assets/images/treasureHunter.json"].textures; 
  
  //Make the treasure box using the alias
  treasure = new Sprite(id["treasure.png"]);
  stage.addChild(treasure);
  //Position the treasure next to the right edge of the canvas
  treasure.x = stage.width - treasure.width - 48;
  treasure.y = stage.height / 2 - treasure.height / 2;
  stage.addChild(treasure);
  //Make the exit door
  door = new Sprite(id["door.png"]); 
  door.position.set(32, 0);
  stage.addChild(door);
  //Make the blobs
  var spacing = 48,
      xOffset = 150,
      speed = 3,
      direction = 1;
  //Make as many blobs as there are `numberOfBlobs`
  for (var i = 0; i < numberOfBlobs; i++) {
    //Make a blob
    blobs[i] = new Sprite(id["blob.png"]);
    var x = spacing * i + xOffset;
    var y = randomInt(0, stage.height - blobs[i].height);
    //Set the blob's position
    blobs[i].x = x;
    blobs[i].y = y;
    blobs[i].vy = speed * direction;
    direction *= -1;
    //Add the blob sprite to the stage
    stage.addChild(blobs[i]);
  }
state = play;
gameLoop()
}


function gameLoop(){
  //Loop this function 60 times per second
  requestAnimationFrame(gameLoop);
  state();
  //Render the stage
  renderer.render(stage);
}

function play() {

  blobs.forEach(function(blob) {
      //Move the blob
      blob.y += blob.vy;
      //Check the blob's screen boundaries
      var blobHitsWall = contain(blob, {x: 28, y: 10, width: 488, height: 480});
      //If the blob hits the top or bottom of the stage, reverse
      if (blobHitsWall === "top" || blobHitsWall === "bottom") {
        blob.vy *= -1;
      }

  })
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function contain(sprite, container) {
  
    var collision = undefined;
  
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