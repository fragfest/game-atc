const entityFns = require('./entity');
const Square = require('../js/Square');

module.exports = class Runway {
  constructor(title, entityLayerObj, positionObj) {
    this.id = Math.random();
    this.title = title.trim();
    this.x = positionObj.x;
    this.y = positionObj.y;
    this.ctx = entityLayerObj.ctx;
    this.width = 10;
    this.height = 50;
    this.altitude = 0;
    this.runwayHeading = Math.PI / 2;

    this.ctx.fillStyle = 'lightgreen';
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {}

  removeLanded({ entityManagerArr }) {
    const entityAirport = entityFns.create({...this});
    const isEntityLanded = entityOther => {
      if(entityOther.id === entityAirport.id) return false;
      if(!entityOther.headingRad && entityOther.headingRad !== 0) return false;
      const distX = Math.abs(entityAirport.x - entityOther.x);
      const distY = Math.abs(entityAirport.y - entityOther.y);
      const distVert = Math.abs(entityAirport.altitude - entityOther.altitude);
      const deltaHeading = Math.abs(this.runwayHeading - entityOther.headingRad)
      const isCloseHorizontal = (distX < 5 && distY < 5);
      const isCloseVertical = distVert < 150;
      const isRunwayHeading = deltaHeading < 0.05;
      return isCloseHorizontal && isCloseVertical && isRunwayHeading;
    }
    
    let index = 0;
    entityManagerArr.forEach(entity => {
      const isSquare = entity instanceof Square;
      if(isEntityLanded(entity) && isSquare) {
        entity.destroy();
        entityManagerArr.splice(index, 1);
      }
      index++;
    });
  }
};