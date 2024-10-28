import { getTooCloseDistance } from '../entity';
import { ScreenSizes, isWithinDist } from '../utils';
import { isAircraft, isAirborne } from '../types';
import { getWakeStrength } from './airframe';

/**
 * @typedef {import('./Aircraft')} Aircraft
 */

/**
 * @param {Aircraft} aircraft
 * @param {Context} textLayerObj
 */
export const drawPlaneWake = (aircraft, textLayerObj) => {
  const distMiles3 = aircraft.isSmall
    ? getTooCloseDistance(ScreenSizes.Small)
    : getTooCloseDistance(ScreenSizes.Large);

  const minRadius = distMiles3 * 0.1;
  textLayerObj.ctx.strokeStyle = 'orange';

  aircraft.trailPixelArr.forEach((point, index) => {
    const { wakeRadius } = wake(index);
    if (wakeRadius === 0) return;

    const circleRadius = wakeRadius * minRadius;
    textLayerObj.ctx.beginPath();
    textLayerObj.ctx.arc(point.x, point.y, circleRadius, 0, 2 * Math.PI);
    textLayerObj.ctx.stroke();
  });

  textLayerObj.ctx.closePath();
};

export const calcWake = ({ entityManagerArr, aircraft }) => {
  const isNotOriginPlane = (plane) => plane.id !== aircraft.id;
  const isPlane = (obj) =>
    isAircraft(obj) && isAirborne(obj) && isNotOriginPlane(obj);
  const isWithinAlt = (planeSrc, alt) => (plane) =>
    plane.altitude > planeSrc.altitude - alt &&
    plane.altitude < planeSrc.altitude;

  const getPlanesInWake = (circleRadius, wake) => {
    const planes = entityManagerArr.filter(isPlane);
    if (planes.length === 0) return [];

    const planesInWake = planes.filter((plane) =>
      isWithinDist(circleRadius, wake, plane)
    );
    return planesInWake;
  };

  const distMiles3 = aircraft.isSmall
    ? getTooCloseDistance(ScreenSizes.Small)
    : getTooCloseDistance(ScreenSizes.Large);
  const minRadius = distMiles3 * 0.1;

  const planesInWake = [];

  aircraft.trailPixelArr.forEach((point, index) => {
    const { wakeRadius, wakeStrength, wakeAltitude } = wake(index);
    if (wakeRadius === 0) return;

    const circleRadius = wakeRadius * minRadius;
    const planesHorizontal = getPlanesInWake(circleRadius, point);
    const planes = planesHorizontal.filter(isWithinAlt(aircraft, wakeAltitude));
    if (planes.length === 0) return;

    const createWakeObj = (planeInwake) => ({
      plane: planeInwake,
      strength: strengthByAirframe(aircraft, planeInwake, wakeStrength),
    });
    planesInWake.push(...planes.map(createWakeObj));
  });

  return planesInWake;
};

// PRIVATE ////////////////////////////////////////////////////////

const strengthByAirframe = (planeSrc, planeInWake, wakeStrength) => {
  const srcAirframe = getWakeStrength(planeSrc.wake);
  const destAirframe = getWakeStrength(planeInWake.wake);
  const total = srcAirframe * wakeStrength * 2 - destAirframe * wakeStrength;
  return total;
};

const wake = (index) => {
  const retObj = {};
  retObj.wakeRadius = 0;
  retObj.wakeAltitude = 0;
  retObj.wakeStrength = 0;

  const strengthByIndex = (wakeIndex) => {
    const strengthMin = 0.1;
    const ratio = (wakeIndexMax - wakeIndex) / wakeIndexMax;
    return strengthMin + (1 - strengthMin) * ratio;
  };

  const altitudeMax = 1000;
  const wakeIndexMax = 4;
  if (index % 2 === 0) {
    return retObj;
  } else if (index === 1) {
    retObj.wakeRadius = 2;
    retObj.wakeAltitude = altitudeMax * (1 / (wakeIndexMax + 1));
    retObj.wakeStrength = strengthByIndex(0);
  } else if (index === 3) {
    retObj.wakeRadius = 2.5;
    retObj.wakeAltitude = altitudeMax * (2 / (wakeIndexMax + 1));
    retObj.wakeStrength = strengthByIndex(1);
  } else if (index === 5) {
    retObj.wakeRadius = 3.5;
    retObj.wakeAltitude = altitudeMax * (3 / (wakeIndexMax + 1));
    retObj.wakeStrength = strengthByIndex(2);
  } else if (index === 7) {
    retObj.wakeRadius = 4.5;
    retObj.wakeAltitude = altitudeMax * (4 / (wakeIndexMax + 1));
    retObj.wakeStrength = strengthByIndex(3);
  } else if (index === 9) {
    return retObj;
  } else if (index === 11) {
    retObj.wakeRadius = 6;
    retObj.wakeAltitude = altitudeMax * (5 / (wakeIndexMax + 1));
    retObj.wakeStrength = strengthByIndex(wakeIndexMax);
  }

  return retObj;
};
