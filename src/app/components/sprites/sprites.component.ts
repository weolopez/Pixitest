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
import { GameComponent, SpriteObject } from '../../game/game.component';
import { SpriteInteractions } from '../../functions/sprite/interactions';
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
  public keyType = 'string';
  public newProperty = '';
  public game = GameComponent;
  public property: string;
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
    events.subscribe('SPRITE_SELECTED', sprite => {
      this.sprite = sprite;
      this.spriteSelectionChanged();
    }
    );
  }

  ngOnInit(): void {}

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

  // getSprite() {
  //   this.sprite = GameComponent.sprites[SpritesComponent._selectedSprite];
  //   this.selectedSprite = this.sprite;
  //   this.keySelectionChanged();
  //   return this.sprite;
  // }

  change() {
    let key = this.key;
    if (this.key === 'New') {
      key = this.newProperty;
    }
    this.sprite[key] = this.property;

    if (!isNaN(this.sprite[key])) {
      this.sprite[key] = Number(this.sprite[key]);
      this.keys[key] = Number(this.sprite[key]);
    } else if (this.sprite[key] === 'true' || this.sprite[key] === 'false') {
      this.sprite[key] = Boolean(this.sprite[key]);
      this.sprite.keys[key] = Boolean(this.sprite[key]);
    } else {
      this.sprite[key] = this.sprite[key];
      this.sprite.keys[key] = this.sprite[key];
    }

    this.events.publish('SPRITE_UPDATED', this.sprite);
    this.spriteSelectionChanged();
  }
  add(name, filename) {
    const sprite: SpriteObject = <SpriteObject>{};
    sprite.name = this.name;
    sprite.filename = this.key;
    GameComponent.add(sprite);
  }
  deleteSprite() {
    this.events.publish('SPRITE_DELETE', this.sprite);
  }
  spriteSelectionChanged() {
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
      this.keyType = 'string';
    } else {
      this.keyType = typeof this.sprite[this.key];
      this.property = this.sprite[this.key];
    }
  }
}
