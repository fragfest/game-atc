import { getScreenSize, ScreenSizes } from '../utils';
import { getScore } from './score';

export const WeatherType = Object.freeze({
  Inert: 'Inert',
  Turbulence: 'Turbulence',
});

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

  const level = getScore().level;
  if (level === 1) level1(weatherArgs);
  if (level === 2) level2(weatherArgs);
  if (level === 3) level3(weatherArgs);
  if (level === 4) level4(weatherArgs);
  if (level === 5) level5(weatherArgs);

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
// LEVELS
////////////////////////////////////////////////////////////////////////

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
  weatherArgs.hasIcon = true;

  const rainOnDeparture = addTurbulence(weatherArgs, createLargeRain, hover);
  rainOnDeparture({
    x: 0.08 * width,
    y: 0.45 * height,
    radius: width / 11,
  });
  const rainOverWaypointBIG = addTurbulence(
    weatherArgs,
    createLargeRain,
    driftESE
  );
  rainOverWaypointBIG({
    x: 0.6 * width,
    y: 0.4 * height,
    radius: width / 16,
  });

  const cloud1 = addInert(weatherArgs, create(CloudType.LightHazeOne), hover);
  const cloud2 = addInert(weatherArgs, create(CloudType.LightHazeOne), hover);
  const cloud3 = addInert(weatherArgs, create(CloudType.LightHazeOne), hover);
  const cloud4 = addInert(weatherArgs, create(CloudType.LightHazeOne), hover);
  const cloud5 = addInert(weatherArgs, create(CloudType.LightHazeTwo), hover);
  const cloud6 = addInert(weatherArgs, create(CloudType.MediumHaze), hover);

  cloud1({ x: 0.6 * width, y: 0.8 * height, radius: width / 14 });
  cloud2({ x: 0.65 * width, y: 0.83 * height, radius: width / 14 });
  cloud3({ x: 0.75 * width, y: 0.1 * height, radius: width / 14 });
  cloud4({ x: 0.8 * width, y: 0.1 * height, radius: width / 14 });
  cloud5({ x: 0.2 * width, y: 0 * height, radius: width / 14 });
  cloud6({ x: -0.1 * width, y: 0.1 * height, radius: width / 14 });
};

////////////////////////////////////////////////////////////////////////
// add weather systems
////////////////////////////////////////////////////////////////////////

const addInert =
  ({ ctx, entityDiv, entityManagerArr }, createWeatherFn, moveFn) =>
  ({ x, y, radius }) => {
    const XY = { x, y };
    const centerXY = { x: x + radius, y: y + radius };

    const obj = createWeatherFn(ctx, entityDiv, x, y, radius * 2);
    const updateMoveFn = moveFn(centerXY.x, centerXY.y);

    const updateWeatherFn = () => {
      const diffXY = updateMoveFn(centerXY.x, centerXY.y);
      updateXY(diffXY, XY, centerXY, obj);
    };
    entityManagerArr.push(
      createWeatherEntity(WeatherType.Inert, centerXY, radius, updateWeatherFn)
    );
  };

const addTurbulence =
  ({ ctx, entityDiv, entityManagerArr }, createWeatherFn, moveFn) =>
  ({ x, y, radius }) => {
    const XY = { x, y };
    const centerXY = { x: x + radius, y: y + radius };

    const obj = createWeatherFn(ctx, entityDiv, x, y, radius * 2);
    const updateMoveFn = moveFn(centerXY.x, centerXY.y);

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
  updateWeatherFn,
  centerXY,
  radius,
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

const createLargeRain = (ctx, div, x, y, width) => {
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
const hover = (xInitial, yInitial) => (x, y) => ({ x: 0, y: 0 });
// eslint-disable-next-line
const driftESE = (xInitial, yInitial) => (x, y) => {
  if (getScreenSize() === ScreenSizes.Large) return { x: 0.01, y: 0.005 };
  if (getScreenSize() === ScreenSizes.Small) return { x: 0.007, y: 0.0035 };
};
// eslint-disable-next-line
const driftE = (xInitial, yInitial) => (x, y) => {
  // 1.4 : 2
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
    filter = '';
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
    filter = 'brightness(0.8)';
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
