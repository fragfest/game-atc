// const { radToDegrees, convHdgDegToThreeDigits } = require('./utils');
const Square = require('./Square');
// const {
//   isEntityGettingCloser,
//   distBetweenEntities
// } = require('./entity');

////////////////////////////////////////////////////////////
// class Waypoint
////////////////////////////////////////////////////////////
module.exports = class Waypoint {
  constructor(title, entityLayerObj, textLayerObj, positionObj) {
    this.id = Math.random();
    this.title = title.trim();
    this.ctx = entityLayerObj.ctx
    this.textLayerObj = textLayerObj;

    this.x = positionObj.x;
    this.y = positionObj.y;
    this.width = 5;
    this.height = 5;
    this.altitude = 0;
  }

  updateDestroy() { }

  update({ entityManagerArr }) {
    // const isGettingCloser = isEntityGettingCloser(this);
    const planeHolding = (entity) => {
      if (!(entity instanceof Square)) return false;
      if (!entity.isHolding) return false;
      if (entity.waypoint === this.title) return true;
      return false;
    };
    const planesHolding = entityManagerArr.filter(planeHolding);

    planesHolding.forEach((plane) => {
      const deltaY = this.y - plane.y;
      const deltaX = this.x - plane.x;
      let headingRad = Math.atan(deltaY / deltaX);
      if (deltaX < 0) headingRad += Math.PI;

      plane.setHeadingTarget(headingRad, false, true);
      // plane.setDistPrev(distBetweenEntities(this)(plane));
    });
  }

  draw() {
    _draw(this);
  }
};
// end class Waypoint

// PRIVATE ////////////////////////////////////////////////////////

const _draw = (self) => {
  self.ctx.fillStyle = 'greenyellow';
  self.ctx.globalAlpha = 1;
  self.ctx.fillRect(self.x, self.y, self.width, self.height);
  self.textLayerObj.ctx.fillStyle = 'greenyellow';
  self.textLayerObj.ctx.font = "bold 10px Arial"
  self.textLayerObj.ctx.fillText(self.title, self.x, self.y - 2);
}