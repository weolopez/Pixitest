import { Injectable } from '@angular/core';
import { Events } from './../event/event.service';

import { GameComponent } from '../../game/game.component';
import { Observable } from 'rxjs/Observable';
import {
  AngularFireList,
  AngularFireDatabase,
  AngularFireObject,
  AngularFireAction
} from 'angularfire2/database';

@Injectable()
export class FirebaseService {

  public sprites: Array<any> = [];
  spriteRef: AngularFireObject<any>;

  spriteObservable: Observable<any>;
  prefix = '';

  constructor(private db: AngularFireDatabase, public event: Events) {

    this.spriteRef = db.object(this.prefix + 'sprites');
    this.spriteObservable = this.spriteRef.valueChanges();
    this.spriteObservable.subscribe(storedSprites => {
      for (const sprite of Object.keys(storedSprites)) {
        if (!GameComponent.sprites[sprite]) {
          GameComponent.add(storedSprites[sprite]);
        }
      }
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

    event.subscribe('SPRITE_ADDED', sprite => {
      if (!this.sprites.find(s => s.name === sprite.name)) {
        this.sprites.push(sprite);
      }
      if (sprite.name) {
        for (const key of Object.keys(sprite.keys)) {
          sprite.keys[key] = sprite[key];
        }
        this.db.object(this.prefix + 'sprites/' + sprite.name).set(sprite.keys);
      }
    });

  }

}
