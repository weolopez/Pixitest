import { Component, OnInit, Input } from '@angular/core';
import { Events } from '../../services/event/event.service';
import { SpritesComponent } from '../sprites/sprites.component';

@Component({
  selector: 'app-behavior',
  templateUrl: './behavior.component.html',
  styleUrls: ['./behavior.component.css']
})
export class BehaviorComponent {
  public static events: any;
  constructor(public e: Events) {
    window.addEventListener('keydown', event => {
   //   e.publish('TEST', event)
      e.publish(event.key, event);
    });
    e.subscribe('SPRITE_ADDED', sprite => this.spriteAdded(sprite));
    BehaviorComponent.events = e;
  }

  spriteAdded(sprite) {
    if (sprite.interactive !== true) {
      return;
    }
    // sprite button mode will mean the hand cursor appears when you roll over the sprite with your mouse
    sprite.buttonMode = true;

    // center the sprite's anchor point
    sprite.anchor.set(0.7);

    // setup events for mouse + touch using
    // the pointer events
    sprite
      .on('pointerdown', this.onDragStart)
      .on('pointerup', this.onDragEnd)
      .on('pointerupoutside', this.onDragEnd)
      .on('pointermove', this.onDragMove);
  }

  onDragStart(event) {
    const sprite = event.currentTarget;
    // store a reference to the data
    // the reason for sprite is because of multitouch
    // we want to track the movement of sprite particular touch
    sprite.data = event.data;
    sprite.alpha = 0.5;

    // make it a bit bigger, so it's easier to grab
    sprite.scale.set(3);
    sprite.dragging = true;
  }

  onDragEnd(event) {
    const sprite = event.currentTarget;
    BehaviorComponent.events.publish('SPRITE_SELECTED', sprite);
    sprite.alpha = 1;
    // make it a bit bigger, so it's easier to grab
    sprite.scale.set(1);
    sprite.dragging = false;
    // set the interaction data to null
    sprite.data = null;
  }

  onDragMove(event) {
    const sprite = event.currentTarget;
    if (sprite.dragging) {
      const newPosition = sprite.data.getLocalPosition(sprite.parent);
      sprite.x = newPosition.x;
      sprite.y = newPosition.y;
    }
  }

}
