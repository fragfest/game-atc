export const convertToPosRad = rad => (rad >= 0) ? rad : (2 * Math.PI + rad);
export const convertToSmallRad = rad => (rad < 2 * Math.PI) ? rad : (rad - 2 * Math.PI);
export const convertToSmallDegrees = degrees => (degrees <= 360) ? degrees : (degrees - 360);

// zero degrees is east on the Canvas
export const radToDegrees = rad => (Number(rad) * 180 / Math.PI) + 90;
export const degreesToRad = degrees => (Number(degrees) - 90) * Math.PI / 180;
export const inputHeadingToRad = heading => convertToPosRad(degreesToRad(heading));

export const isValidHeading = str => {
  if (str.length > 3) return false;

  const strArr = str.split('');
  const intOnlyArr = strArr.map(str => parseInt(str))
    .filter(int => !Number.isNaN(int));
  const hasOnlyInts = intOnlyArr.length === str.length;
  const isInRange = parseInt(str) >= 0 && parseInt(str) <= 360;
  const isNotAllZeros = str !== '000';
  return hasOnlyInts && isInRange && isNotAllZeros;
}
