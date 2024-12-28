import { getGameSize, ScreenSizes } from '../utils';
import { HoldingPosition, WaypointType } from '../types';
import Runway from './Runway';
import Waypoint from '../canvas/Waypoint';

/**
 * @typedef {import('./airports/airports.js').EntitySetupFn} EntitySetupFn
 */

export const Runways = Object.freeze({
  TwoSevenRight: '27R',
  TwoSevenLeft: '27L',
});

export const getMapImage = () => '/img/london.png';

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

export const getWaypointDestinationsAll = () => {
  return Object.values(WaypointDepartures);
};

export const getWaypointArrivalsAll = () => {
  return Object.values(WaypointArrivals);
};

// sections numbered from WNW going clockwise: 1 - 8
export const getWaypointBySection = (sectionInt) => {
  if (sectionInt >= 1 && sectionInt <= 4) return Waypoints.LAM;
  if (sectionInt >= 5 && sectionInt <= 8) return Waypoints.BIG;
};

// TODO refactor: use getWaypointDestinationsAll() and have caller choose rnd
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
  const runway27R = (argObj) => {
    return new Runway(
      Runways.TwoSevenRight,
      argObj.imgLayerObj,
      argObj.screenSize,
      getRunway(Runways.TwoSevenRight, argObj.screenSize)
    );
  };

  const runway27L = (argObj) => {
    return new Runway(
      Runways.TwoSevenLeft,
      argObj.imgLayerObj,
      argObj.screenSize,
      getRunway(Runways.TwoSevenLeft, argObj.screenSize)
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
  return [runway27L, runway27R].concat(waypointArrivals, waypointDepartures);
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
