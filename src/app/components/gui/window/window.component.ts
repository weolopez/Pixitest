import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Container } from 'pixi.js';
import { DefaultTheme } from '../../../pixi/default-theme';
import { Events } from '../../../services/event/event.service';
import { GameComponent } from '../../../game/game.component';

@Component({
  selector: 'pixi-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.css']
})
  
export class WindowComponent implements OnInit, OnChanges {
  public x: number;
  public y: number; 
  public color: number;
  public corner: number;
  public margin: number;
  public opacity: number;
  public _width: number;
  public _height: number;
  public components: any;
  window: PIXI.Graphics;

  constructor(events: Events) {
    this.window = new PIXI.Graphics();
      <Container>Object.assign(this.window, DefaultTheme.Window);

    events.subscribe('GAME_LOADED', (game: GameComponent) => {
      events.subscribe('WINDOW_CLOSE', button => this.window.visible = false);
      game.stage.addChild(this.window);
      this.draw();
    //  this.window.visible = false;
    });
   }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.draw();
  }

  draw() {
    
    this.window.lineStyle(2, this.color, 1);
    this.window.beginFill(this.color, this.opacity);
    this.window.drawRoundedRect(0, 0, this._width, this._height, this.corner);
    this.window.position.set(this.x + this.margin, this.y + this.margin);
    this.window.endFill();
  }
}
