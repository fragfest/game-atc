import { ScreenSizes } from '../utils';

export const scorePanel = (size) => {
  if (size === ScreenSizes.Small) {
    return {
      size,
      top: 640,
      left: 312,
      width: 320,
      height: 72,
    };
  }

  return {
    size,
    top: 858,
    left: 580,
    width: 320,
    height: 90,
  };
};

export const flightStripQueue = (size) => {
  if (size === ScreenSizes.Small) {
    return {
      size,
      top: 0,
      left: 1018,
      width: 279,
      height: 60,
    };
  }

  return {
    size,
    top: 0,
    left: 1346,
    width: 362,
    height: 78,
  };
};

export const controlPanelTakeoff = (size) => {
  if (size === ScreenSizes.Small) {
    return {
      size,
      top: 610,
      left: 679,
      width: 64,
      height: 28,
    };
  }

  return {
    size,
    top: 808,
    left: 948,
    width: 80,
    height: 40,
  };
};

export const controlPanelHolding = (size) => {
  if (size === ScreenSizes.Small) {
    return {
      size,
      top: 610,
      left: 734,
      width: 42,
      height: 28,
    };
  }

  return {
    size,
    top: 808,
    left: 1014,
    width: 53,
    height: 40,
  };
};

export const controlPanelLanding = (size) => {
  if (size === ScreenSizes.Small) {
    return {
      size,
      top: 610,
      left: 679,
      width: 42,
      height: 28,
    };
  }

  return {
    size,
    top: 808,
    left: 949,
    width: 53,
    height: 40,
  };
};

export const controlPanelAltitude = (size) => {
  if (size === ScreenSizes.Small) {
    return {
      size,
      top: 694,
      left: 877,
      width: 30,
      height: 20,
    };
  }

  return {
    size,
    top: 910,
    left: 1182,
    width: 38,
    height: 26,
  };
};

export const controlPanelHeading = (size) => {
  if (size === ScreenSizes.Small) {
    return {
      size,
      top: 653,
      left: 877,
      width: 30,
      height: 20,
    };
  }

  return {
    size,
    top: 863,
    left: 1182,
    width: 38,
    height: 26,
  };
};

export const flightStripFirst = (size) => {
  if (size === ScreenSizes.Small) {
    return {
      size,
      top: 72,
      left: 1018,
      width: 279,
      height: 52,
    };
  }

  return {
    size,
    top: 86,
    left: 1346,
    width: 362,
    height: 70,
  };
};

export const flightStripThirdWaypoint = (size) => {
  if (size === ScreenSizes.Small) {
    return {
      size,
      top: 201,
      left: 1090,
      width: 58,
      height: 28,
    };
  }

  return {
    size,
    top: 245,
    left: 1436,
    width: 68,
    height: 36,
  };
};

export const flightStripSecond = (size) => {
  if (size === ScreenSizes.Small) {
    return {
      size,
      top: 129,
      left: 1018,
      width: 279,
      height: 52,
    };
  }

  return {
    size,
    top: 157,
    left: 1346,
    width: 362,
    height: 70,
  };
};

export const flightStripThird = (size) => {
  if (size === ScreenSizes.Small) {
    return {
      size,
      top: 186,
      left: 1018,
      width: 279,
      height: 52,
    };
  }

  return {
    size,
    top: 228,
    left: 1346,
    width: 362,
    height: 70,
  };
};
