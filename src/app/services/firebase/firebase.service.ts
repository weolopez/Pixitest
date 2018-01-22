import { Injectable } from '@angular/core';
import { Events } from './../event/event.service';

import { Observable } from 'rxjs/Observable';
import {
  AngularFireList,
  AngularFireDatabase,
  AngularFireObject,
  AngularFireAction
} from 'angularfire2/database';

@Injectable()
export class FirebaseService {

  spriteRef: AngularFireObject<any>;
  spriteObservable: Observable<any>;
  prefix = '';

  constructor(private db: AngularFireDatabase, public events: Events) {

    this.spriteRef = db.object(this.prefix + 'sprites');
    this.spriteObservable = this.spriteRef.valueChanges();
    this.spriteObservable.subscribe(storedSprites => {
      for (const sprite of Object.keys(storedSprites)) {
        events.publish('SPRITE_ADD', storedSprites[sprite])
      }
    });

    events.subscribe('SPRITE_KEYS_UPDATED', sprite => this.db.object(this.prefix + 'sprites/' + sprite.keys.name).set(sprite.keys));

    setTimeout(() => {
      // for (const key of Object.keys(GameComponent.sprites)) {
      //   const sprite = GameComponent.sprites[key];
      //   const keys = sprite.keys;
      //   for (const k of Object.keys(keys)) {
      //     keys[k] = sprite[k];
      //   }
      //   this.db.object(this.prefix + 'sprites/' + sprite.name).set(keys);
      // }
    }, 5500);

    events.subscribe('SPRITE_ADDED', sprite => this.spriteAdded(sprite));
    events.subscribe('SPRITE_UPDATED', sprite => this.spriteUpdated(sprite));
    events.subscribe('SPRITE_DELETED', sprite => this.spriteUpdated(sprite));

  }
  spriteDeleted(sprite) {
    this.db.object(this.prefix + 'sprites/' + sprite.name).remove();
  }

  spriteUpdated(sprite) {
    if (!sprite.keys) return;
    if (sprite.name) {
      for (const key of Object.keys(sprite.keys)) {
        sprite.keys[key] = sprite[key];
      }
      this.db.object(this.prefix + 'sprites/' + sprite.name).set(sprite.keys);
    }
  }

  spriteAdded(sprite) {
    this.spriteUpdated(sprite);
  }

}
