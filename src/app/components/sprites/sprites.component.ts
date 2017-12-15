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
  public keyType = 'text';
  public newProperty = '';
  public game = GameComponent;
  public property: string;
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
<<<<<<< HEAD
  public selectedSprite;
<<<<<<< HEAD
  constructor() { }
=======
=======
>>>>>>> feature/ngrx
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
>>>>>>> 203a144c947f54ef6807430b09cdebac0e2e2097

  ngOnInit(): void { }

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

  change(changing) {
    this.propertyValue = changing;
    let key = this.key;
    if (this.key === 'New') {
      key = this.newProperty;
    }
    this.sprite[key] = this.propertyValue;

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
<<<<<<< HEAD
    this.sprite = this.selectedSprite;
    SpritesComponent._selectedSprite = this.selectedSprite.name;
=======
>>>>>>> feature/ngrx
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
<<<<<<< HEAD
      this.keyType = (typeof this.sprite[this.key] === 'number') ? 'number' : 'text';
      this.property = this.selectedSprite[this.key];
    }
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
    SpritesComponent._selectedSprite = sprite.name;
    sprite.alpha = 1;
    // make it a bit bigger, so it's easier to grab
    sprite.scale.set(1);
    sprite.dragging = false;
    // set the interaction data to null
    sprite.data = null;

    this.sprite = sprite;
  }

  onDragMove(event) {
    const sprite = event.currentTarget;
    if (sprite.dragging) {
      const newPosition = sprite.data.getLocalPosition(sprite.parent);
      sprite.x = newPosition.x;
      sprite.y = newPosition.y;
=======
      this.keyType = typeof this.sprite[this.key];
      this.property = this.sprite[this.key];
>>>>>>> feature/ngrx
    }
  }
}
