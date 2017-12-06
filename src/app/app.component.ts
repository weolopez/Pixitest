import {FirebaseObjectObservable} from 'angularfire2/database-deprecated';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { GameComponent } from './game/game.component';
import { AngularFireList, AngularFireDatabase, AngularFireObject, AngularFireAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { setInterval } from 'timers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('textExample') textExample: ElementRef;
  title = 'box';
  public sprites: Array<any> = [];
  public images: Array<any> = [];

  spriteRef: AngularFireObject<any>;
  spriteObservable: Observable<any>;
  spriteFB = {};
  public keys = ['name', 'x', 'y', 'vx', 'vy'];

  constructor(private db: AngularFireDatabase) {
    this.spriteRef = db.object('sprites');
    this.spriteObservable = this.spriteRef.valueChanges();
    this.spriteObservable.subscribe(changes => {
      for (const key of Object.keys(changes)) {
        if (!GameComponent.sprites[key]) {
          GameComponent.add(changes[key]);
        }
      }
    });

    setInterval(() => {
      for (const key of Object.keys(GameComponent.sprites)) {
        const sprite = GameComponent.sprites[key];
        const keys = sprite.keys;
        for (const k of Object.keys(keys)) {
            keys[k] = sprite[k];
        }
        this.db.object('sprites/' + sprite.name).set(keys);
      }
    }, 500);
  }
  init(resource) {
    for (const element of Object.keys(resource['gameResources'].data.frames)) {
      this.images.push(element);
    }
  }
  update(sprite) {
    this.sprites.push(sprite);
    if (sprite.name) {
      this.db.object('sprites/' + sprite.name).set(sprite.keys);
    }
  }
}
