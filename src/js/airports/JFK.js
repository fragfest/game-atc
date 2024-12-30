import { getGameSize, ScreenSizes } from '../utils';
import { HoldingPosition, WaypointType } from '../types';
import Runway from './Runway';
import Waypoint from '../canvas/Waypoint';

/**
 * @typedef {import('./airports/airports.js').EntitySetupFn} EntitySetupFn
 */

export const Runways = Object.freeze({
  TwentyTwoLeft: '22L',
  TwentyTwoRight: '22R',
});

export const getMapImage = () => '/img/maps/new-york.png';

export const getRunwaysAll = () => Object.values(Runways);

export const getRunwayRnd = () => {
  const index = Math.floor(Math.random() * getRunwaysAll().length);
  return getRunwaysAll()[index];
};

export const getRunway = (runway, screenSize) => {
  const obj = runways(runway, screenSize);
  if (!obj) throw new Error('runway not found: ' + runway);
  return obj;
};

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

export const getWaypointDestinationsAll = () => {
  return Object.values(WaypointDepartures);
};

export const getWaypointArrivalsAll = () => {
  return Object.values(WaypointArrivals);
};

// sections numbered from WNW going clockwise: 1 - 8
export const getWaypointBySection = (sectionInt) => {
  if (sectionInt >= 1 && sectionInt <= 2) return Waypoints.LENDY;
  if (sectionInt >= 3 && sectionInt <= 6) return Waypoints.CORVT;
  if (sectionInt >= 7 && sectionInt <= 8) return Waypoints.KMCHI;
};

export const getWaypointDepartureRnd = () => {
  const waypoints = getWaypointDestinationsAll();
  const index = Math.floor(Math.random() * waypoints.length);
  return waypoints[index];
};

export const getWaypoint = (waypoint, screenSize) => {
  const obj = waypoints(waypoint, screenSize);
  if (!obj) throw new Error('waypoint not found: ' + waypoint);
  return obj;
};

/**
 * @returns {Array.<EntitySetupFn>}
 */
export const getMapEntities = () => {
  const runway22L = (argObj) => {
    return new Runway(
      Runways.TwentyTwoLeft,
      argObj.imgLayerObj,
      argObj.screenSize,
      getRunway(Runways.TwentyTwoLeft, argObj.screenSize)
    );
  };

  const runway22R = (argObj) => {
    return new Runway(
      Runways.TwentyTwoRight,
      argObj.imgLayerObj,
      argObj.screenSize,
      getRunway(Runways.TwentyTwoRight, argObj.screenSize)
    );
  };

  const waypointArrivals = getWaypointArrivalsAll().map(
    (waypoint) => (argObj) => {
      return new Waypoint(
        waypoint,
        argObj.backgroundObj,
        argObj.headingLayerObj,
        argObj.screenSize,
        getWaypoint(waypoint, argObj.screenSize)
      );
    }
  );

  const waypointDepartures = getWaypointDestinationsAll().map(
    (waypoint) => (argObj) => {
      return new Waypoint(
        waypoint,
        argObj.backgroundObj,
        argObj.headingLayerObj,
        argObj.screenSize,
        getWaypoint(waypoint, argObj.screenSize)
      );
    }
  );
  return [runway22L, runway22R].concat(waypointArrivals, waypointDepartures);
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
      runwayWidth = 4;
      // 22L
      xOffset22L = 343;
      yOffset22L = 92;
      length22L = 52;
      titlePosition22L = { x: 8, y: 12 };
      // 22R
      xOffset22R = 330;
      yOffset22R = 87;
      length22R = 64;
      titlePosition22R = { x: -36, y: 6 };
      break;

    case ScreenSizes.Small:
      runwayWidth = 2.2;
      // 22L
      xOffset22L = 252;
      yOffset22L = 74;
      length22L = 30;
      titlePosition22L = { x: 6, y: 8 };
      // 22R
      xOffset22R = 244;
      yOffset22R = 69;
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
          x: width - 250,
          y: height / 2 - 180,
        };
      case WaypointArrivals.LENDY:
        return {
          holdingPosition: HoldingPosition.South,
          type: WaypointType.Arrival,
          x: width / 4 + 250,
          y: height / 2 - 280,
        };
      case WaypointArrivals.KMCHI:
        return {
          holdingPosition: HoldingPosition.North,
          type: WaypointType.Arrival,
          x: width / 2 - 70,
          y: height - 240,
        };
      case WaypointDepartures.NORTH:
        return {
          type: WaypointType.Departure,
          x: width - 200,
          y: 50,
        };
      case WaypointDepartures.SOUTH:
        return {
          type: WaypointType.Departure,
          x: width / 2 - 20,
          y: height - 30,
        };
      case WaypointDepartures.SHIPP:
        return {
          type: WaypointType.Departure,
          x: width - 70,
          y: height - 50,
        };
      case WaypointDepartures.SBJ:
        return {
          type: WaypointType.Departure,
          x: 40,
          y: height / 2,
        };
    }
  }

  if (screenSize === ScreenSizes.Small) {
    switch (waypoint) {
      case WaypointArrivals.CORVT:
        return {
          holdingPosition: HoldingPosition.North,
          type: WaypointType.Arrival,
          x: width - 190,
          y: height / 2 - 130,
        };
      case WaypointArrivals.LENDY:
        return {
          holdingPosition: HoldingPosition.South,
          type: WaypointType.Arrival,
          x: width / 4 + 190,
          y: height / 2 - 210,
        };
      case WaypointArrivals.KMCHI:
        return {
          holdingPosition: HoldingPosition.North,
          type: WaypointType.Arrival,
          x: width / 2 - 50,
          y: height - 180,
        };
      case WaypointDepartures.NORTH:
        return {
          type: WaypointType.Departure,
          x: width - 150,
          y: 40,
        };
      case WaypointDepartures.SOUTH:
        return {
          type: WaypointType.Departure,
          x: width / 2 - 10,
          y: height - 30,
        };
      case WaypointDepartures.SHIPP:
        return {
          type: WaypointType.Departure,
          x: width - 60,
          y: height - 40,
        };
      case WaypointDepartures.SBJ:
        return {
          type: WaypointType.Departure,
          x: 30,
          y: height / 2,
        };
    }
  }
};
