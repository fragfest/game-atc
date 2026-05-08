import { isCloseToWeather, weatherGameLoop } from './weather';
import { isCloseToPlane, hasEntityFuncs } from '../entity';

import { getGameSize, resetMayday, runwayIdleDisplay } from '../utils';
import { draw as drawScale } from '../canvas/scale';
import { isArrival, isAircraft } from '../types';
import {
  createAircraftRndDefault,
  spawnPlaneGameTick,
} from '../aircraft/aircraftGame.js';
import { SoundType, play, playLoop, stop } from './sound';
import Runway from '../airports/Runway.js';
import { maydaySpawned, runwayIdlePenalty } from './score/score.js';

/**
 * @typedef {import('../airports/airports.js').EntitySetupFn} EntitySetupFn
 * @typedef {import('./victory.js').Goals} Goals
 */

/**
 * @typedef {Object} FocusObj show focus pulses
 * @property {Boolean} isFlightStripDepFocus
 * @property {Number} flightStripArrFocusIndex
 * @property {Boolean} isFlightStripArrFocus
 * @property {Boolean} isFlightStripArrWaypointFocus
 * @property {Boolean} isControlPanelTakeoffLandFocus
 * @property {Boolean} isControlPanelHoldHandoffFocus
 * @property {Boolean} isControlPanelHeadingFocus
 * @property {Boolean} isControlPanelAltitudeFocus
 * @property {Boolean} isScorePanelFocus
 */

/**
 * @typedef {Object} State
 * @property {Goals} goals
 * @property {Number} idleTimerTimestamp
 * @property {Number} idleTimerSecs
 * @property {Boolean} isIdlePrev
 * @property {Number} fastForwardNum
 * @property {Boolean} gameLoopCancel
 * @property {Boolean} gameLoopRunning
 * @property {Boolean} playProximitySound
 * @property {Boolean} showCircles
 * @property {Object} dialogBox
 * @property {FocusObj} focusObj
 */

let showConflictCircles = false;

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
  const airport = argObj.airport;

  setShowCircles(state)(showConflictCircles);

  const firstPlaneCanvasObj = { ...canvasObj, flightObj: { time: 10 * 60 } };
  const spawnFirstPlane = () => {
    spawnAircraftRnd(screenSize, entityManagerArr)(
      () => createAircraftRndDefault(firstPlaneCanvasObj, 1, airport),
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
  weatherGameLoop(width, height, argObj, state);

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

/**
 *
 * @param {Object} argObj game setupArg
 * @param {Array.<EntitySetupFn>} arr
 */
export const setupEntities = (argObj, arr) => {
  const entityAdd = entityManagerAdd(argObj.entityManagerArr);
  arr.forEach((entity) => entityAdd(entity(argObj)));
};

export const getCanvasObj = (argObj) => ({
  entityManagerArr: argObj.entityManagerArr,
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

export const setGameSpeed = (state) => (fastForwardNum) => {
  if (fastForwardNum === 0) state.fastForwardNum = 1;
  if (fastForwardNum === 1) state.fastForwardNum = 1;
  if (fastForwardNum === 2) state.fastForwardNum = 8;
  if (fastForwardNum === 3) state.fastForwardNum = 16;
  if (fastForwardNum >= 4) state.fastForwardNum = 32;
};

export const cancelGameLoop = (state) => {
  state.gameLoopCancel = true;
};

export const setGameLoopState = (state) => (isRunning) => {
  state.gameLoopRunning = !!isRunning;
};

export const getShowCircles = () => showConflictCircles;

export const setShowCircles = (state) => (isShowCircles) => {
  state.showCircles = !!isShowCircles;
  showConflictCircles = !!isShowCircles;
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
  (timestampArg) => {
    let gameLoopRunning = state.gameLoopRunning;
    let showCircles = state.showCircles;

    if (!state.focusObj) state.focusObj = {};

    const updateIntervalMs = 500;
    const timestamp = timestampArg * (state.fastForwardNum || 1);

    const deltaTime = timestamp - timestampPrev;
    if (deltaTime < 0) {
      timestampPrev = timestamp;
    }

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
          entityManagerArr,
          deltaTimeMs: updateIntervalMs,
          timestamp,
        })
      );
      entityManagerArr.forEach(callFn('updateHandoff', { entityManagerArr }));
      entityManagerArr.forEach(
        callFn('setProximity', {
          entityManagerArr,
          screenSize,
          showCircles,
          deltaTimeMs: updateIntervalMs,
          timestamp,
        })
      );
      entityManagerArr.forEach(callFn('draw', timestamp));

      setRunwayIdle(state, timestamp, updateIntervalMs, entityManagerArr);

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

const setRunwayIdle = (state, timestamp, deltaTimeMs, entityManagerArr) => {
  const isRunway = (entity) => entity instanceof Runway;

  const runways = entityManagerArr.filter(isRunway);
  const isIdle = runways.reduce((acc, val) => acc && val.isIdle, true);
  const isIdleStateEnabled = runways.find((val) => val.isIdleStateEnabled);

  if (state.idleTimerSecs === null) {
    return;
  }

  if (isIdleStateEnabled && isIdle) {
    if (state.idleTimerTimestamp) {
      let delta = timestamp - state.idleTimerTimestamp;
      if (delta < 0) {
        delta = 0;
      }
      if (delta > 2 * deltaTimeMs) {
        delta = deltaTimeMs;
      }

      state.idleTimerTimestamp = timestamp;
      state.idleTimerSecs -= delta / 1000;
      if (state.idleTimerSecs < 0 && !state.isIdlePrev) {
        runwayIdleDisplay();
        state.isIdlePrev = true;
        runwayIdlePenalty();
      }
    }
  }

  if (isIdleStateEnabled && !isIdle) {
    state.isIdlePrev = false;
    state.idleTimerTimestamp = timestamp;
    state.idleTimerSecs = state?.goals?.IdleTimer;
  }
};

const setProximityAlarm = (state, entityManagerArr) => {
  const planes = entityManagerArr.filter(isAircraft);
  const isAlarmOn =
    planes.find((x) => x.hasProximityAlert) ||
    planes.find((x) => x.isMaydaySoundOn);

  if (!state.playProximitySound && isAlarmOn) {
    playLoop(SoundType.Collision);
  }
  if (!isAlarmOn) {
    stop(SoundType.Collision);
  }
  state.playProximitySound = isAlarmOn;
};

/**
 * @typedef {import('../aircraft/aircraftGame.js').CreateAircraftRnd} CreateAircraftRnd
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

    const planeClose = !!entityManagerArr.find(isCloseToNewPlane(plane));
    const weatherClose = !!entityManagerArr.find(isCloseToWeather(plane));
    if (isArrival(plane) && (planeClose || weatherClose)) {
      plane.destroy();
      return;
    }

    if (plane.isMayday || plane.isMaydayDepart) {
      resetMayday();
      maydaySpawned();
    }

    play(SoundType.Spawn);
    addPlaneToGame(plane);
  };

const callFn = (fnStr, argsObj) => (entity) => {
  if (!entity) return null;
  entity[fnStr] ? entity[fnStr](argsObj) : null;
};
