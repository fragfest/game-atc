import Waypoint from '../canvas/Waypoint';
import Runway from '../airports/Runway';
import { isCloseToWeather, weatherGameLoop } from './weather';
import { isCloseToPlane, hasEntityFuncs } from '../entity';
import {
  getRunway,
  Runways,
  getWaypoint,
  getWaypointDestinationsAll,
  getWaypointArrivalsAll,
} from '../airports/LHR';

import { getGameSize } from '../utils';
import { draw as drawScale } from '../canvas/scale';
import { isArrival, isAircraft } from '../types';
import {
  createAircraftRndDestinationType,
  spawnPlaneGameTick,
} from '../aircraft/aircraftGame.js';
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
  const spawnFirstPlane = () => {
    spawnAircraftRnd(screenSize, entityManagerArr)(
      () => createAircraftRndDestinationType(firstPlaneCanvasObj, 1),
      1
    );
  };

  const spawnPlaneUpdateFn = spawnPlaneGameTick(
    canvasObj,
    entityManagerArr,
    spawnAircraftRnd(screenSize, entityManagerArr)
  );

  const gameTickFullGame = gameTick(
    state,
    screenSize,
    entityManagerArr,
    -500,
    spawnPlaneUpdateFn,
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
  clickCB: argObj.aircraftClickEventCB,
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

export const setPlaneSelected = (argObj, aircraft) => {
  const width = getGameSize(argObj.screenSize).width;
  const height = getGameSize(argObj.screenSize).height;
  const entityManagerArr = argObj.entityManagerArr;

  argObj.textLayerObj.ctx.clearRect(0, 0, width, height);
  argObj.headingLayerObj.ctx.clearRect(0, 0, width, height);
  entityManagerArr.forEach(callFn('setSelected', false));
  aircraft.setSelected(true);
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
    spawnPlaneUpdateFn,
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
      spawnPlaneUpdateFn(updateIntervalMs);
      entityManagerArr.forEach(callFn('hide'));
      entityManagerArr.forEach(
        callFn('update', {
          deltaTimeMs: updateIntervalMs,
          entityManagerArr,
          timestamp,
        })
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
          spawnPlaneUpdateFn,
          textLayerClearFn,
          headingLayerClearFn,
          gameUpdateFn
        )
      );
    }
  };

// PRIVATE ////////////////////////////////////////////////////////////////////

const setProximityAlarm = (state, entityManagerArr) => {
  const planes = entityManagerArr.filter(isAircraft);
  const isAlarmOn = !!planes.find((x) => x.hasProximityAlert);

  if (!state.playProximitySound && isAlarmOn) {
    playLoop(SoundType.Collision);
  }
  if (!isAlarmOn) {
    stop(SoundType.Collision);
  }
  state.playProximitySound = isAlarmOn;
};

/**
 * @typedef {import('../Plane.js').CreateAircraftRnd} CreateAircraftRnd
 */
/**
 * @param {String} screenSize
 * @param {Array} entityManagerArr
 * @returns {CreateAircraftRnd}
 */
const spawnAircraftRnd =
  (screenSize, entityManagerArr) => (createAircraftFn, chanceOfAircraft) => {
    const addPlaneToGame = entityManagerAdd(entityManagerArr);
    const isCloseToNewPlane = isCloseToPlane(screenSize);

    if (Math.random() > chanceOfAircraft) return;

    const plane = createAircraftFn();
    if (!plane) return;

    const planeClose = entityManagerArr.find(isCloseToNewPlane(plane));
    const weatherClose = entityManagerArr.find(isCloseToWeather(plane));
    if (isArrival(plane) && (planeClose || weatherClose)) {
      plane.destroy();
      return;
    }

    play(SoundType.Spawn);
    addPlaneToGame(plane);
  };

const callFn = (fnStr, argsObj) => (entity) => {
  if (!entity) return null;
  entity[fnStr] ? entity[fnStr](argsObj) : null;
};
