import { BehaviorComponent } from './components/behavior/behavior.component';

import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FirebaseService } from './services/firebase/firebase.service';
import { Events } from './services/event/event.service';
import { Ezgui } from './pixi/ezgui';

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
    const ezgui = new Ezgui(events);
  }
  init(resource) {
    for (const element of Object.keys(resource['gameResources'].data.frames)) {
      this.images.push(element);
    }
  }
}
