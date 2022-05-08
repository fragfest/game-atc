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
  LAM: 'LAM',
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

  switch (screenSize) {
    case ScreenSizes.Large:
      xOffset = -140;
      yOffset = 26;
      length = 60;
      break;
    case ScreenSizes.Small:
      xOffset = -105;
      yOffset = 18;
      length = 40;
      break;
  }

  switch (runway) {
    case '27R':
      return {
        x: width / 2 + xOffset,
        y: height / 2 + yOffset,
        heading: 270,
        length,
      };
  }
};

const waypoints = (waypoint, screenSize) => {
  const width = getGameSize(screenSize).width;
  let xOffset = 0;
  const height = getGameSize(screenSize).height;
  let yOffset = 0;

  switch (screenSize) {
    case ScreenSizes.Large:
      xOffset = 400;
      yOffset = -150;
      break;
    case ScreenSizes.Small:
      xOffset = 300;
      yOffset = -112;
      break;
  }

  switch (waypoint) {
    case 'LAM':
      return {
        x: width / 2 + xOffset,
        y: height / 2 + yOffset,
      };
  }
};