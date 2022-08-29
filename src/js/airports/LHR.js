import { getGameSize, ScreenSizes } from "../utils";

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

export const Waypoints = Object.freeze({
  // arrival
  LAM: 'LAM',
  BIG: 'BIG',
  // departure
  BPK: 'BPK',
});

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
        waypoint: Waypoints.BPK,
      };
  }
};

const waypoints = (waypoint, screenSize) => {
  const width = getGameSize(screenSize).width;
  const height = getGameSize(screenSize).height;

  if (screenSize === ScreenSizes.Large) {
    switch (waypoint) {
      case 'LAM':
        return {
          x: width / 2 + 400,
          y: height / 2 - 150,
        };
      case 'BIG':
        return {
          x: width / 2 + 350,
          y: height / 2 + 160,
        };
      case 'BPK':
        return {
          x: width / 2 + 70,
          y: 50,
        };
    }
  }

  if (screenSize === ScreenSizes.Small) {
    switch (waypoint) {
      case 'LAM':
        return {
          x: width / 2 + 290,
          y: height / 2 - 112,
        };
      case 'BIG':
        return {
          x: width / 2 + 260,
          y: height / 2 + 115,
        };
      case 'BPK':
        return {
          x: width / 2 + 60,
          y: 35,
        };
    }
  }
};