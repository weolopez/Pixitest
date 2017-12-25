import { Events } from "../services/event/event.service";
import * as PIXI from 'pixi.js';
import { Component, typeValues } from "./component";

export class Ezgui {

  gui: typeValues = <typeValues>{
    id: 'main_window',
    type: 'window',
    x: 50,
    y: 50,
    text: 'Settings',
    children: [
      {
      type: 'button',
      x: 50,
      y: 50
    }
    ] 
  }
  node: Component;
  constructor(private events: Events) {  
    events.subscribe('GAME_LOADED', game => {
      this.node = new Component(game.stage);
      this.node.add(this.gui);
      this.node.gui.visible = false;
    });

    events.subscribe('p', game => 
      this.node.gui.visible = !this.node.gui.visible);
  }


}