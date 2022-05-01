export const getPerformance = (airframe) => {
  const performance = airframes[airframe];
  if (!performance) return airframes['A320'];
  return performance;
}

////////////// PRIVATE //////////////////////////////////////
const airframes = {
  A320: {
    speedMin: 180,
    speedLanding: 135,
    speedMax: 450,
    speedDeltaPerMs: 0.0015,
    speedRatePerMs: 0.0005,
    altitudeRatePerMs: 0.025,
    turnRateRadPerMs: 0.0001,
    wake: 'M',
  }
};