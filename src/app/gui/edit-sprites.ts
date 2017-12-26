import { Events } from "../services/event/event.service";
import * as PIXI from 'pixi.js';
import { Component, typeValues } from "../pixi/component";

export class EditSprites {

  gui: typeValues = <typeValues>{
    id: 'main_window',
    type: 'window',
    x: 550,
    y: 0,
    width: 500,
    height: 500,
    text: 'Edit',
    children: [
      {
        id: 'sprite-bar',
        type: 'toolbar',
        x: 10,
        y: 50,
        children: [{
          id: 'add',
          type: 'iconButton',
          x: 10,
          y: 5,
          text: '+'
        }
        ]
    }
    ] 
  }
  component: Component;
  constructor(private events: Events) {  
    events.subscribe('GAME_LOADED', game => {
      this.component = new Component(game.stage);
      let node = this.component.add(this.gui);
      this.component.gui.visible = false;
      let sprite = <PIXI.Container> this.component.gui.getChildByName('sprite-bar');
    });

    events.subscribe('SPRITE_ADDED', (sprite: PIXI.Sprite) => {

      const TEXTURE = PIXI.utils.TextureCache[sprite['filename']];
      const newSprite = new PIXI.Sprite(TEXTURE);
      this.component.addTo('sprite-bar', newSprite);
    })

    events.subscribe('o', game => 
      this.component.gui.visible = !this.component.gui.visible);
  }


}