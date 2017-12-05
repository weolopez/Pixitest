import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { GameComponent } from './game/game.component';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
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

  spriteRef: AngularFireList<any>;
  spriteObservable: Observable<any[]>;

  constructor(db: AngularFireDatabase) {
    this.spriteRef = db.list('sprites');
    this.spriteObservable = this.spriteRef.snapshotChanges().map(changes => {
      return changes.map(c => ({
        key: c.payload.key,
        ...c.payload.val()
      }));
    });
  }
  init(resource) {
    for (const element of Object.keys(resource['gameResources'].data.frames)) {
      this.images.push(element);
    }
  }
  update(sprite) {
    this.sprites.push(sprite);
  }
}
