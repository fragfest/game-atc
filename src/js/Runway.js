
module.exports = class Runway {
  constructor(title, entityLayerObj, positionObj) {
    this.id = Math.random();
    this.title = title.trim();
    this.x = positionObj.x;
    this.y = positionObj.y;
    this.ctx = entityLayerObj.ctx;

    this.width = 10;
    this.height = 50;
    this.altitude = 0;
  }

  update({ deltaTimeMs }) {
    this.ctx.fillStyle = 'darkgreen';
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  setProximity({ entityManagerArr }) {
  }
};