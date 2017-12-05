import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { GameComponent } from './game/game.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('textExample') textExample: ElementRef;
  title = 'box';
  public app: PIXI.Application;
  public sprites: Array<any>;
  public images: Array<any>;
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
}
