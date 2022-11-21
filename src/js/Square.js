import {
  Direction,
  inputHeadingToRad,
  convertToSmallRad,
  convertToPosRad,
  convHdgRadToThreeDigits,
  leftPadZeros,
  altitudeDisplay,
} from './utils';
import * as entityFns from './entity';
import { MessageEvents, publish } from './events/messages';
import {
  uniqueProximityPair,
  planeProximityPenalty,
  planeLandSuccess,
  planeLeaveFail,
  planeHandoffSuccess,
} from './panelBottom/score';
import { DestinationType } from './aircraft/airframe';

////////////////////////////////////////////////////////////
// class Square
////////////////////////////////////////////////////////////
export default class Square {
  constructor(title, entityLayerObj, textLayerObj, headingLayerObj, htmlDiv, positionObj, planeObj) {
    this.id = Math.random();
    this.title = title.trim().substring(0, 6);
    this.ctx = entityLayerObj.ctx;
    this.canvasWidth = entityLayerObj.width;
    this.canvasHeight = entityLayerObj.height;
    this.textLayerObj = textLayerObj;
    this.headingLayerObj = headingLayerObj;
    this.positionObj = positionObj;

    this.htmlDiv = htmlDiv;
    this.htmlSquareDiv = null;
    this.htmlImgEl = null;
    this.width = 5;
    this.height = 5;

    this.direction = Direction.None;
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
    this.iconDefault = planeObj.airframeObj.iconDefault;
    this.iconSelected = planeObj.airframeObj.iconSelected;
    this.iconConflict = planeObj.airframeObj.iconConflict;
    this.iconLanding = planeObj.airframeObj.iconLanding;
    this.isSmall = planeObj.airframeObj.isSmall;

    // states
    this.isSelected = false;
    this.isHandoff = false;
    this.isFlyingOutOfArea = false;
    this.isNonInteractive = false;
    this.destroyFlag = false;
    this.onGlidePath = false;
    this.isTaxiing = false;
    this.isTouchedDown = false;
    this.landing = false;
    this.isHolding = false;
    this.isAtWaypoint = false;
    this.takeoff = false;
    this.distPrev = Infinity;
    this.trailPixelMs = 0;
    this.trailPixelArr = [];

    // flightstrip info
    this.hasProximityAlert = false;
    this.destinationType = planeObj.destinationType || ''; // TODO consolidate with WaypointType
    this.runway = planeObj.runway || '';
    this.setWaypoint(planeObj.waypoint || '');
    this.airframe = planeObj.airframeObj.type || '';
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

  setDirection(direction) {
    if (!direction) return;
    this.direction = direction;
  }

  setIsAtWaypoint(isHoldingAtWaypoint) {
    this.isAtWaypoint = !!isHoldingAtWaypoint;
  }

  setWaypoint(waypoint) {
    if (!waypoint) return;
    this.setDirection(Direction.None);
    this.waypoint = waypoint;
  }

  startTakeoff() {
    if (!this.isTaxiing) return
    this.setIsTaxiing(false);
    this.takeoff = true;
  }

  setIsTaxiing(isTaxiing) {
    this.isTaxiing = !!isTaxiing;
    if (!this.htmlSquareDiv) {
      _createHtmlEl(this);
    }
  }

  setHandoff(isHandoff, waypoint) {
    this.isHandoff = !!isHandoff;
    this.setWaypoint(waypoint);
  }

  setHolding(isHolding, waypoint) {
    this.isHolding = !!isHolding;
    if (!isHolding) {
      this.setIsAtWaypoint(false);
      this.setDirection(Direction.None);
    }
    this.setWaypoint(waypoint);
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
   * @param {Number} headingRad heading in rad. Zero is East, positive angle is CW
   * @param {Boolean} isLanding set/cancel landing mode
   * @param {Boolean} isHolding set/cancel holding mode
   * @param {Direction} direction heading turn direction
   * @returns 
   */
  setHeadingTarget(headingRad, isLanding, isHolding, direction) {
    if (this.isNonInteractive) return;

    this.setHolding(isHolding, this.waypoint);
    // cancel landing 
    if (this.landing && !isLanding) {
      const speed = (this.speedTarget < this.speedMin) ? this.speedMin : this.speed;
      const alt = (this.altitudeTarget < this.altitudeMin) ? this.altitudeMin : this.altitude;
      this.setSpeed(speed);
      this.setAltitude(alt);
    }

    this.setLanding(isLanding);
    this.setDirection(direction);
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
    if (this.htmlSquareDiv) {
      this.htmlSquareDiv.addEventListener('mouseup', () => { });
      this.htmlSquareDiv.addEventListener('mouseenter', () => this.htmlSquareDiv.style.cursor = 'default');
    }
  }

  setDestroyFlag(shouldDestroy) {
    this.destroyFlag = !!shouldDestroy;
  }

  destroy() {
    this.hide();
    _clearTrailPixelsAll(this);
    if (this.htmlSquareDiv) this.htmlSquareDiv.remove();
    if (this.isFlyingOutOfArea) {
      const scoreRemoved = planeLeaveFail();
      publish(MessageEvents.MessageAllEV, this.title + ' failed handoff (' + scoreRemoved + ')');
      return;
    }
    if (this.isHandoff) {
      const scoreAdded = planeHandoffSuccess();
      publish(MessageEvents.MessageAllEV, this.title + ' handoff complete (+' + scoreAdded + ')');
      return;
    }
    if (this.isTouchedDown) {
      const scoreAdded = planeLandSuccess();
      publish(MessageEvents.MessageAllEV, this.title + ' landing complete (+' + scoreAdded + ')');
      return;
    }
  }

  updateHandoff({ entityManagerArr }) {
    if (this.destinationType !== DestinationType.Departure) return;

    const isTargetWaypoint = entity =>
      entity.class === 'waypoint' && // TODO deprecate the class prop
      entity.title === this.waypoint;

    const waypointObj = entityManagerArr.find(isTargetWaypoint);
    if (!waypointObj) return;
    if (entityFns.isCloseToWaypoint(waypointObj)(this)) {
      console.log(this.title, waypointObj, 'handoff complete')
      this.setDestroyFlag(true);
      this.setHandoff(true, this.waypoint);
    }
  }

  updateDestroy({ entityManagerArr }) {
    if (!this.destroyFlag) return;

    this.destroy();
    const index = entityManagerArr.findIndex(entity => entity.id === this.id);
    if (index === -1) return;
    entityManagerArr.splice(index, 1);
  }

  updateHeading(headingOld, headingTarget, headingChange, direction) {
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

    if (direction === Direction.Right) return headingIncrease;
    if (direction === Direction.Left) return headingDecrease;
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

    // touch down rollout
    if (this.isTouchedDown) {
      if (speed > 120) return calcDelta(speedDeltaPerMs * 0.5);
      return calcDelta(speedDeltaPerMs * 2);
    }

    // takeoff
    if (!this.takeoff) return calcDelta(speedDeltaPerMs);
    if (speed < 6) return calcDelta(speedDeltaPerMs * 0.5);
    if (speed >= 6 && speed < 10) return calcDelta(speedDeltaPerMs);
    if (speed >= 10 && speed < 20) return calcDelta(speedDeltaPerMs * 1.8);
    if (speed >= 20 && speed < 30) return calcDelta(speedDeltaPerMs * 2.2);
    if (speed >= 30 && speed < 40) return calcDelta(speedDeltaPerMs * 3.2);
    if (speed >= 40 && speed < 100) return calcDelta(speedDeltaPerMs * 3.7);
    if (speed >= 100) return calcDelta(speedDeltaPerMs * 4);
    if (speed > speedTakeoff) return calcDelta(speedDeltaPerMs);

    return calcDelta(speedDeltaPerMs);
  }

  update({ deltaTimeMs }) {
    const squareOrigin = this.isSmall ? 10 : 13;

    const headingOld = this.headingRad;
    const headingTarget = this.headingTargetRad;
    const headingChange = this.turnRateRadPerMs * deltaTimeMs;
    const direction = this.direction;
    const headingRadNewLarge = this.updateHeading(headingOld, headingTarget, headingChange, direction);
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
    if (this.htmlSquareDiv) {
      this.htmlSquareDiv.style.left = (this.x - squareOrigin) + 'px';
      this.htmlSquareDiv.style.top = (this.y - squareOrigin) + 'px';
    }
    this.headingRad = headingRadNew;
    this.heading = convHdgRadToThreeDigits(headingRadNew);
    this.altitude = altitudeNew;
    this.speed = speedNew;

    // this.ctx.fillStyle = 'red';
    // this.ctx.fillRect(this.x - 2, this.y - 2, 4, 4);

    // square leaving canvas
    const outsideCanvasWidth = (x, offset) => (x > (this.canvasWidth + offset)) || (x < (0 - offset));
    const outsideCanvasHeight = (y, offset) => (y > (this.canvasHeight + offset)) || (y < (0 - offset));
    if (outsideCanvasWidth(this.x, 0) || outsideCanvasHeight(this.y, 0)) {
      this.setNonInteractive();
      _clearTrailPixelsAll(this);
    }
    if (outsideCanvasWidth(this.x, 15) || outsideCanvasHeight(this.y, 15)) {
      this.setDestroyFlag(true);
      this.isFlyingOutOfArea = true;
    }
  }

  draw(timestamp) {
    this.hide();
    if (this.isTaxiing) return;

    let color = 'white';
    if (this.hasProximityAlert) {
      color = 'orangered';
      this.htmlImgEl.src = this.iconConflict;
    } else if (this.isSelected) {
      color = 'greenyellow';
      this.htmlImgEl.src = this.iconSelected;
    } else if (this.landing) {
      color = 'yellow';
      this.htmlImgEl.src = this.iconLanding;
    } else {
      color = 'white';
      this.htmlImgEl.src = this.iconDefault
    }

    this.htmlImgEl.style.transform = 'rotate(' + this.heading + 'deg)';
    _draw(this, color);

    // create trail of pixels
    const shiftX = this.isSmall ? 3 : 3
    const shiftY = this.isSmall ? 0 : 2
    const intervalSecs = 3;
    if (this.takeoff) return;
    if (!timestamp) return;
    if (timestamp > (this.trailPixelMs + intervalSecs * 1000)) {
      this.trailPixelMs = timestamp;
      const pixelsInX = Math.cos(this.headingRad);
      const pixelsInY = Math.sin(this.headingRad);
      const x = this.x - pixelsInX - shiftX;
      const y = this.y - pixelsInY - shiftY;
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(x - 1, y - 1, 2, 2);
      this.trailPixelArr.unshift({ x, y });
    }
  }

  hide() {
    this.trailPixelArr.forEach((pixel, index) => {
      const fracMaxIndex = index / _trailMax;
      _clearTrailPixel(this, pixel);
      _drawTrailPixel(this, pixel, 1 - fracMaxIndex);
      if (index > _trailMax - 1) {
        _clearTrailPixel(this, pixel);
        this.trailPixelArr.pop();
      }
    });
  }

  setSelected(isSelected) {
    this.isSelected = !!isSelected;
  }

  setProximity({ entityManagerArr, screenSize }) {
    const isPlane = plane => plane instanceof Square;
    const isEntityCloseTo = entityFns.isCloseToEntity(screenSize)(this);
    const isAirborne = plane => !plane.isTaxiing && !plane.takeoff && !plane.isTouchedDown;
    const isOnRunway = plane => !plane.isTaxiing && (plane.takeoff || plane.isTouchedDown);
    const isSameRunway = plane => plane.runway === this.runway;

    const isCloseAirborne = plane => isAirborne(plane) && isAirborne(this);
    const isCloseRunway = plane => isOnRunway(plane) && isOnRunway(this) && isSameRunway(plane);
    const isPlaneClose = plane => isPlane(plane) && isEntityCloseTo(plane) && (isCloseAirborne(plane) || isCloseRunway(plane));

    const planeClose = entityManagerArr.find(isPlaneClose);
    if (!planeClose) {
      this.hasProximityAlert = false;
      return;
    }

    this.hasProximityAlert = true;
    const pairFound = uniqueProximityPair(this, planeClose);
    if (pairFound) {
      const scoreDecrease = planeProximityPenalty(this, planeClose);
      if (scoreDecrease === null) return;

      const msg = this.title + ' & ' + planeClose.title + ' conflict';
      publish(MessageEvents.MessageProximityEV, {
        id: this.id + '|' + planeClose.id,
        msg,
        scoreDecrease,
      });
    }
  }
}
////////////////////////////////////////////////////////////
// end class Square
////////////////////////////////////////////////////////////

const _trailMax = 12;
const _clearTrailPixelsAll = (self) => {
  self.trailPixelArr.forEach((pixel) => _clearTrailPixel(self, pixel));
  self.trailPixelArr = [];
}
const _clearTrailPixel = (self, pixel) => self.ctx.clearRect(pixel.x - 2, pixel.y - 2, 4, 4);
const _drawTrailPixel = (self, pixel, opacity) => {
  self.ctx.globalAlpha = opacity;
  self.ctx.fillStyle = 'white';
  self.ctx.fillRect(pixel.x - 1, pixel.y - 1, 2, 2);
  self.ctx.globalAlpha = 1;
}

const _createHtmlEl = (self) => {
  const squareSize = self.isSmall ? 15 : 22;
  const squareOrigin = self.isSmall ? 10 : 13;

  self.htmlSquareDiv = document.createElement('div');
  self.htmlDiv.appendChild(self.htmlSquareDiv);
  self.htmlSquareDiv.id = self.title;
  self.htmlSquareDiv.style.position = 'absolute';
  self.htmlSquareDiv.addEventListener('mouseup', () => self.clickEventCB());
  self.htmlSquareDiv.addEventListener('mouseenter', () => self.htmlSquareDiv.style.cursor = 'pointer');
  self.htmlSquareDiv.addEventListener('mouseleave', () => self.htmlSquareDiv.style.cursor = 'none');
  self.htmlSquareDiv.style.left = (self.x - squareOrigin) + 'px';
  self.htmlSquareDiv.style.top = (self.y - squareOrigin) + 'px';
  self.htmlSquareDiv.style.marginTop = 2.6 + 'px';
  self.htmlSquareDiv.style.width = squareSize + 'px';
  self.htmlSquareDiv.style.height = squareSize + 'px';
  // self.htmlSquareDiv.style.border = '1px solid yellow';

  self.htmlImgEl = new Image();
  self.htmlSquareDiv.appendChild(self.htmlImgEl);
  self.htmlImgEl.style.transform = 'rotate(' + self.heading + 'deg)';
  self.htmlImgEl.id = self.title + '-icon';
  self.htmlImgEl.src = self.iconDefault;
  self.htmlImgEl.width = squareSize;
  self.htmlImgEl.draggable = false;
  // self.htmlImgEl.style.border = '1px solid orange';
}

const _draw = (self, color) => {
  if (self.takeoff || self.isTouchedDown) return;

  const degreesDisplay = self.heading;
  const speedDisplay = leftPadZeros(Math.round(self.speed));
  const altDisplay = altitudeDisplay(self.altitude);

  self.textLayerObj.ctx.fillStyle = color;
  self.textLayerObj.ctx.font = "10px Arial"
  self.textLayerObj.ctx.fillText(self.title, self.x + 10, self.y - 8);
  self.textLayerObj.ctx.fillStyle = color;
  self.textLayerObj.ctx.fillText('                ' + degreesDisplay + '\u00B0', self.x, self.y - 8);
  self.textLayerObj.ctx.fillText('                ' + altDisplay + ' ft', self.x, self.y + 2);
  self.textLayerObj.ctx.fillText('                ' + speedDisplay + ' kts', self.x, self.y + 12);
};
