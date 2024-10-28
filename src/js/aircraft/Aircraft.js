import { DestinationType, Direction, isAircraft, isAirborne } from '../types';
import {
  ScreenSizes,
  inputHeadingToRad,
  convertToSmallRad,
  convertToPosRad,
  convHdgRadToThreeDigits,
  leftPadZeros,
  altitudeDisplay,
  isWithinDist,
  accMax,
} from '../utils';
import {
  getTooCloseDistance,
  isCloseToEntity,
  isCloseToWaypoint,
} from '../entity';
import { MessageEvents, publishMessage as publish } from '../events/messages';
import {
  wakePenalty,
  turbulencePenalty,
  resetProximity,
  uniqueProximityPair,
  planeProximityPenalty,
  planeLandSuccess,
  planeLeaveFail,
  planeHandoffSuccess,
  planeDelayFail,
} from '../game/score/score';
import { play, SoundType } from '../game/sound';
import { isInWeather, isTurbulence } from '../game/weather';
import { calcWake } from './aircraftWake';

export default class Aircraft {
  constructor(
    flightObj,
    entityLayerObj,
    textLayerObj,
    headingLayerObj,
    htmlDiv,
    positionObj,
    planeObj
  ) {
    this.id = Math.random();
    this.ctx = entityLayerObj.ctx;
    this.canvasWidth = entityLayerObj.width;
    this.canvasHeight = entityLayerObj.height;
    this.textLayerObj = textLayerObj;
    this.headingLayerObj = headingLayerObj; // TODO remove?
    this.positionObj = positionObj;

    this.direction = Direction.None;
    this.x = positionObj.x;
    this.y = positionObj.y;
    this.altitude = positionObj.altitude;
    this.altitudeTarget = 0;
    this.altitudeMin = 1000;
    this.altitudeMax = 20000;
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
    this.isSmall = planeObj.airframeObj.isSmall;

    // html div
    this.htmlDiv = htmlDiv;
    this.htmlAircraftDiv = null;
    this.htmlImgEl = { src: null };
    this.width = 5;
    this.height = 5;
    this.iconSize = planeObj.airframeObj.images.iconSize;
    this.iconDefault = planeObj.airframeObj.images.iconDefault;
    this.iconSelected = planeObj.airframeObj.images.iconSelected;
    this.iconConflict = planeObj.airframeObj.images.iconConflict;
    this.iconLanding = planeObj.airframeObj.images.iconLanding;
    // html class
    this.isShowHtmlPulse = true;

    // turbulence
    this.isTurbulenceWake = false;
    this.turbulenceWakeArr = [];
    this.wakeTimestampMs = 0;
    this.wakeMs = 0;
    this.isTurbulenceWeather = false;
    this.turbulenceTimestampMs = 0;
    this.turbulenceMs = 0;

    // states
    this.isDelayed = false;
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
    // state visual
    this.isShowCircle = false;
    this.trailPixelMs = 0;
    this.trailPixelArr = [];
    // state numbers
    this.prevPosition = { x: 0, y: 0 };
    // TODO migrate to using prevPosition
    this.distPrevHolding = Infinity;
    this.distPrevHandoff = Infinity;

    // flight info
    this.time = flightObj.time;
    this.title = flightObj.flight.trim().substring(0, 6);
    this.city = flightObj.city;
    this.airport = flightObj.airport;
    this.airline = flightObj.airline;

    // flightstrip info
    this.hasProximityAlert = false;
    this.destinationType = planeObj.destinationType || ''; // TODO consolidate with WaypointType
    this.runway = planeObj.runway || '';
    this.waypoint = '';
    this.setWaypoint(planeObj.waypoint || '');
    this.airframe = planeObj.airframeObj.type || '';
    this.wake = planeObj.airframeObj.wake;

    // constants
    this.pixelsBasePerKnot = 0.001;
    this.speedDeltaPerMs = planeObj.airframeObj.speedDeltaPerMs;
    this.speedRatePerMs = planeObj.airframeObj.speedRatePerMs;
    this.altitudeRatePerMs = planeObj.airframeObj.altitudeRatePerMs;
    this.turnRateRadPerMs = planeObj.airframeObj.turnRateRadPerMs;

    // departure or arrival
    if (this.destinationType === DestinationType.Arrival) {
      _createHtmlEl(this);
    } else {
      this.setAltitude(0, false, true);
      this.isNonInteractive = true;
      this.isTaxiing = true;
    }
  }

  clickEventCB() {
    throw new Error('clickEventCB not attached');
  }

  /**
   * @param {Number} strengthNum
   */
  addTurbulenceWake(strengthNum) {
    const strength = Number(strengthNum);
    this.turbulenceWakeArr.push(strength);
  }

  resetTurbulenceWakeArr() {
    this.turbulenceWakeArr = [];
  }

  setIsDelayed(isDelayed) {
    this.isDelayed = !!isDelayed;
    planeDelayFail();
  }

  setShowCircle(isShowCircle) {
    this.isShowCircle = !!isShowCircle;
  }

  setDirection(direction) {
    if (!direction) return;
    this.direction = direction;
  }

  setIsAtWaypoint(isHoldingAtWaypoint) {
    this.isAtWaypoint = !!isHoldingAtWaypoint;
  }

  setWaypoint(waypoint) {
    if (!waypoint) return;
    this.setIsAtWaypoint(false);
    this.setDirection(Direction.None);
    this.waypoint = waypoint;
  }

  startTakeoff() {
    if (!this.isTaxiing) return;
    this.cancelTaxiing();
    this.takeoff = true;
    play(SoundType.Takeoff);
  }

  cancelTaxiing() {
    this.isTaxiing = false;
    if (!this.htmlAircraftDiv) {
      _createHtmlEl(this);
    }
  }

  setHandoff(isHandoff) {
    if (this.isTaxiing || this.takeoff) return;

    if (isHandoff && !this.isHandoff) {
      play(SoundType.Set);
    }
    if (!isHandoff && this.isHandoff) {
      play(SoundType.Set);
    }
    if (!isHandoff) {
      this.setDistPrevHandoff(Infinity);
    }
    this.isHandoff = !!isHandoff;
  }

  setHolding(isHolding) {
    if (isHolding && !this.isHolding) {
      play(SoundType.Set);
    }
    if (!isHolding && this.isHolding) {
      play(SoundType.Set);
    }

    if (!isHolding) {
      this.setIsAtWaypoint(false);
      this.setDirection(Direction.None);
      this.setDistPrevHolding(Infinity);
    }
    this.isHolding = !!isHolding;
  }

  setOnGlidepath(arg) {
    this.onGlidePath = !!arg;
  }

  setDistPrevHandoff(dist) {
    if (!parseFloat(dist)) return;
    this.distPrevHandoff = parseFloat(dist);
  }

  setDistPrevHolding(dist) {
    if (!parseFloat(dist)) return;
    this.distPrevHolding = parseFloat(dist);
  }

  setIsTouchedDown(isTouchedDown) {
    this.isTouchedDown = !!isTouchedDown;
    this.speedDeltaPerMs = this.speedDeltaPerMs * 2.5;
    this.setNonInteractive(true);
  }

  setLanding(isLanding) {
    if (!isLanding && this.landing) {
      play(SoundType.Set);
    }

    if (!isLanding) {
      this.setOnGlidepath(false);
    }
    this.landing = !!isLanding;
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

    speed = speed < speedMin ? speedMin : speed;
    speed = speed > this.speedMax ? this.speedMax : speed;
    this.speedTarget = Math.floor(speed / 5) * 5;
  }

  setAltitude(altitudeArg, isLanding, isOnGround) {
    if (this.isNonInteractive && !isOnGround) return;

    this.setLanding(isLanding);
    let altitude = parseInt(altitudeArg);
    let altitudeMin = this.altitudeMin;
    if (isLanding) altitudeMin = 0;
    if (isOnGround) altitudeMin = 0;

    altitude = altitude < altitudeMin ? altitudeMin : altitude;
    altitude = altitude > this.altitudeMax ? this.altitudeMax : altitude;
    this.altitudeTarget = Math.floor(altitude / 100) * 100;
  }

  setHeadingRad(headingRadArg, isLanding) {
    const headingRad = convertToPosRad(convertToSmallRad(headingRadArg));
    this.headingRad = headingRad;
    this.setHeadingTarget(headingRad, isLanding, false, Direction.None);
  }

  /**
   * @param {Number} headingRad heading in rad. Zero is East, positive angle is CW
   * @param {Boolean} isLanding set/cancel landing mode
   * @param {Boolean} isHolding set/cancel holding mode
   * @param {Direction | null} direction set heading turn direction. when null do not modify direction
   * @returns
   */
  setHeadingTarget(headingRad, isLanding, isHolding, direction) {
    if (this.isNonInteractive) return;

    // cancel landing
    if (this.landing && !isLanding) {
      const speed =
        this.speedTarget < this.speedMin ? this.speedMin : this.speed;
      const alt =
        this.altitudeTarget < this.altitudeMin
          ? this.altitudeMin
          : this.altitude;
      this.setSpeed(speed);
      this.setAltitude(alt);
    }

    this.setHolding(isHolding);
    this.setLanding(isLanding);
    if (direction) this.setDirection(direction);
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

    this.setHeadingTarget(
      inputHeadingToRad(heading),
      false,
      false,
      Direction.None
    );
  }

  setNonInteractive(isNonInteractive) {
    if (isNonInteractive) {
      this.isNonInteractive = true;
      if (this.htmlAircraftDiv) {
        this.htmlClickDiv.addEventListener('mouseup', () => {});
        this.htmlClickDiv.addEventListener(
          'mouseenter',
          () => (this.htmlClickDiv.style.cursor = 'default')
        );
      }
    } else {
      this.isNonInteractive = false;
      if (this.htmlAircraftDiv) {
        _setDivMouseEvents(this);
      }
    }
  }

  setDestroyFlag(shouldDestroy) {
    this.destroyFlag = !!shouldDestroy;
  }

  destroy() {
    this.hide();
    _clearTrailPixelsAll(this);
    if (this.htmlAircraftDiv) this.htmlAircraftDiv.remove();
    if (this.isFlyingOutOfArea) {
      planeLeaveFail();
      publish(MessageEvents.MessageAllEV, this.title + ' handoff failed');
      return;
    }
    if (this.isHandoff) {
      planeHandoffSuccess();
      publish(
        MessageEvents.MessageAllEV,
        this.title + ' departure handoff complete'
      );
      return;
    }
    if (this.isTouchedDown) {
      planeLandSuccess();
      publish(MessageEvents.MessageAllEV, this.title + ' landing complete');
      return;
    }
  }

  ////////////////////////////////////////////////////////////////////////
  // UPDATE FUNCS
  ////////////////////////////////////////////////////////////////////////

  updateHtmlClass() {
    if (!this.htmlAircraftDiv) return;

    if (this.isShowHtmlPulse) {
      this.isShowHtmlPulse = false;
      if (this.htmlClickDiv.classList.contains(getPulseClass())) return;

      this.htmlClickDiv.classList.add(getPulseClass());
      if (this.isSmall) {
        if (!this.htmlClickDiv.classList.contains('small')) {
          this.htmlClickDiv.classList.add('small');
        }
      }

      setTimeout(() => {
        if (this.htmlClickDiv.classList.contains(getPulseClass())) {
          this.htmlClickDiv.classList.remove(getPulseClass());
        }
      }, 6000);
    }
  }

  updateHandoff({ entityManagerArr }) {
    if (this.destinationType !== DestinationType.Departure) return;

    const isTargetWaypoint = (entity) =>
      entity.class === 'waypoint' && // TODO deprecate the class prop
      entity.title === this.waypoint;
    const waypointObj = entityManagerArr.find(isTargetWaypoint);
    if (!waypointObj) return;

    const distToWaypoint = this.isSmall ? 18 : 28;
    if (isWithinDist(distToWaypoint, waypointObj, this)) {
      this.isShowHtmlPulse = true;
    }
    if (isCloseToWaypoint(waypointObj)(this)) {
      this.setDestroyFlag(true);
      this.setHandoff(true);
    }
  }

  updateDestroy({ entityManagerArr }) {
    if (!this.destroyFlag) return;

    this.destroy();
    const index = entityManagerArr.findIndex((entity) => entity.id === this.id);
    if (index === -1) return;
    entityManagerArr.splice(index, 1);
  }

  updateHeading(headingOld, headingTarget, headingChange, direction) {
    const headingSmall = convertToSmallRad(headingOld);
    const headingTargetSmall = convertToSmallRad(headingTarget);
    const headingLarge = headingSmall + 2 * Math.PI;
    const headingTargetLarge = headingTargetSmall + 2 * Math.PI;

    let smallDiff = Math.abs(headingTargetSmall - headingSmall);
    let highestSmall =
      headingTargetSmall > headingSmall ? headingTargetSmall : headingSmall;
    const isLowestLargeTarget = headingTargetLarge < headingLarge;
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
      if (turnRight)
        return headingIncrease > headingTargetSmall
          ? headingTargetSmall
          : headingIncrease;
      else
        return headingDecrease < headingTargetSmall
          ? headingTargetSmall
          : headingDecrease;
    }
    // else isClosestBetween
    const turnRight = isLowestLargeTarget;
    if (turnRight)
      return headingIncrease > headingTargetLarge
        ? headingTargetLarge
        : headingIncrease;
    else
      return headingLargeDecrease < headingTargetSmall
        ? headingTargetSmall
        : headingLargeDecrease;
  }

  updateAltitude(altitudeOld, altitudeTarget, altitudeChange) {
    const delta = Math.round(altitudeTarget - altitudeOld);
    const altitudeIncrease = altitudeOld + altitudeChange;
    const altitudeDecrease = altitudeOld - altitudeChange;
    if (delta === 0) return altitudeOld;
    else if (delta > 0)
      return altitudeIncrease > altitudeTarget
        ? altitudeTarget
        : altitudeIncrease;
    else
      return altitudeDecrease < altitudeTarget
        ? altitudeTarget
        : altitudeDecrease;
  }

  updateSpeed(speed, speedTarget, speedIncreaseArg, speedDecreaseArg) {
    const delta = Math.round(speedTarget - speed);
    const speedIncrease = speed + speedIncreaseArg;
    const speedDecrease = speed - speedDecreaseArg;
    if (delta === 0) return speed;
    if (delta > 0)
      return speedIncrease > speedTarget ? speedTarget : speedIncrease;
    return speedDecrease < speedTarget ? speedTarget : speedDecrease;
  }

  getSpeedDelta(speed, deltaTimeMs) {
    const speedDeltaPerMs = this.speedDeltaPerMs;
    const speedTakeoff = this.speedTakeoff;
    const calcDelta = (speedDeltaPerMsArg) => {
      const pixelsSpeedDeltaBase = speedDeltaPerMsArg * deltaTimeMs;
      return pixelsSpeedDeltaBase * this.pixelsBasePerKnot;
    };

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

  updateWake(timestampMs) {
    const isInWake = !!this.turbulenceWakeArr.length;
    const maxStrength = this.turbulenceWakeArr.reduce(accMax, 0);
    this.resetTurbulenceWakeArr();

    if (!isInWake) {
      this.isTurbulenceWake = false;
    } else if (!this.isTurbulenceWake && isInWake) {
      this.wakeTimestampMs = timestampMs;
      this.isTurbulenceWake = true;
    } else if (isInWake) {
      const turbulenceDiff = timestampMs - this.wakeTimestampMs;
      this.wakeTimestampMs = timestampMs;
      this.wakeMs += turbulenceDiff;
      wakePenalty(turbulenceDiff, maxStrength);
    }
  }

  update({ deltaTimeMs, timestamp }) {
    const headingOld = this.headingRad;
    const headingTarget = this.headingTargetRad;
    const headingChange = this.turnRateRadPerMs * deltaTimeMs;
    const direction = this.direction;
    const headingRadNewLarge = this.updateHeading(
      headingOld,
      headingTarget,
      headingChange,
      direction
    );
    const headingRadNew = convertToPosRad(
      convertToSmallRad(headingRadNewLarge)
    );

    if (this.takeoff) this.setSpeed(220, false, true);
    if (this.takeoff && this.speed > this.speedTakeoff) {
      this.isNonInteractive = false;
      this.takeoff = false;
      this.setSpeed(220, false, false);
      this.setAltitude(2000, false, false);
    }

    const speedDelta = this.getSpeedDelta(this.speed, deltaTimeMs);
    const speedNew = this.updateSpeed(
      this.speed,
      this.speedTarget,
      speedDelta,
      speedDelta
    );
    const pixelsSpeedRateBase = this.speedRatePerMs * deltaTimeMs;
    const pixelsSpeed = pixelsSpeedRateBase * this.pixelsBasePerKnot * speedNew;
    const pixelsInX = Math.cos(headingRadNew) * pixelsSpeed;
    const pixelsInY = Math.sin(headingRadNew) * pixelsSpeed;

    const altitudeOld = this.altitude;
    const altitudeChange = this.altitudeRatePerMs * deltaTimeMs;
    const altitudeNew = this.updateAltitude(
      altitudeOld,
      this.altitudeTarget,
      altitudeChange
    );

    this.headingRad = headingRadNew;
    this.heading = convHdgRadToThreeDigits(headingRadNew);
    this.altitude = altitudeNew;
    this.speed = speedNew;

    this.prevPosition = {
      x: this.x,
      y: this.y,
    };
    this.x += pixelsInX;
    this.y += pixelsInY;

    if (this.htmlAircraftDiv) {
      const aircraftSize = _htmlAircraftSize(this.isSmall, this.iconSize).side;
      const aircraftTop = _htmlAircraftSize(this.isSmall, this.iconSize).top;
      this.htmlAircraftDiv.style.left = this.x - aircraftSize / 2 + 'px';
      this.htmlAircraftDiv.style.top =
        this.y - aircraftTop - aircraftSize / 2 + 'px';
      this.updateHtmlClass();
    }

    this.updateWake(timestamp);

    // timer
    if (this.time <= 0) {
      this.time = 0;
      if (!this.isDelayed) {
        this.setIsDelayed(true);
      }
    } else {
      this.time -= deltaTimeMs / 1000;
    }

    // returning to canvas
    if (
      this.isNonInteractive &&
      !this.isTouchedDown &&
      !this.isTaxiing &&
      !this.takeoff &&
      this.x > 0 &&
      this.x < this.canvasWidth &&
      this.y > 0 &&
      this.y < this.canvasHeight
    ) {
      this.setNonInteractive(false);
    }

    // leaving canvas
    const outsideCanvasWidth = (x, offset) =>
      x > this.canvasWidth + offset || x < 0 - offset;
    const outsideCanvasHeight = (y, offset) =>
      y > this.canvasHeight + offset || y < 0 - offset;
    if (outsideCanvasWidth(this.x, 0) || outsideCanvasHeight(this.y, 0)) {
      this.setNonInteractive(true);
      this.isShowHtmlPulse = true;
    }
    if (outsideCanvasWidth(this.x, 15) || outsideCanvasHeight(this.y, 15)) {
      _clearTrailPixelsAll(this);
      this.isFlyingOutOfArea = true;
      this.setDestroyFlag(true);
    }
  }

  ////////////////////////////////////////////////////////////////////////
  // END UPDATE FUNCS
  ////////////////////////////////////////////////////////////////////////

  draw(timestamp) {
    const setIfImgSrcDiff = (str) => {
      const src = this.htmlImgEl.src;
      const srcPathOnly = '/' + src.split('/').slice(3).join('/');
      if (srcPathOnly !== str) {
        this.htmlImgEl.src = str;
      }
    };

    this.hide();
    if (this.isTaxiing) return;

    let color = 'white';
    if (this.hasProximityAlert) {
      color = 'orangered';
      setIfImgSrcDiff(this.iconConflict);
    } else if (this.isSelected) {
      color = 'greenyellow';
      setIfImgSrcDiff(this.iconSelected);
    } else if (this.landing) {
      color = 'yellow';
      setIfImgSrcDiff(this.iconLanding);
    } else {
      color = 'white';
      setIfImgSrcDiff(this.iconDefault);
    }
    this.htmlImgEl.style.transform = 'rotate(' + this.heading + 'deg)';

    _draw(this, color);

    // create trail of pixels
    const intervalSecs = 3;
    if (this.takeoff) return;
    if (!timestamp) return;
    if (timestamp > this.trailPixelMs + intervalSecs * 1000) {
      this.trailPixelMs = timestamp;
      const x = this.x;
      const y = this.y;
      const pixel = { x, y };
      _drawTrailPixel(this, pixel, 1);
      this.trailPixelArr.unshift(pixel);
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
    if (this.isSelected) {
      play(SoundType.Select);
    }
  }

  setProximity({ entityManagerArr, screenSize, showCircles, timestamp }) {
    const isEntityCloseTo = isCloseToEntity(screenSize)(this);
    const isOnRunway = (plane) =>
      !plane.isTaxiing && (plane.takeoff || plane.isTouchedDown);
    const isSameRunway = (plane) => plane.runway === this.runway;

    const isCloseAirborne = (plane) => isAirborne(plane) && isAirborne(this);
    const isCloseRunway = (plane) =>
      isOnRunway(plane) && isOnRunway(this) && isSameRunway(plane);
    const isPlaneClose = (plane) =>
      isAircraft(plane) &&
      isEntityCloseTo(plane) &&
      (isCloseAirborne(plane) || isCloseRunway(plane));

    const timestampMs = timestamp;
    this.setShowCircle(!!showCircles);

    // weather proximity //////////////////////////////////////////
    const turbulenceArr = entityManagerArr.filter(isTurbulence);
    if (turbulenceArr.length) {
      const isTurbulenceWeather = !!turbulenceArr.find(isInWeather(this));

      if (!isTurbulenceWeather) {
        this.isTurbulenceWeather = false;
      } else if (!this.isTurbulenceWeather && isTurbulenceWeather) {
        this.turbulenceTimestampMs = timestampMs;
        this.isTurbulenceWeather = true;
      } else if (isTurbulenceWeather) {
        const turbulenceDiff = timestampMs - this.turbulenceTimestampMs;
        this.turbulenceTimestampMs = timestampMs;
        this.turbulenceMs += turbulenceDiff;
        turbulencePenalty(turbulenceDiff);
      }
    } else {
      this.isTurbulenceWeather = false;
    }

    // wake proximity //////////////////////////////////////////
    const planesInWake = calcWake({ entityManagerArr, aircraft: this });
    planesInWake.forEach(({ plane, strength }) =>
      plane.addTurbulenceWake(strength)
    );

    // TODO plane proximity remove return statements
    // plane proximity //////////////////////////////////////////
    const planeClose = entityManagerArr.find(isPlaneClose);
    if (!planeClose) {
      this.hasProximityAlert = false;
      resetProximity(this);
      return;
    }

    this.hasProximityAlert = true;
    const pairFound = uniqueProximityPair(this, planeClose, timestampMs);
    if (pairFound) {
      const scoreDecrease = planeProximityPenalty(
        this,
        planeClose,
        timestampMs
      );
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
// end class
////////////////////////////////////////////////////////////

// should match css class names in canvas/Plane.vue <style>
const getPlaneClass = () => 'plane';
const getPulseClass = () => 'pulse';

const _trailMax = 12;
const _clearTrailPixelsAll = (self) => {
  self.trailPixelArr.forEach((pixel) => _clearTrailPixel(self, pixel));
  self.trailPixelArr = [];
};
const _clearTrailPixel = (self, pixel) =>
  self.ctx.clearRect(pixel.x - 2, pixel.y - 2, 4, 4);
const _drawTrailPixel = (self, pixel, opacity) => {
  self.ctx.globalAlpha = opacity;
  self.ctx.fillStyle = 'white';
  self.ctx.fillRect(pixel.x - 1, pixel.y - 1, 2, 2);
  self.ctx.globalAlpha = 1;
};

const _htmlAircraftSize = (isSmall, iconSize) => ({
  side: isSmall ? 0.68 * iconSize.side : iconSize.side,
  top: isSmall ? 0 : iconSize.top,
});

const _createHtmlEl = (self) => {
  const htmlAircraftWidth = 0;
  const aircraftSize = _htmlAircraftSize(self.isSmall, self.iconSize).side;
  const aircraftTop = _htmlAircraftSize(self.isSmall, self.iconSize).top;

  self.htmlAircraftDiv = document.createElement('div');
  self.htmlDiv.appendChild(self.htmlAircraftDiv);
  self.htmlAircraftDiv.id = self.title + '-plane';
  self.htmlAircraftDiv.style.position = 'absolute';
  self.htmlAircraftDiv.style.display = 'flex';
  self.htmlAircraftDiv.style.gap = '4px';
  self.htmlAircraftDiv.style['justify-content'] = 'space-between';
  self.htmlAircraftDiv.style['pointer-events'] = 'none';

  self.htmlAircraftDiv.style.left = self.x - aircraftSize / 2 + 'px';
  self.htmlAircraftDiv.style.top =
    self.y - aircraftTop - aircraftSize / 2 + 'px';
  self.htmlAircraftDiv.style['min-width'] =
    aircraftSize + htmlAircraftWidth + 'px';
  self.htmlAircraftDiv.style.height = aircraftSize + 'px';

  self.htmlClickDiv = document.createElement('div');
  self.htmlAircraftDiv.appendChild(self.htmlClickDiv);

  self.htmlClickDiv.id = self.title;
  self.htmlClickDiv.classList.add(getPlaneClass());
  self.htmlClickDiv.style.position = 'relative';
  self.htmlClickDiv.style['pointer-events'] = 'auto';

  _setDivMouseEvents(self);
  self.htmlClickDiv.addEventListener(
    'mouseleave',
    () => (self.htmlClickDiv.style.cursor = 'none')
  );
  self.htmlClickDiv.style.width = aircraftSize + 'px';
  self.htmlClickDiv.style.height = aircraftSize + 'px';

  self.htmlImgEl = new Image();
  self.htmlClickDiv.appendChild(self.htmlImgEl);
  self.htmlImgEl.style.transform = 'rotate(' + self.heading + 'deg)';
  self.htmlImgEl.id = self.title + '-icon';
  self.htmlImgEl.src = self.iconDefault;
  self.htmlImgEl.style.width = 'inherit';
  self.htmlImgEl.style.height = 'inherit';
  self.htmlImgEl.draggable = false;

  // self.htmlClickDiv.style.border = '1px solid yellow';
  // self.htmlImgEl.style.border = '1px solid orange';

  const titleDisplay = self.title;
  const degreesDisplay = self.heading;
  const speedDisplay = leftPadZeros(Math.round(self.speed));
  const altDisplay = altitudeDisplay(self.altitude);

  self.htmlTextEl = document.createElement('div');
  self.htmlTextEl.style.display = 'none';
  self.htmlTextEl.style.gap = '8px';
  self.htmlAircraftDiv.appendChild(self.htmlTextEl);
  self.htmlTextEl.classList.add('plane-text');
  self.htmlTextEl.style.cursor = 'default';
  self.htmlTextEl.style['justify-content'] = 'space-between';
  self.htmlCol1 = document.createElement('div');
  self.htmlCol2 = document.createElement('div');
  self.htmlCol2.style.width = '60px';
  self.htmlTextEl.appendChild(self.htmlCol1);
  self.htmlTextEl.appendChild(self.htmlCol2);

  const textDivLine0 = document.createElement('div');
  self.htmlCol1.appendChild(textDivLine0);
  textDivLine0.innerText = titleDisplay;

  self.textDivLine1 = document.createElement('div');
  self.textDivLine2 = document.createElement('div');
  self.textDivLine3 = document.createElement('div');
  self.textDivLine1.innerText = degreesDisplay + '\u00B0';
  self.textDivLine2.innerText = altDisplay + ' ft';
  self.textDivLine3.innerText = speedDisplay + ' kts';
  self.htmlCol2.appendChild(self.textDivLine1);
  self.htmlCol2.appendChild(self.textDivLine2);
  self.htmlCol2.appendChild(self.textDivLine3);

  self.htmlCol1.style.color = 'white';
  self.htmlCol1.style.font = '10px Arial';
  self.htmlCol2.style.color = 'white';
  self.htmlCol2.style.font = '10px Arial';
};

const _setDivMouseEvents = (self) => {
  self.htmlClickDiv.addEventListener('mouseup', () => self.clickEventCB());
  self.htmlClickDiv.addEventListener(
    'mouseenter',
    () => (self.htmlClickDiv.style.cursor = 'pointer')
  );
};

const _draw = (self, color) => {
  const proximityDist = self.isSmall
    ? getTooCloseDistance(ScreenSizes.Small)
    : getTooCloseDistance(ScreenSizes.Large);

  // TODO debug wake circles
  // drawPlaneWake(self, self.textLayerObj);

  if (self.isShowCircle) {
    self.textLayerObj.ctx.strokeStyle = 'white';
    self.textLayerObj.ctx.beginPath();
    self.textLayerObj.ctx.arc(
      self.x,
      self.y,
      proximityDist / 2,
      0,
      2 * Math.PI
    );
    self.textLayerObj.ctx.closePath();
    self.textLayerObj.ctx.stroke();
  }

  if (self.takeoff || self.isTouchedDown) {
    self.htmlTextEl.style.display = 'none';
    return;
  }
  self.htmlTextEl.style.display = 'flex';

  const degreesDisplay = self.heading;
  const speedDisplay = leftPadZeros(Math.round(self.speed));
  const altDisplay = altitudeDisplay(self.altitude);

  self.htmlCol1.style.color = color;
  self.htmlCol2.style.color = color;

  self.textDivLine1.innerText = degreesDisplay + '\u00B0';
  self.textDivLine2.innerText = altDisplay + ' ft';
  self.textDivLine3.innerText = speedDisplay + ' kts';
};
