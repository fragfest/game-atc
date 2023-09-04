import { ScreenSizes } from "../utils";


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
      top: 70,
      left: 1018,
      width: 279,
      height: 60,
    };
  }

  return {
    size,
    top: 82,
    left: 1346,
    width: 362,
    height: 78,
  };
}
