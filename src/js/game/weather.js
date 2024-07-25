import { getScore } from './score';

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
  if (level === 4) level4(weatherArgs);

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

const level4 = (weatherArgs) => {
  const { width, height } = weatherArgs;

  const x = 0.08 * width;
  const y = 0.45 * height;
  const radius = 120;
  addLargeRainHover(weatherArgs)({ x, y, radius });
};

////////////////////////////////////////////////////////////////////////
// add weather systems
////////////////////////////////////////////////////////////////////////

const addLargeRainHover =
  ({ ctx, entityDiv, entityManagerArr }) =>
  ({ x, y, radius }) => {
    const centerXY = { x: x + radius, y: y + radius };

    const obj = createLargeRain(ctx, entityDiv, x, y, radius * 2);
    const updateWeatherFn = () => {
      // centerXY.x += 0.05;
      // x += 0.05;
      obj.weatherDiv.style.left = x + 'px';
      obj.weatherDiv.style.top = y + 'px';
      obj.drawFn(x, y);
    };
    entityManagerArr.push(
      createWeatherEntity(centerXY, radius, updateWeatherFn)
    );
  };

const createWeatherEntity = (centerXY, radius, updateWeatherFn) => ({
  updateWeatherFn,
  centerXY,
  radius,
});

////////////////////////////////////////////////////////////////////////
// create weather systems
////////////////////////////////////////////////////////////////////////

const createLargeRain = (ctx, div, x, y, width) => {
  const iconSize = 40;
  const cloudSize = 0.35 * width;

  const weatherDiv = document.createElement('div');
  div.appendChild(weatherDiv);
  weatherDiv.style.position = 'absolute';
  weatherDiv.style.left = x + 'px';
  weatherDiv.style.top = y + 'px';
  weatherDiv.style.width = width + 'px';
  weatherDiv.style.height = width + 'px';
  // weatherDiv.style.border = '1px solid white';

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

  const drawFn = (circleX, circleY) =>
    addRainCircle(ctx, circleX, circleY, width);

  drawFn(x, y);

  return {
    weatherDiv,
    drawFn,
  };
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
    opacity = 1;
  }
  if (cloudType === CloudType.ExtraLargeRain) {
    src = 'cloud-six.png';
    filter = '';
    opacity = 1;
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
  imgIconEl.style.opacity = 0.7;
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
