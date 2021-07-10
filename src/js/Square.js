const entityFns = require('./entity');

module.exports = class Square {
  constructor(layerObj, positionObj) {
    this.id = Math.random();
    this.ctx = layerObj.ctx;
    this.x = positionObj.x;
    this.y = positionObj.y;
    this.headingRad = positionObj.heading;   // in radians. 0 is 100% to the right
    this.timestampPrevMs = 0;
    this.speedPixelPerMs = 0.005;
    this.width = 10;
    this.height = 10;
  }

  setHeading(direction) {
    switch(direction){
      case 'left': this.headingRad = Math.PI;
      break;
      case 'right': this.headingRad = 0;
      break;
      case 'top': this.headingRad = (3/2) * Math.PI;
      break;
      case 'down': this.headingRad = (1/2) * Math.PI;
      break;
      default: this.headingRad = 0;
    }
  }

  update(timestamp, updateIntervalMs) {
    const elapsedMs = timestamp - this.timestampPrevMs;
    if(elapsedMs > updateIntervalMs) {
      this.timestampPrevMs = timestamp;
      const pixels = (this.speedPixelPerMs * elapsedMs);
      const pixelsInX = Math.cos(this.headingRad) * pixels;
      const pixelsInY = Math.sin(this.headingRad) * pixels;

      this.ctx.clearRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2)
      this.x += pixelsInX;
      this.y += pixelsInY;
      this.ctx.fillStyle = 'darkslategrey';
      this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  setProximity(entityManagerArr) {
    const entity = entityFns.create({...this});
    const isEntityCloseTo = entityFns.isCloseToEntity(entity);
    const accAnyEntitiesClose = (acc, val) => {
      const entityOther = entityFns.create(val);
      return acc || isEntityCloseTo(entityOther);
    };
    const isClose = entityManagerArr.reduce(accAnyEntitiesClose, false);

    if(isClose) {
      this.ctx.clearRect(entity.x - 1, entity.y - 1, entity.width + 2, entity.height + 2)
      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
    }
  }
}
