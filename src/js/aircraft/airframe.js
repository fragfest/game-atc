export const getPerformance = (airframe) => {
  const performance = performanceByAirframe[airframe];
  if (!performance) return performanceByAirframe['A320'];
  return performance;
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
  speedMin: 180,
  speedLanding: 135,
  speedMax: 450,
  speedDeltaPerMs: 0.0015,
  speedRatePerMs: 0.02, // TODO consider changing based on screenSize
  altitudeRatePerMs: 0.025,
  turnRateRadPerMs: 0.00005,
  wake: WakeRating.M,
};

const performanceByAirframe = {
  A320: { ...basePerformance, wake: WakeRating.M },
  A333: { ...basePerformance, wake: WakeRating.H },
  B763: { ...basePerformance, wake: WakeRating.H },
  B77W: { ...basePerformance, wake: WakeRating.H },
  A388: { ...basePerformance, wake: WakeRating.J },
};