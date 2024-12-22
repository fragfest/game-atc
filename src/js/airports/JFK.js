import { HoldingPosition, WaypointType } from '../types';
import { getGameSize, ScreenSizes } from '../utils';

export const Runways = Object.freeze({
  TwentyTwoLeft: '22L',
});

export const getMapImage = () => '/img/new-york.png';

export const getRunwaysAll = () => {
  return ['22L'];
};

export const getRunwayRnd = () => {
  const index = Math.floor(Math.random() * getRunwaysAll().length);
  return getRunwaysAll()[index];
};

export const getRunway = (runway, screenSize) => {
  const obj = runways(runway, screenSize);
  if (!obj) throw new Error('runway not found: ' + runway);
  return obj;
};

export const Waypoints = Object.freeze({
  // arrival
  CORVT: 'CORVT',
  LENDY: 'LENDY',
  KMCHI: 'KMCHI',
  // departure
  NORTH: 'NORTH',
  SOUTH: 'SOUTH',
  SHIPP: 'SHIPP',
  SBJ: 'SBJ',
});

export const getWaypointDestinationsAll = () => {
  return ['NORTH', 'SOUTH', 'SHIPP', 'SBJ'];
};

export const getWaypointArrivalsAll = () => {
  return ['CORVT', 'LENDY', 'KMCHI'];
};

// sections numbered from WNW going clockwise: 1 - 8
export const getWaypointBySection = (sectionInt) => {
  if (sectionInt >= 1 && sectionInt <= 2) return Waypoints.LENDY;
  if (sectionInt >= 3 && sectionInt <= 6) return Waypoints.CORVT;
  if (sectionInt >= 7 && sectionInt <= 8) return Waypoints.KMCHI;
};

export const getWaypointDepartureRnd = () => {
  const waypointsDeparture = getWaypointDestinationsAll();
  const indexDeparture = Math.floor(Math.random() * waypointsDeparture.length);
  return waypointsDeparture[indexDeparture];
};

export const getWaypoint = (waypoint, screenSize) => {
  const obj = waypoints(waypoint, screenSize);
  if (!obj) throw new Error('waypoint not found: ' + waypoint);
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
  let titlePosition22L = { x: 0, y: 0 };

  switch (screenSize) {
    case ScreenSizes.Large:
      xOffset = 345;
      yOffset = 65;
      length = 60;
      runwayWidth = 4;
      titlePosition22L = { x: 8, y: 12 };
      break;
    // TODO //////////////////////////////////////////////////////////////////
    case ScreenSizes.Small:
      xOffset = 345;
      yOffset = 65;
      length = 60;
      runwayWidth = 4;
      titlePosition22L = { x: 8, y: 12 };
      break;
  }

  switch (runway) {
    case '22L':
      return {
        x: width / 2 + xOffset,
        y: height / 2 + 18 + yOffset,
        heading: 211,
        length,
        width: runwayWidth,
        titlePosition: titlePosition22L,
      };
  }
};

const waypoints = (waypoint, screenSize) => {
  const width = getGameSize(screenSize).width;
  const height = getGameSize(screenSize).height;

  if (screenSize === ScreenSizes.Large) {
    switch (waypoint) {
      case 'CORVT':
        return {
          holdingPosition: HoldingPosition.North,
          type: WaypointType.Arrival,
          x: width - 250,
          y: height / 2 - 180,
        };
      case 'LENDY':
        return {
          holdingPosition: HoldingPosition.South,
          type: WaypointType.Arrival,
          x: width / 4 + 250,
          y: height / 2 - 280,
        };
      case 'KMCHI':
        return {
          holdingPosition: HoldingPosition.North,
          type: WaypointType.Arrival,
          x: width / 2 - 70,
          y: height - 240,
        };
      case 'NORTH':
        return {
          type: WaypointType.Departure,
          x: width - 200,
          y: 50,
        };
      case 'SOUTH':
        return {
          type: WaypointType.Departure,
          x: width / 2 + 20,
          y: height - 30,
        };
      case 'SHIPP':
        return {
          type: WaypointType.Departure,
          x: width - 70,
          y: height - 50,
        };
      case 'SBJ':
        return {
          type: WaypointType.Departure,
          x: 50,
          y: height / 2,
        };
    }
  }

  // TODO //////////////////////////////////////////////////////////////////
  if (screenSize === ScreenSizes.Small) {
    switch (waypoint) {
      case 'CORVT':
        return {
          holdingPosition: HoldingPosition.North,
          type: WaypointType.Arrival,
          x: width - 250,
          y: height / 2 - 180,
        };
      case 'LENDY':
        return {
          holdingPosition: HoldingPosition.South,
          type: WaypointType.Arrival,
          x: width / 4 + 250,
          y: height / 2 - 280,
        };
      case 'KMCHI':
        return {
          holdingPosition: HoldingPosition.South,
          type: WaypointType.Arrival,
          x: width / 2 - 70,
          y: height - 240,
        };
      case 'NORTH':
        return {
          type: WaypointType.Departure,
          x: width - 200,
          y: 50,
        };
      case 'SOUTH':
        return {
          type: WaypointType.Departure,
          x: width / 2 + 20,
          y: height - 30,
        };
      case 'SHIPP':
        return {
          type: WaypointType.Departure,
          x: width - 70,
          y: height - 50,
        };
      case 'SBJ':
        return {
          type: WaypointType.Departure,
          x: 50,
          y: height / 2,
        };
    }
  }
};
