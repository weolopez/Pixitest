import { PixiService } from './services/pixi/pixi.service';

import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FirebaseService } from './services/firebase/firebase.service';
import { Events } from './services/event/event.service';
import { Settings } from './gui/settings';
import { Edit } from './gui/edit';
import { Player } from './player/player';
import { InteractiveService } from './services/interactive/interactive.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private firebaseService: FirebaseService,
    private events: Events,
    interactiveService: InteractiveService,
    pixiService: PixiService,
    firebase: FirebaseService
  ) {
    // const gameComponent = new GameComponent(events);
    const edit = new Edit(events);
    const settings = new Settings(events);
    // const spriteComponent = new SpritesComponent(events);
   // const behaviorComponent = new BehaviorComponent(events);
    const player = new Player(events);

  }
}
