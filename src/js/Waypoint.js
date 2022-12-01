import Square from './Square';
import { WaypointType, HoldingPosition } from './types';
import {
  isCloseToWaypoint,
  isEntityGettingCloser,
  distBetweenEntities,
} from './entity';
import {
  Direction,
  convertToSmallDegrees,
  radToDegrees,
} from './utils';
import { DestinationType } from './aircraft/airframe';

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
    const planeHoldingHoldoff = (entity) => {
      if (!(entity instanceof Square)) return false;
      if (!entity.isHolding && !entity.isHandoff) return false;
      if (entity.waypoint === this.title) return true;
      return false;
    };
    const isClose = isCloseToWaypoint({ ...this, altitude: 0 });

    const planes = entityManagerArr.filter(planeHoldingHoldoff);
    planes.forEach((plane) => {
      const deltaY = this.y - plane.y;
      const deltaX = this.x - plane.x;
      let headingRad = Math.atan(deltaY / deltaX);
      if (deltaX < 0) headingRad += Math.PI;
      const headingDeg = convertToSmallDegrees(radToDegrees(headingRad));

      // TODO combine or move setDistPrev* to Square update() as it must be called in tandem with setHeadingTarget

      if (plane.destinationType === DestinationType.Departure) {
        if (isClose(plane) && !isEntityGettingCloser(this, plane, plane.distPrevHandoff)) {
          plane.setHandoff(false);
          plane.setDistPrevHandoff(distBetweenEntities(this)(plane))
          plane.setHeadingTarget(plane.headingRad, false, false, Direction.None);
          return;
        }

        // plane heading towards waypoint
        plane.setDistPrevHandoff(distBetweenEntities(this)(plane))
        plane.setHeadingTarget(headingRad, false, false, Direction.None);
        return;
      }

      if (plane.destinationType === DestinationType.Arrival) {
        if (!plane.isAtWaypoint &&
          isEntityGettingCloser(this, plane, plane.distPrevHolding) &&
          isClose(plane)) {

          let direction = null;
          plane.setIsAtWaypoint(true);
          if (180 <= headingDeg && headingDeg <= 360) direction = this.westSideTurnDirection;
          if (0 < headingDeg && headingDeg < 180) direction = this.eastSideTurnDirection;

          plane.setDistPrevHolding(distBetweenEntities(this)(plane));
          plane.setHeadingTarget(headingRad, false, true, direction);
          return;
        }
        if (!plane.isAtWaypoint) {
          // plane heading towards waypoint
          plane.setDistPrevHolding(distBetweenEntities(this)(plane));
          plane.setHeadingTarget(headingRad, false, true, Direction.None);
          return;
        }
        // plane holding at waypoint
        plane.setDistPrevHolding(distBetweenEntities(this)(plane));
        plane.setHeadingTarget(headingRad, false, true, null);
      }
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
// class Waypoint END