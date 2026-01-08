// import { getLevelObj } from '../levels/levels';
import { getLevelObj } from '../levels/getLevel';
import { isAirborne } from '../types';
import { getScreenSize, ScreenSizes, isWithinDist } from '../utils';

export const WeatherType = Object.freeze({
  Inert: 'Inert',
  Turbulence: 'Turbulence',
});
export const isTurbulence = (obj) => obj.weatherType === WeatherType.Turbulence;

/**
 * @typedef {Function} WeatherFunc
 * @param {Object} args weatherArgs
 * @param {Number} args.width
 * @param {Number} args.height
 * @param {Object} args.ctx
 * @param {Object} args.entityDiv
 * @param {Array} args.entityManagerArr
 */

/**
 * @param {Number} width
 * @param {Number} height
 * @param {Object} args
 * @param {Array} args.entityManagerArr
 * @param {Object} args.weatherLayerObj canvas object
 * @param {Object} args.entityDiv HtmlElement
 */
export const weatherGameLoop = (width, height, args) => {
  const weatherArgs = {
    width,
    height,
    ctx: args.weatherLayerObj.ctx,
    entityDiv: args.entityDiv,
    entityManagerArr: args.entityManagerArr,
  };
  getLevelObj().weatherFn(weatherArgs);
  window.requestAnimationFrame(tick(width, height, args));
};

const tick = (width, height, args) => () => {
  args.weatherLayerObj.ctx.clearRect(0, 0, width, height);
  updateWeather(args.entityManagerArr);
  window.requestAnimationFrame(tick(width, height, args));
};

const updateWeather = (entityManagerArr) => {
  const weatherArr = entityManagerArr.filter((x) => x.updateWeatherFn);
  weatherArr.forEach((weather) => {
    weather.updateWeatherFn();
  });
};

////////////////////////////////////////////////////////////////////////
// HELPER FUNCS
////////////////////////////////////////////////////////////////////////

export const isCloseToWeather = (entityObj) => (weatherEntity) => {
  const weatherObjXY = {
    x: weatherEntity?.centerXY?.x,
    y: weatherEntity?.centerXY?.y,
  };

  const isWithinWeatherDist = isWithinDist(
    (weatherEntity?.radius || 0) * 2,
    entityObj,
    weatherObjXY
  );
  return isTurbulence(weatherEntity) && isWithinWeatherDist;
};

export const isInWeather = (entityObj) => (weatherEntity) => {
  const weatherObjXY = {
    x: weatherEntity?.centerXY?.x,
    y: weatherEntity?.centerXY?.y,
  };
  return (
    isAirborne(entityObj) &&
    isTurbulence(weatherEntity) &&
    isWithinDist(weatherEntity.radius, entityObj, weatherObjXY)
  );
};

export const getAllTurbulenceLevels = () => [
  5, 6, 9, 11, 14, 16, 20, 24, 25, 26,
];

////////////////////////////////////////////////////////////////////////
// LEVELS
////////////////////////////////////////////////////////////////////////
/**
 * @param {Number} gameLevel
 * @returns {WeatherFunc}
 */
export const getWeatherLevelByGameLevel = (gameLevel) => {
  const weatherFn = ({ width, height, ctx, entityDiv, entityManagerArr }) => {
    const weatherArgs = {
      width,
      height,
      ctx,
      entityDiv,
      entityManagerArr,
    };

    // LHR
    if (gameLevel === 1) return level1(weatherArgs);
    if (gameLevel === 2) return level2(weatherArgs);
    if (gameLevel === 3) return level3(weatherArgs);
    if (gameLevel === 4) return level4(weatherArgs);
    if (gameLevel === 5) {
      level5(weatherArgs);
      turbulenceLight1(weatherArgs);
      return;
    }
    if (gameLevel === 6) {
      level6(weatherArgs);
      turbulenceHeavy1(weatherArgs);
      return;
    }

    // JFK
    if (gameLevel === 7) return level7(weatherArgs);
    if (gameLevel === 8) return level8(weatherArgs);
    if (gameLevel === 9) {
      level1(weatherArgs);
      turbulenceLight2(weatherArgs);
      return;
    }
    if (gameLevel === 10) return level2(weatherArgs);
    if (gameLevel === 11) {
      level3(weatherArgs);
      turbulenceHeavy2(weatherArgs);
      return;
    }

    // HND
    if (gameLevel === 12) return level4(weatherArgs);
    if (gameLevel === 13) return level5(weatherArgs);
    if (gameLevel === 14) {
      level6(weatherArgs);
      turbulenceLight3(weatherArgs);
      return;
    }
    if (gameLevel === 15) return level6(weatherArgs);
    if (gameLevel === 16) {
      level7(weatherArgs);
      turbulenceHeavy3(weatherArgs);
      return;
    }

    // AMS
    if (gameLevel === 17) return level8(weatherArgs);
    if (gameLevel === 18) return level1(weatherArgs);
    if (gameLevel === 19) return level3(weatherArgs);
    if (gameLevel === 20) {
      level4(weatherArgs);
      turbulenceVeryLight1(weatherArgs);
      return;
    }
    if (gameLevel === 21) return level5(weatherArgs);

    // YVR
    if (gameLevel === 22) return level6(weatherArgs);
    if (gameLevel === 23) return level7(weatherArgs);
    if (gameLevel === 24) {
      level8(weatherArgs);
      turbulenceVeryLight2(weatherArgs);
      return;
    }
    if (gameLevel === 25) {
      level1(weatherArgs);
      turbulenceVeryLight3(weatherArgs);
      return;
    }
    if (gameLevel === 26) {
      level3(weatherArgs);
      turbulenceHeavy4(weatherArgs);
      return;
    }

    throw new Error('unknown level: ' + gameLevel);
  };
  return weatherFn;
};

////////////////////////////////////////////////////////////////////////
// PRIVATE
////////////////////////////////////////////////////////////////////////

const turbulenceHeavy4 = (weatherArgs) => {
  const { width, height } = weatherArgs;

  const leftNorth = addTurbulence(weatherArgs, createLargeRain1, hover);
  leftNorth({
    x: 0.22 * width,
    y: -0.05 * height,
    radius: width / 12,
  });
  const leftMiddle1 = addTurbulence(weatherArgs, createLargeRain2, hover);
  leftMiddle1({
    x: 0.15 * width,
    y: 0.22 * height,
    radius: width / 12,
  });
  const leftSmall1 = addTurbulence(weatherArgs, createLargeRain1, hover);
  leftSmall1({
    x: 0.1 * width,
    y: 0.45 * height,
    radius: width / 22,
  });
  const leftSmall2 = addTurbulence(weatherArgs, createLargeRain2, hover);
  leftSmall2({
    x: 0.1 * width,
    y: 0.7 * height,
    radius: width / 22,
  });
  const leftSmall3 = addTurbulence(weatherArgs, createLargeRain1, hover);
  leftSmall3({
    x: 0.3 * width,
    y: 0.65 * height,
    radius: width / 22,
  });
  const leftSmall4 = addTurbulence(weatherArgs, createLargeRain2, hover);
  leftSmall4({
    x: 0.45 * width,
    y: 0.85 * height,
    radius: width / 20,
  });
  const centre1 = addTurbulence(weatherArgs, createLargeRain1, hover);
  centre1({
    x: 0.58 * width,
    y: 0.36 * height,
    radius: width / 14,
  });
  const centre2 = addTurbulence(weatherArgs, createLargeRain2, hover);
  centre2({
    x: 0.45 * width,
    y: 0.25 * height,
    radius: width / 18,
  });
  const centre3 = addTurbulence(weatherArgs, createLargeRain1, hover);
  centre3({
    x: 0.71 * width,
    y: 0.37 * height,
    radius: width / 18,
  });
  const rightSmall1 = addTurbulence(weatherArgs, createLargeRain1, hover);
  rightSmall1({
    x: 0.9 * width,
    y: 0.25 * height,
    radius: width / 22,
  });
  const rightSmall2 = addTurbulence(weatherArgs, createLargeRain2, hover);
  rightSmall2({
    x: 0.85 * width,
    y: 0.45 * height,
    radius: width / 24,
  });
};

const turbulenceHeavy3 = (weatherArgs) => {
  const { width, height } = weatherArgs;

  const LeftNorth = addTurbulence(weatherArgs, createLargeRain1, hover);
  LeftNorth({
    x: 0.22 * width,
    y: 0.02 * height,
    radius: width / 18,
  });
  const LeftMiddle = addTurbulence(weatherArgs, createLargeRain2, hover);
  LeftMiddle({
    x: 0.2 * width,
    y: 0.35 * height,
    radius: width / 12,
  });
  const middleNorthTop = addTurbulence(weatherArgs, createLargeRain1, hover);
  middleNorthTop({
    x: 0.62 * width,
    y: 0.02 * height,
    radius: width / 22,
  });
  const middleNorthSmall = addTurbulence(weatherArgs, createLargeRain2, hover);
  middleNorthSmall({
    x: 0.63 * width,
    y: 0.12 * height,
    radius: width / 18,
  });
  const middleSouthSmall = addTurbulence(weatherArgs, createLargeRain2, hover);
  middleSouthSmall({
    x: 0.65 * width,
    y: 0.6 * height,
    radius: width / 20,
  });
  const middleSouthMed = addTurbulence(weatherArgs, createLargeRain1, hover);
  middleSouthMed({
    x: 0.6 * width,
    y: 0.75 * height,
    radius: width / 13,
  });
};

const turbulenceHeavy2 = (weatherArgs) => {
  const { width, height } = weatherArgs;
  const rainLargeLeft = addTurbulence(weatherArgs, createLargeRain2, driftESE);
  rainLargeLeft({
    x: 0 * width,
    y: 0.1 * height,
    radius: width / 12,
  });
  const rainSmallLeft = addTurbulence(weatherArgs, createLargeRain1, driftESE);
  rainSmallLeft({
    x: -0.05 * width,
    y: 0.25 * height,
    radius: width / 12,
  });
  const rainMidLeft = addTurbulence(weatherArgs, createLargeRain1, hover);
  rainMidLeft({
    x: 0.42 * width,
    y: 0.42 * height,
    radius: width / 9,
  });
};

const turbulenceHeavy1 = (weatherArgs) => {
  const { width, height } = weatherArgs;
  const rainNorth1 = addTurbulence(weatherArgs, createLargeRain1, driftE);
  rainNorth1({
    x: 0.37 * width,
    y: 0 * height,
    radius: width / 13,
  });
  const rainNorth2 = addTurbulence(weatherArgs, createLargeRain2, driftE);
  rainNorth2({
    x: 0.4 * width,
    y: 0.22 * height,
    radius: width / 13,
  });
  const rainSouth1 = addTurbulence(weatherArgs, createLargeRain1, hover);
  rainSouth1({
    x: 0.37 * width,
    y: 0.75 * height,
    radius: width / 14,
  });
  const rainSouth2 = addTurbulence(weatherArgs, createLargeRain2, hover);
  rainSouth2({
    x: 0.42 * width,
    y: 0.6 * height,
    radius: width / 14,
  });
};

const turbulenceLight3 = (weatherArgs) => {
  const { width, height } = weatherArgs;
  const rainMid = addTurbulence(weatherArgs, createLargeRain1, hover);
  rainMid({
    x: 0.3 * width,
    y: 0.4 * height,
    radius: width / 12,
  });
  const rainDriftOnApproach = addTurbulence(
    weatherArgs,
    createLargeRain2,
    driftESE
  );
  rainDriftOnApproach({
    x: 0.5 * width,
    y: 0.3 * height,
    radius: width / 16,
  });
};

const turbulenceLight2 = (weatherArgs) => {
  const { width, height } = weatherArgs;
  const rainMiddleLarge = addTurbulence(weatherArgs, createLargeRain1, hover);
  rainMiddleLarge({
    x: 0.3 * width,
    y: 0.45 * height,
    radius: width / 12,
  });
  const rainMiddleSmall = addTurbulence(weatherArgs, createLargeRain1, hover);
  rainMiddleSmall({
    x: 0.4 * width,
    y: 0.4 * height,
    radius: width / 12,
  });
};

const turbulenceLight1 = (weatherArgs) => {
  const { width, height } = weatherArgs;
  const rainOnDeparture = addTurbulence(weatherArgs, createLargeRain1, hover);
  rainOnDeparture({
    x: 0.03 * width,
    y: 0.45 * height,
    radius: width / 14,
  });
  const rainDriftOnApproach = addTurbulence(
    weatherArgs,
    createLargeRain2,
    driftESE
  );
  rainDriftOnApproach({
    x: 0.5 * width,
    y: 0.3 * height,
    radius: width / 16,
  });
};

const turbulenceVeryLight3 = (weatherArgs) => {
  const { width, height } = weatherArgs;
  const rainOnDeparture = addTurbulence(weatherArgs, createLargeRain1, hover);
  rainOnDeparture({
    x: 0.85 * width,
    y: 0.4 * height,
    radius: width / 14,
  });
};

const turbulenceVeryLight2 = (weatherArgs) => {
  const { width, height } = weatherArgs;
  const rainOnDeparture = addTurbulence(weatherArgs, createLargeRain2, driftE);
  rainOnDeparture({
    x: 0.15 * width,
    y: 0.65 * height,
    radius: width / 16,
  });
};

const turbulenceVeryLight1 = (weatherArgs) => {
  const { width, height } = weatherArgs;
  const rainOnDeparture = addTurbulence(
    weatherArgs,
    createLargeRain1,
    driftENE
  );
  rainOnDeparture({
    x: 0.35 * width,
    y: 0.65 * height,
    radius: width / 16,
  });
};

const level1 = (weatherArgs) => {
  const { width, height } = weatherArgs;
  const create = createOneSmallCloud;

  const cloud1 = addInert(weatherArgs, createTwoSmallClouds, driftESE);
  const cloud2 = addInert(weatherArgs, create(CloudType.LightHazeOne), hover);
  const cloud3 = addInert(weatherArgs, create(CloudType.LightHazeTwo), hover);
  const cloud4 = addInert(weatherArgs, create(CloudType.LargeHaze), hover);
  const cloud5 = addInert(weatherArgs, create(CloudType.MediumRain), hover);

  cloud1({ x: 0.05 * width, y: 0.05 * height, radius: width / 14 });
  cloud2({ x: 0.2 * width, y: 0.4 * height, radius: width / 14 });
  cloud3({ x: 0.1 * width, y: 0.7 * height, radius: width / 14 });
  cloud4({ x: 0.8 * width, y: 0.5 * height, radius: width / 14 });
  cloud5({ x: 0.7 * width, y: 0.1 * height, radius: width / 14 });
};

const level2 = (weatherArgs) => {
  const { width, height } = weatherArgs;
  const create = createOneSmallCloud;

  const cloud1 = addInert(
    weatherArgs,
    create(CloudType.LightHazeOne),
    driftESE
  );
  const cloud2 = addInert(
    weatherArgs,
    create(CloudType.LightHazeOne),
    driftESE
  );
  const cloud3 = addInert(weatherArgs, create(CloudType.LightHazeOne), hover);
  const cloud4 = addInert(weatherArgs, create(CloudType.LightHazeOne), hover);
  const cloud5 = addInert(weatherArgs, create(CloudType.MediumHaze), hover);
  const cloud6 = addInert(weatherArgs, create(CloudType.MediumHaze), hover);
  const cloud7 = addInert(weatherArgs, create(CloudType.LightHazeOne), hover);
  const cloud8 = addInert(weatherArgs, create(CloudType.LightHazeOne), hover);

  cloud1({ x: 0.1 * width, y: 0.1 * height, radius: width / 14 });
  cloud2({ x: 0.5 * width, y: 0.02 * height, radius: width / 14 });
  cloud3({ x: 0.7 * width, y: 0.8 * height, radius: width / 14 });
  cloud4({ x: 0.75 * width, y: 0.83 * height, radius: width / 14 });
  cloud5({ x: 0.78 * width, y: 0.4 * height, radius: width / 14 });
  cloud6({ x: 0.72 * width, y: 0.35 * height, radius: width / 14 });
  cloud7({ x: 0.75 * width, y: 0.36 * height, radius: width / 14 });
  cloud8({ x: 0.73 * width, y: 0.45 * height, radius: width / 14 });
};

const level3 = (weatherArgs) => {
  const { width, height } = weatherArgs;
  const create = createOneSmallCloud;

  const cloud1 = addInert(weatherArgs, create(CloudType.LargeRain), driftESE);
  const cloud2 = addInert(
    weatherArgs,
    create(CloudType.LargeScattered),
    driftE
  );
  const cloud3 = addInert(weatherArgs, create(CloudType.LightHazeOne), hover);
  const cloud4 = addInert(weatherArgs, create(CloudType.LightHazeOne), hover);
  const cloud5 = addInert(weatherArgs, create(CloudType.LightHazeOne), hover);
  const cloud6 = addInert(weatherArgs, create(CloudType.LightHazeOne), hover);
  const cloud7 = addInert(weatherArgs, create(CloudType.MediumHaze), hover);

  cloud1({ x: 0.05 * width, y: 0.2 * height, radius: width / 14 });
  cloud2({ x: -0.1 * width, y: 0.5 * height, radius: width / 14 });
  cloud3({ x: 0.55 * width, y: 0.1 * height, radius: width / 14 });
  cloud4({ x: 0.65 * width, y: 0.02 * height, radius: width / 14 });
  cloud5({ x: 0.7 * width, y: -0.01 * height, radius: width / 14 });
  cloud6({ x: 0.8 * width, y: 0.07 * height, radius: width / 14 });
  cloud7({ x: 0.7 * width, y: 0.8 * height, radius: width / 14 });
};

const level4 = (weatherArgs) => {
  const { width, height } = weatherArgs;
  const create = createOneSmallCloud;

  const cloud1 = addInert(weatherArgs, create(CloudType.LightHazeOne), driftE);
  const cloud2 = addInert(weatherArgs, create(CloudType.LightHazeOne), driftE);
  const cloud3 = addInert(weatherArgs, create(CloudType.LightHazeOne), driftE);
  const cloud4 = addInert(weatherArgs, create(CloudType.LightHazeTwo), hover);
  const cloud5 = addInert(weatherArgs, create(CloudType.MediumHaze), hover);
  const cloud6 = addInert(weatherArgs, create(CloudType.LargeHaze), hover);
  const cloud7 = addInert(weatherArgs, create(CloudType.MediumHaze), hover);

  cloud1({ x: 0.05 * width, y: 0.4 * height, radius: width / 14 });
  cloud2({ x: 0.1 * width, y: 0.43 * height, radius: width / 14 });
  cloud3({ x: 0.05 * width, y: 0.48 * height, radius: width / 14 });
  cloud4({ x: 0.5 * width, y: 0.1 * height, radius: width / 14 });
  cloud5({ x: 0.55 * width, y: 0.12 * height, radius: width / 14 });
  cloud6({ x: 0.6 * width, y: 0.08 * height, radius: width / 14 });
  cloud7({ x: 0.8 * width, y: 0.75 * height, radius: width / 14 });
};

const level5 = (weatherArgs) => {
  const { width, height } = weatherArgs;
  const create = createOneSmallCloud;

  const cloud1 = addInert(weatherArgs, create(CloudType.LightHazeOne), hover);
  const cloud2 = addInert(weatherArgs, create(CloudType.LightHazeOne), hover);
  const cloud3 = addInert(weatherArgs, create(CloudType.LightHazeOne), hover);
  const cloud4 = addInert(weatherArgs, create(CloudType.LightHazeOne), hover);
  const cloud5 = addInert(weatherArgs, create(CloudType.LightHazeTwo), hover);
  const cloud6 = addInert(weatherArgs, create(CloudType.MediumHaze), hover);
  const cloud7 = addInert(weatherArgs, create(CloudType.LargeHaze), hover);

  cloud1({ x: 0.6 * width, y: 0.8 * height, radius: width / 14 });
  cloud2({ x: 0.65 * width, y: 0.83 * height, radius: width / 14 });
  cloud3({ x: 0.75 * width, y: 0.1 * height, radius: width / 14 });
  cloud4({ x: 0.8 * width, y: 0.1 * height, radius: width / 14 });
  cloud5({ x: 0.2 * width, y: 0 * height, radius: width / 14 });
  cloud6({ x: -0.1 * width, y: 0.1 * height, radius: width / 14 });
  cloud7({ x: -0.27 * width, y: 0.6 * height, radius: width / 6 });
};

const level6 = (weatherArgs) => {
  const { width, height } = weatherArgs;
  const create = createOneSmallCloud;

  const cloud1 = addInert(weatherArgs, create(CloudType.LightHazeOne), hover);
  const cloud2 = addInert(weatherArgs, create(CloudType.LightHazeOne), hover);
  const cloud3 = addInert(weatherArgs, create(CloudType.LightHazeOne), hover);
  const cloud4 = addInert(weatherArgs, create(CloudType.LightHazeOne), hover);
  const cloud5 = addInert(weatherArgs, create(CloudType.LightHazeTwo), hover);
  const cloud6 = addInert(weatherArgs, create(CloudType.MediumHaze), hover);
  const cloud7 = addInert(weatherArgs, create(CloudType.MediumHaze), hover);

  cloud1({ x: -0.05 * width, y: 0.55 * height, radius: width / 10 });
  cloud2({ x: 0.1 * width, y: 0.5 * height, radius: width / 11 });
  cloud3({ x: 0.14 * width, y: 0.62 * height, radius: width / 10.5 });
  cloud4({ x: 0.08 * width, y: 0.66 * height, radius: width / 10.5 });
  cloud5({ x: 0.15 * width, y: 0.05 * height, radius: width / 15 });
  cloud6({ x: 0.22 * width, y: 0.021 * height, radius: width / 15 });
  cloud7({ x: 0.75 * width, y: 0.8 * height, radius: width / 18 });
};

const level7 = (args) => {
  const { width, height } = args;
  const create = createOneSmallCloud;

  const cloud1 = addInert(args, createTwoSmallClouds, driftENE);
  const cloud2 = addInert(args, create(CloudType.LightHazeOne), driftENE);
  const cloud3 = addInert(args, create(CloudType.LightHazeTwo), hover);
  const cloud4 = addInert(args, create(CloudType.LargeHaze), hover);
  const cloud5 = addInert(args, create(CloudType.MediumHaze), hover);
  const cloud6 = addInert(args, create(CloudType.LargeHaze), hover);
  const cloud7 = addInert(args, create(CloudType.LightHazeOne), hover);
  const cloud8 = addInert(args, create(CloudType.LightHazeTwo), hover);

  cloud1({ x: 0.25 * width, y: 0.43 * height, radius: width / 14 });
  cloud2({ x: 0.08 * width, y: 0.4 * height, radius: width / 8 });
  cloud3({ x: -0.1 * width, y: 0.1 * height, radius: width / 14 });
  cloud4({ x: -0.17 * width, y: 0.7 * height, radius: width / 10 });
  cloud5({ x: 0.63 * width, y: 0.79 * height, radius: width / 14 });
  cloud6({ x: 0.57 * width, y: 0.83 * height, radius: width / 14 });
  cloud7({ x: 0.3 * width, y: 0.75 * height, radius: width / 16 });
  cloud8({ x: 0.85 * width, y: 0.3 * height, radius: width / 22 });
};

const level8 = (args) => {
  const { width, height } = args;
  const create = createOneSmallCloud;

  const cloud1 = addInert(args, create(CloudType.MediumRain), driftE);
  const cloud2 = addInert(args, create(CloudType.LightHazeOne), driftE);
  const cloud3 = addInert(args, create(CloudType.LargeRain), hover);
  const cloud4 = addInert(args, create(CloudType.LargeHaze), hover);
  const cloud5 = addInert(args, create(CloudType.MediumRain), hover);
  const cloud6 = addInert(args, create(CloudType.MediumRain), hover);
  const cloud7 = addInert(args, create(CloudType.LightHazeTwo), hover);
  const cloud8 = addInert(args, create(CloudType.LightHazeOne), hover);
  const cloud9 = addInert(args, create(CloudType.LightHazeOne), hover);

  cloud1({ x: -0.05 * width, y: 0.43 * height, radius: width / 14 });
  cloud2({ x: -0.08 * width, y: 0.4 * height, radius: width / 8 });
  cloud3({ x: 0.4 * width, y: 0.3 * height, radius: width / 14 });
  cloud4({ x: 0.3 * width, y: 0.28 * height, radius: width / 10 });
  cloud5({ x: 0.8 * width, y: 0.5 * height, radius: width / 14 });
  cloud6({ x: 0.75 * width, y: 0.55 * height, radius: width / 14 });
  cloud7({ x: 0.7 * width, y: 0.9 * height, radius: width / 16 });
  cloud8({ x: 0.29 * width, y: 0.39 * height, radius: width / 16 });
  cloud9({ x: 0.35 * width, y: 0.25 * height, radius: width / 16 });
};

////////////////////////////////////////////////////////////////////////
// add weather systems
////////////////////////////////////////////////////////////////////////

const addInert =
  (
    { ctx, entityDiv, entityManagerArr, width, height },
    createWeatherFn,
    moveFn
  ) =>
  ({ x, y, radius }) => {
    const XY = { x, y };
    const centerXY = { x: x + radius, y: y + radius };

    const obj = createWeatherFn(ctx, entityDiv, x, y, radius * 2);
    const updateMoveFn = moveFn(width, height);

    const updateWeatherFn = () => {
      const diffXY = updateMoveFn(centerXY.x, centerXY.y);
      updateXY(diffXY, XY, centerXY, obj);
    };
    entityManagerArr.push(
      createWeatherEntity(WeatherType.Inert, centerXY, radius, updateWeatherFn)
    );
  };

const addTurbulence =
  (
    { ctx, entityDiv, entityManagerArr, width, height },
    createWeatherFn,
    moveFn
  ) =>
  ({ x, y, radius }) => {
    const XY = { x, y };
    const centerXY = { x: x + radius, y: y + radius };

    const obj = createWeatherFn(ctx, entityDiv, x, y, radius * 2);
    const updateMoveFn = moveFn(width, height);

    const updateWeatherFn = () => {
      const diffXY = updateMoveFn(centerXY.x, centerXY.y);
      updateXY(diffXY, XY, centerXY, obj);
      obj.drawCircleFn(XY.x, XY.y);
    };
    entityManagerArr.push(
      createWeatherEntity(
        WeatherType.Turbulence,
        centerXY,
        radius,
        updateWeatherFn
      )
    );
  };

const createWeatherEntity = (
  weatherType,
  centerXY,
  radius,
  updateWeatherFn
) => ({
  weatherType,
  centerXY,
  radius,
  updateWeatherFn,
});

const updateXY = (diffXY, XY, centerXY, obj) => {
  XY.x += diffXY.x;
  XY.y += diffXY.y;
  obj.weatherDiv.style.left = XY.x + 'px';
  obj.weatherDiv.style.top = XY.y + 'px';
  centerXY.x += diffXY.x;
  centerXY.y += diffXY.y;
};

////////////////////////////////////////////////////////////////////////
// create weather systems
////////////////////////////////////////////////////////////////////////

const createOneSmallCloud = (cloudType) => (ctx, div, x, y, width) => {
  const cloudSize = 0.35 * width;

  const weatherDiv = document.createElement('div');
  div.appendChild(weatherDiv);
  weatherDiv.style.position = 'absolute';
  weatherDiv.style.left = x + 'px';
  weatherDiv.style.top = y + 'px';
  weatherDiv.style.width = width + 'px';
  weatherDiv.style.height = width + 'px';
  addCloud(weatherDiv, 0.6 * width, 0.25 * width, cloudSize, cloudType);
  return { weatherDiv };
};

const createTwoSmallClouds = (ctx, div, x, y, width) => {
  const cloudSize = 0.35 * width;

  const weatherDiv = document.createElement('div');
  div.appendChild(weatherDiv);
  weatherDiv.style.position = 'absolute';
  weatherDiv.style.left = x + 'px';
  weatherDiv.style.top = y + 'px';
  weatherDiv.style.width = width + 'px';
  weatherDiv.style.height = width + 'px';

  addCloud(weatherDiv, 0 * width, 0 * width, cloudSize, CloudType.MediumHaze);
  addCloud(
    weatherDiv,
    0.6 * width,
    0.25 * width,
    cloudSize,
    CloudType.LightHazeOne
  );
  return { weatherDiv };
};

const createLargeRain2 = (ctx, div, x, y, width) => {
  const iconSize = width / 6;
  const cloudSize = 0.35 * width;

  const weatherDiv = document.createElement('div');
  div.appendChild(weatherDiv);
  weatherDiv.style.position = 'absolute';
  weatherDiv.style.left = x + 'px';
  weatherDiv.style.top = y + 'px';
  weatherDiv.style.width = width + 'px';
  weatherDiv.style.height = width + 'px';

  addIcon(weatherDiv, width, iconSize);
  addCloud(weatherDiv, 0.3 * width, 0 * width, cloudSize, CloudType.MediumHaze);
  addCloud(
    weatherDiv,
    0.25 * width,
    0.6 * width,
    cloudSize,
    CloudType.MediumHaze
  );
  addCloud(
    weatherDiv,
    0.4 * width,
    0.25 * width,
    cloudSize,
    CloudType.MediumRain
  );
  addCloud(
    weatherDiv,
    0 * width,
    0.15 * width,
    cloudSize,
    CloudType.MediumRain
  );
  addCloud(weatherDiv, 0 * width, 0.45 * width, cloudSize, CloudType.LargeRain);

  const drawCircleFn = (circleX, circleY) =>
    addRainCircle(ctx, circleX, circleY, width);

  drawCircleFn(x, y);

  return { weatherDiv, drawCircleFn };
};

const createLargeRain1 = (ctx, div, x, y, width) => {
  const iconSize = width / 6;
  const cloudSize = 0.35 * width;

  const weatherDiv = document.createElement('div');
  div.appendChild(weatherDiv);
  weatherDiv.style.position = 'absolute';
  weatherDiv.style.left = x + 'px';
  weatherDiv.style.top = y + 'px';
  weatherDiv.style.width = width + 'px';
  weatherDiv.style.height = width + 'px';

  addIcon(weatherDiv, width, iconSize);
  addCloud(weatherDiv, 0.11 * width, 0, cloudSize, CloudType.MediumHaze);
  addCloud(
    weatherDiv,
    0.14 * width,
    0.21 * width,
    cloudSize,
    CloudType.LargeRain
  );
  addCloud(weatherDiv, 0, 0.36 * width, cloudSize, CloudType.MediumRain);
  addCloud(
    weatherDiv,
    0.32 * width,
    0.5 * width,
    cloudSize,
    CloudType.MediumRain
  );
  addCloud(
    weatherDiv,
    -0.07 * width,
    0.75 * width,
    cloudSize,
    CloudType.LightHazeOne
  );

  const drawCircleFn = (circleX, circleY) =>
    addRainCircle(ctx, circleX, circleY, width);

  drawCircleFn(x, y);

  return { weatherDiv, drawCircleFn };
};

////////////////////////////////////////////////////////////////////////
// cloud movement
////////////////////////////////////////////////////////////////////////
// drift function names reference compass points

// eslint-disable-next-line
const hover = (width, height) => (x, y) => ({ x: 0, y: 0 });

const driftENE = (width, height) => (x, y) => {
  if (x > width + 100 || x < -100 || y > height + 100 || y < -100) {
    return { x: 0, y: 0 };
  }
  if (getScreenSize() === ScreenSizes.Large) return { x: 0.01, y: -0.005 };
  if (getScreenSize() === ScreenSizes.Small) return { x: 0.007, y: -0.0035 };
};

const driftESE = (width, height) => (x, y) => {
  if (x > width + 100 || x < -100 || y > height + 100 || y < -100) {
    return { x: 0, y: 0 };
  }
  if (getScreenSize() === ScreenSizes.Large) return { x: 0.01, y: 0.005 };
  if (getScreenSize() === ScreenSizes.Small) return { x: 0.007, y: 0.0035 };
};

const driftE = (width, height) => (x, y) => {
  if (x > width + 100 || x < -100 || y > height + 100 || y < -100) {
    return { x: 0, y: 0 };
  }
  if (getScreenSize() === ScreenSizes.Large) return { x: 0.01, y: 0 };
  if (getScreenSize() === ScreenSizes.Small) return { x: 0.007, y: 0 };
};

////////////////////////////////////////////////////////////////////////
// cloud components
////////////////////////////////////////////////////////////////////////

const CloudType = Object.freeze({
  LargeScattered: 'LargeScattered',
  LightHazeOne: 'LightHazeOne',
  LightHazeTwo: 'LightHazeTwo',
  MediumHaze: 'MediumHaze',
  LargeHaze: 'LargeHaze',
  MediumRain: 'MediumRain',
  LargeRain: 'LargeRain',
  ExtraLargeRain: 'ExtraLargeRain',
});

const addCloud = (div, x, y, height, cloudType) => {
  let src = 'cloud-two.png';
  let filter = 'blur(3px)';
  let opacity = 0.8;

  if (cloudType === CloudType.LargeScattered) {
    src = 'cloud-eight.png';
    height = 1.6 * height;
    opacity = 0.8;
  }
  if (cloudType === CloudType.LightHazeOne) {
    src = 'cloud-seven.png';
    height = 0.6 * height;
    opacity = 0.7;
  }
  if (cloudType === CloudType.LightHazeTwo) {
    src = 'cloud-one.png';
    opacity = 0.5;
  }
  if (cloudType === CloudType.MediumHaze) {
    src = 'cloud-three.png';
    opacity = 0.5;
  }
  if (cloudType === CloudType.LargeHaze) {
    src = 'cloud-four.png';
    opacity = 0.6;
  }
  if (cloudType === CloudType.MediumRain) {
    src = 'cloud-two.png';
    filter = 'blur(3px) brightness(0.7)';
    opacity = 0.8;
  }
  if (cloudType === CloudType.LargeRain) {
    src = 'cloud-five.png';
    filter = 'blur(3px) brightness(0.8)';
    opacity = 0.8;
  }
  if (cloudType === CloudType.ExtraLargeRain) {
    src = 'cloud-six.png';
    filter = '';
    opacity = 0.8;
  }

  const imgEl = new Image();
  div.appendChild(imgEl);
  imgEl.style.position = 'absolute';
  imgEl.style.left = x + 'px';
  imgEl.style.top = y + 'px';
  imgEl.src = '/img/weather/' + src;
  imgEl.height = height;
  imgEl.draggable = false;
  imgEl.style.opacity = opacity;
  imgEl.style.filter = filter;
  imgEl.style['z-index'] = -2;
};

const addIcon = (div, width, iconSize) => {
  const imgIconEl = new Image();
  div.appendChild(imgIconEl);
  imgIconEl.src = '/img/weather/rain.gif';
  imgIconEl.height = iconSize;
  imgIconEl.draggable = false;
  imgIconEl.style.opacity = 0.5;
  imgIconEl.style.position = 'absolute';
  imgIconEl.style.left = width / 2 - iconSize / 2 + 'px';
  imgIconEl.style.top = width / 2 - iconSize / 2 + 'px';
  imgIconEl.style['border-radius'] = '8px';
  imgIconEl.style['z-index'] = -1;
};

const addRainCircle = (ctx, x, y, width) => {
  const color = 255;
  const opacity = 0.15;
  ctx.fillStyle = `rgba(${color}, ${color}, ${color}, ${opacity})`;
  ctx.filter = 'blur(3px)';
  ctx.beginPath();
  ctx.arc(x + width / 2, y + width / 2, width / 2, 0, 2 * Math.PI);
  ctx.fill();
};
