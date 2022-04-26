const Waypoint = require('./Waypoint');
const Square = require('./Square');
const Runway = require('./Runway');
import { hasEntityUpdate } from './entity';

let gameLoopRunning = false;
export const setup = (argObj) => {
  const entityManagerArr = argObj.entityManagerArr;

  const callFn = (fnStr, argsObj) => entity => entity[fnStr] ? entity[fnStr](argsObj) : null;
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
  const squareOne = new Square('SQ 001',
    argObj.entityLayerObj, argObj.textLayerObj, argObj.headingLayerObj, argObj.entityDiv,
    { x: argObj.width / 2 + 300, y: 200, heading: '222', altitude: 100, speed: 180 },
    { destinationType: 'arrival', airframe: 'B738', wakeRating: 'M', waypoint: 'LAM', runway: '27R' });
  const squareTwo = new Square('SQ 002',
    argObj.entityLayerObj, argObj.textLayerObj, argObj.headingLayerObj, argObj.entityDiv,
    { x: argObj.width / 2 + 10, y: argObj.height / 2 + 20, heading: '270', altitude: 800, speed: 180 },
    { destinationType: 'arrival', airframe: 'A320', wakeRating: 'M', waypoint: 'LAM', runway: '27R' });
  const squareThree = new Square('SQ 003',
    argObj.entityLayerObj, argObj.textLayerObj, argObj.headingLayerObj, argObj.entityDiv,
    { x: argObj.width / 2 + 300, y: 30, heading: '222', altitude: 100, speed: 180 },
    { destinationType: 'arrival', airframe: 'B738', wakeRating: 'M', waypoint: 'OCK', runway: '27R' });

  const squareClickEventCB = argObj.squareClickEventCB; // CB arg: Square
  squareOne.clickEventCB = () => squareClickEventCB(squareOne);
  squareTwo.clickEventCB = () => squareClickEventCB(squareTwo);
  squareThree.clickEventCB = () => squareClickEventCB(squareThree);
  const planes = [squareOne, squareTwo, squareThree];

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