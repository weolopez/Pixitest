import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';
import { SpriteObject } from '../../game/game.component';
import { Events } from '../../services/event/event.service';

@Component({
  selector: 'app-sprites',
  templateUrl: './sprites.component.html',
  styleUrls: ['./sprites.component.css']
})
export class SpritesComponent implements OnInit, OnChanges {

  public sprites: Array<any> = [];
  @Input('images') public images: Array<any> = [];

  @ViewChild('textExample') textExample: ElementRef;
  @ViewChild('inputElement') inputElement: ElementRef;

  title = 'box';
  public key = '';
  public keyType = 'text';
  public newProperty = '';
  public propertyValue: any;
  public name = '';
  public filename: string;
  public show = false;
  public selectValue;
  public keys = [];
  public sprite;
  public image;
  public functionText;
  public functionName;
  constructor(private events: Events) {
    events.subscribe('SPRITE_ADDED', sprite => { this.sprites.push(sprite); });
    events.subscribe('SPRITE_DELETED', sprite => {
      this.sprites = this.sprites.splice(
          sprite.findIndex(s => s === sprite), 1);
    });

    events.subscribe('SPRITE_SELECTED', sprite => this.spriteSelectionChanged(sprite) );
    events.subscribe('ArrowRight', () => this.updateSpriteAngle(1) );
    events.subscribe('ArrowLeft', () => this.updateSpriteAngle(-1) );
    events.subscribe('ArrowUp', () => this.updateSpriteAcceleration(1));
    events.subscribe('ArrowUp', () => this.updateSpriteAcceleration(-1));
  }
  ngOnInit(): void { }

  updateSpriteAcceleration(rate) {
    this.sprite.vx += rate;
    this.sprite.vy += rate;
    this.sprite.N += rate+5;
  }
  updateSpriteAngle(turn) {
    this.sprite.angle += turn;
    // center the sprite's anchor point
    this.sprite.anchor.set(0.5);
    this.sprite.rotation = this.sprite.angle * Math.PI / 180;
    this.sprite.vy = Math.sin(this.sprite.rotation); 
    this.sprite.vx = Math.cos(this.sprite.rotation);
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(
      () => {
        this.filename = this.images[4];
        this.sprites.push({ name: 'New' });
      },
      1000,
      this
    );
  }

  spriteUpdated() {
    this.events.publish('SPRITE_KEYS_UPDATED', this.sprite);
  }

  change(changing?) {
    if (changing)
      this.propertyValue = changing;

    let key = this.key;
    if (this.key === 'New') {
      key = this.newProperty;
    }

    if (!isNaN(this.sprite[key])) {
      this.sprite.keys[key] = Number(this.propertyValue);
    } else if (this.sprite[key] === 'true' || this.sprite[key] === 'false') {
      this.sprite.keys[key] = Boolean(this.propertyValue);
    } else if (!isNaN(this.propertyValue)) {
      this.sprite.keys[key] = Number(this.propertyValue);
    } else if (this.propertyValue === 'true' || this.propertyValue === 'false') {
      this.sprite.keys[key] = Boolean(this.propertyValue);
    } else {
      this.sprite.keys[key] = this.propertyValue;
    }

    this.events.publish('SPRITE_KEYS_UPDATED', this.sprite);
    this.spriteSelectionChanged();
  }

  add(name, filename) {
    const sprite: SpriteObject = <SpriteObject>{};
    sprite.name = this.name;
    sprite.filename = this.key;
    // GameComponent.add(sprite);
  }
  deleteSprite() {
    this.events.publish('SPRITE_DELETE', this.sprite);
  }
  spriteSelectionChanged(sprite?) {
    if (sprite) this.sprite = sprite;

    if (this.sprite.name === 'New') {
      this.keys = this.images;
    } else {
      this.keys = Object.keys(this.sprite.keys);
      this.keys.push('New');
      this.key = this.keys[1];
    }
  }
  keySelectionChanged() {
    if (!this.sprite) { return; }
    if (this.sprite.name === 'New') {
      this.keyType = 'text';
    } else {
      this.keyType = typeof this.sprite[this.key];
      this.propertyValue = this.sprite[this.key];
    }
  }
}
