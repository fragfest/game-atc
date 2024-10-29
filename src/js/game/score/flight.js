// eslint-disable-next-line
import Aircraft from '../../aircraft/Aircraft';

/**
 * @param {Aircraft} plane
 * @returns {Number} score 0 to 1
 */
export const flightQuality = (plane) => {
  if (!plane) return 1;

  const turbulenceWeight = 0.5;
  const turbulenceMsMax = 60 * 1000;
  const turbulenceRatio = plane.turbulenceMs / turbulenceMsMax;
  const turbulenceRaw = turbulenceRatio < 1 ? turbulenceRatio : 1;
  const weatherTurbulence = Number(
    (turbulenceRaw * turbulenceWeight).toFixed(3)
  );

  const wakeTurbulenceWeight = 0.5;
  const wakeTurbulenceMsMax = 60 * 1000;
  const wakeTurbulenceRatio = plane.wakeMs / wakeTurbulenceMsMax;
  const wakeTurbulenceRaw = wakeTurbulenceRatio < 1 ? wakeTurbulenceRatio : 1;
  const wakeTurbulence = Number(
    (wakeTurbulenceRaw * wakeTurbulenceWeight).toFixed(3)
  );

  const totalTurbulenceRaw = weatherTurbulence + wakeTurbulence;
  const totalTurbulence = totalTurbulenceRaw < 0.5 ? totalTurbulenceRaw : 0.5;

  const wakeWeight = 0.5;
  const wakeMax = 50;
  const wakeRatio = plane.wakeScore / wakeMax;
  const wakeRaw = wakeRatio < 1 ? wakeRatio : 1;
  const wake = Number((wakeRaw * wakeWeight).toFixed(3));

  const totalRaw = totalTurbulence + wake;
  const total = totalRaw < 1 ? totalRaw : 1;
  return 1 - total;
};
