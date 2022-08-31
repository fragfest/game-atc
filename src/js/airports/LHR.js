import { getGameSize, ScreenSizes } from "../utils";
import { WaypointType } from '../types';

export const Runways = Object.freeze({
  TwoSevenRight: '27R',
});

export const getRunway = (runway, screenSize) => {
  const obj = runways(runway, screenSize);
  if (!obj) {
    throw new Error('runway not found: ' + runway);
  }
  return obj;
};

// TODO split into departure and arrivals
export const Waypoints = Object.freeze({
  // arrival
  BNN: 'BNN',
  OCK: 'OCK',
  LAM: 'LAM',
  BIG: 'BIG',
  // departure
  DET: 'DET',
  MID: 'MID',
  CPT: 'CPT',
  BPK: 'BPK',
});

export const getWaypointDeparture = () => {
  const waypointsDeparture = ['DET', 'MID', 'CPT', 'BPK'];
  const indexDeparture = Math.floor(Math.random() * waypointsDeparture.length);
  return waypointsDeparture[indexDeparture];
}

export const getWaypoint = (waypoint, screenSize) => {
  const obj = waypoints(waypoint, screenSize);
  if (!obj) {
    throw new Error('waypoint not found: ' + waypoint);
  }
  return obj;
};

////////////// PRIVATE ////////////////////////////////
const runways = (runway, screenSize) => {
  const width = getGameSize(screenSize).width;
  let xOffset = 0;
  const height = getGameSize(screenSize).height;
  let yOffset = 0;
  let length = 0;
  let runwayWidth = 0;

  switch (screenSize) {
    case ScreenSizes.Large:
      xOffset = -140;
      yOffset = 26;
      length = 60;
      runwayWidth = 4;
      break;
    case ScreenSizes.Small:
      xOffset = -105;
      yOffset = 18;
      length = 40;
      runwayWidth = 2.8;
      break;
  }

  switch (runway) {
    case '27R':
      return {
        x: width / 2 + xOffset,
        y: height / 2 + yOffset,
        heading: 270,
        length,
        width: runwayWidth,
      };
  }
};

const waypoints = (waypoint, screenSize) => {
  const width = getGameSize(screenSize).width;
  const height = getGameSize(screenSize).height;

  if (screenSize === ScreenSizes.Large) {
    switch (waypoint) {
      case 'BNN':
        return {
          type: WaypointType.Arrival,
          x: width / 2 - 215,
          y: height / 2 - 155,
        };
      case 'OCK':
        return {
          type: WaypointType.Arrival,
          x: 465,
          y: height - 160,
        };
      case 'LAM':
        return {
          type: WaypointType.Arrival,
          x: width / 2 + 400,
          y: height / 2 - 150,
        };
      case 'BIG':
        return {
          type: WaypointType.Arrival,
          x: width / 2 + 350,
          y: height / 2 + 160,
        };
      case 'DET':
        return {
          type: WaypointType.Departure,
          x: width / 2 + 150,
          y: height - 28,
        };
      case 'MID':
        return {
          type: WaypointType.Departure,
          x: 270,
          y: height - 42,
        };
      case 'CPT':
        return {
          type: WaypointType.Departure,
          x: 50,
          y: height / 2 - 45,
        };
      case 'BPK':
        return {
          type: WaypointType.Departure,
          x: width / 2 + 70,
          y: 50,
        };
    }
  }

  if (screenSize === ScreenSizes.Small) {
    switch (waypoint) {
      case 'BNN':
        return {
          type: WaypointType.Arrival,
          x: width / 2 - 160,
          y: height / 2 - 118,
        };
      case 'OCK':
        return {
          type: WaypointType.Arrival,
          x: 350,
          y: height - 120,
        };
      case 'LAM':
        return {
          type: WaypointType.Arrival,
          x: width / 2 + 290,
          y: height / 2 - 112,
        };
      case 'BIG':
        return {
          type: WaypointType.Arrival,
          x: width / 2 + 260,
          y: height / 2 + 115,
        };
      case 'DET':
        return {
          type: WaypointType.Departure,
          x: width / 2 + 112,
          y: height - 22,
        };
      case 'MID':
        return {
          type: WaypointType.Departure,
          x: 202,
          y: height - 30,
        };
      case 'CPT':
        return {
          type: WaypointType.Departure,
          x: 39,
          y: height / 2 - 33,
        };
      case 'BPK':
        return {
          type: WaypointType.Departure,
          x: width / 2 + 60,
          y: 35,
        };
    }
  }
};