// WAYPOINT /////////////////////////////////////////////////////////////////
export const Direction = Object.freeze({
  None: 'none',
  Left: 'left',
  Right: 'right',
});

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

// UTIL /////////////////////////////////////////////////////////////////
export const leftPadZeros = (str) => ('000' + str).slice(-3);

export const isValidHeading = (str) => {
  const isInRange = parseInt(str) >= 0 && parseInt(str) <= 360;
  return isValidThreeDigitInput(str, isInRange);
};
export const isValidAltitude = (plane, str) => {
  let min = 1000;
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

// SIZE /////////////////////////////////////////////////////////////////
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
