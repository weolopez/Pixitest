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

@Component({
  selector: 'app-sprites',
  templateUrl: './sprites.component.html',
  styleUrls: ['./sprites.component.css']
})
export class SpritesComponent implements OnInit, OnChanges {
  public static _selectedSprite = 'fred';

  @Input('sprites') public sprites: Array<any> = [];
  @Input('images') public images: Array<any> = [];

  @Output('update') public update = new EventEmitter<any>();
  @Output('delete') public delete = new EventEmitter<any>();
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
  public selectedSprite;
  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(
      () => {
        this.getSprite();
        this.selectedSprite = this.sprites[4];
        this.filename = this.images[4];
        this.spriteSelectionChanged();
        this.sprites.push({ name: 'New' });

        const sf = SpriteInteractions;

        this.sprites.forEach(sprite => {
          if (sprite.interactive === true) {
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
        });
      },
      1000,
      this
    );
  }

  getSprite() {
    this.sprite = GameComponent.sprites[SpritesComponent._selectedSprite];
    this.selectedSprite = this.sprite;
    this.keySelectionChanged();
    return this.sprite;
  }

  change(changing) {
    this.propertyValue = changing;
    let key = this.key;
    if (this.key === 'New') {
      key = this.newProperty;
    }
    this.sprite[key] = this.propertyValue;

    if (!isNaN(this.sprite[key])) {
      this.sprite[key] = Number(this.sprite[key]);
      this.sprite.keys[key] = Number(this.sprite[key]);
    } else if (this.sprite[key] === 'true' || this.sprite[key] === 'false') {
      this.sprite[key] = Boolean(this.sprite[key]);
      this.sprite.keys[key] = Boolean(this.sprite[key]);
    } else {
      this.sprite[key] = this.sprite[key];
      this.sprite.keys[key] = this.sprite[key];
    }

    this.update.emit(this.sprite);
    this.spriteSelectionChanged();
  }
  add(name, filename) {
    const sprite: SpriteObject = <SpriteObject>{};
    sprite.name = this.name;
    sprite.filename = this.key;
    GameComponent.add(sprite);
  }
  deleteSprite() {
    this.delete.emit(this.sprite);
  }
  spriteSelectionChanged() {
    this.sprite = this.selectedSprite;
    SpritesComponent._selectedSprite = this.selectedSprite.name;
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
    }
  }
}
