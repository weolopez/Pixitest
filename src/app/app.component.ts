import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { GameComponent } from './game/game.component';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('textExample') textExample: ElementRef;
  title = 'box';
  public app: PIXI.Application;
  public sprites: Array<any> = [];
  public images: Array<any> = [];

  spriteRef: AngularFireList<any>;
  spriteObservable: Observable<any[]>;

  constructor(db: AngularFireDatabase) {
    this.app = new PIXI.Application(800, 150, { backgroundColor: 0x1099bb });
    const basicText: PIXI.Text = new PIXI.Text('Basic text in pixi');
    basicText.x = 30;
    basicText.y = 90;

    this.app.stage.addChild(basicText);

    this.spriteRef = db.list('sprites');
    this.spriteObservable = this.spriteRef.snapshotChanges().map(changes => {
      return changes.map(c => ({
        key: c.payload.key,
        ...c.payload.val()
      }));
    });
  }
  ngOnInit(): void {
    const _sprites = GameComponent.getSprites();
  }
  init(resource) {
    for (const element of Object.keys(resource['gameResouces'].data.frames)) {
      this.images.push(element);
    }
  }
  update(sprite) {
    this.sprites.push(sprite);
  }
}
