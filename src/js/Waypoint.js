const Square = require('./Square');
const { WaypointType, HoldingPosition } = require('./types');
const { isCloseToWaypoint } = require('./entity');
const {
  Direction,
  convertToSmallDegrees,
  radToDegrees,
} = require('./utils');

////////////////////////////////////////////////////////////
// class Waypoint
////////////////////////////////////////////////////////////
module.exports = class Waypoint {
  constructor(title, entityLayerObj, textLayerObj, waypointObj) {
    this.class = 'waypoint';
    this.id = Math.random();
    this.title = title.trim();
    this.type = waypointObj.type || WaypointType.Arrival;
    const holdingPosition = waypointObj.holdingPosition || HoldingPosition.North;
    if (holdingPosition === HoldingPosition.North) {
      this.westSideTurnDirection = Direction.Right;
      this.eastSideTurnDirection = Direction.Left;
    }
    if (holdingPosition === HoldingPosition.South) {
      this.westSideTurnDirection = Direction.Left;
      this.eastSideTurnDirection = Direction.Right;
    }

    this.ctx = entityLayerObj.ctx
    this.textLayerObj = textLayerObj;
    this.x = waypointObj.x - 2;
    this.y = waypointObj.y - 2;
    this.width = 4;
    this.height = 4;
    this.altitude = 6000;
  }

  update({ entityManagerArr }) {
    const planeHolding = (entity) => {
      if (!(entity instanceof Square)) return false;
      if (!entity.isHolding) return false;
      if (entity.waypoint === this.title) return true;
      return false;
    };
    const isClose = isCloseToWaypoint({ ...this, altitude: 0 });

    const planesHolding = entityManagerArr.filter(planeHolding);
    planesHolding.forEach((plane) => {
      const deltaY = this.y - plane.y;
      const deltaX = this.x - plane.x;
      let direction = null;
      let headingRad = Math.atan(deltaY / deltaX);
      if (deltaX < 0) headingRad += Math.PI;
      const headingDeg = convertToSmallDegrees(radToDegrees(headingRad));

      if (plane.isAtWaypoint) direction = null;
      if (!plane.isAtWaypoint && isClose(plane)) {
        plane.setIsAtWaypoint(true);
        if (180 <= headingDeg && headingDeg <= 360) direction = this.westSideTurnDirection;
        if (0 < headingDeg && headingDeg < 180) direction = this.eastSideTurnDirection;
      }

      plane.setHeadingTarget(headingRad, false, true, direction);
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
  self.textLayerObj.ctx.font = "9px Arial"
  self.textLayerObj.ctx.fillText(self.title, self.x + 2, self.y - 4);
}