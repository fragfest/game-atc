import { ScreenSizes } from '../utils';
import { getScreenSize } from './scale';

export const taxiQueueFlightstrip = () => {
  const size = getScreenSize();

  if (size === ScreenSizes.Small) {
    return {
      size,
      top: 20,
      left: 1308,
      width: 20,
      height: 24,
    };
  }

  return {
    size,
    top: 22,
    left: 1718,
    width: 23,
    height: 30,
  };
};
