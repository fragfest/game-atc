const entityFns = require('./entity');

module.exports = class Square {
  constructor(entityLayerObj, textLayerObj, positionObj) {
    this.id = Math.random();
    this.ctx = entityLayerObj.ctx;
    this.textLayerObj = textLayerObj;
    this.x = positionObj.x;
    this.y = positionObj.y;
    this.headingRad = positionObj.heading;   // in radians. 0 is 100% to the right
    this.timestampPrevMs = 0;
    this.speedPixelPerMs = 0.005;
    this.width = 10;
    this.height = 10;
  }

  setHeading(inputHeading) {
    if(!inputHeading && inputHeading !== 0) return;
    if(inputHeading.toString().length !== 3) return;
    const inputHeadingArr = inputHeading.toString().split('');
    const accAllAreInts = (acc, val) => acc && Number.isInteger(parseInt(val));
    const allCharsCanBeInts = inputHeadingArr.reduce(accAllAreInts, true);
    if(!allCharsCanBeInts) return;

    const heading = parseInt(inputHeading);
    const headingRad = (heading - 90) * Math.PI / 180;
    this.headingRad = headingRad;
  }

  setHeadingStr(direction) {
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

  update(deltaTimeMs) {
      const pixels = (this.speedPixelPerMs * deltaTimeMs);
      const pixelsInX = Math.cos(this.headingRad) * pixels;
      const pixelsInY = Math.sin(this.headingRad) * pixels;

      this.ctx.clearRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2)
      this.x += pixelsInX;
      this.y += pixelsInY;
      this.ctx.fillStyle = 'darkslategrey';
      this.ctx.fillRect(this.x, this.y, this.width, this.height);
      this.textLayerObj.ctx.fillStyle = 'lightgreen';
      this.textLayerObj.ctx.fillText('square', this.x, this.y + 5);
  }

  setProximity(timestamp, updateIntervalMs, entityManagerArr) {
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

      const elapsedMs = timestamp - this.timestampPrevMs;
      if(elapsedMs > updateIntervalMs) {
        this.timestampPrevMs = timestamp;
        this.textLayerObj.ctx.fillStyle = 'lightgreen';
        this.textLayerObj.ctx.fillText('square', this.x, this.y + 5);
      }
    }
  }
}
