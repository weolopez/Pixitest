import { BehaviorComponent } from './components/behavior/behavior.component';
import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { GameComponent } from './game/game.component';
import { AngularFireList, AngularFireDatabase, AngularFireObject, AngularFireAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

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
  prefix = '';
  constructor(private db: AngularFireDatabase) {
    this.spriteRef = db.object(this.prefix + 'sprites');
    this.spriteObservable = this.spriteRef.valueChanges();
    this.spriteObservable.subscribe(changes => {
      for (const key of Object.keys(changes)) {
        if (!GameComponent.sprites[key]) {
          GameComponent.add(changes[key]);
        }
      }
      // const fred = GameComponent.sprites['fred'];
      // fred.behaviors = ['moveVertically'];
      // BehaviorComponent.sprites.push(fred);
    });

    setTimeout(() => {
      for (const key of Object.keys(GameComponent.sprites)) {
        const sprite = GameComponent.sprites[key];
        const keys = sprite.keys;
        for (const k of Object.keys(keys)) {
          keys[k] = sprite[k];
        }
        this.db.object(this.prefix + 'sprites/' + sprite.name).set(keys);
      }
    }, 5500);
  }
  init(resource) {
    for (const element of Object.keys(resource['gameResources'].data.frames)) {
      this.images.push(element);
    }
  }
  update(sprite) {
    if (!this.sprites.find(s => s.name === sprite.name)) {
      this.sprites.push(sprite);
    }
    if (sprite.name) {
      for (const key of Object.keys(sprite.keys)) {
        sprite.keys[key] = sprite[key];
      }
      this.db.object(this.prefix + 'sprites/' + sprite.name).set(sprite.keys);
    }
  }
  add(sprite) {

  }
  delete(sprite) {

  }

}
