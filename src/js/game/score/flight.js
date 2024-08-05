// eslint-disable-next-line
import Square from '../../Square';

/**
 * @param {Square} plane
 * @returns {Number} score 0 to 1
 */
export const flightQuality = (plane) => {
  if (!plane) return 1;

  const turbulenceMsMax = 60 * 1000;
  const turbulenceFn = (x) => x.turbulenceMs / turbulenceMsMax;
  const turbulenceRaw = turbulenceFn(plane) < 1 ? turbulenceFn(plane) : 1;
  const turbulenceWeight = 0.3;
  const turbulence = turbulenceRaw * turbulenceWeight;
  return 1 - turbulence;
};
