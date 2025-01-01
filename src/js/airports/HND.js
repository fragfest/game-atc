import { getGameSize, ScreenSizes } from '../utils';
import { HoldingPosition, RunwayType, WaypointType } from '../types';
import Runway from './Runway';
import Waypoint from '../canvas/Waypoint';

/**
 * @typedef {import('./airports.js').EntitySetupFn} EntitySetupFn
 */

export const RunwaysDepartures = Object.freeze({
  SixteenLeft: '16L',
  SixteenRight: '16R',
});
export const RunwaysArrivals = Object.freeze({
  TwentyTwo: '22',
  TwentyThree: '23',
});
export const Runways = Object.freeze({
  ...RunwaysArrivals,
  ...RunwaysDepartures,
});

export const WaypointArrivals = Object.freeze({
  HONDA: 'HONDA',
  KAIHO: 'KAIHO',
  NATTY: 'NATTY',
});
export const WaypointDepartures = Object.freeze({
  KAIJI: 'KAIJI',
  URAGA: 'URAGA',
  KINPU: 'KINPU',
});
export const Waypoints = Object.freeze({
  ...WaypointArrivals,
  ...WaypointDepartures,
});

// sections numbered from WNW going clockwise: 1 - 8
export const getWaypointBySection = (sectionInt) => {
  if (sectionInt >= 1 && sectionInt <= 3) return Waypoints.NATTY;
  if (sectionInt >= 4 && sectionInt <= 6) return Waypoints.HONDA;
  if (sectionInt >= 7 && sectionInt <= 8) return Waypoints.KAIHO;
};

/**
 * @returns {Array.<EntitySetupFn>}
 */
export const getMapEntities = () => {
  const runwaysDeparture = Object.values(RunwaysDepartures).map(
    (runway) => (argObj) => {
      return new Runway(
        runway,
        RunwayType.DepartureOnly,
        argObj.imgLayerObj,
        runways(runway, argObj.screenSize)
      );
    }
  );

  const runwaysArrival = Object.values(RunwaysArrivals).map(
    (runway) => (argObj) => {
      return new Runway(
        runway,
        RunwayType.ArrivalOnly,
        argObj.imgLayerObj,
        runways(runway, argObj.screenSize)
      );
    }
  );

  const waypointsArr = Object.values(Waypoints).map((waypoint) => (argObj) => {
    return new Waypoint(
      waypoint,
      argObj.backgroundObj,
      argObj.headingLayerObj,
      argObj.screenSize,
      waypoints(waypoint, argObj.screenSize)
    );
  });

  return [].concat(runwaysDeparture, runwaysArrival, waypointsArr);
};

///////////////////////////////////////////////////////////////
// PRIVATE
///////////////////////////////////////////////////////////////

const runways = (runway, screenSize) => {
  const width = getGameSize(screenSize).width;
  const height = getGameSize(screenSize).height;
  let runwayWidth = 0;
  // 22
  let xOffset22 = 0;
  let yOffset22 = 0;
  let length22 = 0;
  let titlePosition22 = { x: 0, y: 0 };
  // 23
  let xOffset23 = 0;
  let yOffset23 = 0;
  let length23 = 0;
  let titlePosition23 = { x: 0, y: 0 };
  // 16L
  let xOffset16L = 0;
  let yOffset16L = 0;
  let length16L = 0;
  let titlePosition16L = { x: 0, y: 0 };
  // 16R
  let xOffset16R = 0;
  let yOffset16R = 0;
  let length16R = 0;
  let titlePosition16R = { x: 0, y: 0 };

  switch (screenSize) {
    case ScreenSizes.Large:
      runwayWidth = 4;
      // 22
      xOffset22 = 12;
      yOffset22 = 36;
      length22 = 44;
      titlePosition22 = { x: -10, y: -4 };
      // 23
      xOffset23 = 74;
      yOffset23 = 81;
      length23 = 44;
      titlePosition23 = { x: 6, y: 12 };
      // 16L
      xOffset16L = 21;
      yOffset16L = 38;
      length16L = 55;
      titlePosition16L = { x: 16, y: 16 };
      // 16R
      xOffset16R = 4;
      yOffset16R = 48;
      length16R = 55;
      titlePosition16R = { x: -12, y: 40 };
      break;

    case ScreenSizes.Small:
      runwayWidth = 2.2;
      // 22
      xOffset22 = 7;
      yOffset22 = 30;
      length22 = 30;
      titlePosition22 = { x: -6, y: -5 };
      // 23
      xOffset23 = 54;
      yOffset23 = 62;
      length23 = 30;
      titlePosition23 = { x: 4, y: 10 };
      // 16L
      xOffset16L = 15;
      yOffset16L = 29;
      length16L = 40;
      titlePosition16L = { x: 14, y: 16 };
      // 16R
      xOffset16R = 0;
      yOffset16R = 36;
      length16R = 40;
      titlePosition16R = { x: -10, y: 30 };
      break;
  }

  switch (runway) {
    case Runways.TwentyTwo:
      return {
        x: width / 2 + xOffset22,
        y: height / 2 + yOffset22,
        heading: 222,
        length: length22,
        width: runwayWidth,
        titlePosition: titlePosition22,
      };

    case Runways.TwentyThree:
      return {
        x: width / 2 + xOffset23,
        y: height / 2 + yOffset23,
        heading: 228,
        length: length23,
        width: runwayWidth,
        titlePosition: titlePosition23,
      };

    case Runways.SixteenLeft:
      return {
        x: width / 2 + xOffset16L,
        y: height / 2 + yOffset16L,
        heading: 154,
        length: length16L,
        width: runwayWidth,
        titlePosition: titlePosition16L,
      };

    case Runways.SixteenRight:
      return {
        x: width / 2 + xOffset16R,
        y: height / 2 + yOffset16R,
        heading: 154,
        length: length16R,
        width: runwayWidth,
        titlePosition: titlePosition16R,
      };
  }
};

const waypoints = (waypoint, screenSize) => {
  const width = getGameSize(screenSize).width;
  const height = getGameSize(screenSize).height;

  if (screenSize === ScreenSizes.Large) {
    switch (waypoint) {
      case WaypointArrivals.HONDA:
        return {
          holdingPosition: HoldingPosition.South,
          type: WaypointType.Arrival,
          x: width - 240,
          y: height / 2 + 70,
        };

      case WaypointArrivals.KAIHO:
        return {
          holdingPosition: HoldingPosition.North,
          type: WaypointType.Arrival,
          x: 0.4 * width,
          y: 0.92 * height,
        };

      case WaypointArrivals.NATTY:
        return {
          holdingPosition: HoldingPosition.South,
          type: WaypointType.Arrival,
          x: 0.5 * width,
          y: 0.1 * height,
        };

      case WaypointDepartures.KAIJI:
        return {
          type: WaypointType.Departure,
          x: 0.75 * width,
          y: 50,
        };

      case WaypointDepartures.URAGA:
        return {
          type: WaypointType.Departure,
          x: 0.8 * width,
          y: height - 50,
        };

      case WaypointDepartures.KINPU:
        return {
          type: WaypointType.Departure,
          x: 50,
          y: 0.2 * height,
        };
    }
  }

  if (screenSize === ScreenSizes.Small) {
    switch (waypoint) {
      case WaypointArrivals.HONDA:
        return {
          holdingPosition: HoldingPosition.South,
          type: WaypointType.Arrival,
          x: width - 180,
          y: height / 2 + 50,
        };

      case WaypointArrivals.KAIHO:
        return {
          holdingPosition: HoldingPosition.North,
          type: WaypointType.Arrival,
          x: 0.4 * width,
          y: 0.92 * height,
        };

      case WaypointArrivals.NATTY:
        return {
          holdingPosition: HoldingPosition.South,
          type: WaypointType.Arrival,
          x: 0.5 * width,
          y: 0.1 * height,
        };

      case WaypointDepartures.KAIJI:
        return {
          type: WaypointType.Departure,
          x: (3 / 4) * width,
          y: 40,
        };

      case WaypointDepartures.URAGA:
        return {
          type: WaypointType.Departure,
          x: 0.8 * width,
          y: height - 40,
        };

      case WaypointDepartures.KINPU:
        return {
          type: WaypointType.Departure,
          x: 40,
          y: 0.2 * height,
        };
    }
  }
};
