import Waypoint from '../Waypoint';
import Runway from '../Runway';
import { weatherGameLoop } from './weather';
import {
  getTooCloseDistance,
  distBetweenEntities,
  hasEntityFuncs,
} from '../entity';
import {
  getRunway,
  Runways,
  getWaypoint,
  getWaypointDestinationsAll,
  getWaypointArrivalsAll,
} from '../airports/LHR';

import { getGameSize, isWeather, minWeatherDist } from '../utils';
import { draw as drawScale } from '../canvas/scale';
import { isArrival, isSquare } from '../types';
import { createPlane, spawnRndPlane } from '../Plane';
import { SoundType, play, playLoop, stop } from './sound';

/**
 * @typedef {object} State
 * @property {Boolean} gameLoopCancel
 * @property {Boolean} gameLoopRunning
 * @property {Boolean} playProximitySound
 * @property {Boolean} showCircles
 * @property {Object} dialogBox
 * @property {String} focusCircleType
 * @property {Object} focusCircle
 */

/**
 * @param {State} state
 * @param {object} argObj
 */
export const setup = (state) => (argObj) => {
  const entityManagerArr = argObj.entityManagerArr;
  const screenSize = argObj.screenSize;
  const width = getGameSize(argObj.screenSize).width;
  const height = getGameSize(argObj.screenSize).height;
  const canvasObj = getCanvasObj(argObj);

  const firstPlaneCanvasObj = { ...canvasObj, flightObj: { time: 10 * 60 } };
  const spawnFirstPlane = () =>
    createSquare(screenSize, entityManagerArr)(
      () => createPlane(firstPlaneCanvasObj, 1).square,
      1
    );

  const spawnPlaneFullGame_timestampArg = spawnRndPlane(
    canvasObj,
    entityManagerArr,
    createSquare(screenSize, entityManagerArr)
  );

  const gameTickFullGame = gameTick(
    state,
    screenSize,
    entityManagerArr,
    -500,
    spawnPlaneFullGame_timestampArg,
    textLayerClearFn(argObj.textLayerObj, { width, height }),
    headingLayerClearFn(argObj.headingLayerObj, { width, height }),
    () => argObj.gameUpdateCB()
  );

  if (state.gameLoopRunning) return;
  state.gameLoopRunning = true;
  state.gameLoopCancel = false;

  window.requestAnimationFrame(gameTickFullGame);
  weatherGameLoop(width, height, argObj);

  spawnFirstPlane();
};

export const textLayerClearFn =
  (textLayerObj, { width, height }) =>
  () => {
    textLayerObj.ctx.clearRect(0, 0, width, height);
  };
export const headingLayerClearFn =
  (headingLayerObj, { width, height }) =>
  () => {
    headingLayerObj.ctx.clearRect(0, 0, width, height);
  };

export const setupEntities = (argObj) => {
  const entityAdd = entityManagerAdd(argObj.entityManagerArr);

  const runway27R = new Runway(
    Runways.TwoSevenRight,
    argObj.imgLayerObj,
    argObj.screenSize,
    getRunway(Runways.TwoSevenRight, argObj.screenSize)
  );
  const runway27L = new Runway(
    Runways.TwoSevenLeft,
    argObj.imgLayerObj,
    argObj.screenSize,
    getRunway(Runways.TwoSevenLeft, argObj.screenSize)
  );

  entityAdd(runway27R);
  entityAdd(runway27L);

  getWaypointArrivalsAll().forEach((waypoint) => {
    entityAdd(
      new Waypoint(
        waypoint,
        argObj.backgroundObj,
        argObj.headingLayerObj,
        argObj.screenSize,
        getWaypoint(waypoint, argObj.screenSize)
      )
    );
  });

  getWaypointDestinationsAll().forEach((waypoint) => {
    entityAdd(
      new Waypoint(
        waypoint,
        argObj.backgroundObj,
        argObj.headingLayerObj,
        argObj.screenSize,
        getWaypoint(waypoint, argObj.screenSize)
      )
    );
  });
};

export const getCanvasObj = (argObj) => ({
  entityManagerArr: argObj.entityManagerArr,
  // TODO remove screenSize
  screenSize: argObj.screenSize,
  width: getGameSize(argObj.screenSize).width,
  height: getGameSize(argObj.screenSize).height,
  canvasObjEntity: argObj.entityLayerObj,
  canvasObjText: argObj.textLayerObj,
  canvasObjHeading: argObj.headingLayerObj,
  canvasEntityEl: argObj.entityDiv,
  clickCB: argObj.squareClickEventCB,
});

export const drawInertElements = (layerObj, { screenSize, width, height }) => {
  drawScale(layerObj, screenSize, width, height);
};

export const cancelGameLoop = (state) => {
  state.gameLoopCancel = true;
};

export const setGameLoopState = (state) => (isRunning) => {
  state.gameLoopRunning = !!isRunning;
};

export const setShowCircles = (state) => (isShowCircles) => {
  state.showCircles = !!isShowCircles;
};

export const setPlaneSelected = (argObj, square) => {
  const width = getGameSize(argObj.screenSize).width;
  const height = getGameSize(argObj.screenSize).height;
  const entityManagerArr = argObj.entityManagerArr;

  argObj.textLayerObj.ctx.clearRect(0, 0, width, height);
  argObj.headingLayerObj.ctx.clearRect(0, 0, width, height);
  entityManagerArr.forEach(callFn('setSelected', false));
  square.setSelected(true);
  entityManagerArr.forEach(callFn('draw'));
};

export const entityManagerAdd = (entityManagerArr) => (obj) => {
  if (hasEntityFuncs(obj)) entityManagerArr.push(obj);
  else throw new Error('non-entity not added \n' + JSON.stringify(obj));
};

export const gameTick =
  (
    state,
    screenSize,
    entityManagerArr,
    timestampPrev,
    spawnPlaneFn_timestampArg,
    textLayerClearFn,
    headingLayerClearFn,
    gameUpdateFn
  ) =>
  (timestamp) => {
    let gameLoopRunning = state.gameLoopRunning;
    let showCircles = state.showCircles;

    const updateIntervalMs = 500;
    const deltaTime = timestamp - timestampPrev;

    if (gameLoopRunning && deltaTime > updateIntervalMs) {
      timestampPrev = timestamp;
      // cleanup
      entityManagerArr.forEach(callFn('updateDestroy', { entityManagerArr }));
      textLayerClearFn();
      headingLayerClearFn();
      // update
      spawnPlaneFn_timestampArg(updateIntervalMs);
      entityManagerArr.forEach(callFn('hide'));
      entityManagerArr.forEach(
        callFn('update', { deltaTimeMs: updateIntervalMs, entityManagerArr })
      );
      entityManagerArr.forEach(callFn('updateHandoff', { entityManagerArr }));
      entityManagerArr.forEach(
        callFn('setProximity', {
          entityManagerArr,
          screenSize,
          showCircles,
          timestamp,
        })
      );
      entityManagerArr.forEach(callFn('draw', timestamp));
      // sounds
      setProximityAlarm(state, entityManagerArr);
      // callbacks
      gameUpdateFn();
    }

    if (!state.gameLoopCancel) {
      window.requestAnimationFrame(
        gameTick(
          state,
          screenSize,
          entityManagerArr,
          timestampPrev,
          spawnPlaneFn_timestampArg,
          textLayerClearFn,
          headingLayerClearFn,
          gameUpdateFn
        )
      );
    }
  };

// PRIVATE ////////////////////////////////////////////////////////////////////
const isWithinDist = (distMax, obj1, obj2) => {
  return distBetweenEntities(obj1)(obj2) < distMax;
};

const setProximityAlarm = (state, entityManagerArr) => {
  const planes = entityManagerArr.filter(isSquare);
  const isAlarmOn = !!planes.find((x) => x.hasProximityAlert);

  if (!state.playProximitySound && isAlarmOn) {
    playLoop(SoundType.Collision);
  }
  if (!isAlarmOn) {
    stop(SoundType.Collision);
  }
  state.playProximitySound = isAlarmOn;
};

const createSquare =
  (screenSize, entityManagerArr) => (createEntityFn, chanceOfSquare) => {
    const addPlaneToGame = entityManagerAdd(entityManagerArr);
    const minSpawnDist = getTooCloseDistance(screenSize) * 2.5;

    const isCloseToPlane = (newObj) => (otherObj) =>
      isSquare(otherObj) &&
      isArrival(newObj) &&
      isWithinDist(minSpawnDist, newObj, otherObj);

    const isCloseToWeather = (newObj) => (weatherObj) => {
      const weatherObjXY = {
        x: weatherObj?.centerXY?.x,
        y: weatherObj?.centerXY?.y,
      };

      const isWithinWeatherDist = isWithinDist(
        minWeatherDist(weatherObj),
        newObj,
        weatherObjXY
      );
      return isWeather(weatherObj) && isArrival(newObj) && isWithinWeatherDist;
    };

    if (Math.random() < chanceOfSquare) {
      const newEntity = createEntityFn();
      if (!newEntity) return;

      const planeClose = entityManagerArr.find(isCloseToPlane(newEntity));
      const weatherClose = entityManagerArr.find(isCloseToWeather(newEntity));

      if (planeClose || weatherClose) {
        newEntity.destroy();
        return;
      }

      play(SoundType.Spawn);
      addPlaneToGame(newEntity);
    }
  };

const callFn = (fnStr, argsObj) => (entity) => {
  if (!entity) return null;
  entity[fnStr] ? entity[fnStr](argsObj) : null;
};
