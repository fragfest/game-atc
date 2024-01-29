import { ScreenSizes } from '../utils';

export const getAirframe = (airframe) => {
  return detailsByAirframe[airframe] || detailsByAirframe['A320'];
};

export const getPerformance = (airframe, screenSize) => {
  const performanceLarge =
    performanceByAirframe[airframe] || performanceByAirframe['A320'];
  if (screenSize === ScreenSizes.Small) {
    return Object.assign(performanceLarge, basePerformanceSmall);
  }
  return performanceLarge;
};

export const Airframes = Object.freeze({
  A320: 'A320',
  A333: 'A333',
  B763: 'B763',
  B77W: 'B77W',
  A388: 'A388',
});

export const WakeRating = Object.freeze({
  L: 'L',
  M: 'M',
  H: 'H',
  J: 'J',
});

////////////// PRIVATE //////////////////////////////////////
const pathPlanes = '/img/planes';

const basePerformanceSmall = {
  isSmall: true,
  speedRatePerMs: 0.009,
};

const basePerformance = {
  isSmall: false,
  speedTakeoff: 150,
  speedMin: 180,
  speedLanding: 130,
  speedMax: 450,
  speedDeltaPerMs: 2,
  speedRatePerMs: 0.012,
  altitudeRatePerMs: 0.04,
  turnRateRadPerMs: 0.00005,
  wake: WakeRating.M,
  images: {
    iconSize: { top: -2, side: 30 },
    iconDefault: pathPlanes + '/A388/white.png',
    iconSelected: pathPlanes + '/A388/green.png',
    iconConflict: pathPlanes + '/A388/red.png',
    iconLanding: pathPlanes + '/A388/yellow.png',
    profile: pathPlanes + '/A388/profile.png',
  },
};

const PerformanceModifiers = Object.freeze({
  A320: {},
  A333: {
    speedTakeoff: 160,
    speedMin: 200,
    speedLanding: 140,
    speedDeltaPerMs: 1.7,
    altitudeRatePerMs: 0.036,
    turnRateRadPerMs: 0.000046,
    wake: WakeRating.H,
  },
  B763: {
    speedTakeoff: 160,
    speedMin: 200,
    speedLanding: 140,
    turnRateRadPerMs: 0.000046,
    wake: WakeRating.H,
  },
  B77W: {
    speedTakeoff: 160,
    speedMin: 200,
    speedLanding: 140,
    speedDeltaPerMs: 1.8,
    altitudeRatePerMs: 0.038,
    turnRateRadPerMs: 0.000046,
    wake: WakeRating.H,
  },
  A388: {
    speedTakeoff: 165,
    speedMin: 220,
    speedLanding: 145,
    speedDeltaPerMs: 1.6,
    altitudeRatePerMs: 0.034,
    turnRateRadPerMs: 0.000042,
    wake: WakeRating.J,
  },
});

const IconSizes = Object.freeze({
  A320: { top: 0, side: 22 },
  A333: { top: 2, side: 26 },
  B763: { top: -2, side: 24 },
  B77W: { top: 2, side: 26 },
  A388: { top: -2, side: 32 },
});

const imagesObj = (type) => ({
  iconSize: IconSizes[type],
  iconDefault: pathPlanes + '/' + type + '/white.png',
  iconSelected: pathPlanes + '/' + type + '/green.png',
  iconConflict: pathPlanes + '/' + type + '/red.png',
  iconLanding: pathPlanes + '/' + type + '/yellow.png',
  profile: pathPlanes + '/' + type + '/profile.png',
});

const performanceByAirframe = {
  A320: {
    ...basePerformance,
    ...PerformanceModifiers.A320,
    type: 'A320',
    images: imagesObj('A320'),
  },
  A333: {
    ...basePerformance,
    ...PerformanceModifiers.A333,
    type: 'A333',
    images: imagesObj('A333'),
  },
  B763: {
    ...basePerformance,
    ...PerformanceModifiers.B763,
    type: 'B763',
    images: imagesObj('B763'),
  },
  B77W: {
    ...basePerformance,
    ...PerformanceModifiers.B77W,
    type: 'B77W',
    images: imagesObj('B77W'),
  },
  A388: {
    ...basePerformance,
    ...PerformanceModifiers.A388,
    type: 'A388',
    images: imagesObj('A388'),
  },
};

const detailsByAirframe = {
  A320: { make: 'Airbus', airframe: 'A320-200' },
  A333: { make: 'Airbus', airframe: 'A330-300' },
  B763: { make: 'Boeing', airframe: '767-300' },
  B77W: { make: 'Boeing', airframe: '777-300ER' },
  A388: { make: 'Airbus', airframe: 'A380-800' },
};
