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
  let xOffset = 0;
  let yOffset = 0;
  let length = 0;
  let runwayWidth = 0;
  let titlePosition27L = { x: 0, y: 0 };
  let titlePosition27R = { x: 0, y: 0 };

  switch (screenSize) {
    case ScreenSizes.Large:
      xOffset = -140;
      yOffset = 26;
      length = 60;
      runwayWidth = 4;
      titlePosition27L = { x: 0, y: 16 };
      titlePosition27R = { x: 0, y: -8 };
      break;
    case ScreenSizes.Small:
      xOffset = -105;
      yOffset = 18;
      length = 40;
      runwayWidth = 1.6;
      titlePosition27L = { x: 0, y: 11 };
      titlePosition27R = { x: 0, y: -5 };
      break;
  }

  switch (runway) {
    case Runways.TwoSevenRight:
      return {
        x: width / 2 + xOffset,
        y: height / 2 + yOffset,
        heading: 270,
        length,
        width: runwayWidth,
        titlePosition: titlePosition27R,
      };
    case Runways.TwoSevenLeft:
      return {
        x: width / 2 + xOffset,
        y: height / 2 + 18 + yOffset,
        heading: 270,
        length,
        width: runwayWidth,
        titlePosition: titlePosition27L,
      };
  }
};

const waypoints = (waypoint, screenSize) => {
  const width = getGameSize(screenSize).width;
  const height = getGameSize(screenSize).height;

  if (screenSize === ScreenSizes.Large) {
    switch (waypoint) {
      case WaypointArrivals.BNN:
        return {
          holdingPosition: HoldingPosition.North,
          type: WaypointType.Arrival,
          x: width / 2 - 215,
          y: height / 2 - 155,
        };
      case WaypointArrivals.OCK:
        return {
          holdingPosition: HoldingPosition.South,
          type: WaypointType.Arrival,
          x: 465,
          y: height - 160,
        };
      case WaypointArrivals.LAM:
        return {
          holdingPosition: HoldingPosition.North,
          type: WaypointType.Arrival,
          x: width / 2 + 400,
          y: height / 2 - 150,
        };
      case WaypointArrivals.BIG:
        return {
          holdingPosition: HoldingPosition.South,
          type: WaypointType.Arrival,
          x: width / 2 + 350,
          y: height / 2 + 160,
        };
      case WaypointDepartures.DET:
        return {
          type: WaypointType.Departure,
          x: width / 2 + 150,
          y: height - 28,
        };
      case WaypointDepartures.MID:
        return {
          type: WaypointType.Departure,
          x: 270,
          y: height - 42,
        };
      case WaypointDepartures.CPT:
        return {
          type: WaypointType.Departure,
          x: 50,
          y: height / 2 - 45,
        };
      case WaypointDepartures.BPK:
        return {
          type: WaypointType.Departure,
          x: width / 2 + 70,
          y: 50,
        };
    }
  }

  if (screenSize === ScreenSizes.Small) {
    switch (waypoint) {
      case WaypointArrivals.BNN:
        return {
          holdingPosition: HoldingPosition.North,
          type: WaypointType.Arrival,
          x: width / 2 - 160,
          y: height / 2 - 118,
        };
      case WaypointArrivals.OCK:
        return {
          holdingPosition: HoldingPosition.South,
          type: WaypointType.Arrival,
          x: 350,
          y: height - 120,
        };
      case WaypointArrivals.LAM:
        return {
          holdingPosition: HoldingPosition.North,
          type: WaypointType.Arrival,
          x: width / 2 + 290,
          y: height / 2 - 112,
        };
      case WaypointArrivals.BIG:
        return {
          holdingPosition: HoldingPosition.South,
          type: WaypointType.Arrival,
          x: width / 2 + 260,
          y: height / 2 + 115,
        };
      case WaypointDepartures.DET:
        return {
          type: WaypointType.Departure,
          x: width / 2 + 112,
          y: height - 22,
        };
      case WaypointDepartures.MID:
        return {
          type: WaypointType.Departure,
          x: 202,
          y: height - 30,
        };
      case WaypointDepartures.CPT:
        return {
          type: WaypointType.Departure,
          x: 39,
          y: height / 2 - 33,
        };
      case WaypointDepartures.BPK:
        return {
          type: WaypointType.Departure,
          x: width / 2 + 60,
          y: 35,
        };
    }
  }
};
