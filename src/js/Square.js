const {
  inputHeadingToRad,
  convertToSmallRad,
  convertToPosRad,
  convHdgRadToThreeDigits,
  leftPadZeros,
  altitudeDisplay,
} = require('./utils');
const entityFns = require('./entity');

const { MessageEvents, publish } = require('./events/messages');

////////////////////////////////////////////////////////////
// class Square
////////////////////////////////////////////////////////////
module.exports = class Square {
  constructor(title, entityLayerObj, textLayerObj, headingLayerObj, htmlDiv, positionObj, planeObj) {
    this.id = Math.random();
    this.title = title.trim().substring(0, 6);
    this.ctx = entityLayerObj.ctx;
    this.canvasWidth = entityLayerObj.width;
    this.canvasHeight = entityLayerObj.height;
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
    this.squareOneDiv.style.width = 22 + 'px';
    this.squareOneDiv.style.height = 22 + 'px';

    this.width = 5;
    this.height = 5;
    this.x = positionObj.x;
    this.y = positionObj.y;

    this.altitude = positionObj.altitude;
    this.altitudeMin = 100;
    this.altitudeMax = 40000;
    this.setAltitude(positionObj.altitude, false);
    this.headingRad = inputHeadingToRad(positionObj.heading);
    this.heading = positionObj.heading;
    this.headingTargetRad = 0;
    this.setHeadingDegrees(positionObj.heading);
    this.speed = positionObj.speed;
    this.speedPixelPerMs = 0;
    this.speedTarget = 0;
    this.setSpeed(positionObj.speed, false);
    this.speedMin = planeObj.airframeObj.speedMin;
    this.speedLanding = planeObj.airframeObj.speedLanding;
    this.speedMax = planeObj.airframeObj.speedMax;

    // display
    this.isSelected = false;

    // states
    this.isNonInteractive = false;
    this.destroyFlag = false;
    this.onGlidePath = false;
    this.isTouchedDown = false;
    this.landing = false;
    this.distPrev = Infinity;

    // flightstrip info
    this.hasProximityAlert = false;
    this.destinationType = planeObj.destinationType || "";
    this.runway = planeObj.runway || "";
    this.waypoint = planeObj.waypoint || "";
    this.airframe = planeObj.airframeObj.type || "";
    this.wake = planeObj.airframeObj.wake;

    // constants
    this.pixelsBasePerKnot = 0.001;
    this.speedDeltaPerMs = planeObj.airframeObj.speedDeltaPerMs;
    this.speedRatePerMs = planeObj.airframeObj.speedRatePerMs;
    this.altitudeRatePerMs = planeObj.airframeObj.altitudeRatePerMs;
    this.turnRateRadPerMs = planeObj.airframeObj.turnRateRadPerMs;
  }

  clickEventCB() { throw new Error('clickEventCB not attached'); }

  setOnGlidepath(arg) {
    this.onGlidePath = !!arg;
  }

  setDistPrev(distPrevArg) {
    this.distPrev = distPrevArg;
  }

  setIsTouchedDown(isTouchedDown) {
    this.isTouchedDown = !!isTouchedDown;
    this.speedDeltaPerMs = this.speedDeltaPerMs * 2.5;
    this.setNonInteractive();
  }

  setLanding(isLanding) {
    this.landing = !!isLanding;
    if (!isLanding) {
      this.onGlidePath = false;
      this.distPrev = Infinity;
    }
  }

  /**
   * @description set speed & landing modes
   * @param {Number|String} speedArg knots
   * @param {Boolean} isLanding set landing mode to attempt glideslope lineup
   * @param {Boolean} force force speed set
   */
  setSpeed(speedArg, isLanding, force) {
    if (this.isNonInteractive && !force) return;

    this.setLanding(isLanding);
    let speed = parseInt(speedArg);
    let speedMin = this.speedMin;
    if (isLanding) speedMin = this.speedLanding;
    if (this.isTouchedDown) speedMin = 0;

    speed = (speed < speedMin) ? speedMin : speed;
    speed = (speed > this.speedMax) ? this.speedMax : speed;
    this.speedTarget = Math.floor(speed / 5) * 5;
  }

  setAltitude(altitudeArg, isLanding, isTouchedDown) {
    if (this.isNonInteractive && !isTouchedDown) return;

    this.setLanding(isLanding);
    let altitude = parseInt(altitudeArg);
    if (isTouchedDown) {
      return this.altitudeTarget = altitude;
    }

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
    if (this.isNonInteractive) return;

    this.setLanding(isLanding);
    this.headingTargetRad = convertToPosRad(convertToSmallRad(headingRad));
  }

  setHeadingDegrees(inputHeading) {
    if (!inputHeading && inputHeading !== 0) return;
    if (inputHeading.toString().length !== 3) return;
    const inputHeadingArr = inputHeading.toString().split('');
    const accAllAreInts = (acc, val) => acc && Number.isInteger(parseInt(val));
    const inputHeadingIsAllInts = inputHeadingArr.reduce(accAllAreInts, true);
    if (!inputHeadingIsAllInts) return;

    const heading = parseInt(inputHeading);
    if (heading > 360 || heading <= 0) return;

    this.setHeadingTarget(inputHeadingToRad(heading), false);
  }

  setNonInteractive() {
    this.isNonInteractive = true;
    this.squareOneDiv.remove();
  }

  setDestroyFlag(shouldDestroy) {
    this.destroyFlag = !!shouldDestroy;
  }

  destroy() {
    hide(this);
    this.squareOneDiv.remove();
  }

  updateDestroy({ entityManagerArr }) {
    if (!this.destroyFlag) return;

    this.destroy();
    const index = entityManagerArr.findIndex(entity => entity.id === this.id);
    if (index === -1) return;
    entityManagerArr.splice(index, 1);
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
    if (headingTargetSmall === headingSmall) return headingTargetSmall;
    if (isOppositeHeading) return headingIncrease;

    if (isClosestSmall) {
      const turnRight = headingTargetSmall > headingSmall;
      if (turnRight) return (headingIncrease > headingTargetSmall) ? headingTargetSmall : headingIncrease;
      else return (headingDecrease < headingTargetSmall) ? headingTargetSmall : headingDecrease;
    }
    // else isClosestBetween
    const turnRight = isLowestLargeTarget;
    if (turnRight) return (headingIncrease > headingTargetLarge) ? headingTargetLarge : headingIncrease;
    else return (headingLargeDecrease < headingTargetSmall) ? headingTargetSmall : headingLargeDecrease;
  }

  updateAltitude(altitudeOld, altitudeTarget, altitudeChange) {
    const delta = Math.round(altitudeTarget - altitudeOld);
    const altitudeIncrease = altitudeOld + altitudeChange;
    const altitudeDecrease = altitudeOld - altitudeChange;
    if (delta === 0) return altitudeOld;
    else if (delta > 0) return (altitudeIncrease > altitudeTarget) ? altitudeTarget : altitudeIncrease;
    else return (altitudeDecrease < altitudeTarget) ? altitudeTarget : altitudeDecrease;
  }

  updateSpeed(speed, speedTarget, speedIncreaseArg, speedDecreaseArg) {
    const delta = Math.round(speedTarget - speed);
    const speedIncrease = speed + speedIncreaseArg;
    const speedDecrease = speed - speedDecreaseArg;
    if (delta === 0) return speed;
    if (delta > 0) return (speedIncrease > speedTarget) ? speedTarget : speedIncrease;
    return (speedDecrease < speedTarget) ? speedTarget : speedDecrease;
  }

  update({ deltaTimeMs }) {
    const headingOld = this.headingRad;
    const headingTarget = this.headingTargetRad;
    const headingChange = this.turnRateRadPerMs * deltaTimeMs;
    const headingRadNewLarge = this.updateHeading(headingOld, headingTarget, headingChange);
    const headingRadNew = convertToPosRad(convertToSmallRad(headingRadNewLarge));

    const pixelsSpeedDeltaBase = this.speedDeltaPerMs * deltaTimeMs;
    const speedDelta = pixelsSpeedDeltaBase * this.pixelsBasePerKnot;
    const speedNew = this.updateSpeed(this.speed, this.speedTarget, speedDelta, speedDelta);
    const pixelsSpeedRateBase = this.speedRatePerMs * deltaTimeMs;
    const pixelsSpeed = pixelsSpeedRateBase * this.pixelsBasePerKnot * speedNew;
    const pixelsInX = Math.cos(headingRadNew) * pixelsSpeed;
    const pixelsInY = Math.sin(headingRadNew) * pixelsSpeed;

    const altitudeOld = this.altitude;
    const altitudeTarget = this.altitudeTarget;
    const altitudeChange = this.altitudeRatePerMs * deltaTimeMs;
    const altitudeNew = this.updateAltitude(altitudeOld, altitudeTarget, altitudeChange);

    hide(this);
    this.x += pixelsInX;
    this.y += pixelsInY;
    this.squareOneDiv.style.left = this.x - 10 + 'px';
    this.squareOneDiv.style.top = this.y - 10 + 'px';
    this.headingRad = headingRadNew;
    this.heading = convHdgRadToThreeDigits(headingRadNew);
    this.altitude = altitudeNew;
    this.speed = speedNew;

    let color = 'white';
    if (this.landing) color = 'yellow';
    if (this.hasProximityAlert) color = 'orangered';
    if (this.isSelected) color = 'greenyellow';
    draw(this, color);

    const outsideCanvasWidth = (x, offset) => (x > (this.canvasWidth + offset)) || (x < (0 - offset));
    const outsideCanvasHeight = (y, offset) => (y > (this.canvasHeight + offset)) || (y < (0 - offset));
    if (outsideCanvasWidth(this.x, 0) || outsideCanvasHeight(this.y, 0)) {
      this.setNonInteractive();
    }
    if (outsideCanvasWidth(this.x, 15) || outsideCanvasHeight(this.y, 15)) {
      this.setDestroyFlag(true);
      publish(MessageEvents.MessageAllEV, this.title + ' exited area of control');
    }
  }

  draw() {
    let color = 'white';
    if (this.landing) color = 'yellow';
    if (this.hasProximityAlert) color = 'orangered';
    if (this.isSelected) color = 'greenyellow';
    hide(this);
    draw(this, color);
  }

  setSelected(isSelected) {
    this.isSelected = !!isSelected;
  }

  setProximity({ entityManagerArr }) {
    const isEntityCloseTo = entityFns.isCloseToEntity(this);
    const accAnySquaresClose = (acc, val) => {
      const entityOther = val;
      const isSquare = val instanceof Square;
      const areBothFlying = !this.isTouchedDown && !entityOther.isTouchedDown;
      return acc || (isEntityCloseTo(entityOther) && isSquare && areBothFlying);
    };
    const isClose = entityManagerArr.reduce(accAnySquaresClose, false);

    if (isClose) {
      this.hasProximityAlert = true;
      let color = 'orangered';
      if (this.isSelected) color = 'greenyellow';
      hide(this);
      draw(this, color);
    } else {
      this.hasProximityAlert = false;
    }
  }
};
////////////////////////////////////////////////////////////
// end class Square
////////////////////////////////////////////////////////////
const hide = (self) => {
  self.ctx.clearRect(self.x - 1, self.y - 1, self.width + 2, self.height + 2)
}

const draw = (self, color) => {
  self.ctx.fillStyle = color;
  self.ctx.globalAlpha = 1;
  self.ctx.fillRect(self.x, self.y, self.width, self.height);
  self.ctx.clearRect(self.x + 1, self.y + 1, self.width - 2, self.height - 2);

  const pixelsInX = Math.cos(self.headingRad) * self.speed / 15;
  const pixelsInY = Math.sin(self.headingRad) * self.speed / 15;
  const center = { x: self.x + self.width / 2, y: self.y + self.height / 2 };
  self.headingLayerObj.ctx.strokeStyle = color;
  self.headingLayerObj.ctx.beginPath();
  self.headingLayerObj.ctx.moveTo(center.x, center.y);
  self.headingLayerObj.ctx.lineTo(center.x - pixelsInX, center.y - pixelsInY);
  self.headingLayerObj.ctx.stroke();

  const degreesDisplay = self.heading;
  const speedDisplay = leftPadZeros(Math.round(self.speed));
  const altDisplay = altitudeDisplay(self.altitude);

  self.textLayerObj.ctx.fillStyle = color;
  self.textLayerObj.ctx.font = "11px Arial"
  self.textLayerObj.ctx.fillText(self.title, self.x, self.y - 2);
  self.textLayerObj.ctx.fillStyle = color;
  self.textLayerObj.ctx.fillText('              ' + degreesDisplay + '\u00B0', self.x, self.y - 2);
  self.textLayerObj.ctx.fillText('              ' + altDisplay + ' ft', self.x, self.y + 8);
  self.textLayerObj.ctx.fillText('              ' + speedDisplay + ' kts', self.x, self.y + 18);
};
