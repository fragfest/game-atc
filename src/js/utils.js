import { isDeparture, isArrival } from './types';
import { distBetweenEntities } from './entity';

// PLANES /////////////////////////////////////////////////////////////////
export const getDepartureCount = (arr) => arr.filter(isDeparture).length;
export const getArrivalCount = (arr) => arr.filter(isArrival).length;

// WAYPOINT /////////////////////////////////////////////////////////////////
export const nextWaypoint = (waypointsArr, plane) => {
  const indexSel = waypointsArr.findIndex((str) => str === plane.waypoint);
  let indexNext = indexSel + 1;
  if (indexNext >= waypointsArr.length) indexNext = 0;
  return waypointsArr[indexNext];
};

// ALTITUDE /////////////////////////////////////////////////////////////////
export const altitudeDisplay = (alt) => Math.round(alt / 10) * 10;

// HEADING /////////////////////////////////////////////////////////////////
export const convertToPosRad = (rad) => (rad >= 0 ? rad : 2 * Math.PI + rad);
export const convertToSmallRad = (rad) =>
  rad < 2 * Math.PI ? rad : rad - 2 * Math.PI;
export const convertToSmallDegrees = (degrees) =>
  degrees <= 360 ? degrees : degrees - 360;
// zero degrees is east on the Canvas
export const radToDegrees = (rad) => (Number(rad) * 180) / Math.PI + 90;
export const degreesToRad = (degrees) =>
  ((Number(degrees) - 90) * Math.PI) / 180;
export const inputHeadingToRad = (heading) =>
  convertToPosRad(degreesToRad(heading));
export const convHdgDegToThreeDigits = (degree) => {
  const degrees = Math.round(convertToSmallDegrees(degree));
  return leftPadZeros(degrees);
};
export const convHdgRadToThreeDigits = (rad) => {
  const degrees = Math.round(convertToSmallDegrees(radToDegrees(rad)));
  return leftPadZeros(degrees);
};

// UTIL //////////////////////////////////////////////////////////////////

export const createInterceptHeading = (src, dest) => {
  const x = dest.x - src.x;
  const y = dest.y - src.y;

  // src in SE
  if (x < 0 && y < 0) return Math.PI + Math.atan(y / x);
  // src in NE
  if (x < 0 && y > 0) return Math.PI + Math.atan(y / x);
  // src in NW
  if (x > 0 && y > 0) return Math.atan(y / x);
  // src in SW
  if (x > 0 && y < 0) return convertToPosRad(Math.atan(y / x));

  return 0;
};

/**
 * @param {number} hdgRad heading to check (radians)
 * @param {number} arcCentreHdgRad centre line heading (radians)
 * @param {number} arcAngleDeg arc on each side of centre line (degrees)
 * @returns {boolean}
 */
export const isHeadingWithinArc = (hdgRad, arcCentreHdgRad, arcAngleDeg) => {
  const arcAngle = deg2Rad(arcAngleDeg);
  let centre = arcCentreHdgRad;
  let hdg = hdgRad;
  if (hdg > Math.PI) {
    hdg = -1 * (2 * Math.PI - hdg);
  }
  if (centre > Math.PI) {
    centre = -1 * (2 * Math.PI - centre);
  }

  const angleWithinLeftArc = hdg >= centre - arcAngle;
  const angleWithinRightArc = hdg <= centre + arcAngle;
  return angleWithinLeftArc && angleWithinRightArc;
};

export const isWithinDist = (distMax, obj1, obj2) => {
  return distBetweenEntities(obj1)(obj2) < distMax;
};

export const isValidHeading = (str) => {
  const isInRange = parseInt(str) >= 0 && parseInt(str) <= 360;
  return isValidThreeDigitInput(str, isInRange);
};
export const isValidAltitude = (plane, str) => {
  let min = plane.altitudeMin;
  if (plane.landing) min = plane.altitudeMin;
  if (plane.isTouchedDown) min = 0;

  const isInRange =
    parseInt(str) >= min / 100 && parseInt(str) <= plane.altitudeMax / 100;
  return isValidThreeDigitInput(str, isInRange);
};
export const isValidSpeed = (plane, str) => {
  let min = plane.speedMin;
  if (plane.landing) min = plane.speedLanding;
  if (plane.isTouchedDown) min = 0;
  if (plane.takeoff) min = 0;

  const isInRange = parseInt(str) >= min && parseInt(str) <= plane.speedMax;
  return isValidThreeDigitInput(str, isInRange);
};

export const leftPadZeros = (str) => ('000' + str).slice(-3);

// SIZE //////////////////////////////////////////////////////////////
export const ScreenSizes = Object.freeze({
  Small: 'small',
  Large: 'large',
});

export const calculateScreenSize = (windowWidth, windowHeight) => {
  const screenOneWidth = 1500;
  const screenOneHeight = 1000;

  // w/h aspect ratio: 1.6525
  if (windowWidth < screenOneWidth || windowHeight < screenOneHeight) {
    return ScreenSizes.Small;
  } else {
    return ScreenSizes.Large;
  }
};

/**
 * @returns {ScreenSizes} screenSize
 */
export const getScreenSize = () => {
  return localStorage.getItem('screen-size') || null;
};

/**
 * @param {ScreenSizes} screenSize
 */
export const setScreenSize = (screenSize) => {
  localStorage.setItem('screen-size', screenSize);
};

/**
 * @param {ScreenSizes} screenSize
 */
export const getGameSize = (screenSize) => {
  const obj = gameSizes[screenSize] ? gameSizes[screenSize] : gameSizes.large;
  return { ...obj };
};

/**
 * @param {ScreenSizes} screenSize
 */
export const getClassSize = (screenSize) => {
  if (screenSize === ScreenSizes.Small) return 'small';
  if (screenSize === ScreenSizes.Large) return 'large';
  return '';
};

// GENERAL /////////////////////////////////////////////////////////////////
export const accMax = (acc, val) => (acc > val ? acc : val);
export const randMinMax = (min, max) => min + Math.random() * (max - min);

// SETUP /////////////////////////////////////////////////////////////////
export const setupGameLoadAndExit = () => {
  if (process.env.NODE_ENV === 'production') {
    // browser prompts on reload and close
    window.onbeforeunload = function () {
      return '';
    };
    window.close = function () {
      return '';
    };
  }
};

export const destroyGameLoadAndExit = () => {
  // remove browser prompts on reload and close
  window.onbeforeunload = null;
  window.close = null;
};

////////////////////////////////////////////////////////////////////////////
// PRIVATE
///////////////////////////////////////////////////////////////////////////

// SETUP /////////////////////////////////////////////////////////////////
// keys are ScreenSizes values
const gameSizes = {
  small: { width: 991, height: 600 },
  large: { width: 1322, height: 800 },
};

// HEADING /////////////////////////////////////////////////////////////////
const isValidThreeDigitInput = (str, isInRange) => {
  if (str.length > 3) return false;

  const strArr = str.split('');
  const intOnlyArr = strArr
    .map((str) => parseInt(str))
    .filter(Number.isInteger);
  const hasOnlyInts = intOnlyArr.length === str.length;
  const isNotAllZeros = str !== '000';
  if (str.length < 3 && !hasOnlyInts) {
    return false;
  }
  if (str.length < 3 && hasOnlyInts) {
    return true;
  }
  return hasOnlyInts && isNotAllZeros && isInRange;
};

const deg2Rad = (deg) => (deg * Math.PI) / 180;

// MISC  //////////////////////////////////////////////////////////
export const timeDebug = () => debug();
export const wakeDebug = () => debug();
export const wakeDanger = () => debug();
export const resizeGameOver = () => debug();
export const resetLevelComplete = () => debug();
export const routerPathRelative = () => debug();
export const uniqueProximityDebug = () => debug();
export const clearProximityCircle = () => debug();
export const goAroundDebug = () => debug();
export const turbulenceCounterReset = () => debug();
export const setLogLevel = () => debug();
export const setupDebug = () => debug();
export const historyRecordDebug = () => debug();
export const victoryDebug = () => debug();
export const resetBadgeHistory = () => debug();

const debug = () => {
  window['06d6dd1b-76bb-4e0f-9d66-6dd80e324211'] =
    '8c329fcb-0fb7-4401-a9f6-65332dcdb21b';
};
