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
    this.ctx.fillStyle = 'greenyellow';
    this.ctx.globalAlpha = 1;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.textLayerObj.ctx.fillStyle = 'greenyellow';
    this.textLayerObj.ctx.font = "bold 10px Arial"
    this.textLayerObj.ctx.fillText(this.title, this.x, this.y - 2);
  } 
};