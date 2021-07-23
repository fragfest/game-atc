const entityFns = require('./entity');
const Square = require('../js/Square');

const degreesToRad = degrees => (Number(degrees) - 90) * Math.PI / 180;
const convertToPosRad = rad => (rad >= 0) ? rad : (2 * Math.PI + rad); 
const inputHeadingToRad = heading => convertToPosRad(degreesToRad(heading));

module.exports = class Runway {
  constructor(title, entityLayerObj, imgLayerCtx, htmlDiv, positionObj) {
    this.id = Math.random();
    this.title = title.trim();
    this.x = positionObj.x;
    this.y = positionObj.y;
    this.ctx = entityLayerObj.ctx;
    this.imgLayerCtx = imgLayerCtx;
    this.width = 8;
    this.height = 100;
    this.altitude = 0;
    this.runwayHeading = inputHeadingToRad(positionObj.heading);
    // this.runwayHeading = Math.PI * 3 / 4;  // runwayHeading 222 degrees

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

  removeLanded({ entityManagerArr }) {
    const entityAirport = entityFns.create({...this});
    const isEntityLanded = entityOther => {
      if(entityOther.id === entityAirport.id) return false;
      if(!entityOther.headingRad && entityOther.headingRad !== 0) return false;
      const distX = Math.abs(entityAirport.x - entityOther.x);
      const distY = Math.abs(entityAirport.y - entityOther.y);
      const distVert = Math.abs(entityAirport.altitude - entityOther.altitude);
      const deltaHeading = Math.abs(this.runwayHeading - entityOther.headingRad)
      const isCloseHorizontal = (distX < 10 && distY < 10);
      const isCloseVertical = distVert < 150;
      const isRunwayHeading = deltaHeading < 0.3;
      console.log(entityOther.title, distX, distY, deltaHeading)
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