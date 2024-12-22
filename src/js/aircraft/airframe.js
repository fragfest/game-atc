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
  A319: 'A319',
  A320: 'A320',
  A321: 'A321',
  A333: 'A333',
  A388: 'A388',
  B738: 'B738',
  B763: 'B763',
  B788: 'B788',
  B789: 'B789',
  B78X: 'B78X',
  B772: 'B772',
  B77W: 'B77W',
  B748: 'B748',
});

export const getWakeStrength = (rating) => {
  switch (rating) {
    case WakeRating.L:
      return 1;
    case WakeRating.M:
      return 2;
    case WakeRating.H:
      return 3;
    case WakeRating.J:
      return 4;
    default:
      return 1;
  }
};

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
  B738: {},
  A320: {},
  A321: {},
  A333: {
    speedTakeoff: 160,
    speedMin: 200,
    speedLanding: 140,
    speedDeltaPerMs: 1.7,
    altitudeRatePerMs: 0.036,
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
  B763: {
    speedTakeoff: 160,
    speedMin: 200,
    speedLanding: 140,
    turnRateRadPerMs: 0.000046,
    wake: WakeRating.H,
  },
  B789: {
    speedTakeoff: 160,
    speedMin: 210,
    speedLanding: 145,
    turnRateRadPerMs: 0.000046,
    wake: WakeRating.H,
  },
  B77W: {
    speedTakeoff: 160,
    speedMin: 210,
    speedLanding: 140,
    speedDeltaPerMs: 1.8,
    altitudeRatePerMs: 0.038,
    turnRateRadPerMs: 0.000046,
    wake: WakeRating.H,
  },
  B748: {
    speedTakeoff: 165,
    speedMin: 220,
    speedLanding: 145,
    speedDeltaPerMs: 1.6,
    altitudeRatePerMs: 0.034,
    turnRateRadPerMs: 0.000042,
    wake: WakeRating.H,
  },
});

const IconSizes = Object.freeze({
  A319: { top: 0, side: 22 },
  A320: { top: 0, side: 22 },
  A321: { top: 0, side: 22 },
  A333: { top: 0, side: 26 },
  A388: { top: 0, side: 32 },
  B738: { top: 0, side: 22 },
  B763: { top: 0, side: 24 },
  B788: { top: 0, side: 24 },
  B789: { top: 0, side: 24 },
  B78X: { top: 0, side: 24 },
  B772: { top: 0, side: 26 },
  B77W: { top: 0, side: 26 },
  // B748: { top: 0, side: 32 },
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
  B738: {
    ...basePerformance,
    ...PerformanceModifiers.B738,
    type: 'B738',
    images: imagesObj('A320'),
  },
  A319: {
    ...basePerformance,
    ...PerformanceModifiers.A320,
    type: 'A319',
    images: imagesObj('A320'),
  },
  A320: {
    ...basePerformance,
    ...PerformanceModifiers.A320,
    type: 'A320',
    images: imagesObj('A320'),
  },
  A321: {
    ...basePerformance,
    ...PerformanceModifiers.A321,
    type: 'A321',
    images: imagesObj('A320'),
  },
  A333: {
    ...basePerformance,
    ...PerformanceModifiers.A333,
    type: 'A333',
    images: imagesObj('A333'),
  },
  A388: {
    ...basePerformance,
    ...PerformanceModifiers.A388,
    type: 'A388',
    images: imagesObj('A388'),
  },
  B763: {
    ...basePerformance,
    ...PerformanceModifiers.B763,
    type: 'B763',
    images: imagesObj('B763'),
  },
  B788: {
    ...basePerformance,
    ...PerformanceModifiers.B789,
    type: 'B788',
    images: imagesObj('B763'),
  },
  B789: {
    ...basePerformance,
    ...PerformanceModifiers.B789,
    type: 'B789',
    images: imagesObj('B763'),
  },
  B78X: {
    ...basePerformance,
    ...PerformanceModifiers.B789,
    type: 'B78X',
    images: imagesObj('B763'),
  },
  B772: {
    ...basePerformance,
    ...PerformanceModifiers.B77W,
    type: 'B772',
    images: imagesObj('B77W'),
  },
  B77W: {
    ...basePerformance,
    ...PerformanceModifiers.B77W,
    type: 'B77W',
    images: imagesObj('B77W'),
  },
  B748: {
    ...basePerformance,
    ...PerformanceModifiers.A388,
    type: 'B748',
    images: imagesObj('A388'),
  },
};

const detailsByAirframe = {
  A319: { make: 'Airbus', airframe: 'A319-131' },
  A320: { make: 'Airbus', airframe: 'A320-200' },
  A321: { make: 'Airbus', airframe: 'A321-231' },
  A333: { make: 'Airbus', airframe: 'A330-300' },
  A388: { make: 'Airbus', airframe: 'A380-800' },
  B738: { make: 'Boeing', airframe: '737-8K2' },
  B763: { make: 'Boeing', airframe: '767-300' },
  B788: { make: 'Boeing', airframe: '787-8' },
  B789: { make: 'Boeing', airframe: '787-9' },
  B78X: { make: 'Boeing', airframe: '787-10' },
  B772: { make: 'Boeing', airframe: '777-236ER' },
  B77W: { make: 'Boeing', airframe: '777-300ER' },
  B748: { make: 'Boeing', airframe: '747-8' },
};
