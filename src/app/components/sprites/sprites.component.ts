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
  public app: PIXI.Application;
  public game = GameComponent;
  public property: string;
  public name = '';
  public filename: string;
  public show = false;
  public selectValue;
  public keys = [];
  public sprite;
  public image;
  constructor() {
  }
  ngOnInit(): void {
    //this.sprite = this.sprites[4];
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      this.sprite = this.sprites[4];
      this.filename = this.images[4];
      this.selectionChanged();
    }, 1000, this);
  }
  change(e, property: string) {
    if (!e.name) { return; }
    const sprite = GameComponent.sprites[e.name];


    if (typeof sprite[property] === 'string') {
      sprite[property] = e.value;
      sprite.keys[property] = e.value;
    } else if (typeof sprite[property] === 'number') {
      sprite[property] = Number(e.value);
      sprite.keys[property] = Number(e.value);
    } else {
      if (typeof Number(e.value) === 'number') {
      sprite[property] = Number(e.value);
      sprite.keys[property] = Number(e.value);
      } else {
        sprite[property] = e.value;
        sprite.keys[property] = e.value;
      }
    }
    this.update.emit(sprite);
  }
  add(name, filename) {
    const sprite: SpriteObject = <SpriteObject> {};
    sprite.name = name;
    sprite.filename = filename;
    GameComponent.add(sprite);
  }

  selectionChanged() {
    this.keys = Object.keys(this.sprite.keys);
  }
}
