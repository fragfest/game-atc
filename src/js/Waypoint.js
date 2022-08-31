const Square = require('./Square');
const { WaypointType } = require('./types');

////////////////////////////////////////////////////////////
// class Waypoint
////////////////////////////////////////////////////////////
module.exports = class Waypoint {
  constructor(title, entityLayerObj, textLayerObj, waypointObj) {
    this.type = 'waypoint';
    this.id = Math.random();
    this.title = title.trim();
    this.type = waypointObj.type || WaypointType.Arrival;

    this.ctx = entityLayerObj.ctx
    this.textLayerObj = textLayerObj;
    this.x = waypointObj.x - 2;
    this.y = waypointObj.y - 2;
    this.width = 4;
    this.height = 4;
    this.altitude = 6000;
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
    });
  }

  draw() {
    _draw(this);
  }
};
// end class Waypoint

// PRIVATE ////////////////////////////////////////////////////////

const _draw = (self) => {
  self.ctx.fillStyle = (self.type === WaypointType.Arrival) ? 'orange' : 'deepskyblue';
  self.ctx.globalAlpha = 1;
  self.ctx.fillRect(self.x - (self.width / 2), self.y - (self.height / 2), self.width, self.height);
  self.textLayerObj.ctx.fillStyle = (self.type === WaypointType.Arrival) ? 'orange' : 'deepskyblue';
  self.textLayerObj.ctx.font = "bold 9px Arial"
  self.textLayerObj.ctx.fillText(self.title, self.x + 2, self.y - 4);
}