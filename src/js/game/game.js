import Waypoint from '../Waypoint';
import Square from '../Square';
import Runway from '../Runway';
import { isCloseToEntity, hasEntityFuncs } from '../entity';
import {
  getRunway,
  Runways,
  getWaypoint,
  getWaypointDestinationsAll,
  getWaypointArrivalsAll,
} from '../airports/LHR';
import { getGameSize, setupGameLoadAndExit } from "../utils";
import { create } from '../Plane';
import { setup as setupKeyboard } from '../events/keyboard';
import { resetProximity, setup as setupScore } from './score';
import { setup as setupVictory } from './victory';
import { draw as drawScale } from '../canvas/scale';

const isSquare = obj => obj instanceof Square;
const isNotTaxiing = obj => !obj.isTaxiing;

let gameLoopRunning = false;
export const setGameLoopState = (isRunning) => {
  gameLoopRunning = !!isRunning;
}

// SETUP ////////////////////////////////////////////////////////////////
export const setup = (argObj) => {
  const entityManagerArr = argObj.entityManagerArr;
  const screenSize = argObj.screenSize;
  const canvasObj = {
    entityManagerArr,
    screenSize: argObj.screenSize,
    width: getGameSize(argObj.screenSize).width,
    height: getGameSize(argObj.screenSize).height,
    canvasObjEntity: argObj.entityLayerObj,
    canvasObjText: argObj.textLayerObj,
    canvasObjHeading: argObj.headingLayerObj,
    canvasEntityEl: argObj.entityDiv,
    clickCB: argObj.squareClickEventCB,
  };

  let firstPlane = true;
  const createPlane = (deltaTimeMs) => {
    const lowCount = 8;
    const highCount = 16;
    let chanceOfPlanePerSec = 0.03;

    const count = entityManagerArr.filter(isSquare).length;
    if (count < lowCount) chanceOfPlanePerSec = 0.1;
    if (count > highCount) chanceOfPlanePerSec = 0.005;
    let chanceOfPlane = chanceOfPlanePerSec * deltaTimeMs / 1000;
    if (firstPlane) {
      firstPlane = false;
      chanceOfPlane = 1;
    }
    createSquare(argObj, entityManagerArr, chanceOfPlane, () => create(canvasObj).square);
  }

  const updateIntervalMs = 500;
  let timestampPrev = -500;

  const gameTick = (timestamp) => {
    const deltaTime = timestamp - timestampPrev;
    if (!gameLoopRunning) return;

    if (deltaTime > updateIntervalMs) {
      timestampPrev = timestamp;
      // cleanup
      entityManagerArr.forEach(callFn('updateDestroy', { entityManagerArr }));
      argObj.textLayerObj.ctx.clearRect(0, 0, canvasObj.width, canvasObj.height);
      argObj.headingLayerObj.ctx.clearRect(0, 0, canvasObj.width, canvasObj.height);
      // update
      createPlane(updateIntervalMs);
      entityManagerArr.forEach(callFn('hide'));
      entityManagerArr.forEach(callFn('update', { deltaTimeMs: updateIntervalMs, entityManagerArr }));
      entityManagerArr.forEach(callFn('updateHandoff', { entityManagerArr }));
      entityManagerArr.forEach(callFn('setProximity', { entityManagerArr, screenSize }));
      entityManagerArr.forEach(callFn('draw', timestamp));
      // cleanup
      resetProximity();
      // callbacks
      argObj.gameUpdateCB();
    }

    window.requestAnimationFrame(gameTick);
  }

  // SETUP
  if (gameLoopRunning) return;
  gameLoopRunning = true;

  setupGameLoadAndExit();
  setupKeyboard();
  setupScore();
  setupVictory();
  drawInertElements(argObj.imgLayerObj, canvasObj);

  window.requestAnimationFrame(gameTick);
}
// SETUP END ////////////////////////////////////////////////////////////

export const setupEntities = (argObj) => {
  const entityAdd = entityManagerAdd(argObj.entityManagerArr);

  const runway27R = new Runway(
    Runways.TwoSevenRight, argObj.imgLayerObj, argObj.screenSize,
    getRunway(Runways.TwoSevenRight, argObj.screenSize));
  const runway27L = new Runway(
    Runways.TwoSevenLeft, argObj.imgLayerObj, argObj.screenSize,
    getRunway(Runways.TwoSevenLeft, argObj.screenSize));
  entityAdd(runway27R);
  entityAdd(runway27L);

  getWaypointArrivalsAll().forEach(waypoint => {
    entityAdd(
      new Waypoint(waypoint, argObj.backgroundObj, argObj.headingLayerObj,
        getWaypoint(waypoint, argObj.screenSize))
    );
  });
  getWaypointDestinationsAll().forEach(waypoint => {
    entityAdd(
      new Waypoint(waypoint, argObj.backgroundObj, argObj.headingLayerObj,
        getWaypoint(waypoint, argObj.screenSize))
    );
  });
}

export const setPlaneSelected = (argObj, square) => {
  const screenSize = argObj.screenSize;
  const width = getGameSize(argObj.screenSize).width;
  const height = getGameSize(argObj.screenSize).height;
  const entityManagerArr = argObj.entityManagerArr;

  argObj.textLayerObj.ctx.clearRect(0, 0, width, height);
  argObj.headingLayerObj.ctx.clearRect(0, 0, width, height);
  entityManagerArr.forEach(callFn('setSelected', false));
  square.setSelected(true);
  entityManagerArr.forEach(callFn('setProximity', { entityManagerArr, screenSize }));
  entityManagerArr.forEach(callFn('draw'));
}

//////////////////////////////////////////////////////////////////////////////
// PRIVATE
//////////////////////////////////////////////////////////////////////////////
const drawInertElements = (layerObj, canvasObj) => {
  drawScale(layerObj, canvasObj.screenSize, canvasObj.width, canvasObj.height);
}

const createSquare = (argObj, entityManagerArr, chanceOfSquare, createEntityFn) => {
  const addObj = entityManagerAdd(entityManagerArr);
  const isCloseToPlane = newObj => otherObj =>
    isCloseToEntity(argObj.screenSize)(newObj)(otherObj) &&
    isSquare(otherObj) &&
    isNotTaxiing(otherObj);

  if (Math.random() < chanceOfSquare) {
    const newEntity = createEntityFn();
    if (!newEntity) return;

    const entityClose = entityManagerArr.find(isCloseToPlane(newEntity));
    if (entityClose) {
      newEntity.destroy();
      return;
    }
    addObj(newEntity);
  }
}

const entityManagerAdd = entityManagerArr => obj => {
  if (hasEntityFuncs(obj)) entityManagerArr.push(obj);
  else throw new Error('non-entity not added \n' + JSON.stringify(obj));
}

const callFn = (fnStr, argsObj) => entity => {
  if (!entity) return null;
  entity[fnStr] ? entity[fnStr](argsObj) : null;
}
