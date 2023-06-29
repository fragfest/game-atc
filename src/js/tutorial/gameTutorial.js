import { getGameSize } from "../utils";
import {
  entityManagerAdd,
  gameTick,
  getCanvasObj,
  textLayerClearFn,
  headingLayerClearFn
} from "../game/game";
import Square from "../Square";
import { getFlightArrival, getFlightDeparture } from '../flights/LHR';
import { Waypoints, Runways } from '../airports/LHR';
import { DestinationType, getPerformance } from '../aircraft/airframe';

/**
 * @typedef {import('../game/game.js').State} State
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

  const addToGame = entityManagerAdd(entityManagerArr);

  addToGame(createPlaneArrival(canvasObj));
  state.dialogBox = { top: 0.4, left: 0.4, width: 0.30, html: `Welcome Trainee, <br> Shit's gunna get real` };

  let timestampPrev = -500;
  const gameTickTutorial = gameTick(
    state,
    screenSize,
    entityManagerArr,
    timestampPrev,
    () => { },
    textLayerClearFn(argObj.textLayerObj, { width, height }),
    headingLayerClearFn(argObj.headingLayerObj, { width, height }),
    () => argObj.gameUpdateCB()
  );

  if (state.gameLoopRunning) return;
  state.gameLoopRunning = true;
  
  window.requestAnimationFrame(gameTickTutorial);
}

// PRIVATE /////////////////////////////////////////////////////////////////////////////

const createPlaneArrival = ({
  screenSize, width, height, canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl, clickCB
}, isDeparture) => {

  let flight = getFlightArrival([]);
  let destinationType = DestinationType.Arrival;

  if(isDeparture) {
    flight = getFlightDeparture([]);
    destinationType = DestinationType.Departure;
  }

  const airframeObj = getPerformance(flight.airframe, screenSize);
  const waypoint = Waypoints.LAM;
  const runway = Runways.TwoSevenLeft;

  const square = new Square(flight, canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl,
    { x: width / 1.69, y: height / 1.88, heading: '270', altitude: 1200, speed: 180 },
    { destinationType, airframeObj, waypoint, runway }
  );
  square.clickEventCB = () => clickCB(square);

  return square;
}