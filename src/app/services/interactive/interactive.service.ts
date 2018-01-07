import { Injectable } from '@angular/core';
import { Events } from '../event/event.service';
import { Container } from '../../pixi/container';

@Injectable()
export class InteractiveService {

  constructor(events: Events) {

    window.addEventListener('keydown', event => {
      events.publish(event.key, event);
    });

    events.subscribe('PLAYER_ADDED', (player: Container) => {
    player.on('pointermove', this.onDragMove);
  })
}


onDragMove(event) {
  const sprite = event.currentTarget;
    sprite.px = event.data.global.x;
    sprite.py = event.data.global.y;

    const deltaX = sprite.px - sprite.sx;
    const deltaY = sprite.py - sprite.sy;
    let rotation = Math.atan2(deltaY, deltaX);
    sprite.angle = rotation * (180 / Math.PI);

    sprite.anchor.set(0.5);
    sprite.vy = Math.sin(rotation);
    sprite.vx = Math.cos(rotation);

    if (rotation > Math.PI / 2) {
      rotation = (rotation - (Math.PI / 2)) - (Math.PI / 2);
    }
    if (rotation < -Math.PI / 2) {
      rotation = (Math.PI / 2) + (rotation + (Math.PI / 2)); //  - (Math.PI / 2)) ;
    }
    sprite.children[2].rotation = rotation;

  sprite.N = 1;//Math.abs((deltaX + deltaY));
    sprite.say = deltaX + ' : ' + deltaY + ' : ' + sprite.N;
  }
}

