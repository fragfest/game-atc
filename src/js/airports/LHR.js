import { getGameSize, ScreenSizes } from '../utils';
import { HoldingPosition, RunwayType, WaypointType } from '../types';
import Runway from './Runway';
import Waypoint from '../canvas/Waypoint';

/**
 * @typedef {import('./airports/airports.js').EntitySetupFn} EntitySetupFn
 */

export const RunwaysDepartures = Object.freeze({
  TwoSevenRight: '27R',
  TwoSevenLeft: '27L',
});
export const RunwaysArrivals = Object.freeze({
  TwoSevenRight: '27R',
  TwoSevenLeft: '27L',
});
export const Runways = Object.freeze({
  ...RunwaysArrivals,
});

export const WaypointArrivals = Object.freeze({
  BNN: 'BNN',
  OCK: 'OCK',
  LAM: 'LAM',
  BIG: 'BIG',
});
export const WaypointDepartures = Object.freeze({
  DET: 'DET',
  MID: 'MID',
  CPT: 'CPT',
  BPK: 'BPK',
});
export const Waypoints = Object.freeze({
  ...WaypointArrivals,
  ...WaypointDepartures,
});

// sections numbered from WNW going clockwise: 1 - 8
export const getWaypointBySection = (sectionInt) => {
  if (sectionInt >= 1 && sectionInt <= 4) return Waypoints.LAM;
  if (sectionInt >= 5 && sectionInt <= 8) return Waypoints.BIG;
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

// test function
export const getWaypoint = (waypoint, screenSize) => {
  const obj = waypoints(waypoint, screenSize);
  return obj;
};

///////////////////////////////////////////////////////////////
// PRIVATE
///////////////////////////////////////////////////////////////

const runways = (runway, screenSize) => {
  const width = getGameSize(screenSize).width;
  const height = getGameSize(screenSize).height;
  let runwayWidth = 4;
  let length = 60;
  if (screenSize === ScreenSizes.Small) runwayWidth = 2.6;
  if (screenSize === ScreenSizes.Small) length = 40;

  if (runway === Runways.TwoSevenRight) {
    return {
      x: 0.318 * width,
      y: 0.507 * height,
      heading: 270,
      length,
      width: runwayWidth,
      titlePosition: { x: 0, y: -10 },
    };
  }
  if (runway === Runways.TwoSevenLeft) {
    return {
      x: 0.318 * width,
      y: 0.534 * height,
      heading: 270,
      length,
      width: runwayWidth,
      titlePosition: { x: 0, y: 16 },
    };
  }
};

const waypoints = (waypoint, screenSize) => {
  const width = getGameSize(screenSize).width;
  const height = getGameSize(screenSize).height;
  let borderPadding = 50;
  if (screenSize === ScreenSizes.Small) borderPadding = 30;

  switch (waypoint) {
    case WaypointArrivals.BNN:
      return {
        holdingPosition: HoldingPosition.North,
        type: WaypointType.Arrival,
        x: 0.3 * width,
        y: 0.32 * height,
      };
    case WaypointArrivals.OCK:
      return {
        holdingPosition: HoldingPosition.South,
        type: WaypointType.Arrival,
        x: 0.35 * width,
        y: 0.7 * height,
      };
    case WaypointArrivals.LAM:
      return {
        holdingPosition: HoldingPosition.North,
        type: WaypointType.Arrival,
        x: 0.75 * width,
        y: 0.31 * height,
      };
    case WaypointArrivals.BIG:
      return {
        holdingPosition: HoldingPosition.South,
        type: WaypointType.Arrival,
        x: 0.7 * width,
        y: 0.7 * height,
      };
    case WaypointDepartures.DET:
      return {
        type: WaypointType.Departure,
        x: 0.7 * width,
        y: height - borderPadding,
      };
    case WaypointDepartures.MID:
      return {
        type: WaypointType.Departure,
        x: 0.3 * width,
        y: height - borderPadding,
      };
    case WaypointDepartures.CPT:
      return {
        type: WaypointType.Departure,
        x: borderPadding,
        y: 0.2 * height,
      };
    case WaypointDepartures.BPK:
      return {
        type: WaypointType.Departure,
        x: 0.55 * width,
        y: borderPadding,
      };
  }
};
