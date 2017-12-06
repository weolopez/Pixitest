import { Component, OnInit, ViewChild, ElementRef, Input, SimpleChanges } from '@angular/core';
import { GameComponent, SpriteObject } from '../../game/game.component';
import { element } from 'protractor';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-sprites',
  templateUrl: './sprites.component.html',
  styleUrls: ['./sprites.component.css']
})
export class SpritesComponent implements OnInit, OnChanges {
  @Input('sprites') public sprites: Array<any> = [];
  @Input('images') public images: Array<any> = [];
  @ViewChild('textExample') textExample: ElementRef;

  title = 'box';
  public app: PIXI.Application;
  public game = GameComponent;
  public property: string;
  public name = '';
  public filename: string;
  public show = false;
  constructor() {
  }
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('CHANGES');
  }
  change(e, property: string) {
    if (!e.name) { return; }

    if (typeof GameComponent.sprites[e.name][property] === 'string') {
      GameComponent.sprites[e.name][property] = e.value;
    } else if (typeof GameComponent.sprites[e.name][property] === 'number') {
      GameComponent.sprites[e.name][property] = Number(e.value);
    }
  }
  add(name, filename) {
    const sprite: SpriteObject = <SpriteObject> {};
    sprite.name = name;
    sprite.filename = filename;
    GameComponent.add(sprite);
  }
}
