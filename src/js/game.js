const Waypoint = require('./Waypoint');
const Square = require('./Square');
const Runway = require('./Runway');
import { hasEntityUpdate } from './entity';
import { create } from './Plane';
import { isCloseToEntity } from './entity';

let gameLoopRunning = false;
export const setup = (argObj) => {
  const entityManagerArr = argObj.entityManagerArr;
  const canvasObj = {
    width: argObj.width, height: argObj.height,
    canvasObjEntity: argObj.entityLayerObj,
    canvasObjText: argObj.textLayerObj,
    canvasObjHeading: argObj.headingLayerObj,
    canvasEntityEl: argObj.entityDiv,
    clickCB: argObj.squareClickEventCB,
  };

  const createPlane = () => {
    entityCreate(entityManagerArr, () => create(canvasObj).square);
  }

  const updateIntervalMs = 2000;
  let timestampPrev = -2000;

  const gameTick = timestamp => {
    const deltaTime = timestamp - timestampPrev;
    if (deltaTime > updateIntervalMs) {
      timestampPrev = timestamp;
      // cleanup
      entityManagerArr.forEach(callFn('removeLanded', { entityManagerArr }));
      argObj.textLayerObj.ctx.clearRect(0, 0, argObj.width, argObj.height);
      argObj.headingLayerObj.ctx.clearRect(0, 0, argObj.width, argObj.height);
      // update
      createPlane();
      entityManagerArr.forEach(callFn('update', ({ deltaTimeMs: updateIntervalMs, entityManagerArr })));
      entityManagerArr.forEach(callFn('setProximity', { entityManagerArr, deltaTimeMs: updateIntervalMs }));
      // callbacks
      argObj.gameUpdateCB({
        planes: entityManagerArr.filter(entity => entity instanceof Square),
      });
    }

    window.requestAnimationFrame(gameTick);
  }

  if (gameLoopRunning) return;
  window.requestAnimationFrame(gameTick);
  gameLoopRunning = true;
};

export const setupEntities = (argObj) => {
  const runwayOne = new Runway('run1',
    argObj.backgroundObj, argObj.imgLayerObj,
    { x: argObj.width / 2 - 140, y: argObj.height / 2 + 26, heading: 270 });

  const waypointOne = new Waypoint('WAYONE',
    argObj.backgroundObj, argObj.headingLayerObj,
    { x: argObj.width / 2 + 200, y: argObj.height / 2 });

  const entityManagerArr = [];
  const entityAdd = entityManagerAdd(entityManagerArr);
  entityAdd(runwayOne);
  entityAdd(waypointOne);
  return entityManagerArr;
};

//////////////////////////////////////////////////////////////////////////////
// PRIVATE
//////////////////////////////////////////////////////////////////////////////
const shouldCreatePlaneIfRndAbove = 0.1;

const entityCreate = (entityManagerArr, createEntityFn) => {
  const addObj = entityManagerAdd(entityManagerArr);
  const newEntity = createEntityFn();

  if (Math.random() > shouldCreatePlaneIfRndAbove) {
    const entityClose = entityManagerArr.find(isCloseToEntity(newEntity));
    if (!entityClose) addObj(newEntity);
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