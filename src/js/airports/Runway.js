import { isAircraft, Direction, RunwayType } from '../types';
import {
  convertToSmallDegrees,
  convHdgRadToThreeDigits,
  createInterceptHeading,
  degreesToRad,
  getScreenSize,
  inputHeadingToRad,
  isHeadingWithinArc,
  radToDegrees,
  ScreenSizes,
  goAroundDebug,
} from '../utils';
import { MessageEvents, publishMessage as publish } from '../events/messages';
import { play, SoundType } from '../game/sound';
import { getHeadingToEntity } from '../entity';
import {
  planeLandFail,
  ScoreEvents,
  subscribeScore,
} from '../game/score/score';
import { isArrivalsSuccess } from '../game/victory';

////////////////////////////////////////////////////////////
// class Runway
////////////////////////////////////////////////////////////
export default class Runway {
  constructor(title, runwayType, imgLayerObj, runwayObj) {
    this.classType = 'Runway';
    const screenSize = getScreenSize();

    this.id = Math.random();
    this.title = title.trim();
    this.x = runwayObj.x;
    this.y = runwayObj.y;
    this.isSmall = false;
    if (
      screenSize === ScreenSizes.Small ||
      screenSize === ScreenSizes.VerySmall
    ) {
      this.isSmall = true;
    }
    this.ctx = imgLayerObj.ctx;
    this.width = runwayObj.width;
    this.height = runwayObj.length;
    this.altitude = 0;
    this.altitudeLanding = this.altitude + 150;
    this.altitudeMax = 5000;
    this.runwayHeading = inputHeadingToRad(runwayObj.heading);
    this.waypoint = runwayObj.waypoint;
    this.landingEntities = [];
    this.takeoffEntities = [];
    this.titlePosition = runwayObj.titlePosition || {};
    this.titleX = this.titlePosition.x || 0;
    this.titleY = this.titlePosition.y || 0;

    this.isIdleStateEnabled = false;
    this.isIdle = true;

    subscribeScore(ScoreEvents.ScoreEV, (score) => {
      if (isArrivalsSuccess(score.level, score.arrivals)) {
        this.isIdleStateEnabled = false;
      }
    });

    this.isShowDashes = true;
    if (runwayType === RunwayType.DepartureOnly) {
      this.isShowDashes = false;
    }

    // this.ctx.fillStyle = 'greenyellow';
    // this.ctx.fillRect(this.x - 2, this.y - 2, 4, 4);

    const img = new Image();
    img.onload = () => {
      this.ctx.save();
      this.ctx.translate(this.x, this.y);
      this.ctx.rotate(this.runwayHeading - Math.PI / 2);
      this.ctx.drawImage(
        img,
        (-1 * this.width) / 2,
        0,
        this.width,
        this.height
      );
      this.ctx.restore();
    };
    img.src = '/img/runway.svg';

    this.ctx.fillStyle = 'greenyellow';
    let font = '12px Arial';
    if (this.isSmall) {
      font = '10px Arial';
    }
    this.ctx.font = font;
    this.ctx.fillText(this.title, this.x + this.titleX, this.y + this.titleY);

    // draw runway heading dashes
    let length = 0;
    if (this.isShowDashes) {
      length = this.isSmall ? 65 : 100;
    }
    const dashLength = this.isSmall ? 4 : 6;
    const dashSpaceMultiple = 4;
    const reverseRunwayHeading = this.runwayHeading + Math.PI;
    const dashLengthInX = Math.cos(reverseRunwayHeading) * dashLength;
    const dashLengthInY = Math.sin(reverseRunwayHeading) * dashLength;
    const numDashes = Math.ceil(length / dashLength);

    this.ctx.strokeStyle = 'greenyellow';
    this.ctx.lineWidth = 1.2;
    this.ctx.beginPath();
    let dashX = this.x + 4 * dashLengthInX;
    let dashY = this.y + 4 * dashLengthInY;

    for (let i = 0; i < numDashes; i++) {
      this.ctx.moveTo(dashX, dashY);
      this.ctx.lineTo(dashX + dashLengthInX, dashY + dashLengthInY);
      dashX = dashX + dashSpaceMultiple * dashLengthInX;
      dashY = dashY + dashSpaceMultiple * dashLengthInY;
    }
    this.ctx.stroke();
  }

  update({ entityManagerArr }) {
    const isEntityOnRunway = isOnRunwayRollout(this.landingEntities);
    const isOnTakeoffRoll = (entity) => {
      return !!this.takeoffEntities.find((takeoff) => takeoff.id === entity.id);
    };

    entityManagerArr.forEach((entity) => {
      if (!isAircraft(entity)) return;

      const distObj = distToRunwayObj(this, entity);
      const distToRunway = distToRunwayObj(this, entity.prevPosition).dist;
      const isGettingCloser = distObj.dist <= distToRunway;

      if (entity.destroyFlag) return;
      if (entity.runway !== this.title) return;
      if (isEntityOnRunway(entity)) return;
      if (entity.takeoff) {
        if (isOnTakeoffRoll(entity)) {
          this.isIdle = false;
          return;
        }

        if (
          this.takeoffEntities.length >= 1 ||
          this.landingEntities.length >= 1
        ) {
          entity.cancelTakeoff();
          return;
        }

        this.takeoffEntities.push(entity);
        play(SoundType.Takeoff);
        return;
      }
      if (!entity.landing) return;

      // const { x, y } = { ...entity };
      // if (isGettingCloser) {
      //   console.log({ x, y }, entity.prevPosition);
      //   console.log('onGlidePath', entity.onGlidePath);
      //   const outgoingHeading = this.runwayHeading + Math.PI;
      //   const oncourseX = distObj.dist * Math.cos(outgoingHeading);
      //   const oncourseY = distObj.dist * Math.sin(outgoingHeading);
      //   const xdiff = this.x + oncourseX;
      //   const ydiff = this.y + oncourseY;
      //   this.ctx.fillStyle = 'yellow';
      //   this.ctx.fillRect(xdiff, ydiff, 3, 3);
      // }

      if (!isGettingCloser && entity.onGlidePath) {
        play(SoundType.Fail);
        return updateGoAround(this.runwayHeading, entity);
      }

      if (!isGettingCloser && !entity.onGlidePath) {
        showMsgFlyingAway(entity);
        play(SoundType.Fail);
        return entity.setLanding(false);
      }

      if (!isWithinMaxDist(this, distToRunway) && !entity.onGlidePath) {
        showMsgTooFar(entity);
        play(SoundType.Fail);
        return entity.setLanding(false);
      }

      if (!isHeadingClose(this, entity, distToRunway) && !entity.onGlidePath) {
        showMsgOffCourse(this.runwayHeading, entity);
        play(SoundType.Fail);
        return entity.setLanding(false);
      }

      if (!isTurnAngleSmall(this, entity) && !entity.onGlidePath) {
        showMsgOffCourse(this.runwayHeading, entity);
        play(SoundType.Fail);
        return entity.setLanding(false);
      }

      if (isTooHigh(this, entity) && !entity.onGlidePath) {
        showMsgTooHigh(entity);
        play(SoundType.Fail);
        return entity.setLanding(false);
      }

      if (!entity.onGlidePath) {
        entity.setOnGlidepath(true);
        play(SoundType.Ding);
        publish(MessageEvents.MessageLandingErrorEV, {
          id: entity.id,
          msg: '',
          instructions: '',
        });
      }

      // console.log(entity.title + ' :: intercept glidepath ');
      const interceptHeading = createInterceptHeading(entity, this);
      entity.setHeadingTarget(interceptHeading, true, false, Direction.None);
      updateSpeedAlt(this, entity, distToRunway);
    });
  }

  updateDestroy({ entityManagerArr }) {
    const isEntityTouchedDown = isTouchedDown(this);
    const isEntityOnRunway = isOnRunwayRollout(this.landingEntities);
    const noDeparturesOnRunway = !this.takeoffEntities.length;
    const runwayEmpty = !this.landingEntities.length && noDeparturesOnRunway;

    if (runwayEmpty) {
      this.isIdle = true;
    } else {
      this.isIdle = false;
    }

    entityManagerArr.forEach((entity) => {
      const placeOnRunway = (entity) => this.landingEntities.push(entity);
      const hasEntityLiftedOff = (entity) => {
        return (
          this.takeoffEntities.find((takeoff) => takeoff.id === entity.id) &&
          !entity.takeoff
        );
      };

      if (!isAircraft(entity)) return;
      if (hasEntityLiftedOff(entity)) {
        removeTakeoffFromRunway(this.takeoffEntities)(entity);
        return;
      }
      if (!entity.landing) return;
      if (isEntityOnRunway(entity)) {
        this.isIdleStateEnabled = true;
        landingRollout(this, entity);
      } else if (isEntityTouchedDown(entity)) {
        // console.log(entity.title + ' :: touch down');
        entity.setIsTouchedDown(true);
        entity.setAltitude(this.altitude, true, true);
        entity.setHeadingRad(this.runwayHeading, true);
        if (!isEntityOnRunway(entity)) {
          play(SoundType.Land);
          placeOnRunway(entity);
        }
      }
    });
  }

  draw() {}
}
////////////////////////////////////////////////////////////
// end class Runway
////////////////////////////////////////////////////////////

const showMsgTooHigh = (plane) => {
  publish(MessageEvents.MessageLandingErrorEV, {
    id: plane.id,
    msg: 'altitude too high',
    instructions: 'lower to approach altitude 5000ft',
  });
};

const showMsgFlyingAway = (plane) => {
  publish(MessageEvents.MessageLandingErrorEV, {
    id: plane.id,
    msg: 'not flying towards',
    instructions: 'turn towards runway',
  });
};

const showMsgOffCourse = (runwayHeading, plane) => {
  const heading = convHdgRadToThreeDigits(runwayHeading);
  publish(MessageEvents.MessageLandingErrorEV, {
    id: plane.id,
    msg: 'too far off course',
    instructions: 'turn to runway heading ' + heading,
  });
};

const showMsgTooFar = (plane) => {
  publish(MessageEvents.MessageLandingErrorEV, {
    id: plane.id,
    msg: 'distance too far',
    instructions: 'fly closer to runway',
  });
};

const isTooHigh = (self, entity) => {
  if (entity.altitude > self.altitudeMax) return true;
  return false;
};

const isHeadingClose = (self, entity, distToRunway) => {
  let deltaHeading = Math.abs(self.runwayHeading - entity.headingRad);
  if (distToRunway <= 60) return deltaHeading < 0.5;
  if (60 < distToRunway && distToRunway <= 120) return deltaHeading < 0.5;
  if (120 < distToRunway && distToRunway <= 200) return deltaHeading < 1;
  if (distToRunway > 200) return deltaHeading < 2;
};

const isTurnAngleSmall = (self, plane) => {
  const oppositeRunwayHdgDeg = convertToSmallDegrees(
    radToDegrees(self.runwayHeading + Math.PI)
  );
  const oppositeRunwayHdg = degreesToRad(oppositeRunwayHdgDeg);
  const hdgToPlane = getHeadingToEntity(self)(plane);

  const arcMax = 15;
  return isHeadingWithinArc(hdgToPlane, oppositeRunwayHdg, arcMax);
};

/**
 * @description update speed & altitude based on distance to Runway
 * @param {Object} self
 * @param {Aircraft} aircraft
 */
const updateSpeedAlt = (self, aircraft, distToRunway) => {
  let speedTarget = aircraft.speedLanding;
  let altitudeTarget = self.altitudeLanding;
  if (40 < distToRunway && distToRunway <= 80) {
    speedTarget += 10;
    altitudeTarget += 200;
  }
  if (80 < distToRunway && distToRunway <= 135) {
    speedTarget += 20;
    altitudeTarget += 600;
  }
  if (distToRunway > 135) {
    speedTarget += 40;
    altitudeTarget += 1000;
  }

  if (aircraft.speedTarget > speedTarget) aircraft.setSpeed(speedTarget, true);
  if (aircraft.altitudeTarget > altitudeTarget)
    aircraft.setAltitude(altitudeTarget, true);
};

const removeTakeoffFromRunway = (takeoffEntities) => (entity) => {
  const index = takeoffEntities.findIndex((item) => item.id === entity.id);
  if (index >= 0) {
    takeoffEntities.splice(index, 1);
  }
};

const landingRollout = (self, entity) => {
  const removeFromRunway = (entity) => {
    self.landingEntities = self.landingEntities.filter(
      (landing) => landing.id !== entity.id
    );
  };

  // console.log(entity.title + ' :: landing rollout');
  entity.setHeadingRad(self.runwayHeading, true);
  entity.setSpeed(0, true, true);
  if (entity.speed <= 5) {
    removeFromRunway(entity);
    entity.setDestroyFlag(true);
  }
};

const distToRunwayObj = (self, entity) => {
  const x = self.x - entity.x;
  const y = self.y - entity.y;
  const dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return { x, y, dist };
};

const isWithinMaxDist = (self, distToRunway) => {
  const isSmall = self.isSmall;
  const maxDistFromRunway = isSmall ? 300 : 400;
  return distToRunway < maxDistFromRunway;
};

const isOnRunwayRollout = (landingEntities) => (entity) => {
  return !!landingEntities.find((landing) => landing.id === entity.id);
};

const isTouchedDown = (self) => (entityOther) => {
  if (entityOther.id === self.id) return false;

  const distX = Math.abs(self.x - entityOther.x);
  const distY = Math.abs(self.y - entityOther.y);
  const distVert = Math.abs(self.altitude - entityOther.altitude);
  const deltaHeading = Math.abs(self.runwayHeading - entityOther.headingRad);
  const deltaLandingSpeed = Math.abs(
    entityOther.speedLanding - entityOther.speed
  );
  const isCloseHorizontal = distX < 5 && distY < 5;
  const isCloseVertical = distVert < 200;
  const isRunwayHeading = deltaHeading < 0.5;
  const isCloseLandingSpeed = deltaLandingSpeed < 15;
  // if (entityOther.landing) {
  //   console.log(entityOther.title
  //     + ' :: isCloseHorizontal: ' + isCloseHorizontal
  //     + ' :: isCloseVertical: ' + isCloseVertical
  //     + ' :: isRunwayHeading: ' + isRunwayHeading
  //     + ' :: isCloseLandingSpeed: ' + isCloseLandingSpeed);
  // }
  return (
    isCloseHorizontal &&
    isCloseVertical &&
    isRunwayHeading &&
    isCloseLandingSpeed
  );
};

const updateGoAround = (runwayHeading, entity) => {
  goAroundDebug();
  entity.setHeadingTarget(runwayHeading, false, false, Direction.None);
  if (entity.speedTarget <= 220) entity.setSpeed(220, false, true);
  if (entity.altitudeTarget <= 2000) entity.setAltitude(2000, false);

  planeLandFail();
  publish(MessageEvents.MessageLandingErrorEV, {
    id: entity.id,
    msg: 'abort - going around',
    instructions: 'landing aborted',
  });
};
