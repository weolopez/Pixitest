import { SpriteObject } from './game.component';
import { Events } from '../services/event/event.service';

export class SpritesComponent {
  private sprite = { vx: 0, vy: 0, N: 0, angle: 0, rotation:0, anchor: {set: (s)=>s} };
  constructor(private events: Events) {
    events.subscribe('SPRITE_SELECTED', sprite => this.sprite = sprite );
    events.subscribe('ArrowRight', () => this.updateSpriteAngle(1) );
    events.subscribe('ArrowLeft', () => this.updateSpriteAngle(-1) );
    events.subscribe('ArrowUp', () => this.updateSpriteAcceleration(1));
    events.subscribe('ArrowUp', () => this.updateSpriteAcceleration(-1));
  }

  updateSpriteAcceleration(rate) {
    this.sprite.vx += rate;
    this.sprite.vy += rate;
    this.sprite.N += rate + 5;
  }
  updateSpriteAngle(turn) {
    this.sprite.angle += turn;
    // center the sprite's anchor point
    this.sprite.anchor.set(0.5);
    this.sprite.rotation = this.sprite.angle * Math.PI / 180;
    this.sprite.vy = Math.sin(this.sprite.rotation);
    this.sprite.vx = Math.cos(this.sprite.rotation);
  }
}
