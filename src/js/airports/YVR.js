import { getGameSize, ScreenSizes } from '../utils';
import { HoldingPosition, RunwayType, WaypointType } from '../types';
import Runway from './Runway';
import Waypoint from '../canvas/Waypoint';

/**
 * @typedef {import('./airports.js').EntitySetupFn} EntitySetupFn
 */

export const RunwaysDepartures = Object.freeze({
  TwentysixLeft: '26L',
  TwentysixRight: '26R',
});
export const RunwaysArrivals = Object.freeze({
  TwentysixLeft: '26L',
  TwentysixRight: '26R',
});
export const Runways = Object.freeze({
  ...RunwaysArrivals,
});

export const WaypointArrivals = Object.freeze({
  GRIZZ: 'GRIZZ',
  CANUC: 'CANUC',
  PAINE: 'PAINE',
});
export const WaypointDepartures = Object.freeze({
  DUTOP: 'DUTOP',
  FRASE: 'FRASE',
  DOLLR: 'DOLLR',
  VARSY: 'VARSY',
});
export const Waypoints = Object.freeze({
  ...WaypointArrivals,
  ...WaypointDepartures,
});

// sections numbered from WNW going clockwise: 1 - 8
export const getWaypointBySection = (sectionInt) => {
  if (sectionInt >= 1 && sectionInt <= 2) return Waypoints.GRIZZ;
  if (sectionInt >= 3 && sectionInt <= 4) return Waypoints.CANUC;
  if (sectionInt >= 5 && sectionInt <= 8) return Waypoints.PAINE;
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
  let widthRunway = 6.2;
  let length = 65;
  if (screenSize === ScreenSizes.Small) {
    widthRunway = 4.6;
    length = 50;
  }
  if (screenSize === ScreenSizes.VerySmall) {
    widthRunway = 4.6;
    length = 50;
  }

  if (runway === Runways.TwentysixRight) {
    return {
      x: 0.316 * width,
      y: 0.563 * height,
      heading: 260,
      length: length,
      width: widthRunway,
      titlePosition: { x: 4, y: -10 },
    };
  }

  if (runway === Runways.TwentysixLeft) {
    return {
      x: 0.327 * width,
      y: 0.614 * height,
      heading: 260,
      length: length + 5,
      width: widthRunway,
      titlePosition: { x: 8, y: 12 },
    };
  }
};

const waypoints = (waypoint, screenSize) => {
  const width = getGameSize(screenSize).width;
  const height = getGameSize(screenSize).height;
  let borderPadding = 50;
  if (screenSize === ScreenSizes.Small) borderPadding = 30;
  if (screenSize === ScreenSizes.VerySmall) borderPadding = 30;

  switch (waypoint) {
    case WaypointArrivals.GRIZZ:
      return {
        type: WaypointType.Arrival,
        holdingPosition: HoldingPosition.South,
        x: 0.33 * width,
        y: 0.23 * height,
      };

    case WaypointArrivals.CANUC:
      return {
        type: WaypointType.Arrival,
        holdingPosition: HoldingPosition.South,
        x: 0.75 * width,
        y: 0.2 * height,
      };

    case WaypointArrivals.PAINE:
      return {
        type: WaypointType.Arrival,
        holdingPosition: HoldingPosition.North,
        x: 0.75 * width,
        y: 0.75 * height,
      };

    case WaypointDepartures.VARSY:
      return {
        type: WaypointType.Departure,
        x: borderPadding,
        y: 50,
      };

    case WaypointDepartures.DOLLR:
      return {
        type: WaypointType.Departure,
        x: 0.6 * width,
        y: borderPadding,
      };

    case WaypointDepartures.FRASE:
      return {
        type: WaypointType.Departure,
        x: width - borderPadding - 10,
        y: 0.2 * height,
      };

    case WaypointDepartures.DUTOP:
      return {
        type: WaypointType.Departure,
        x: 0.7 * width,
        y: height - borderPadding,
      };
  }
};
