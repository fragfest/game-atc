import Square from './Square';
import { WaypointType, HoldingPosition } from './types';
import { isCloseToWaypoint } from './entity';
import {
  Direction,
  convertToSmallDegrees,
  radToDegrees,
} from './utils';

////////////////////////////////////////////////////////////
// class Waypoint
////////////////////////////////////////////////////////////
export default class Waypoint {
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
    this.ctx.fillStyle = (this.type === WaypointType.Arrival) ? 'orange' : 'deepskyblue';
    this.ctx.globalAlpha = 1;
    this.ctx.fillRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
    this.textLayerObj.ctx.fillStyle = (this.type === WaypointType.Arrival) ? 'orange' : 'deepskyblue';
    this.textLayerObj.ctx.font = "9px Arial"
    this.textLayerObj.ctx.fillText(this.title, this.x + 2, this.y - 4);
  }
}
// end class Waypoint