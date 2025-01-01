import { getGameSize, ScreenSizes } from '../utils';
import { HoldingPosition, RunwayType, WaypointType } from '../types';
import Runway from './Runway';
import Waypoint from '../canvas/Waypoint';

/**
 * @typedef {import('./airports.js').EntitySetupFn} EntitySetupFn
 */

export const RunwaysDepartures = Object.freeze({
  EighteenLeft: '18L',
  Twentyfour: '24',
});
export const RunwaysArrivals = Object.freeze({
  EighteenRight: '18R',
  EighteenCentre: '18C',
});
export const Runways = Object.freeze({
  ...RunwaysArrivals,
  ...RunwaysDepartures,
});

export const WaypointArrivals = Object.freeze({
  SPY: 'SPY',
  PAM: 'PAM',
});
export const WaypointDepartures = Object.freeze({
  BERGI: 'BERGI',
  LUNIX: 'LUNIX',
  ANDIK: 'ANDIK',
});
export const Waypoints = Object.freeze({
  ...WaypointArrivals,
  ...WaypointDepartures,
});

// sections numbered from WNW going clockwise: 1 - 8
export const getWaypointBySection = (sectionInt) => {
  if (sectionInt >= 1 && sectionInt <= 4) return Waypoints.SPY;
  if (sectionInt >= 5 && sectionInt <= 8) return Waypoints.PAM;
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
  let widthRunway = 4;
  if (screenSize === ScreenSizes.Small) widthRunway = 2.8;

  if (runway === Runways.EighteenRight) {
    return {
      x: 0.3 * width - 2,
      y: 0.5 * height,
      heading: 183,
      length: 65,
      width: widthRunway,
      titlePosition: { x: -32, y: 10 },
    };
  }

  if (runway === Runways.EighteenCentre) {
    return {
      x: 0.34 * width + 1,
      y: 0.6 * height,
      heading: 183,
      length: 65,
      width: widthRunway,
      titlePosition: { x: -32, y: 14 },
    };
  }

  if (runway === Runways.EighteenLeft) {
    return {
      x: 0.4 * width - 3,
      y: 0.62 * height,
      heading: 183,
      length: 65,
      width: widthRunway,
      titlePosition: { x: -32, y: 10 },
    };
  }

  if (runway === Runways.Twentyfour) {
    return {
      x: 0.39 * width,
      y: 0.68 * height,
      heading: 238,
      length: 65,
      width: widthRunway,
      titlePosition: { x: -22, y: 4 },
    };
  }
};

const waypoints = (waypoint, screenSize) => {
  const width = getGameSize(screenSize).width;
  const height = getGameSize(screenSize).height;

  if (screenSize === ScreenSizes.Large) {
    switch (waypoint) {
      case WaypointArrivals.SPY:
        return {
          holdingPosition: HoldingPosition.South,
          type: WaypointType.Arrival,
          x: 0.6 * width,
          y: 0.15 * height,
        };

      case WaypointArrivals.PAM:
        return {
          holdingPosition: HoldingPosition.South,
          type: WaypointType.Arrival,
          x: 0.78 * width,
          y: 0.5 * height,
        };

      case WaypointDepartures.BERGI:
        return {
          type: WaypointType.Departure,
          x: 50,
          y: 0.2 * height,
        };

      case WaypointDepartures.LUNIX:
        return {
          type: WaypointType.Departure,
          x: width - 50,
          y: 0.7 * height,
        };

      case WaypointDepartures.ANDIK:
        return {
          type: WaypointType.Departure,
          x: 0.9 * width,
          y: 50,
        };
    }
  }

  if (screenSize === ScreenSizes.Small) {
    switch (waypoint) {
      case WaypointArrivals.SPY:
        return {
          holdingPosition: HoldingPosition.South,
          type: WaypointType.Arrival,
          x: 0.6 * width,
          y: 0.15 * height,
        };

      case WaypointArrivals.PAM:
        return {
          holdingPosition: HoldingPosition.South,
          type: WaypointType.Arrival,
          x: 0.78 * width,
          y: 0.5 * height,
        };

      case WaypointDepartures.BERGI:
        return {
          type: WaypointType.Departure,
          x: 40,
          y: 0.2 * height,
        };

      case WaypointDepartures.LUNIX:
        return {
          type: WaypointType.Departure,
          x: width - 40,
          y: 0.7 * height,
        };

      case WaypointDepartures.ANDIK:
        return {
          type: WaypointType.Departure,
          x: 0.9 * width,
          y: 40,
        };
    }
  }
};
