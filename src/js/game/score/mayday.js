import { convHdgDegToThreeDigits, randMinMax } from '../../utils';

export const MaydayScenario = Object.freeze({
  Level9Fire: 'Level9Fire',
  Level15Decompress: 'Level15Decompress',
  Level20BirdStrike: 'Level20BirdStrike',
});

// NOTE to allow for crashes without failing level: check victory have >= 2 for goal: Failed
export const getMaydayLevels = () => [9, 15, 20, 25];

export const getCrashInfo = (scenario) => {
  if (scenario === MaydayScenario.Level9Fire) {
    return {
      title: 'engine fire',
      action: 'emergency landing',
      detail1: 'emergency landing initiated',
      detail2: 'rescue services en route',
      progressTitle: 'Flight controls',
    };
  }

  if (scenario === MaydayScenario.Level15Decompress) {
    return {
      title: 'cabin decompress',
      action: 'emergency descent',
      detail1: 'emergency landing initiated',
      detail2: 'rescue services en route',
      progressTitle: 'Flight controls',
    };
  }

  if (scenario === MaydayScenario.Level20BirdStrike) {
    return {
      title: 'bird strike',
      action: 'land immediately',
      detail1: 'emergency landing initiated',
      detail2: 'rescue services en route',
      progressTitle: 'Engine power',
    };
  }

  return {
    title: 'EMERGENCY',
    action: 'emergency landing',
    detail1: '',
    detail2: '',
    progressTitle: '',
  };
};

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

  if (scenario === MaydayScenario.Level15Decompress) {
    return {
      title: 'cabin decompress',
      action: 'descend & land',
      detail1: 'Emergency descent to 9,000 ft',
      detail2: 'Flight controls degraded',
      progressTitle: 'Flight controls',
    };
  }

  if (scenario === MaydayScenario.Level20BirdStrike) {
    return {
      title: 'bird strike',
      action: 'land immediately',
      detail1: 'Engine failure: climbing degraded',
      detail2: 'Engine power failing',
      progressTitle: 'Engine power',
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

/**
 * @param {MaydayScenario} maydayScenario
 * @param {Number} width
 * @param {Number} height
 */
export const createPositionMayday = (maydayScenario, width, height) => {
  if (maydayScenario === MaydayScenario.Level9Fire) {
    return {
      x: width / 2,
      y: 0 * height,
      heading: convHdgDegToThreeDigits(randMinMax(240, 120)),
      altitude: altMinMax(11000, 13000),
      speed: spdMinMax(280, 320),
      time: 6 * 60,
    };
  }

  if (maydayScenario === MaydayScenario.Level15Decompress) {
    return {
      x: 0.2 * width,
      y: height / 2,
      heading: convHdgDegToThreeDigits(randMinMax(30, 150)),
      altitude: altMinMax(22000, 24000),
      speed: spdMinMax(280, 320),
      time: 10 * 60,
    };
  }

  if (maydayScenario === MaydayScenario.Level20BirdStrike) {
    return {
      time: 7 * 60,
      delayTime: 30,
    };
  }

  return {};
};

/**
 *
 * @param {MaydayScenario} scenario
 * @param {Object} airframeObj
 * @param {Number} airframeObj.turnRateRadPerMs
 * @param {Number} airframeObj.altitudeRatePerMs
 * @param {Number} airframeObj.speedDeltaPerMs
 * @param {Number} fraction fraction of time remaining before time = 0
 * @param {Number} speed current speed
 * @param {Number} alt current altitude
 * @param {Number} altitudeTarget non-mayday expected target
 * @returns
 */
export const getMaydayPerformance = (
  scenario,
  airframeObj,
  fraction,
  speed,
  alt,
  altitudeTargetArg
) => {
  let turn = 1;
  let altGain = 1;
  let altDrop = 1;
  let speedGain = 1;
  let speedDrop = 1;
  let altitudeTarget = altitudeTargetArg;

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
      altitudeTarget,
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

  if (scenario === MaydayScenario.Level15Decompress) {
    altGain = 1;
    altDrop = 1;

    if (alt > 9000) {
      altGain = 0;
      altDrop = 2;
    }
    if (altitudeTarget > 9000) {
      altitudeTarget = 9000;
    }

    if (fraction <= 0.01) {
      turn = 0.7;
    } else if (fraction < 0.2) {
      turn = 0.8;
    } else if (fraction < 1) {
      turn = 0.9;
    }

    return {
      altitudeTarget,
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

  if (scenario === MaydayScenario.Level20BirdStrike) {
    altGain = 0.1;
    turn = 0.9;
    speedGain = 0.1;

    return {
      altitudeTarget,
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
    altitudeTarget,
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

// PRIVATE ///////////////////////////////////////////////////////////////////////////
const altMinMax = (min, max) => Math.floor(randMinMax(min, max) / 100) * 100;
const spdMinMax = (min, max) => Math.floor(randMinMax(min, max) / 5) * 5;
