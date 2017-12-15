import { BehaviorComponent } from './components/behavior/behavior.component';

import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { GameComponent } from './game/game.component';
import { FirebaseService } from './services/firebase/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('textExample') textExample: ElementRef;
  title = 'box';
  public images: Array<any> = [];

  spriteFB = {};
  public keys = ['name', 'x', 'y', 'vx', 'vy'];
  constructor(private firebaseService: FirebaseService) {


  }
  init(resource) {
    for (const element of Object.keys(resource['gameResources'].data.frames)) {
      this.images.push(element);
    }
  }
  update(sprite) {
  }
  add(sprite) {}
  delete(sprite) {
  }
}
