export class SpriteInteractions {
  static onDragStart = function (event) {
    const sprite = event.target;
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    // sprite.data = event.data;
    // sprite.alpha = 0.5;
    // sprite.dragging = true;

    event.target.yell = 'I am here';
    let g;
    g = Object.assign({}, event.data.global);
    event.target.startPoint = g;
  };

  static getVector = function (startPoint, endPoint) {
    const x1 = startPoint.x;
    const y1 = startPoint.y;
    const x2 = endPoint.x;
    const y2 = endPoint.y;

    let vx = x2 - x1;
    let vy = y2 - y1;
    // const slope = vy / vx;
    let N = Math.hypot(vy, vx);

    // const x = x1 + 2;
    // const y = Math.round(((x - x1) * slope) + y1);
    // vx = x - x1;
    // vy = y - y1;
    // N = N / Math.floor(Math.hypot(vy / vx));

    return {
      vx: vx,
      vy: vy,
      N: N
    };
  };
  static onDragEnd = function (event) {

    const sprite = event.currentTarget;

    const vector = SpriteInteractions.getVector(
      sprite.startPoint, event.data.global);

    sprite.N = 1;
    sprite.vx = vector.vx;
    sprite.vy = vector.vy;
    sprite.yell = 'N: ' + sprite.N + 'vx: ' + sprite.vx + 'vy: ' + sprite.vy;

    // sprite.alpha = 1;
    // sprite.dragging = false;
    // set the interaction data to null
    // sprite.data = null;
  };

  static onDragMove = function (event) {
    const sprite = event.currentTarget;
    // if (this.dragging) {
    //   var newPosition = this.data.getLocalPosition(this.parent);
    //   this.x = newPosition.x;
    //   this.y = newPosition.y;
    // }
  };
}
