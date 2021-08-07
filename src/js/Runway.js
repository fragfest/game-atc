const { inputHeadingToRad } = require('./utils');
const entityFns = require('./entity');
const Square = require('../js/Square');

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
    this.runwayHeading = inputHeadingToRad(positionObj.heading);
    // this.runwayHeading = Math.PI * 3 / 4;  // runwayHeading 222 degrees
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

    // this.ctx.fillStyle = 'greenyellow';
    // this.ctx.fillRect(this.x, this.y, 5, 5);

    this.imgLayerCtx.fillStyle = 'greenyellow';
    this.imgLayerCtx.font = "bold 10px Arial"
    this.imgLayerCtx.fillText('27R', this.x, this.y - 5);
  }

  update() {}

  updateLanding({ entityManagerArr }) {
    const isSquare = entity => entity instanceof Square;
    const isHeadingClose = entity => {
      const deltaHeading = Math.abs(this.runwayHeading - entity.headingRad);
      return deltaHeading < 0.5;
    }
    const isEntityOnRunway = isOnRunway(this.landingEntities);

    entityManagerArr.forEach(entity => {
      if(!isSquare(entity)) return;
      if(!entity.landing) return;
      if(isHeadingClose(entity)) {
        const distX = this.x - entity.x;
        const distY = this.y - entity.y;
        const dist = Math.sqrt( Math.pow(distX, 2) + Math.pow(distY, 2) );
        const outgoingHeading = this.runwayHeading + Math.PI;
        const oncourseX = dist * Math.cos(outgoingHeading);
        const oncourseY = dist * Math.sin(outgoingHeading);
        const x = this.x + oncourseX;
        const y = this.y + oncourseY;
        const margin = 10;
        let marginX = Math.abs(margin * Math.cos(outgoingHeading));
        let marginY = Math.abs(margin * Math.sin(outgoingHeading));
        marginX = (marginX > 10) ? marginX : 10;
        marginY = (marginY > 10) ? marginY : 10;
        
        // this.imgLayerCtx.fillStyle = 'yellow';
        // this.imgLayerCtx.fillRect(x, y, 3, 3);

        const distSquareToX = Math.abs(entity.x - x);
        const distSquareToY = Math.abs(entity.y - y);
        const isGettingCloser = dist < entity.distPrev;
        entity.distPrev = dist;
        if(distSquareToX < marginX && distSquareToY < marginY && isGettingCloser) {
          const interceptHeading = Math.atan(distY / distX) + Math.PI;
          console.log(entity.title + ' :: landing mode ');
          entity.setHeadingTarget(interceptHeading, true);
          // TODO auto-slowdown need to support manual setting during landing also
          // TODO setSpeed & setAltitude based on dist i.e. glideslope
          if(entity.speedTarget > entity.speedLanding) entity.setSpeed(entity.speedLanding);
        }
        if(!isGettingCloser && !isEntityOnRunway(entity)) {
          console.log(entity.title + ' :: go-around');
          entity.setHeadingTarget(this.runwayHeading, false);
          if(entity.speedTarget < 160) entity.setSpeed(160);
          if(entity.altitudeTarget < 2000) entity.setAltitude(2000);
        }
      }
    });
  }

  removeLanded({ entityManagerArr }) { 
    const isEntityTouchedDown = isTouchedDown(this);
    const isEntityOnRunway = isOnRunway(this.landingEntities);
    
    let index = -1;
    entityManagerArr.forEach(entity => {
      const isSquare = entity instanceof Square;
      const placeOnRunway = entity => this.landingEntities.push(entity);
      const removeFromRunway = entity => {
        this.landingEntities = this.landingEntities.filter(landing => landing.id !== entity.id);
      }

      index++;
      if(!isSquare) return;
      if(!entity.landing) return;
      if(isEntityTouchedDown(entity)) {
        console.log(entity.title + ' :: touch down');
        entity.setAltitude(0);
        entity.setHeadingRad(this.runwayHeading, true);
        if(!isEntityOnRunway(entity)) {
          placeOnRunway(entity);
        }
      } else if(isEntityOnRunway(entity)) {
        console.log(entity.title + ' :: landing rollout');
        entity.setHeadingRad(this.runwayHeading, true);
        const speedNew = entity.speed - 30;
        entity.setSpeed(speedNew, true);
        if(speedNew <= 0) {
          console.log(entity.title + ' :: landing complete');
          removeFromRunway(entity);
          entity.destroy();
          entityManagerArr.splice(index, 1);
        }
      }
    });
  }
}; //end class Runway

const isOnRunway = landingEntities => entity => landingEntities.find(landing => landing.id === entity.id);

const isTouchedDown = runwaySelf => entityOther => {
  const entityAirport = entityFns.create(runwaySelf);

  if(entityOther.id === entityAirport.id) return false;
  const distX = Math.abs(entityAirport.x - entityOther.x);
  const distY = Math.abs(entityAirport.y - entityOther.y);
  const distVert = Math.abs(entityAirport.altitude - entityOther.altitude);
  const deltaHeading = Math.abs(entityAirport.runwayHeading - entityOther.headingRad);
  const deltaLandingSpeed = Math.abs(entityOther.speedLanding - entityOther.speed);
  const isCloseHorizontal = (distX < 5 && distY < 5);
  const isCloseVertical = distVert < 150;
  const isRunwayHeading = deltaHeading < 0.1;
  const isCloseLandingSpeed = deltaLandingSpeed < 15;
  return isCloseHorizontal && isCloseVertical && isRunwayHeading && isCloseLandingSpeed;
}