const Waypoint = require('./Waypoint');
const Square = require('./Square');
const Runway = require('./Runway');
import { hasEntityUpdate } from './entity';
import { create, DestinationType } from './Plane';

let gameLoopRunning = false;
export const setup = (argObj) => {
  const entityManagerArr = argObj.entityManagerArr;

  const callFn = (fnStr, argsObj) => entity => {
    if (!entity) return null;
    entity[fnStr] ? entity[fnStr](argsObj) : null;
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
  const canvasObj = {
    width: argObj.width, height: argObj.height,
    canvasObjEntity: argObj.entityLayerObj,
    canvasObjText: argObj.textLayerObj,
    canvasObjHeading: argObj.headingLayerObj,
    canvasEntityEl: argObj.entityDiv,
    clickCB: argObj.squareClickEventCB,
  };
  const planeOne = create(DestinationType.Arrival, canvasObj);
  const planeTwo = create(DestinationType.Arrival, canvasObj);
  planeTwo.square.y = argObj.height / 2 - 100;
  const planes = [planeOne.square, planeTwo.square];

  const runwayOne = new Runway('run1',
    argObj.backgroundObj, argObj.imgLayerObj,
    { x: argObj.width / 2 - 140, y: argObj.height / 2 + 26, heading: 270 });

  const waypointOne = new Waypoint('WAYONE',
    argObj.backgroundObj, argObj.headingLayerObj,
    { x: argObj.width / 2 + 200, y: argObj.height / 2 });

  const entityManagerArr = [];
  const entityManagerAdd = obj => {
    if (hasEntityUpdate(obj)) entityManagerArr.push(obj);
    else throw new Error('non-entity not added \n' + JSON.stringify(obj));
  }
  planes.forEach(entityManagerAdd);
  entityManagerAdd(runwayOne);
  entityManagerAdd(waypointOne);
  return entityManagerArr;
};