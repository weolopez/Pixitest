import { PixiService } from './../../services/pixi/pixi.service';
import { Events } from './../../services/event/event.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gui',
  templateUrl: './gui.component.html',
  styleUrls: ['./gui.component.css']
})
export class GuiComponent implements OnInit {

  constructor(events: Events, pixiService: PixiService) {
    events.subscribe('GAME_LOADED', (game: PixiService) => {
      // this.window = new PIXI.Graphics();
      // this.window =  <PIXI.Graphics>Object.assign(this.window, DefaultTheme.Window);
      // game.stage.addChild(this.window);
      // this.draw();
    //  this.window.visible = false;
    });
  }

  ngOnInit() {
  }

}
