import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-behavior',
  templateUrl: './behavior.component.html',
  styleUrls: ['./behavior.component.css']
})
export class BehaviorComponent {

  @Input('sprites') public sprites;
  public show = false;
  public keys = [];
  sprite;

  constructor() {
  }

}
