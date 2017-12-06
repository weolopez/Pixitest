import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-behavior',
  templateUrl: './behavior.component.html',
  styleUrls: ['./behavior.component.css']
})
export class BehaviorComponent {
  // public static sprites = [];
  // public static behaviors = {
  //   moveVertically:
  //     `
  //     //  if (sprite.vy) sprite.y += sprite.vy;
  //     //  if (sprite.vx) sprite.x += sprite.vx;
  //      let blobHitsWall = BehaviorComponent.contain(sprite);
  //      if (blobHitsWall === 'top' || blobHitsWall === 'bottom') {
  //        sprite.vy *= -1;
  //      }
  //      if (blobHitsWall === 'left' || blobHitsWall === 'right') {
  //       sprite.vx *= -1;
  //      }
  //     `
  // };

  @Input('sprites') public sprites;
  public show = false;
  public keys = [];
  sprite;

  constructor() {
    // setInterval(() => {
    //   const behaviors = BehaviorComponent.behaviors;
    //   BehaviorComponent.sprites.forEach(sprite => {
    //     if (sprite.behaviors) {
    //       sprite.behaviors.forEach(behavior => {
    //         console.dir(behavior);
    //         // tslint:disable-next-line:no-eval
    //         eval(behaviors[behavior]);
    //       });
    //     }
    //   });
    // }, 500);
  }

  selectionChanged() {
    this.keys = Object.keys(this.sprite.keys);
  }

}
