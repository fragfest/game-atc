const Waypoint = require('./Waypoint');
const Square = require('./Square');
import Runway from './Runway';
import { isEntity } from './entity';

export const setup = (argObj) => {
  const squareClickEventCB = argObj.squareClickEventCB; // CB arg: Square

  const squareOne = new Square('SQ 001',
    argObj.entityLayerObj, argObj.textLayerObj, argObj.headingLayerObj, argObj.entityDiv,
    { x: argObj.width / 2 + 300, y: argObj.height / 2 - 200, heading: '222', altitude: 100, speed: 180 });
  const squareTwo = new Square('SQ 002',
    argObj.entityLayerObj, argObj.textLayerObj, argObj.headingLayerObj, argObj.entityDiv,
    { x: argObj.width / 2 + 10, y: argObj.height / 2 + 20, heading: '270', altitude: 800, speed: 180 });
  const squareThree = new Square('SQ 003',
    argObj.entityLayerObj, argObj.textLayerObj, argObj.headingLayerObj, argObj.entityDiv,
    { x: 50, y: 100, heading: '090', altitude: 1000, speed: 180 });

  squareOne.clickEventCB = () => squareClickEventCB(squareOne);
  squareTwo.clickEventCB = () => squareClickEventCB(squareTwo);
  squareThree.clickEventCB = () => squareClickEventCB(squareThree);
  const planes = [squareOne, squareTwo, squareThree];

  const runwayOne = new Runway('run1',
    argObj.backgroundObj, argObj.imgLayerObj,
    { x: argObj.width / 2 - 100, y: argObj.height / 2 + 17, heading: 270 });

  const waypointOne = new Waypoint('WAYONE',
    argObj.backgroundObj, argObj.headingLayerObj,
    { x: argObj.width / 2 + 200, y: argObj.height / 2 });

  const entityManagerArr = [];
  const entityManagerAdd = obj => {
    if (isEntity(obj)) entityManagerArr.push(obj);
    else throw new Error('non-entity not added \n' + JSON.stringify(obj));
  }
  planes.forEach(plane => {
    entityManagerAdd(plane);
  })
  entityManagerAdd(runwayOne);
  entityManagerAdd(waypointOne);

  const callFn = (fnStr, argsObj) => entity => entity[fnStr] ? entity[fnStr](argsObj) : null;
  const updateIntervalMs = 2000;
  let timestampPrev = 0;

  const gameTick = timestamp => {
    const deltaTime = timestamp - timestampPrev;
    if (deltaTime > updateIntervalMs) {
      timestampPrev = timestamp;
      // cleanup
      entityManagerArr.forEach(callFn('removeLanded', { entityManagerArr }));
      argObj.textLayerObj.ctx.clearRect(0, 0, argObj.width, argObj.height);
      argObj.headingLayerObj.ctx.clearRect(0, 0, argObj.width, argObj.height);
      // update
      entityManagerArr.forEach(callFn('update', ({ deltaTimeMs: updateIntervalMs })));
      entityManagerArr.forEach(callFn('setProximity', { entityManagerArr, deltaTimeMs: updateIntervalMs }));
      entityManagerArr.forEach(callFn('updateLanding', { entityManagerArr }));
      // callbacks
      argObj.gameUpdateCB({
        planes: entityManagerArr.filter(entity => entity instanceof Square),
      });
    }

    window.requestAnimationFrame(gameTick);
  }

  window.requestAnimationFrame(gameTick);

}; // end setup
