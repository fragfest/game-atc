////////////////////////////////////////////////////////////
// class Waypoint
////////////////////////////////////////////////////////////
module.exports = class Waypoint {
  constructor(title, entityLayerObj, textLayerObj, positionObj) {
    this.id = Math.random();
    this.title = title.trim();
    this.ctx = entityLayerObj.ctx
    this.textLayerObj = textLayerObj;

    this.x = positionObj.x;
    this.y = positionObj.y;
    this.width = 5;
    this.height = 5;
    this.altitude = 0;
  }

  update() {
    _draw(this);
  }

  draw() {
    _draw(this);
  }
};
// end class Waypoint

// PRIVATE ////////////////////////////////////////////////////////

const _draw = (self) => {
  self.ctx.fillStyle = 'greenyellow';
  self.ctx.globalAlpha = 1;
  self.ctx.fillRect(self.x, self.y, self.width, self.height);
  self.textLayerObj.ctx.fillStyle = 'greenyellow';
  self.textLayerObj.ctx.font = "bold 10px Arial"
  self.textLayerObj.ctx.fillText(self.title, self.x, self.y - 2);
}