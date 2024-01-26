import {
  convertToSmallDegrees,
  convHdgRadToThreeDigits,
  inputHeadingToRad,
  radToDegrees,
  ScreenSizes,
  Direction,
} from './utils';
import Square from './Square';
import { MessageEvents, publishMessage as publish } from './events/messages';
import { play, SoundType } from './game/sound';
import { planeLandFail } from './game/score';

////////////////////////////////////////////////////////////
// class Runway
////////////////////////////////////////////////////////////
export default class Runway {
  constructor(title, imgLayerObj, screenSize, runwayObj) {
    this.id = Math.random();
    this.title = title.trim();
    this.x = runwayObj.x;
    this.y = runwayObj.y;
    this.isSmall = screenSize === ScreenSizes.Small ? true : false;
    this.ctx = imgLayerObj.ctx;
    this.width = runwayObj.width;
    this.height = runwayObj.length;
    this.altitude = 0;
    this.altitudeLanding = this.altitude + 150;
    this.altitudeMax = 5000;
    this.runwayHeading = inputHeadingToRad(runwayObj.heading);
    this.waypoint = runwayObj.waypoint;
    this.landingEntities = [];
    this.titlePosition = runwayObj.titlePosition || {};
    this.titleX = this.titlePosition.x || 0;
    this.titleY = this.titlePosition.y || 0;

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
    img.src = '/img/runway.png';

    this.ctx.fillStyle = 'greenyellow';
    this.ctx.font = this.isSmall ? '10px Arial' : '12px Arial';
    this.ctx.fillText(this.title, this.x + this.titleX, this.y + this.titleY);

    // draw runway heading dashes
    const length = this.isSmall ? 65 : 100;
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
    const isSquare = (entity) => entity instanceof Square;
    const isEntityOnRunway = isOnRunway(this.landingEntities);

    entityManagerArr.forEach((entity) => {
      if (!isSquare(entity)) return;

      const distObj = distToRunwayObj(this, entity);
      const distToRunway = distToRunwayObj(this, entity.prevPosition).dist;
      const isGettingCloser = distObj.dist <= distToRunway;

      if (entity.destroyFlag) return;
      if (entity.runway !== this.title) return;
      if (isEntityOnRunway(entity)) return;
      if (!entity.landing) return;

      // const { x, y } = { ...entity };
      // console.log({ x, y }, entity.prevPosition, entity.onGlidePath);

      // if (isGettingCloser) {
      //   const outgoingHeading = self.runwayHeading + Math.PI;
      //   const oncourseX = dist * Math.cos(outgoingHeading);
      //   const oncourseY = dist * Math.sin(outgoingHeading);
      //   const xdiff = self.x + oncourseX;
      //   const ydiff = self.y + oncourseY;
      //   self.imgLayerCtx.fillStyle = 'yellow';
      //   self.imgLayerCtx.fillRect(xdiff, ydiff, 3, 3);
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

      if (
        !isTurnAngleSmall(this, entity, distToRunway) &&
        !entity.onGlidePath
      ) {
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
      const interceptHeading = Math.atan(distObj.y / distObj.x) + Math.PI;
      entity.setHeadingTarget(interceptHeading, true, false, Direction.None);
      updateSpeedAlt(this, entity, distToRunway);
    });
  }

  updateDestroy({ entityManagerArr }) {
    const isEntityTouchedDown = isTouchedDown(this);
    const isEntityOnRunway = isOnRunway(this.landingEntities);

    entityManagerArr.forEach((entity) => {
      const isSquare = entity instanceof Square;
      const placeOnRunway = (entity) => this.landingEntities.push(entity);

      if (!isSquare) return;
      if (!entity.landing) return;
      if (isEntityOnRunway(entity)) {
        landingRollout(this, entity);
      } else if (isEntityTouchedDown(entity)) {
        // console.log(entity.title + ' :: touch down');
        entity.setIsTouchedDown(true);
        entity.setAltitude(this.altitude, true, true);
        entity.setHeadingRad(this.runwayHeading, true);
        if (!isEntityOnRunway(entity)) {
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

const isTurnAngleSmall = (self, entity, distToRunway) => {
  const angleMaxDeg = 15;
  const x = Math.abs(self.x - entity.x);
  const angleToGlidepath = convertToSmallDegrees(
    radToDegrees(Math.acos(x / distToRunway)) - 90
  );
  return angleToGlidepath < angleMaxDeg;
};

/**
 * @description update Square speed & altitude based on distance to Runway
 * @param {Object} self
 * @param {Square} square
 */
const updateSpeedAlt = (self, square, distToRunway) => {
  let speedTarget = square.speedLanding;
  let altitudeTarget = self.altitudeLanding;
  if (60 < distToRunway && distToRunway <= 120) {
    speedTarget += 5;
    altitudeTarget += 100;
  }
  if (120 < distToRunway && distToRunway <= 200) {
    speedTarget += 10;
    altitudeTarget += 300;
  }
  if (distToRunway > 200) {
    speedTarget += 20;
    altitudeTarget += 600;
  }

  if (square.speedTarget > speedTarget) square.setSpeed(speedTarget, true);
  if (square.altitudeTarget > altitudeTarget)
    square.setAltitude(altitudeTarget, true);
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
  if (entity.speed <= 15) {
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

const isOnRunway = (landingEntities) => (entity) =>
  landingEntities.find((landing) => landing.id === entity.id);

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
