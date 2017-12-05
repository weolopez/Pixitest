import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { GameComponent } from '../../game/game.component';

@Component({
  selector: 'app-sprites',
  templateUrl: './sprites.component.html',
  styleUrls: ['./sprites.component.css']
})
export class SpritesComponent implements OnInit {

  @Input('sprites') public sprites: Array<any> = [];
  @Input('images') public images: Array<any> = [];
  @ViewChild('textExample') textExample: ElementRef;
  title = 'box';
  public app: PIXI.Application;
  public game = GameComponent;
  public property: string;
  public name = '';
  public file_name: string;
  constructor() {
    this.app = new PIXI.Application(800, 150, { backgroundColor: 0x1099bb });
    const basicText: PIXI.Text = new PIXI.Text('Basic text in pixi');
    basicText.x = 30;
    basicText.y = 90;

    this.app.stage.addChild(basicText);
  }
  ngOnInit(): void {
    // this.textExample.nativeElement.appendChild(this.app.view);
    const _sprites = GameComponent.getSprites();
    for (const element of Object.keys(_sprites)) {
      this.sprites.push(element);
    }
  }
  change(element, property: string) {
    GameComponent.sprites[element.name][property] = Number(element.value);
  }
  update($event) {
    const _sprites = GameComponent.getSprites();
    this.sprites = [];
    for (const element of Object.keys(_sprites)) {
      this.sprites.push(_sprites[element]);
    }

    const gameResources = GameComponent.resources['gameResouces'];

    this.images = [];
    for (const element of Object.keys(gameResources.data.frames)) {
      this.images.push(element);
    }
  }
  add(name, file_name) {
    GameComponent.add(name, file_name);
    this.update(name);
  }
}
