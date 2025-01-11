import { getGameSize, ScreenSizes } from '../utils';
import { HoldingPosition, RunwayType, WaypointType } from '../types';
import Runway from './Runway';
import Waypoint from '../canvas/Waypoint';

/**
 * @typedef {import('./airports/airports.js').EntitySetupFn} EntitySetupFn
 */

export const RunwaysDepartures = Object.freeze({
  TwentyTwoLeft: '22L',
  TwentyTwoRight: '22R',
});
export const RunwaysArrivals = Object.freeze({
  TwentyTwoLeft: '22L',
  TwentyTwoRight: '22R',
});
export const Runways = Object.freeze({
  ...RunwaysArrivals,
});

export const WaypointArrivals = Object.freeze({
  CORVT: 'CORVT',
  LENDY: 'LENDY',
  KMCHI: 'KMCHI',
});
export const WaypointDepartures = Object.freeze({
  NORTH: 'NORTH',
  SOUTH: 'SOUTH',
  SHIPP: 'SHIPP',
  SBJ: 'SBJ',
});
export const Waypoints = Object.freeze({
  ...WaypointArrivals,
  ...WaypointDepartures,
});

// sections numbered from WNW going clockwise: 1 - 8
export const getWaypointBySection = (sectionInt) => {
  if (sectionInt >= 1 && sectionInt <= 2) return Waypoints.LENDY;
  if (sectionInt >= 3 && sectionInt <= 6) return Waypoints.CORVT;
  if (sectionInt >= 7 && sectionInt <= 8) return Waypoints.KMCHI;
};

/**
 * @returns {Array.<EntitySetupFn>}
 */
export const getMapEntities = () => {
  const runwaysArr = Object.values(Runways).map((runway) => (argObj) => {
    return new Runway(
      runway,
      RunwayType.Both,
      argObj.imgLayerObj,
      runways(runway, argObj.screenSize)
    );
  });

  const waypointsArr = Object.values(Waypoints).map((waypoint) => (argObj) => {
    return new Waypoint(
      waypoint,
      argObj.backgroundObj,
      argObj.headingLayerObj,
      argObj.screenSize,
      waypoints(waypoint, argObj.screenSize)
    );
  });

  return [].concat(runwaysArr, waypointsArr);
};

///////////////////////////////////////////////////////////////
// PRIVATE
///////////////////////////////////////////////////////////////

const runways = (runway, screenSize) => {
  const width = getGameSize(screenSize).width;
  const height = getGameSize(screenSize).height;
  let runwayWidth = 0;
  // 22L
  let xOffset22L = 0;
  let yOffset22L = 0;
  let length22L = 0;
  let titlePosition22L = { x: 0, y: 0 };
  // 22R
  let xOffset22R = 0;
  let yOffset22R = 0;
  let length22R = 0;
  let titlePosition22R = { x: 0, y: 0 };

  switch (screenSize) {
    case ScreenSizes.Large:
      runwayWidth = 6.2;
      // 22L
      xOffset22L = 345;
      yOffset22L = 98;
      length22L = 52;
      titlePosition22L = { x: 8, y: 12 };
      // 22R
      xOffset22R = 330;
      yOffset22R = 90;
      length22R = 64;
      titlePosition22R = { x: -36, y: 6 };
      break;

    case ScreenSizes.Small:
      runwayWidth = 4.6;
      // 22L
      xOffset22L = 254;
      yOffset22L = 78;
      length22L = 30;
      titlePosition22L = { x: 6, y: 8 };
      // 22R
      xOffset22R = 245;
      yOffset22R = 72;
      length22R = 42;
      titlePosition22R = { x: -26, y: -4 };
      break;
  }

  switch (runway) {
    case Runways.TwentyTwoLeft:
      return {
        x: width / 2 + xOffset22L,
        y: height / 2 + yOffset22L,
        heading: 211,
        length: length22L,
        width: runwayWidth,
        titlePosition: titlePosition22L,
      };

    case Runways.TwentyTwoRight:
      return {
        x: width / 2 + xOffset22R,
        y: height / 2 + yOffset22R,
        heading: 211,
        length: length22R,
        width: runwayWidth,
        titlePosition: titlePosition22R,
      };
  }
};

const waypoints = (waypoint, screenSize) => {
  const width = getGameSize(screenSize).width;
  const height = getGameSize(screenSize).height;

  if (screenSize === ScreenSizes.Large) {
    switch (waypoint) {
      case WaypointArrivals.CORVT:
        return {
          holdingPosition: HoldingPosition.North,
          type: WaypointType.Arrival,
          x: 0.8 * width,
          y: 0.27 * height,
        };
      case WaypointArrivals.LENDY:
        return {
          holdingPosition: HoldingPosition.South,
          type: WaypointType.Arrival,
          x: 0.43 * width,
          y: 0.16 * height,
        };
      case WaypointArrivals.KMCHI:
        return {
          holdingPosition: HoldingPosition.North,
          type: WaypointType.Arrival,
          x: 0.45 * width,
          y: 0.7 * height,
        };
      case WaypointDepartures.NORTH:
        return {
          type: WaypointType.Departure,
          x: 0.85 * width,
          y: 50,
        };
      case WaypointDepartures.SOUTH:
        return {
          type: WaypointType.Departure,
          x: 0.4 * width,
          y: height - 50,
        };
      case WaypointDepartures.SHIPP:
        return {
          type: WaypointType.Departure,
          x: 0.95 * width,
          y: height - 60,
        };
      case WaypointDepartures.SBJ:
        return {
          type: WaypointType.Departure,
          x: 50,
          y: 0.5 * height,
        };
    }
  }

  if (screenSize === ScreenSizes.Small) {
    switch (waypoint) {
      case WaypointArrivals.CORVT:
        return {
          holdingPosition: HoldingPosition.North,
          type: WaypointType.Arrival,
          x: 0.8 * width,
          y: 0.27 * height,
        };
      case WaypointArrivals.LENDY:
        return {
          holdingPosition: HoldingPosition.South,
          type: WaypointType.Arrival,
          x: 0.43 * width,
          y: 0.16 * height,
        };
      case WaypointArrivals.KMCHI:
        return {
          holdingPosition: HoldingPosition.North,
          type: WaypointType.Arrival,
          x: 0.45 * width,
          y: 0.7 * height,
        };
      case WaypointDepartures.NORTH:
        return {
          type: WaypointType.Departure,
          x: 0.85 * width,
          y: 30,
        };
      case WaypointDepartures.SOUTH:
        return {
          type: WaypointType.Departure,
          x: 0.4 * width,
          y: height - 30,
        };
      case WaypointDepartures.SHIPP:
        return {
          type: WaypointType.Departure,
          x: 0.95 * width,
          y: height - 45,
        };
      case WaypointDepartures.SBJ:
        return {
          type: WaypointType.Departure,
          x: 30,
          y: 0.5 * height,
        };
    }
  }
};
