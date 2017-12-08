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

@Component({
  selector: 'app-sprites',
  templateUrl: './sprites.component.html',
  styleUrls: ['./sprites.component.css']
})
export class SpritesComponent implements OnInit, OnChanges {

  @Input('sprites') public sprites: Array<any> = [];
  @Input('images') public images: Array<any> = [];

  @Output('update') public update = new EventEmitter<any>();
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

  constructor() {}

  static alert = function(event) {
    event.target.yell = 'I am here';
    alert('WORKED!!' + event.target.keys);
  };

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(
      () => {
        this.sprite = this.sprites[4];
        this.filename = this.images[4];
        this.spriteSelectionChanged();
        this.sprites.push({ name: 'New' });

        this.sprites
          .find(sprite => sprite.name === 'fred')
          .on('pointerdown', SpritesComponent.alert);
      },
      1000,
      this
    );
  }

  change() {
    let key = this.key;
    if (this.key === 'New') {
      key = this.newProperty;
    }
    this.sprite[key] = this.property;

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
  delete() {
    alert('delete sprite');
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
    if (this.sprite.name === 'New') {
      this.keyType = 'string';
    } else {
      this.keyType = typeof this.sprite[this.key];
    }
  }
}
