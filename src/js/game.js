const Waypoint = require('./Waypoint');
const Square = require('./Square');
const Runway = require('./Runway');
import { isCloseToEntity, hasEntityUpdate } from './entity';
import { getRunway, Runways, Waypoints, getWaypoint } from './airports/LHR';
import { getGameSize } from "./utils";
import { create } from './Plane';
import { setup as setupKeyboard } from './input/keyboard';

// SETUP ////////////////////////////////////////////////////////////////
let gameLoopRunning = false;
export const setup = (argObj) => {
  const entityManagerArr = argObj.entityManagerArr;
  const canvasObj = {
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
    const chanceOfPlanePerSec = 0.02;
    let chanceOfPlane = chanceOfPlanePerSec * deltaTimeMs / 1000
    if (firstPlane) {
      firstPlane = false;
      chanceOfPlane = 1;
    }
    createSquare(entityManagerArr, chanceOfPlane, () => create(canvasObj).square);
  }

  const updateIntervalMs = 500;
  let timestampPrev = -500;

  const gameTick = timestamp => {
    const deltaTime = timestamp - timestampPrev;
    if (deltaTime > updateIntervalMs) {
      timestampPrev = timestamp;
      // cleanup
      entityManagerArr.forEach(callFn('updateDestroy', { entityManagerArr }));
      entityManagerArr.forEach(callFn('removeLanded', { entityManagerArr }));
      argObj.textLayerObj.ctx.clearRect(0, 0, canvasObj.width, canvasObj.height);
      argObj.headingLayerObj.ctx.clearRect(0, 0, canvasObj.width, canvasObj.height);
      // update
      createPlane(updateIntervalMs)
      entityManagerArr.forEach(callFn('update', ({ deltaTimeMs: updateIntervalMs, entityManagerArr })));
      entityManagerArr.forEach(callFn('setProximity', { entityManagerArr }));
      // callbacks
      argObj.gameUpdateCB({
        planes: entityManagerArr.filter(isSquare),
      });
    }

    window.requestAnimationFrame(gameTick);
  }

  // INIT GAME LOOP
  if (gameLoopRunning) return;
  gameLoopRunning = true;

  setupKeyboard();

  window.requestAnimationFrame(gameTick);
};
// SETUP END ////////////////////////////////////////////////////////////

export const setupEntities = (argObj) => {
  const runwayOne = new Runway(
    Runways.TwoSevenRight, argObj.backgroundObj, argObj.imgLayerObj,
    getRunway(Runways.TwoSevenRight, argObj.screenSize));

  const waypointOne = new Waypoint(
    Waypoints.LAM, argObj.backgroundObj, argObj.headingLayerObj,
    getWaypoint(Waypoints.LAM, argObj.screenSize));

  const entityManagerArr = [];
  const entityAdd = entityManagerAdd(entityManagerArr);
  entityAdd(runwayOne);
  entityAdd(waypointOne);
  return entityManagerArr;
};

export const setPlaneSelected = (argObj, square) => {
  const width = getGameSize(argObj.screenSize).width;
  const height = getGameSize(argObj.screenSize).height;
  const entityManagerArr = argObj.entityManagerArr;

  argObj.textLayerObj.ctx.clearRect(0, 0, width, height);
  argObj.headingLayerObj.ctx.clearRect(0, 0, width, height);
  entityManagerArr.forEach(callFn('setSelected', false));
  square.setSelected(true);
  entityManagerArr.forEach(callFn('setProximity', { entityManagerArr }));
  entityManagerArr.forEach(callFn('draw'));
};

//////////////////////////////////////////////////////////////////////////////
// PRIVATE
//////////////////////////////////////////////////////////////////////////////

const createSquare = (entityManagerArr, chanceOfSquare, createEntityFn) => {
  const addObj = entityManagerAdd(entityManagerArr);
  const isCloseToPlane = newObj => otherObj => isCloseToEntity(newObj)(otherObj) && isSquare(otherObj);

  if (Math.random() > 1 - chanceOfSquare) {
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
  if (hasEntityUpdate(obj)) entityManagerArr.push(obj);
  else throw new Error('non-entity not added \n' + JSON.stringify(obj));
}

const callFn = (fnStr, argsObj) => entity => {
  if (!entity) return null;
  entity[fnStr] ? entity[fnStr](argsObj) : null;
}

const isSquare = obj => obj instanceof Square