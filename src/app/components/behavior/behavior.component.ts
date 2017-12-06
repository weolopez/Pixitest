import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-behavior',
  templateUrl: './behavior.component.html',
  styleUrls: ['./behavior.component.css']
})
export class BehaviorComponent {
  public static sprites = [];
  public static behaviors = {
    moveVertically:
      `
      //  if (sprite.vy) sprite.y += sprite.vy;
      //  if (sprite.vx) sprite.x += sprite.vx;
       let blobHitsWall = BehaviorComponent.contain(sprite);
       if (blobHitsWall === 'top' || blobHitsWall === 'bottom') {
         sprite.vy *= -1;
       }
       if (blobHitsWall === 'left' || blobHitsWall === 'right') {
        sprite.vx *= -1;
       }
      `
  };

  constructor() {
    setInterval(() => {
      const behaviors = BehaviorComponent.behaviors;
      BehaviorComponent.sprites.forEach(sprite => {
        if (sprite.behaviors) {
          sprite.behaviors.forEach(behavior => {
            console.dir(behavior);
            // tslint:disable-next-line:no-eval
            eval(behaviors[behavior]);
          });
        }
      });
    }, 500);
  }

  static contain = function(sprite) {
    // Check the blob's screen boundaries
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
}
