import { FocusCircleType } from "../types";
import { getGameSize } from "../utils";
import {
  setGameLoopState,
  entityManagerAdd,
  gameTick,
  getCanvasObj,
  textLayerClearFn,
  headingLayerClearFn,
} from "../game/game";
import Square from "../Square";
import { getFlightArrival } from '../flights/LHR';
import { Waypoints, Runways } from '../airports/LHR';
import { DestinationType, getPerformance } from '../aircraft/airframe';

/**
 * @typedef {import('../game/game.js').State} State
 */

/**
 * @param {State} state 
 * @param {Object} argObj 
 */
export const setup = (state) => (argObj) => {
  const entityManagerArr = argObj.entityManagerArr;
  const screenSize = argObj.screenSize;
  const width = getGameSize(argObj.screenSize).width;
  const height = getGameSize(argObj.screenSize).height;
  const canvasObj = getCanvasObj(argObj);

  const startTime = Date.now();

  const gameTickTutorial = gameTick(
    state,
    screenSize,
    entityManagerArr,
    0,
    tutorial(state, entityManagerArr, canvasObj, startTime),
    textLayerClearFn(argObj.textLayerObj, { width, height }),
    headingLayerClearFn(argObj.headingLayerObj, { width, height }),
    () => argObj.gameUpdateCB()
  );

  if (state.gameLoopRunning) return;
  setGameLoopState(state)(true);
  
  window.requestAnimationFrame(gameTickTutorial);
}

export const planeSelectedFn = (state) => {
  setGameLoopState(state)(true);
  isPlaneSelected = true;
};

export const altitudeUpdatedFn = (state) => (altVal) => {
  setGameLoopState(state)(true);
  altitudeValue = altVal;
};

// PRIVATE /////////////////////////////////////////////////////////////////////////////

const createPlaneArrival = ({
  screenSize, width, height, canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl, clickCB
}) => {

  let flight = getFlightArrival([]);
  let destinationType = DestinationType.Arrival;

  const airframeObj = getPerformance(flight.airframe, screenSize);
  const waypoint = Waypoints.LAM;
  const runway = Runways.TwoSevenLeft;

  const square = new Square(flight, canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl,
    { x: width / 1.05, y: height / 2.5, heading: '240', altitude: 7000, speed: 220 },
    { destinationType, airframeObj, waypoint, runway }
  );
  square.clickEventCB = () => clickCB(square);

  return square;
}

// EXTERNALLY SET VARS
let isPlaneSelected = false;
let altitudeValue = null;

// TUTORIAL STAGES
let scenarioIntro = false;
let scenarioOne = false;
let scenarioTwo = false;
let scenarioTwoUserEvent0 = false;
let scenarioTwoUserEvent1 = false;

const tutorial = (state, entityManagerArr, canvasObj, startTime) => () => {
  const addToGame = entityManagerAdd(entityManagerArr);
  
  const now = Date.now();
  const elapsedTime = now - startTime;
  
  // if (!scenarioIntro && elapsedTime > 500) {
  //   scenarioIntro = true;
  //   const html = `Welcome <b>Trainee</b>, <br><br> Before directing real traffic we need you to qualify on the Future Flight Ops system.<br>` +
  //   ` Complete all the training scenarios so we feel safe letting you lose on the paying public. <br><br> Good Luck!`;
  //   state.dialogBox = { top: 0.1, left: 0.1, width: 0.50, html };
  // }
  
  // if (!scenarioOne && elapsedTime > 18000) {
  //   scenarioOne = true;    
  //   state.dialogBox = { top: 0.1, left: 0.4, width: 0.25, html: '<clear>' };

  //   setTimeout(() => {
  //     const html = `<b>Arrival - Land Aircraft</b><br>` +
  //     `Descend aircraft for an assisted (ILS) approach. Steer aircraft to runway and authorize the approach <br>` +
  //     ` - select plane<br>` +
  //     ` - lower to approach altitude of 6000ft or below<br>` +
  //     ` - turn towards runway<br>` +
  //     ` - when in range, click land`;

  //     addToGame(createPlaneArrival(canvasObj));
  //     state.dialogBox = { top: 0.1, left: 0.3, width: 0.54, html };
  //   }, 500);    
  // }
  
  // if (!scenarioTwo && !isPlaneSelected && elapsedTime > 12000) {
  if (!scenarioTwo && !isPlaneSelected && elapsedTime > 1200) {
    scenarioTwo = true;
    state.focusCircleType = FocusCircleType.FlightStrip;
    addToGame(createPlaneArrival(canvasObj));
    setGameLoopState(state)(false);
  }
  
  if(!scenarioTwoUserEvent0 && scenarioTwo && isPlaneSelected) {
    scenarioTwoUserEvent0 = true;
    state.focusCircleType = null;

    setTimeout(() => {
      state.focusCircleType = FocusCircleType.FlightStrip;
      state.focusCircle = {};
      state.focusCircle.top = 908;
      state.focusCircle.left = 1182;
      state.focusCircle.width = 37;
      state.focusCircle.height = 24;
    }, 500);

    setTimeout(() => {
      setGameLoopState(state)(false);
    }, 1200);
  }

  if(!scenarioTwoUserEvent1 && altitudeValue) {
    scenarioTwoUserEvent1 = true;
    if(altitudeValue <= 6000) {
      state.focusCircleType = null;
      setGameLoopState(state)(true);
    }
  }
}