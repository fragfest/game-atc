export const MaydayScenario = Object.freeze({
  Level9Fire: 'Level9Fire',
});

export const getMaydayLevels = () => [9];

export const getMaydayInfo = (scenario) => {
  if (scenario === MaydayScenario.Level9Fire) {
    return {
      title: 'engine fire',
      action: 'land immediately',
      detail1: 'Unable to gain speed/altitude',
      detail2: 'Flight controls degraded',
      progressTitle: 'Flight controls',
    };
  }

  return {
    title: 'EMERGENCY',
    action: 'land now',
    detail1: '',
    detail2: '',
    progressTitle: '',
  };
};

export const getMaydayAirframe = (scenario, airframeObj, fraction) => {
  let turn = 1;
  let altGain = 1;
  let altDrop = 1;
  let speedGain = 1;
  let speedDrop = 1;

  if (scenario === MaydayScenario.Level9Fire) {
    altGain = 0;
    speedGain = 0;

    if (fraction <= 0.01) {
      turn = 0.3;
    } else if (fraction < 0.2) {
      turn = 0.6;
    } else if (fraction < 0.5) {
      turn = 0.7;
    } else if (fraction < 1) {
      turn = 0.8;
    }

    return {
      turnRateRadPerMs: airframeObj.turnRateRadPerMs * turn,
      gain: {
        altitudeRatePerMs: airframeObj.altitudeRatePerMs * altGain,
        speedDeltaPerMs: airframeObj.speedDeltaPerMs * speedGain,
      },
      drop: {
        altitudeRatePerMs: airframeObj.altitudeRatePerMs * altDrop,
        speedDeltaPerMs: airframeObj.speedDeltaPerMs * speedDrop,
      },
    };
  }

  return {
    turnRateRadPerMs: airframeObj.turnRateRadPerMs,
    gain: {
      altitudeRatePerMs: airframeObj.altitudeRatePerMs,
      speedDeltaPerMs: airframeObj.speedDeltaPerMs,
    },
    drop: {
      altitudeRatePerMs: airframeObj.altitudeRatePerMs,
      speedDeltaPerMs: airframeObj.speedDeltaPerMs,
    },
  };
};
