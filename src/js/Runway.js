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
    this.width = 8;
    this.height = 100;
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

    this.ctx.fillStyle = 'darkslategrey';
    this.ctx.fillRect(this.x, this.y, 6, 6);
  }

  update() {}

  updateLanding({ entityManagerArr }) {
    const isSquare = entity => entity instanceof Square;
    const isHeadingClose = entity => {
      const deltaHeading = Math.abs(this.runwayHeading - entity.headingRad);
      return deltaHeading < 0.5;
    }

    entityManagerArr.forEach(entity => {
      if(!isSquare(entity)) return;
      if(entity.landing && isHeadingClose(entity)) {
        console.log(entity.title + ' :: heading close')
        const distX = Math.abs(this.x - entity.x);
        const distY = Math.abs(this.y - entity.y);
        const dist = Math.sqrt( Math.pow(distX,2) + Math.pow(distY, 2) );
        const outgoingHeading = this.runwayHeading + Math.PI;
        const oncourseX = dist * Math.cos(outgoingHeading);
        const oncourseY = dist * Math.sin(outgoingHeading);
        const x = this.x + oncourseX;
        const y = this.y + oncourseY;
        const margin = 10;
        let marginX = Math.abs(margin * Math.cos(outgoingHeading));
        let marginY = Math.abs(margin * Math.sin(outgoingHeading));
        marginX = (marginX > 5) ? marginX : 5;
        marginY = (marginY > 5) ? marginY : 5;

        this.ctx.fillStyle = 'darkslategrey';
        this.ctx.fillRect(x, y, 3, 3);

        if(Math.abs(entity.x - x) < marginX && Math.abs(entity.y - y) < marginY ) {
          console.log(entity.title + ' :: is on course')
        }
      }
    });
  }

  removeLanded({ entityManagerArr }) {
    const entityAirport = entityFns.create({...this});
    const isEntityTouchedDown = entityOther => {
      if(entityOther.id === entityAirport.id) return false;
      if(!entityOther.headingRad && entityOther.headingRad !== 0) return false;
      const distX = Math.abs(entityAirport.x - entityOther.x);
      const distY = Math.abs(entityAirport.y - entityOther.y);
      const distVert = Math.abs(entityAirport.altitude - entityOther.altitude);
      const deltaHeading = Math.abs(this.runwayHeading - entityOther.headingRad)
      const isCloseHorizontal = (distX < 10 && distY < 10);
      const isCloseVertical = distVert < 150;
      const isRunwayHeading = deltaHeading < 0.3;
      return isCloseHorizontal && isCloseVertical && isRunwayHeading;
    }
    
    let index = 0;
    entityManagerArr.forEach(entity => {
      const isSquare = entity instanceof Square;
      const isOnRunway = entity => this.landingEntities.find(landing => landing.id === entity.id);
      const placeOnRunway = entity => this.landingEntities.push(entity);
      const removeFromRunway = entity => {
        this.landingEntities = this.landingEntities.filter(landing => landing.id !== entity.id);
      }

      if(!isSquare) return;
      else if(isEntityTouchedDown(entity)) {
        console.log(entity.title + ' :: touch down');
        entity.setAltitude(0);
        entity.setSpeed(entity.speed - 30);
        if(!isOnRunway(entity)) {
          placeOnRunway(entity);
        }
      } else if(isOnRunway(entity)) {
        console.log(entity.title + ' :: landing rollout');
        const speedNew = entity.speed - 30;
        entity.setSpeed(speedNew);
        if(speedNew <= 0) {
          console.log(entity.title + ' :: landing complete');
          removeFromRunway(entity);
          entity.destroy();
          entityManagerArr.splice(index, 1);
        }
      }
      index++;
    });
  }
};