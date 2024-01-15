import { ScreenSizes } from '../utils';
import { getScreenSize } from './scale';

export const taxiQueueFlightstrip = () => {
  const size = getScreenSize();

  if (size === ScreenSizes.Small) {
    return {
      size,
      top: 20,
      left: 1310,
      width: 16,
      height: 22,
    };
  }

  return {
    size,
    top: 24,
    left: 1720,
    width: 19,
    height: 27,
  };
};
