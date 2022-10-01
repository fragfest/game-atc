const { inputHeadingToRad, radToDegrees, convertToSmallDegrees, ScreenSizes } = require('./utils');
const Square = require('./Square');
const { MessageEvents, publish } = require('./events/messages');
const { planeGoAroundPenalty } = require('./panelBottom/score');

////////////////////////////////////////////////////////////
// class Runway
////////////////////////////////////////////////////////////
module.exports = class Runway {
  constructor(title, imgLayerObj, screenSize, runwayObj) {
    this.id = Math.random();
    this.title = title.trim();
    this.x = runwayObj.x;
    this.y = runwayObj.y;
    this.isSmall = (screenSize === ScreenSizes.Small) ? true : false;
    this.ctx = imgLayerObj.ctx;
    this.width = runwayObj.width;
    this.height = runwayObj.length;
    this.altitude = 0;
    this.altitudeLanding = this.altitude + 150;
    this.runwayHeading = inputHeadingToRad(runwayObj.heading);
    this.waypoint = runwayObj.waypoint;
    this.landingEntities = [];

    // this.ctx.fillStyle = 'greenyellow';
    // this.ctx.fillRect(this.x - 2, this.y - 2, 4, 4);

    const img = new Image();
    img.onload = () => {
      this.ctx.save();
      this.ctx.translate(this.x, this.y);
      this.ctx.rotate(this.runwayHeading - Math.PI / 2);
      this.ctx.drawImage(img, -1 * this.width / 2, 0, this.width, this.height);
      this.ctx.restore();
    };
    img.src = '/img/runway.png';

    this.ctx.fillStyle = 'greenyellow';
    this.ctx.font = "bold 9px Arial"
    this.ctx.fillText('27R', this.x, this.y - 5);

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
      dashX = dashX + dashSpaceMultiple * dashLengthInX
      dashY = dashY + dashSpaceMultiple * dashLengthInY;
    }
    this.ctx.stroke();
  }

  updateGoAround(entity) {
    const scoreRemoved = planeGoAroundPenalty();
    publish(MessageEvents.MessageAllEV, entity.title + ' landing go-around (' + scoreRemoved + ')');
    entity.setHeadingTarget(this.runwayHeading, false);
    if (entity.speedTarget <= 220) entity.setSpeed(220, false, true);
    if (entity.altitudeTarget <= 2000) entity.setAltitude(2000, false);
  }

  update({ entityManagerArr }) {
    const isSquare = entity => entity instanceof Square;
    const isEntityOnRunway = isOnRunway(this.landingEntities);

    entityManagerArr.forEach(entity => {
      if (!isSquare(entity)) return;
      const distObj = distToRunwayObj(this, entity);
      const isGettingCloser = distObj.dist < entity.distPrev;

      if (entity.destroyFlag) return;
      if (!entity.landing) return;
      if (!isGettingCloser && !isEntityOnRunway(entity)) { return this.updateGoAround(entity); }
      if (isEntityOnRunway(entity)) return;

      if (!isHeadingClose(this, entity) && !entity.onGlidePath) { return entity.setLanding(false); }
      if (!isCloseToGlidepath(this, entity) && !entity.onGlidePath) { return entity.setLanding(false); }
      entity.setDistPrev(distObj.dist);
      entity.setOnGlidepath(true);

      // console.log(entity.title + ' :: intercept glidepath ');
      const interceptHeading = Math.atan(distObj.y / distObj.x) + Math.PI;
      entity.setHeadingTarget(interceptHeading, true);
      updateSpeedAlt(this, entity);
    });
  }

  updateDestroy({ entityManagerArr }) {
    const isEntityTouchedDown = isTouchedDown(this);
    const isEntityOnRunway = isOnRunway(this.landingEntities);

    entityManagerArr.forEach(entity => {
      const isSquare = entity instanceof Square;
      const placeOnRunway = entity => this.landingEntities.push(entity);

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

  draw() { }
};
////////////////////////////////////////////////////////////
// end class Runway
////////////////////////////////////////////////////////////

const isHeadingClose = (self, entity) => {
  const dist = distToRunwayObj(self, entity).dist;
  let deltaHeading = Math.abs(self.runwayHeading - entity.headingRad);
  if (dist <= 60) return deltaHeading < 0.5;
  if (60 < dist && dist <= 120) return deltaHeading < 0.5;
  if (120 < dist && dist <= 200) return deltaHeading < 1;
  if (dist > 200) return deltaHeading < 2;
};

/**
 * @description update Square speed & altitude based on distance to Runway
 * @param {Object} self
 * @param {Square} square
 */
const updateSpeedAlt = (self, square) => {
  const dist = distToRunwayObj(self, square).dist;
  let speedTarget = square.speedLanding;
  let altitudeTarget = self.altitudeLanding;
  if (60 < dist && dist <= 120) {
    speedTarget += 5;
    altitudeTarget += 100;
  }
  if (120 < dist && dist <= 200) {
    speedTarget += 10;
    altitudeTarget += 300;
  }
  if (dist > 200) {
    speedTarget += 20;
    altitudeTarget += 600;
  }

  if (square.speedTarget > speedTarget) square.setSpeed(speedTarget, true);
  if (square.altitudeTarget > altitudeTarget) square.setAltitude(altitudeTarget, true);
};

const landingRollout = (self, entity) => {
  const removeFromRunway = entity => {
    self.landingEntities = self.landingEntities.filter(landing => landing.id !== entity.id);
  };

  // console.log(entity.title + ' :: landing rollout');
  entity.setHeadingRad(self.runwayHeading, true);
  entity.setSpeed(0, true, true);
  if (entity.speed <= 30) {
    // console.log(entity.title + ' :: landing complete');
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

const isCloseToGlidepath = (self, entity) => {
  const angleMaxDeg = 6;
  const maxDistFromRunway = 400;

  const dist = distToRunwayObj(self, entity).dist;
  const x = Math.abs(self.x - entity.x);
  const isWithinMaxDist = dist < maxDistFromRunway;
  const isGettingCloser = dist < entity.distPrev;
  // if (isGettingCloser) {
  //   const outgoingHeading = self.runwayHeading + Math.PI;
  //   const oncourseX = dist * Math.cos(outgoingHeading);
  //   const oncourseY = dist * Math.sin(outgoingHeading);
  //   const xdiff = self.x + oncourseX;
  //   const ydiff = self.y + oncourseY;
  //   self.imgLayerCtx.fillStyle = 'yellow';
  //   self.imgLayerCtx.fillRect(xdiff, ydiff, 3, 3);
  // }

  const angleToGlidepath = convertToSmallDegrees(radToDegrees(Math.acos(x / dist)) - 90);
  return (angleToGlidepath < angleMaxDeg) && isGettingCloser && isWithinMaxDist;
};

const isOnRunway = landingEntities => entity => landingEntities.find(landing => landing.id === entity.id);

const isTouchedDown = self => entityOther => {
  if (entityOther.id === self.id) return false;

  const distX = Math.abs(self.x - entityOther.x);
  const distY = Math.abs(self.y - entityOther.y);
  const distVert = Math.abs(self.altitude - entityOther.altitude);
  const deltaHeading = Math.abs(self.runwayHeading - entityOther.headingRad);
  const deltaLandingSpeed = Math.abs(entityOther.speedLanding - entityOther.speed);
  const isCloseHorizontal = (distX < 5 && distY < 5);
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
  return isCloseHorizontal && isCloseVertical && isRunwayHeading && isCloseLandingSpeed;
};