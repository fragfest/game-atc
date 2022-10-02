import { ScreenSizes } from "../utils";

export const getPerformance = (airframe, screenSize) => {
  const performanceLarge = performanceByAirframe[airframe] || performanceByAirframe['A320'];
  if (screenSize === ScreenSizes.Small) {
    return Object.assign(performanceLarge, basePerformanceSmall);
  }
  return performanceLarge;
}

export const DestinationType = Object.freeze({
  Arrival: 'arrival',
  Departure: 'departure',
});

export const Airframes = Object.freeze({
  A320: 'A320',
  A333: 'A333',
  B763: 'B763',
  B77W: 'B77W',
  A388: 'A388',
});

export const WakeRating = Object.freeze({
  L: 'L', M: 'M', H: 'H', J: 'J',
});

////////////// PRIVATE //////////////////////////////////////
const basePerformance = {
  isSmall: false,
  speedTakeoff: 155,
  speedMin: 180,
  speedLanding: 135,
  speedMax: 450,
  speedDeltaPerMs: 2,
  speedRatePerMs: 0.012,
  altitudeRatePerMs: 0.04,
  turnRateRadPerMs: 0.00005,
  wake: WakeRating.M,
  iconDefault: '/img/plane-icon/A380-white.png',
  iconSelected: '/img/plane-icon/A380-green.png',
  iconConflict: '/img/plane-icon/A380-red.png',
  iconLanding: '/img/plane-icon/A380-yellow.png',
};
const basePerformanceSmall = {
  isSmall: true,
  speedRatePerMs: 0.009,
};

const performanceByAirframe = {
  A320: { ...basePerformance, type: 'A320', wake: WakeRating.M },
  A333: { ...basePerformance, type: 'A333', wake: WakeRating.H },
  B763: { ...basePerformance, type: 'B763', wake: WakeRating.H },
  B77W: { ...basePerformance, type: 'B77W', wake: WakeRating.H },
  A388: { ...basePerformance, type: 'A388', wake: WakeRating.J },
};