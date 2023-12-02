import { ScreenSizes } from "../utils";

export const flightStripQueue = size => {
  if(size === ScreenSizes.Small) {
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
}

export const controlPanelTakeoff = size => {
  if(size === ScreenSizes.Small) {
    return {
      size,
      top: 618,
      left: 686,
      width: 64,
      height: 28,
    };
  }

  return {
    size,
    top: 816,
    left: 956,
    width: 80,
    height: 40,
  };
}

export const controlPanelHolding = size => {
  if(size === ScreenSizes.Small) {
    return {
      size,
      top: 618,
      left: 742,
      width: 42,
      height: 28,
    };
  }

  return {
    size,
    top: 816,
    left: 1022,
    width: 53,
    height: 40,
  };
}

export const controlPanelLanding = size => {
  if(size === ScreenSizes.Small) {
    return {
      size,
      top: 618,
      left: 686,
      width: 42,
      height: 28,
    };
  }

  return {
    size,
    top: 816,
    left: 956,
    width: 53,
    height: 40,
  };
}

export const controlPanelAltitude = size => {
  if(size === ScreenSizes.Small) {
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
}

export const controlPanelHeading = size => {
  if(size === ScreenSizes.Small) {
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
}

export const flightStripFirst = size => {
  if(size === ScreenSizes.Small) {
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
}

export const flightStripSecondWaypoint = size => {
  if(size === ScreenSizes.Small) {
    return {
      size,
      top: 144,
      left: 1090,
      width: 58,
      height: 28,
    };
  }

  return {
    size,
    top: 174,
    left: 1436,
    width: 68,
    height: 36,
  };
}

export const flightStripSecond = size => {
  if(size === ScreenSizes.Small) {
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
}
