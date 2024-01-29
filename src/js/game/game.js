import Waypoint from '../Waypoint';
import Runway from '../Runway';
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
import { getGameSize } from '../utils';
import { draw as drawScale } from '../canvas/scale';
import { isDeparture, isSquare } from '../types';
import { createPlane, spawnRndPlane } from '../Plane';
import { setTaxiQueue } from './score';
import { getGoals } from '../game/victory';
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

  const spawnFirstPlane = () =>
    createSquare(screenSize, entityManagerArr)(
      () => createPlane(canvasObj, 1).square,
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

  spawnFirstPlane();

  window.requestAnimationFrame(gameTickFullGame);
};

export const textLayerClearFn =
  (textLayerObj, { width, height }) =>
  () =>
    textLayerObj.ctx.clearRect(0, 0, width, height);
export const headingLayerClearFn =
  (headingLayerObj, { width, height }) =>
  () =>
    headingLayerObj.ctx.clearRect(0, 0, width, height);

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

export const setPlaneSelected = (state) => (argObj, square) => {
  const showCircles = state.showCircles;

  const screenSize = argObj.screenSize;
  const width = getGameSize(argObj.screenSize).width;
  const height = getGameSize(argObj.screenSize).height;
  const entityManagerArr = argObj.entityManagerArr;

  argObj.textLayerObj.ctx.clearRect(0, 0, width, height);
  argObj.headingLayerObj.ctx.clearRect(0, 0, width, height);
  entityManagerArr.forEach(callFn('setSelected', false));
  square.setSelected(true);
  entityManagerArr.forEach(
    callFn('setProximity', { entityManagerArr, screenSize, showCircles })
  );
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
      // goals
      setTaxiQueue(getTaxiLength(entityManagerArr));
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

export const getTaxiLength = (entityManagerArr) => {
  const planes = entityManagerArr.filter(isSquare);
  const departures = planes.filter(isDeparture);
  return departures.filter((plane) => plane.isTaxiing).length;
};

export const isTaxiQueueAlmostFull = (entityManagerArr) => {
  return getTaxiLength(entityManagerArr) > getTaxiWarnLength();
};

// PRIVATE ////////////////////////////////////////////////////////////////////
const getTaxiWarnLength = () => Math.ceil(0.6 * getGoals().TaxiQueue);

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
      !isDeparture(newObj) &&
      isWithinDist(minSpawnDist, newObj, otherObj);

    if (Math.random() < chanceOfSquare) {
      const newEntity = createEntityFn();
      if (!newEntity) return;

      const entityClose = entityManagerArr.find(isCloseToPlane(newEntity));
      if (entityClose) {
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
