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
const {
  uniqueProximityPair,
  planeProximityPenalty,
  planeLandSuccess,
  planeLeaveFail
} = require('./panelBottom/score');
const { DestinationType } = require('./aircraft/airframe');

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
    this.htmlDiv = htmlDiv;
    this.positionObj = positionObj;

    this.squareOneDiv = null;
    this.width = 5;
    this.height = 5;
    this.x = positionObj.x;
    this.y = positionObj.y;
    this.altitude = positionObj.altitude;
    this.altitudeTarget = 0;
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
    this.speedTakeoff = planeObj.airframeObj.speedTakeoff;

    // display
    this.isSelected = false;

    // states
    this.isFlyingOutOfArea = false;
    this.isNonInteractive = false;
    this.destroyFlag = false;
    this.onGlidePath = false;
    this.isTaxiing = false;
    this.isTouchedDown = false;
    this.landing = false;
    this.isHolding = false;
    this.distPrev = Infinity;
    this.takeoff = false;

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

    // departure
    if (this.destinationType === DestinationType.Arrival) {
      _createHtmlEl(this);
      return;
    }
    this.setAltitude(0, false, true);
    this.isNonInteractive = true;
    this.isTaxiing = true;
  }

  clickEventCB() { throw new Error('clickEventCB not attached'); }

  startTakeoff() {
    this.setIsTaxiing(false);
    this.takeoff = true;
  }

  setIsTaxiing(isTaxiing) {
    this.isTaxiing = !!isTaxiing;
    if (!this.squareOneDiv) {
      _createHtmlEl(this);
    }
  }

  setHolding(isHolding, waypoint) {
    this.waypoint = waypoint;
    this.isHolding = !!isHolding;
  }

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
      this.altitudeTarget = altitude;
      return;
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

  /**
   * @param {Number} headingRad Heading in rad. Zero is East, positive angle is CW
   * @param {Boolean} isLanding set/cancel landing mode
   * @param {Boolean} isHolding set/cancel holding mode
   * @returns 
   */
  setHeadingTarget(headingRad, isLanding, isHolding) {
    if (this.isNonInteractive) return;

    this.setHolding(isHolding, this.waypoint);
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
    if (this.squareOneDiv) this.squareOneDiv.remove();
  }

  setDestroyFlag(shouldDestroy) {
    this.destroyFlag = !!shouldDestroy;
  }

  destroy() {
    this.hide();
    if (this.squareOneDiv) this.squareOneDiv.remove();
    if (this.isTouchedDown) {
      const scoreAdded = planeLandSuccess();
      publish(MessageEvents.MessageAllEV, this.title + ' landing complete (+' + scoreAdded + ')');
      return;
    }
    if (this.isFlyingOutOfArea) {
      const scoreRemoved = planeLeaveFail();
      publish(MessageEvents.MessageAllEV, this.title + ' failed handoff leaving area of control (' + scoreRemoved + ')');
      return;
    }
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

  getSpeedDelta(speed, deltaTimeMs) {
    const speedDeltaPerMs = this.speedDeltaPerMs;
    const speedTakeoff = this.speedTakeoff;
    const calcDelta = speedDeltaPerMsArg => {
      const pixelsSpeedDeltaBase = speedDeltaPerMsArg * deltaTimeMs;
      return pixelsSpeedDeltaBase * this.pixelsBasePerKnot;
    }

    if (!this.takeoff) return calcDelta(speedDeltaPerMs);
    if (speed < 6) return calcDelta(speedDeltaPerMs * 0.5);
    if (speed > 6 && speed < 10) return calcDelta(speedDeltaPerMs);
    if (speed > 10 && speed < 20) return calcDelta(speedDeltaPerMs * 1.5);
    if (speed > 20 && speed < 30) return calcDelta(speedDeltaPerMs * 2);
    if (speed > 30 && speed < 40) return calcDelta(speedDeltaPerMs * 2.5);
    if (speed > 40 && speed < 100) return calcDelta(speedDeltaPerMs * 3.6);
    if (speed > 100 && speed < 110) return calcDelta(speedDeltaPerMs * 2.8);
    if (speed > 110 && speed < 120) return calcDelta(speedDeltaPerMs * 2.6);
    if (speed > 120 && speed < 140) return calcDelta(speedDeltaPerMs * 2.2);
    if (speed > 140 && speed < 150) return calcDelta(speedDeltaPerMs * 1.6);
    if (speed > 150) return calcDelta(speedDeltaPerMs * 1.2);
    if (speed > speedTakeoff) return calcDelta(speedDeltaPerMs);
    return calcDelta(speedDeltaPerMs);
  }

  update({ deltaTimeMs }) {
    const headingOld = this.headingRad;
    const headingTarget = this.headingTargetRad;
    const headingChange = this.turnRateRadPerMs * deltaTimeMs;
    const headingRadNewLarge = this.updateHeading(headingOld, headingTarget, headingChange);
    const headingRadNew = convertToPosRad(convertToSmallRad(headingRadNewLarge));

    if (this.takeoff) this.setSpeed(250, false, true);
    if (this.takeoff && (this.speed > this.speedTakeoff)) {
      this.isNonInteractive = false;
      this.takeoff = false;
      this.setSpeed(250, false, false);
      this.setAltitude(2000, false, false);
    }

    const speedDelta = this.getSpeedDelta(this.speed, deltaTimeMs);
    const speedNew = this.updateSpeed(this.speed, this.speedTarget, speedDelta, speedDelta);
    const pixelsSpeedRateBase = this.speedRatePerMs * deltaTimeMs;
    const pixelsSpeed = pixelsSpeedRateBase * this.pixelsBasePerKnot * speedNew;
    const pixelsInX = Math.cos(headingRadNew) * pixelsSpeed;
    const pixelsInY = Math.sin(headingRadNew) * pixelsSpeed;

    const altitudeOld = this.altitude;
    const altitudeChange = this.altitudeRatePerMs * deltaTimeMs;
    const altitudeNew = this.updateAltitude(altitudeOld, this.altitudeTarget, altitudeChange);

    this.x += pixelsInX;
    this.y += pixelsInY;
    if (this.squareOneDiv) {
      this.squareOneDiv.style.left = this.x - 10 + 'px';
      this.squareOneDiv.style.top = this.y - 10 + 'px';
    }
    this.headingRad = headingRadNew;
    this.heading = convHdgRadToThreeDigits(headingRadNew);
    this.altitude = altitudeNew;
    this.speed = speedNew;

    const outsideCanvasWidth = (x, offset) => (x > (this.canvasWidth + offset)) || (x < (0 - offset));
    const outsideCanvasHeight = (y, offset) => (y > (this.canvasHeight + offset)) || (y < (0 - offset));
    if (outsideCanvasWidth(this.x, 0) || outsideCanvasHeight(this.y, 0)) {
      this.setNonInteractive();
    }
    if (outsideCanvasWidth(this.x, 15) || outsideCanvasHeight(this.y, 15)) {
      this.setDestroyFlag(true);
      this.isFlyingOutOfArea = true;
    }
  }

  draw() {
    this.hide();
    if (this.isTaxiing) return;

    let color = 'white';
    if (this.landing) color = 'yellow';
    if (this.hasProximityAlert) color = 'orangered';
    if (this.isSelected) color = 'greenyellow';
    _draw(this, color);
  }

  hide() {
    this.ctx.clearRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2)
  }

  setSelected(isSelected) {
    this.isSelected = !!isSelected;
  }

  setProximity({ entityManagerArr }) {
    const isNotTaxiing = plane => !plane.isTaxiing && !this.isTaxiing;
    const isEntityCloseTo = entityFns.isCloseToEntity(this);
    const isValidClosePlane = plane => {
      const isSquare = plane instanceof Square;
      return isEntityCloseTo(plane) && isSquare && isNotTaxiing(plane);
    }

    const planeClose = entityManagerArr.find(isValidClosePlane);
    if (!planeClose) {
      this.hasProximityAlert = false;
      return;
    }

    this.hasProximityAlert = true;
    const pairFound = uniqueProximityPair(this, planeClose);
    if (pairFound) {
      const scoreDecrease = planeProximityPenalty(this, planeClose);
      if (scoreDecrease === null) return;

      const msg = this.title + ' & ' + planeClose.title + ' conflict alert';
      publish(MessageEvents.MessageProximityEV, {
        id: this.id + '|' + planeClose.id,
        msg,
        scoreDecrease,
      });
    }
  }
};
////////////////////////////////////////////////////////////
// end class Square
////////////////////////////////////////////////////////////

const _createHtmlEl = (self) => {
  self.squareOneDiv = document.createElement('div');
  self.htmlDiv.appendChild(self.squareOneDiv);
  self.squareOneDiv.id = self.title;
  self.squareOneDiv.style.position = 'absolute';
  self.squareOneDiv.addEventListener('mouseup', () => self.clickEventCB());
  self.squareOneDiv.addEventListener('mouseenter', () => self.squareOneDiv.style.cursor = 'pointer');
  self.squareOneDiv.addEventListener('mouseleave', () => self.squareOneDiv.style.cursor = 'none');
  self.squareOneDiv.style.left = self.positionObj.x - 8 + 'px';
  self.squareOneDiv.style.top = self.positionObj.y - 8 + 'px';
  self.squareOneDiv.style.width = 22 + 'px';
  self.squareOneDiv.style.height = 22 + 'px';
}

const _draw = (self, color) => {
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
