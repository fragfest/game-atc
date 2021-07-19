const entityFns = require('./entity');

const convertToSmallRad = rad => (rad < 2 * Math.PI) ? rad : (rad - 2 * Math.PI);
const convertToPosRad = rad => (rad >= 0) ? rad : (2 * Math.PI + rad); 
const degreesToRad = degrees => (Number(degrees) - 90) * Math.PI / 180;
// zero degrees is east
const headingToRad = heading => convertToPosRad(degreesToRad(heading));

module.exports = class Square {
  constructor(entityLayerObj, textLayerObj, positionObj) {
    this.id = Math.random();
    this.ctx = entityLayerObj.ctx;
    this.textLayerObj = textLayerObj;
    this.x = positionObj.x;
    this.y = positionObj.y;
    this.headingRad = headingToRad(positionObj.heading);
    this.headingTargetRad = 0;
    this.setHeading(positionObj.heading);
    this.turnRateRadPerMs = 0.0001;
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
    const inputHeadingIsAllInts = inputHeadingArr.reduce(accAllAreInts, true);
    if(!inputHeadingIsAllInts) return;

    const heading = parseInt(inputHeading);
    // TODO return if heading > 360 or <= 0

    this.headingTargetRad = headingToRad(heading);
  }

  // TODO remove
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
    let heading = this.headingRad;
    let headingTarget = this.headingTargetRad;
    let headingSmall = convertToSmallRad(heading);
    let headingLarge = headingSmall + 2 * Math.PI;
    let headingTargetSmall = convertToSmallRad(headingTarget);
    let headingTargetLarge = headingTargetSmall + 2 * Math.PI;

    let smallDiff = Math.abs(headingTargetSmall - headingSmall);
    let highestSmall = (headingTargetSmall > headingSmall) ? headingTargetSmall : headingSmall;
    const isLowestLargeTarget = (headingTargetLarge < headingLarge);
    let lowestLarge = isLowestLargeTarget ? headingTargetLarge : headingLarge;
    let betweenSmallLargeDiff = lowestLarge - highestSmall;
    const isClosestSmall = smallDiff < betweenSmallLargeDiff;
    const isOppositeHeading = smallDiff === Math.PI;

    const turnRads = this.turnRateRadPerMs * deltaTimeMs;
    if(headingTarget === heading) {
      console.log('at target')
    } else if(isOppositeHeading) {
      console.log('turn right 180')
      heading = headingSmall + turnRads;
    } else if(isClosestSmall) {
      console.log('use small')

      const turnRight = headingTargetSmall > headingSmall;
      if(turnRight) heading = headingSmall + turnRads;
      else heading = headingSmall - turnRads;

      if(turnRight) {
        heading = (heading > headingTargetSmall) ? headingTargetSmall : heading;
        console.log('turn right', headingTargetSmall, heading)
      } else {
        heading = (heading < headingTargetSmall) ? headingTargetSmall : heading;
        console.log('turn left', headingTargetSmall, heading)
      }

    } else {
      console.log('use between')

      if(isLowestLargeTarget) {
        heading = headingSmall + turnRads;
        heading = (heading > headingTargetLarge) ? headingTargetLarge : heading;
        console.log('turn right', headingTargetLarge, heading)
      } else {
        heading = headingLarge - turnRads;
        heading = (heading < headingTargetSmall) ? headingTargetSmall : heading;
        console.log('turn left', headingTargetSmall, heading)
      }
    }

    const pixels = (this.speedPixelPerMs * deltaTimeMs);
    const pixelsInX = Math.cos(heading) * pixels;
    const pixelsInY = Math.sin(heading) * pixels;

    this.headingRad = convertToPosRad(convertToSmallRad(heading));
    this.ctx.clearRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
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
