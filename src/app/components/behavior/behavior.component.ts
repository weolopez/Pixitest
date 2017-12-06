import { Component, OnInit } from '@angular/core';
import { setInterval } from 'timers';

@Component({
  selector: 'app-behavior',
  templateUrl: './behavior.component.html',
  styleUrls: ['./behavior.component.css']
})
export class BehaviorComponent {
  public static sprites = [];
  public behaviors = {
    moveVertically:
      'sprite.y += sprite.vy; sprite.vy = (contain(sprite)) ? sprite.vy*-1:sprite.vy;'
  };

  constructor() {
    setInterval(() => {
      BehaviorComponent.sprites.forEach(sprite => {
        sprite.behaviors.array.forEach(behavior => {
          console.dir(behavior);
        });
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
