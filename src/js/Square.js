const entityFns = require('./entity');

const convertToSmallRad = rad => (rad < 2 * Math.PI) ? rad : (rad - 2 * Math.PI);
const convertToPosRad = rad => (rad >= 0) ? rad : (2 * Math.PI + rad); 
const convertToSmallDegrees = degrees => (degrees <= 360) ? degrees : (degrees - 360);
// zero degrees is east on the Canvas
const degreesToRad = degrees => (Number(degrees) - 90) * Math.PI / 180;
const radToDegrees = rad => (Number(rad) * 180 / Math.PI) + 90;
const inputHeadingToRad = heading => convertToPosRad(degreesToRad(heading));

module.exports = class Square {
  constructor(entityLayerObj, textLayerObj, headingLayerObj, positionObj) {
    this.id = Math.random();
    this.ctx = entityLayerObj.ctx;
    this.textLayerObj = textLayerObj;
    this.headingLayerObj = headingLayerObj;
    this.x = positionObj.x;
    this.y = positionObj.y;
    this.headingRad = inputHeadingToRad(positionObj.heading);
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
    if(heading > 360 || heading <= 0) return;

    this.headingTargetRad = inputHeadingToRad(heading);
  }

  // TODO remove
  setHeadingStr(direction) {
    switch(direction){
      case 'left': this.headingTargetRad = Math.PI;
      break;
      case 'right': this.headingTargetRad = 0;
      break;
      case 'top': this.headingTargetRad = (3/2) * Math.PI;
      break;
      case 'down': this.headingTargetRad = (1/2) * Math.PI;
      break;
      default: this.headingTargetRad = 0;
    }
  }

  updateHeading(headingOld, headingTarget, headingChange) {
    const headingSmall = convertToSmallRad(headingOld);
    const headingTargetSmall = convertToSmallRad(headingTarget);
    const headingLarge = headingSmall + 2 * Math.PI;
    const headingTargetLarge = headingTargetSmall + 2 * Math.PI;

    let smallDiff = Math.abs(headingTargetSmall - headingSmall);
    let highestSmall = (headingTargetSmall > headingSmall) ? headingTargetSmall : headingSmall;
    const isLowestLargeTarget = (headingTargetLarge < headingLarge);
    let lowestLarge = isLowestLargeTarget ? headingTargetLarge : headingLarge;
    let betweenDiff = lowestLarge - highestSmall;
    const isClosestSmall = smallDiff < betweenDiff;
    const isOppositeHeading = smallDiff === Math.PI;

    const headingIncrease = headingSmall + headingChange;
    const headingDecrease = headingSmall - headingChange;
    const headingLargeDecrease = headingLarge - headingChange;
    if(headingTargetSmall === headingSmall) return headingTargetSmall;
    if(isOppositeHeading) return headingIncrease;
    
    if(isClosestSmall) {
      const turnRight = headingTargetSmall > headingSmall;
      if(turnRight) return (headingIncrease > headingTargetSmall) ? headingTargetSmall : headingIncrease;
      else return (headingDecrease < headingTargetSmall) ? headingTargetSmall : headingDecrease;
    }
    // else isClosestBetween :: if(isLowestLargeTarget) turnRight
    if(isLowestLargeTarget) return (headingIncrease > headingTargetLarge) ? headingTargetLarge : headingIncrease;
    else return (headingLargeDecrease < headingTargetSmall) ? headingTargetSmall : headingLargeDecrease;
  }

  update(deltaTimeMs) {
    const headingOld = this.headingRad;
    const headingTarget = this.headingTargetRad;
    const headingChange = this.turnRateRadPerMs * deltaTimeMs;
    const headingRadNewLarge = this.updateHeading(headingOld, headingTarget, headingChange);
    const headingRadNew = convertToPosRad(convertToSmallRad(headingRadNewLarge));

    const pixels = (this.speedPixelPerMs * deltaTimeMs);
    const pixelsInX = Math.cos(headingRadNew) * pixels;
    const pixelsInY = Math.sin(headingRadNew) * pixels;

    this.ctx.clearRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
    this.x += pixelsInX;
    this.y += pixelsInY;
    this.ctx.fillStyle = 'darkslategrey';
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.textLayerObj.ctx.fillStyle = 'lightgreen';

    const center = { x: this.x + this.width / 2, y: this.y + this.height / 2 };
    this.headingLayerObj.ctx.beginPath();
    this.headingLayerObj.ctx.moveTo(center.x, center.y);
    this.headingLayerObj.ctx.lineTo(center.x + pixelsInX * 1.5, center.y + pixelsInY * 1.5);
    this.headingLayerObj.ctx.stroke();

    this.headingRad = headingRadNew;
    const deg = Math.round(convertToSmallDegrees(radToDegrees(headingRadNew)));
    let degreesDisplay = deg;
    if(deg < 10) degreesDisplay = '00' + deg;
    else if(deg < 100) degreesDisplay = '0' + deg;
    this.textLayerObj.ctx.fillText('square ' + degreesDisplay, this.x, this.y + 5);
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
      this.textLayerObj.ctx.fillStyle = 'lightgreen';
      this.textLayerObj.ctx.fillText('square', this.x, this.y + 5);
    }
  }
}
