import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('textExample') textExample: ElementRef;
  title = 'box';
  public app: PIXI.Application;
  constructor() {
    this.app = new PIXI.Application(800, 150, { backgroundColor: 0x1099bb });
    const basicText: PIXI.Text = new PIXI.Text('Basic text in pixi');
    basicText.x = 30;
    basicText.y = 90;

    this.app.stage.addChild(basicText);
  }
  ngOnInit(): void {
    this.textExample.nativeElement.appendChild(this.app.view);
  }
}
