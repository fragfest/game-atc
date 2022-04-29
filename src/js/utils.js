// HEADING
export const convertToPosRad = rad => (rad >= 0) ? rad : (2 * Math.PI + rad);
export const convertToSmallRad = rad => (rad < 2 * Math.PI) ? rad : (rad - 2 * Math.PI);
export const convertToSmallDegrees = degrees => (degrees <= 360) ? degrees : (degrees - 360);
// zero degrees is east on the Canvas
export const radToDegrees = rad => (Number(rad) * 180 / Math.PI) + 90;
export const degreesToRad = degrees => (Number(degrees) - 90) * Math.PI / 180;
export const inputHeadingToRad = heading => convertToPosRad(degreesToRad(heading));
export const convHdgDegToThreeDigits = degree => {
  const degrees = Math.round(convertToSmallDegrees(degree));
  return leftPadZeros(degrees);
}
export const convHdgRadToThreeDigits = rad => {
  const degrees = Math.round(convertToSmallDegrees(radToDegrees(rad)));
  return leftPadZeros(degrees);
}

// UTIL
export const leftPadZeros = str => ("000" + str).slice(-3);

export const isValidHeading = str => {
  const isInRange = parseInt(str) >= 0 && parseInt(str) <= 360;
  return isValidThreeDigitInput(str, isInRange);
}
export const isValidAltitude = str => {
  const isInRange = parseInt(str) >= 1 && parseInt(str) <= 400;
  return isValidThreeDigitInput(str, isInRange);
}
export const isValidSpeed = str => {
  const isInRange = parseInt(str) >= 135 && parseInt(str) <= 500;
  return isValidThreeDigitInput(str, isInRange);
}

////////////// PRIVATE //////////////////////////////////////
const isValidThreeDigitInput = (str, isInRange) => {
  if (str.length > 3) return false;

  const strArr = str.split('');
  const intOnlyArr = strArr.map(str => parseInt(str))
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
}