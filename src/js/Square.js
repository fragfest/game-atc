const {
  inputHeadingToRad,
  convertToSmallRad,
  convertToPosRad,
  convertToSmallDegrees,
  radToDegrees,
} = require('./utils');
const entityFns = require('./entity');

module.exports = class Square {
  constructor(title, entityLayerObj, textLayerObj, headingLayerObj, htmlDiv, positionObj) {
    this.id = Math.random();
    this.title = title.trim().substring(0, 6);
    this.ctx = entityLayerObj.ctx;
    this.textLayerObj = textLayerObj;
    this.headingLayerObj = headingLayerObj;

    this.squareOneDiv = document.createElement('div');
    htmlDiv.appendChild(this.squareOneDiv);
    this.squareOneDiv.id = this.title;
    this.squareOneDiv.style.position = 'absolute';
    this.squareOneDiv.addEventListener('mouseup', () => this.clickEventCB());
    this.squareOneDiv.addEventListener('mouseenter', () => this.squareOneDiv.style.cursor = 'pointer');
    this.squareOneDiv.addEventListener('mouseleave', () => this.squareOneDiv.style.cursor = 'none');

    this.squareOneDiv.style.left = positionObj.x - 8 + 'px';
    this.squareOneDiv.style.top = positionObj.y - 8 + 'px';
    this.x = positionObj.x;
    this.y = positionObj.y;
    this.altitude = positionObj.altitude;
    this.altitudeTarget = 1000;
    this.altitudeMin = 100;
    this.altitudeMax = 40000;
    this.setAltitude(positionObj.altitude);
    this.headingRad = inputHeadingToRad(positionObj.heading);
    this.headingTargetRad = 0;
    this.setHeadingDegrees(positionObj.heading);
    this.speed = 180;
    this.speedTarget = 180;
    this.speedPixelPerMs = 0.005;
    this.speedTargetPixelPerMs = 0.005;
    this.setSpeed(positionObj.speed);
    this.speedMin = 135;
    this.speedLanding = 135; // TODO when ready can unlink from speedMin
    this.speedMax = 500;

    this.landing = false;
    this.distPrev = Infinity;

    this.altitudeRatePerMs = 0.05;
    this.turnRateRadPerMs = 0.0001;
    this.timestampPrevMs = 0;
    this.width = 5;
    this.height = 5;
    this.squareOneDiv.style.width = 22 + 'px';
    this.squareOneDiv.style.height = 22 + 'px';
  }

  clickEventCB() { throw new Error('clickEventCB not attached'); }

  setLanding(isLanding) {
    this.landing = !!isLanding;
    if(!isLanding) this.distPrev = Infinity;
  }

  setSpeed(speedArg, isTouchedDown) {
    let speed = parseInt(speedArg);
    const speedMin = isTouchedDown ? 0 : this.speedMin;

    speed = (speed < speedMin) ? speedMin : speed;
    speed = (speed > this.speedMax) ? this.speedMax : speed;
    this.speedTarget = Math.floor(speed / 10) * 10;
    this.speedTargetPixelPerMs = convertKnotsToPixelsPerMs(speed);
  }

  setAltitude(altitudeArg) {
    let altitude = parseInt(altitudeArg);
    altitude = (altitude < this.altitudeMin) ? this.altitudeMin : altitude;
    altitude = (altitude > this.altitudeMax) ? this.altitudeMax : altitude;
    this.altitudeTarget = Math.floor(altitude / 100) * 100;
  }

  setHeadingRad(headingRadArg, isLanding) {
    const headingRad = convertToPosRad(convertToSmallRad(headingRadArg));
    this.headingRad = headingRad;
    this.setHeadingTarget(headingRad, isLanding);
  }

  setHeadingTarget(headingRad, isLanding) {
    this.setLanding(isLanding);
    this.headingTargetRad = convertToPosRad(convertToSmallRad(headingRad));
  }

  setHeadingDegrees(inputHeading) {
    if(!inputHeading && inputHeading !== 0) return;
    if(inputHeading.toString().length !== 3) return;
    const inputHeadingArr = inputHeading.toString().split('');
    const accAllAreInts = (acc, val) => acc && Number.isInteger(parseInt(val));
    const inputHeadingIsAllInts = inputHeadingArr.reduce(accAllAreInts, true);
    if(!inputHeadingIsAllInts) return;

    const heading = parseInt(inputHeading);
    if(heading > 360 || heading <= 0) return;

    this.setHeadingTarget(inputHeadingToRad(heading), false);
  }

  // TODO remove
  setHeadingStr(direction) {
    switch(direction){
      case 'left': this.setHeadingTarget(Math.PI, false);
      break;
      case 'right': this.setHeadingTarget(0, false);
      break;
      case 'top': this.setHeadingTarget((3/2) * Math.PI, false);
      break;
      case 'down': this.setHeadingTarget((1/2) * Math.PI, false);
      break;
      default: this.setHeadingTarget(0, false);
    }
  }

  hide() {
    this.ctx.clearRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2)
    const center = { x: this.x + this.width / 2, y: this.y + this.height / 2 };
    this.headingLayerObj.ctx.clearRect(center.x - 25, center.y - 25, 50, 50);
    this.textLayerObj.ctx.clearRect(this.x, this.y - 10, 35, 10);
    this.textLayerObj.ctx.clearRect(this.x + 35, this.y - 10, 40, 35);
  }

  destroy() {
    this.hide();
    this.squareOneDiv.remove();
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
    // else isClosestBetween
    // if(isLowestLargeTarget) turnRight
    if(isLowestLargeTarget) return (headingIncrease > headingTargetLarge) ? headingTargetLarge : headingIncrease;
    else return (headingLargeDecrease < headingTargetSmall) ? headingTargetSmall : headingLargeDecrease;
  }

  updateAltitude(altitudeOldArg, altitudeTargetArg, altitudeChangeArg) {
    const altitudeOld = Math.floor(altitudeOldArg / 100) * 100;
    const altitudeTarget = Math.floor(altitudeTargetArg / 100) * 100;
    const altitudeChange = Math.floor(altitudeChangeArg / 100) * 100;
    const delta = altitudeTarget - altitudeOld;
    const altitudeIncrease = altitudeOld + altitudeChange;
    const altitudeDecrease = altitudeOld - altitudeChange;
    if(delta === 0) return altitudeOld;
    else if(delta > 0) return (altitudeIncrease > altitudeTarget) ? altitudeTarget : altitudeIncrease;
    else return (altitudeDecrease < altitudeTarget) ? altitudeTarget : altitudeDecrease;
  }

  updateSpeed(speedArg, speedTargetArg, speedIncreaseArg, speedDecreaseArg) {
    const speed = Math.round(speedArg);
    const speedTarget = Math.round(speedTargetArg);
    const delta = speedTarget - speed;
    const speedIncrease = speed + speedIncreaseArg;
    const speedDecrease = speed - speedDecreaseArg;
    if(delta === 0) return speed;
    else if(delta > 0) return (speedIncrease > speedTarget) ? speedTarget : speedIncrease;
    else return (speedDecrease < speedTarget) ? speedTarget : speedDecrease;
  }

  update({ deltaTimeMs }) {
    const headingOld = this.headingRad;
    const headingTarget = this.headingTargetRad;
    const headingChange = this.turnRateRadPerMs * deltaTimeMs;
    const headingRadNewLarge = this.updateHeading(headingOld, headingTarget, headingChange);
    const headingRadNew = convertToPosRad(convertToSmallRad(headingRadNewLarge));

    const speedNew = this.updateSpeed(this.speed, this.speedTarget, 15, 15);
    const pixels = (this.speedPixelPerMs * deltaTimeMs);
    const pixelsInX = Math.cos(headingRadNew) * pixels;
    const pixelsInY = Math.sin(headingRadNew) * pixels;

    const altitudeOld = this.altitude;
    const altitudeTarget = this.altitudeTarget;
    const altitudeChange = this.altitudeRatePerMs * deltaTimeMs;
    const altitudeNew = this.updateAltitude(altitudeOld, altitudeTarget, altitudeChange);

    this.hide();
    this.x += pixelsInX;
    this.y += pixelsInY;
    this.squareOneDiv.style.left = this.x - 8 + 'px';
    this.squareOneDiv.style.top = this.y - 8 + 'px';
    this.headingRad = headingRadNew;
    this.altitude = altitudeNew;
    this.speed = speedNew;
    this.speedPixelPerMs = convertKnotsToPixelsPerMs(speedNew);
    const speedPixels = this.speedPixelPerMs * deltaTimeMs;

    draw(this, 'greenyellow', speedPixels);
  }

  setProximity({ entityManagerArr, deltaTimeMs }) {
    const entity = entityFns.create({...this});
    const isEntityCloseTo = entityFns.isCloseToEntity(entity);
    const accAnySquaresClose = (acc, val) => {
      const entityOther = entityFns.create(val);
      const isSquare = val instanceof Square;
      return acc || (isEntityCloseTo(entityOther) && isSquare);
    };
    const isClose = entityManagerArr.reduce(accAnySquaresClose, false);

    if(isClose) {
      this.hide();
      const speedPixels = this.speedPixelPerMs * deltaTimeMs;
      draw(this, 'darkred', speedPixels);
    }
  }
}; // end class Square

const convertKnotsToPixelsPerMs = knots => parseInt(knots) / 36000;

const draw = (self, color, speedPixels) => {
  self.ctx.fillStyle = color;
  self.ctx.globalAlpha = 1;
  self.ctx.fillRect(self.x, self.y, self.width, self.height);
  self.ctx.clearRect(self.x + 1, self.y + 1, self.width - 2, self.height - 2);

  const pixels = speedPixels;
  const pixelsInX = Math.cos(self.headingRad) * pixels;
  const pixelsInY = Math.sin(self.headingRad) * pixels;
  const center = { x: self.x + self.width / 2, y: self.y + self.height / 2 };
  self.headingLayerObj.ctx.strokeStyle = color;
  self.headingLayerObj.ctx.beginPath();
  self.headingLayerObj.ctx.moveTo(center.x, center.y);
  self.headingLayerObj.ctx.lineTo(center.x - pixelsInX * 2, center.y - pixelsInY * 2);
  self.headingLayerObj.ctx.stroke();

  const deg = Math.round(convertToSmallDegrees(radToDegrees(self.headingRad)));
  let degreesDisplay = deg;
  if(deg < 10) degreesDisplay = '00' + deg;
  else if(deg < 100) degreesDisplay = '0' + deg;
  let speedDisplay = self.speed;
  if(self.speed < 10) speedDisplay = '00' + self.speed;
  else if(self.speed < 100) speedDisplay = '0' + self.speed;

  self.textLayerObj.ctx.fillStyle = color;
  self.textLayerObj.ctx.font = "bold 10px Arial"
  self.textLayerObj.ctx.fillText(self.title, self.x, self.y - 2);
  self.textLayerObj.ctx.fillStyle = color;
  self.textLayerObj.ctx.fillText('              ' + degreesDisplay, self.x, self.y - 2);
  self.textLayerObj.ctx.fillText('              ' + self.altitude + ' ft', self.x, self.y + 8);
  self.textLayerObj.ctx.fillText('              ' + speedDisplay + ' kts', self.x, self.y + 18);
};
