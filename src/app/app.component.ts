import { BehaviorComponent } from './components/behavior/behavior.component';

import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FirebaseService } from './services/firebase/firebase.service';
import { Events } from './services/event/event.service';
import { Ezgui } from './pixi/ezgui';
import { EditSprites } from './gui/edit-sprites';
import { SpritesComponent } from './game/sprites.component';
import { GameComponent } from './game/game.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('textExample') textExample: ElementRef;
  title = 'box';
  public images: Array<any> = [];
  constructor(private firebaseService: FirebaseService, private events: Events  ) {
    const gameComponent = new GameComponent(events);
    const ezgui = new Ezgui(events);
    const edit = new EditSprites(events);
    const spriteComponent = new SpritesComponent(events);
    const behaviorComponent = new BehaviorComponent(events);
  // const ezgui = new Ezgui(events);
    // const edit = new EditSprites(events);
    // const spriteComponent = new SpritesComponent(events);
  }
  init(resource) {
    for (const element of Object.keys(resource['gameResources'].data.frames)) {
      this.images.push(element);
    }
  }
}
