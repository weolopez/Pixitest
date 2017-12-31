import * as PIXI from 'pixi.js';

export interface Panel extends PIXI.Container {
    panels?: Array<PIXI.Container>;
    panel: PIXI.Container;
    currentPanel: number;
}