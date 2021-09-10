const { inputHeadingToRad } = require('./utils');
const Square = require('../js/Square');

////////////////////////////////////////////////////////////
// class Runway
////////////////////////////////////////////////////////////
module.exports = class Runway {
  constructor(title, entityLayerObj, imgLayerObj, positionObj) {
    this.id = Math.random();
    this.title = title.trim();
    this.x = positionObj.x;
    this.y = positionObj.y;
    this.ctx = entityLayerObj.ctx;
    this.imgLayerCtx = imgLayerObj.ctx;
    this.width = 4;
    this.height = 60;
    this.altitude = 0;
    this.altitudeLanding = this.altitude + 150;
    // this.runwayHeading = inputHeadingToRad(positionObj.heading);
    this.runwayHeading = Math.PI * 3 / 4;  // runwayHeading 222 degrees
    this.landingEntities = [];

    const img = new Image();
    img.onload = () => {
      this.imgLayerCtx.save();
      this.imgLayerCtx.translate(this.x, this.y);
      this.imgLayerCtx.rotate(this.runwayHeading - Math.PI / 2);
      this.imgLayerCtx.drawImage(img, 0, 0, this.width, this.height);
      this.imgLayerCtx.restore();
    };
    img.src = '/img/runway.png';

    this.ctx.fillStyle = 'greenyellow';
    this.ctx.fillRect(this.x, this.y, 5, 5);

    this.imgLayerCtx.fillStyle = 'greenyellow';
    this.imgLayerCtx.font = "bold 10px Arial"
    this.imgLayerCtx.fillText('27R', this.x, this.y - 5);
  }

  update() {}

  updateGoAround(entity) {
    console.log(entity.title + ' :: go-around');
    entity.setHeadingTarget(this.runwayHeading, false);
    if(entity.speedTarget < 160) entity.setSpeed(160, false, false);
    if(entity.altitudeTarget < 2000) entity.setAltitude(2000, false);
  }

  updateLanding({ entityManagerArr }) {
    const isSquare = entity => entity instanceof Square;
    const isEntityOnRunway = isOnRunway(this.landingEntities);

    entityManagerArr.forEach(entity => {
      if(!isSquare(entity)) return;
      if(!entity.landing) return;

      const distObj = distToRunwayObj(this, entity);
      const isGettingCloser = distObj.dist < entity.distPrev;
      if(!isGettingCloser && !isEntityOnRunway(entity)) {
        return this.updateGoAround(entity);
      }
      if(isEntityOnRunway(entity)) return;

      if(!isHeadingClose(this, entity)) { return entity.setLanding(false); }
      if(!isCloseToGlidepath(this, entity)) { return entity.setLanding(false); }
      entity.setDistPrev(distObj.dist);

      const interceptHeading = Math.atan(distObj.y / distObj.x) + Math.PI;
      console.log(entity.title + ' :: intercept heading ', interceptHeading);
      entity.setHeadingTarget(interceptHeading, true);
      updateSpeedAlt(this, entity);
    });
  }

  removeLanded({ entityManagerArr }) { 
    const isEntityTouchedDown = isTouchedDown(this);
    const isEntityOnRunway = isOnRunway(this.landingEntities);
    
    let index = -1;
    entityManagerArr.forEach(entity => {
      const isSquare = entity instanceof Square;
      const placeOnRunway = entity => this.landingEntities.push(entity);

      index++;
      if(!isSquare) return;
      if(!entity.landing) return;
      if(isEntityOnRunway(entity)) {
        landingRollout(this, entityManagerArr, index, entity);
      } else if(isEntityTouchedDown(entity)) {
        console.log(entity.title + ' :: touch down');
        entity.setIsTouchedDown(true);
        entity.setAltitude(this.altitude, true);
        entity.setHeadingRad(this.runwayHeading, true);
        if(!isEntityOnRunway(entity)) {
          placeOnRunway(entity);
        }
      }
    });
  }
};
////////////////////////////////////////////////////////////
// end class Runway
////////////////////////////////////////////////////////////

const getGlideslopeDist = (self, entity) => {
  const dist = distToRunwayObj(self, entity).dist;
  console.log(entity.title + ' :: dist ' + dist)
  if(dist <= 60) return 10;
  if(60 < dist && dist <= 120) return 20;
  if(120 < dist && dist <= 200) return 30;
  if(dist > 200) return 60;
};

const isHeadingClose = (self, entity) => {
  const dist = distToRunwayObj(self, entity).dist;
  let deltaHeading = Math.abs(self.runwayHeading - entity.headingRad);
  if(dist <= 60) return deltaHeading < 0.5;
  if(60 < dist && dist <= 120) return deltaHeading < 0.5;
  if(120 < dist && dist <= 200) return deltaHeading < 1;
  if(dist > 200) return deltaHeading < 2;
};

const updateSpeedAlt = (self, entity) => {
  const dist = distToRunwayObj(self, entity).dist;
  let speedTarget = entity.speedLanding;
  let altitudeTarget = self.altitudeLanding;
  if(60 < dist && dist <= 120) {
    speedTarget += 15;
    altitudeTarget += 300; 
  }
  if(120 < dist && dist <= 200) {
    speedTarget += 30;
    altitudeTarget += 600; 
  }
  if(dist > 200) {
    speedTarget += 60;
    altitudeTarget += 900; 
  }
  if(entity.speedTarget > speedTarget) entity.setSpeed(speedTarget, true, false);
  if(entity.altitudeTarget > altitudeTarget) entity.setAltitude(altitudeTarget, true);
};

const landingRollout = (self, entityManagerArr, entityIndex, entity) => {
  const removeFromRunway = entity => {
    self.landingEntities = self.landingEntities.filter(landing => landing.id !== entity.id);
  };

  console.log(entity.title + ' :: landing rollout');
  entity.setHeadingRad(self.runwayHeading, true);
  const speedNew = entity.speed - 30;
  entity.setSpeed(speedNew, true, true);
  if(speedNew <= 0) {
    console.log(entity.title + ' :: landing complete');
    removeFromRunway(entity);
    entity.destroy();
    entityManagerArr.splice(entityIndex, 1);
  }
};

const distToRunwayObj = (self, entity) => {
  const x = self.x - entity.x;
  const y = self.y - entity.y;
  const dist = Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2) );
  return { x, y, dist };
};

const isCloseToGlidepath = (self, entity) => {
  const dist = distToRunwayObj(self, entity).dist;
  const outgoingHeading = self.runwayHeading + Math.PI;
  const oncourseX = dist * Math.cos(outgoingHeading);
  const oncourseY = dist * Math.sin(outgoingHeading);
  const x = self.x + oncourseX;
  const y = self.y + oncourseY;
  const margin = getGlideslopeDist(self, entity);
  let marginX = Math.abs(margin * Math.cos(outgoingHeading));
  let marginY = Math.abs(margin * Math.sin(outgoingHeading));
  marginX = (marginX > 10) ? marginX : 10;
  marginY = (marginY > 10) ? marginY : 10;

  const distSquareToX = Math.abs(entity.x - x);
  const distSquareToY = Math.abs(entity.y - y);
  const isGettingCloser = dist < entity.distPrev;
  if(isGettingCloser) {
    self.imgLayerCtx.fillStyle = 'yellow';
    self.imgLayerCtx.fillRect(x, y, 3, 3);
  }
  // console.log('distTo-x', distSquareToX.toFixed('1'), 'max-x', marginX.toFixed('1'),
  //  'distTo-y', distSquareToY.toFixed('1'), 'max-y', marginY.toFixed('1'))
  return distSquareToX < marginX && distSquareToY < marginY && isGettingCloser;
};

const isOnRunway = landingEntities => entity => landingEntities.find(landing => landing.id === entity.id);

const isTouchedDown = self => entityOther => {
  if(entityOther.id === self.id) return false;

  const distX = Math.abs(self.x - entityOther.x);
  const distY = Math.abs(self.y - entityOther.y);
  const distVert = Math.abs(self.altitude - entityOther.altitude);
  const deltaHeading = Math.abs(self.runwayHeading - entityOther.headingRad);
  const deltaLandingSpeed = Math.abs(entityOther.speedLanding - entityOther.speed);
  const isCloseHorizontal = (distX < 5 && distY < 5);
  const isCloseVertical = distVert < 200;
  const isRunwayHeading = deltaHeading < 0.5;
  const isCloseLandingSpeed = deltaLandingSpeed < 15;
  // if(entityOther.landing) {
  //   console.log(entityOther.title
  //     + ' :: isCloseHorizontal: ' + isCloseHorizontal
  //     + ' :: isCloseVertical: ' + isCloseVertical
  //     + ' :: isRunwayHeading: ' + isRunwayHeading
  //     + ' :: isCloseLandingSpeed: ' + isCloseLandingSpeed);
  // }
  return isCloseHorizontal && isCloseVertical && isRunwayHeading && isCloseLandingSpeed;
};