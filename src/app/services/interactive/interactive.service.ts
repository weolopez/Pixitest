import { Injectable } from '@angular/core';
import { Events } from '../event/event.service';
import { Container } from '../../pixi/container';

@Injectable()
export class InteractiveService {

  constructor(public events: Events) {
    const me = this;
    window.addEventListener('keydown', event => {
      events.publish(event.key, event);
    });

    events.subscribe('WINDOW_ADDED', (game_window: Container) => {
      game_window.on('pointermove', event => me.onDragMove(event, me));
    })
    events.subscribe('SPRITE_ADDED', sprite =>
      sprite.on('pointerup', (event) => 
      this.events.publish('SELECTED_SPRITE', event.currentTarget)));
  }

  onDragMove(event, me) {
    me.events.publish('MOUSE_MOVED',
      { x: event.data.global.x, y: event.data.global.y })
  }
}

