import { Component, OnInit, ViewChild, ElementRef, Input, SimpleChanges, Output, EventEmitter, OnChanges } from '@angular/core';
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

  title = 'box';
  public newValue = '';
  public newField = '';
  public game = GameComponent;
  public property: string;
  public name = '';
  public filename: string;
  public show = false;
  public selectValue;
  public keys = [];
  public sprite;
  public image;
  constructor() {}
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(
      () => {
        this.sprite = this.sprites[4];
        this.filename = this.images[4];
        this.selectionChanged();
      },
      1000,
      this
    );
  }
  changeNewField($event) {
    this.newValue = this.sprite[this.newField];
  }
  change(e, property: string) {
    if (!e.value) {
      return;
    }
    const propertyType = typeof this.sprite[property];
    const valueType = typeof e.value ;
    const fieldType = e.type ;

    if (!this.sprite.keys) { this.sprite.keys = {}; }

    if (propertyType === 'number') {
      this.sprite[property] = Number(e.value);
      this.sprite.keys[property] = Number(e.value);
    } else if (typeof this.sprite[property] === 'string') {
      this.sprite[property] = e.value;
      this.sprite.keys[property] = e.value;
    } else {
      if (valueType === 'number') {
        this.sprite[property] = Number(e.value);
        this.sprite.keys[property] = Number(e.value);
      } else {
        this.sprite[property] = e.value;
        this.sprite.keys[property] = e.value;
      }
    }
    this.update.emit(this.sprite);
  }
  add(name, filename) {
    const sprite: SpriteObject = <SpriteObject>{};
    sprite.name = name;
    sprite.filename = filename;
    GameComponent.add(sprite);
  }

  selectionChanged() {
    if (!this.sprite) { return; }
    this.keys = Object.keys(this.sprite.keys);
  }
  getType() {
    if (this.newField.length > 1) {
      return typeof this.sprite[this.newField];
    } else {
      return 'string';
    }
  }
}
