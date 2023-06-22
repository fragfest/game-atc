import Waypoint from '../Waypoint';
import Runway from '../Runway';
import { getTooCloseDistance, distBetweenEntities, hasEntityFuncs } from '../entity';
import {
  getRunway,
  Runways,
  getWaypoint,
  getWaypointDestinationsAll,
  getWaypointArrivalsAll,
} from '../airports/LHR';
import { getGameSize, setupGameLoadAndExit } from "../utils";
import { setup as setupKeyboard } from '../events/keyboard';
import { draw as drawScale } from '../canvas/scale';
import { isSquare } from '../types';
import { create, spawnRndPlane } from '../Plane';

let gameLoopRunning = false;
export const setGameLoopState = (isRunning) => {
  gameLoopRunning = !!isRunning;
}

let showCircles = false;
export const setShowCircles = (isShowCircles) => {
  showCircles = !!isShowCircles;
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

  const createPlane = spawnRndPlane(canvasObj, entityManagerArr, createSquare(screenSize, entityManagerArr))

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
      entityManagerArr.forEach(callFn('setProximity', { entityManagerArr, screenSize, showCircles, timestamp }));
      entityManagerArr.forEach(callFn('draw', timestamp));
      // callbacks
      argObj.gameUpdateCB();
    }

    window.requestAnimationFrame(gameTick);
  }

  if (gameLoopRunning) return;
  gameLoopRunning = true;

  setupGameLoadAndExit();
  setupKeyboard();
  drawInertElements(argObj.imgLayerObj, canvasObj);
  
  createSquare(screenSize, entityManagerArr)(() => create(canvasObj, 0.5).square, 1);

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
      new Waypoint(waypoint, argObj.backgroundObj, argObj.headingLayerObj, argObj.screenSize, 
        getWaypoint(waypoint, argObj.screenSize))
    );
  });
  getWaypointDestinationsAll().forEach(waypoint => {
    entityAdd(
      new Waypoint(waypoint, argObj.backgroundObj, argObj.headingLayerObj, argObj.screenSize, 
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
  entityManagerArr.forEach(callFn('setProximity', { entityManagerArr, screenSize, showCircles }));
  entityManagerArr.forEach(callFn('draw'));
}

//////////////////////////////////////////////////////////////////////////////
// PRIVATE
//////////////////////////////////////////////////////////////////////////////
const drawInertElements = (layerObj, canvasObj) => {
  drawScale(layerObj, canvasObj.screenSize, canvasObj.width, canvasObj.height);
}

const isNotTaxiing = obj => !obj.isTaxiing;
const isWithinDist = (distMax, obj1, obj2) => distBetweenEntities(obj1)(obj2) < distMax;

const createSquare = (screenSize, entityManagerArr) => (createEntityFn, chanceOfSquare) => {
  const addPlaneToGame = entityManagerAdd(entityManagerArr);
  const minSpawnDist = getTooCloseDistance(screenSize) * 1.5;

  const isCloseToPlane = newObj => otherObj =>
    isWithinDist(minSpawnDist, newObj, otherObj) &&
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
    addPlaneToGame(newEntity);
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
