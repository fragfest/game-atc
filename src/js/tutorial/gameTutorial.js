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
import { flightStripFirst, controlPanelAltitude, controlPanelHeading, controlPanelLanding } from "./focusCircleTutorial.js";


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
    tutorial(state, entityManagerArr, startTime, canvasObj, screenSize),
    textLayerClearFn(argObj.textLayerObj, { width, height }),
    headingLayerClearFn(argObj.headingLayerObj, { width, height }),
    () => argObj.gameUpdateCB()
  );

  if (state.gameLoopRunning) return;
  setGameLoopState(state)(true);
  
  window.requestAnimationFrame(gameTickTutorial);
}

export const buttonlandingFn = (isLanding) => {
  buttonLanding = isLanding;
}

export const headingUpdatedFn = (hdgVal) => {
  headingValue = hdgVal;
}

export const altitudeUpdatedFn = (altVal) => {
  altitudeValue = altVal;
};

export const planeSelectedFn = (state) => {
  isPlaneSelected = true;
  setGameLoopState(state)(true);
};

// PRIVATE /////////////////////////////////////////////////////////////////////////////

const createPlaneArrivalStage = ({
  screenSize, width, height, canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl, clickCB
}) => {

  const flight = getFlightArrival([]);
  const destinationType = DestinationType.Arrival;

  const airframeObj = getPerformance(flight.airframe, screenSize);
  const waypoint = Waypoints.LAM;
  const runway = Runways.TwoSevenLeft;

  const square = new Square(flight, canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl,
    { x: width / 1.35, y: height / 2, heading: '240', altitude: 5500, speed: 220 },
    { destinationType, airframeObj, waypoint, runway }
  );
  square.clickEventCB = () => clickCB(square);

  return square;
}

// EXTERNALLY SET VARS
let buttonLanding = false;
let headingValue = null;
let altitudeValue = null;
let isPlaneSelected = false;
//

const Stages = Object.freeze({
  Intro: 'Intro',
  ArrivalLand: 'ArrivalLand',
});

const Events = Object.freeze({
  Dialog: 'Dialog',
  WaitForInput: 'WaitForInput',
  WaitForInput1: 'WaitForInput1',
  WaitForInput2: 'WaitForInput2',
  Selected2: 'Selected2',
  Selected: 'Selected',
  Freeze: 'Freeze',
})

let stage = '';
const stageCompleted = [];
let event = '';

const isAtStage = stageArg => stageArg === stage && !stageCompleted.find(x => x === stage);
const isLastStage = stageArg => stageArg === stage;
const completeStage = stageArg => {
  if(stageCompleted.find(x => x === stageArg)) return;
  stageCompleted.push(stageArg);
}

const tutorial = (state, entityManagerArr, startTime, canvasObj, screenSize) => () => {
  const addToGame = entityManagerAdd(entityManagerArr);
  
  const now = Date.now();
  const elapsedTime = now - startTime;
  
  //DEBUG
  // if(elapsedTime > 500 && stage === '') {
  //   stage = Stages.ArrivalLand;
  //   event = Events.Dialog;
  //   addToGame(createPlaneArrivalStage(canvasObj));
  // }
  // END DEBUG

  if(elapsedTime > 500 && stage === '') {
    stage = Stages.Intro;
  }

  if (isAtStage(Stages.Intro)) {
    const html = `Welcome <b>Trainee</b>, <br><br> Before directing real traffic we need you to qualify on the Future Flight Ops system.<br>` +
    ` Complete all the training scenarios so we feel safe letting you lose on the paying public. <br><br> Good Luck!`;
    state.dialogBox = { top: 0.1, left: 0.1, width: 0.50, html };
    completeStage(Stages.Intro);
  }
  
  if(elapsedTime > 18000 && isLastStage(Stages.Intro)) {
    stage = Stages.ArrivalLand;
    event = Events.Dialog;
  }

  if (isAtStage(Stages.ArrivalLand) && event === Events.Dialog) {
    event = Events.Freeze;
    state.dialogBox = { top: 0.1, left: 0.4, width: 0.50, html: '<clear>' };

    setTimeout(() => {
      const html = `<b>Arrival - Land Aircraft</b><br>` +
      `<div class="line"> Descend aircraft for an assisted (ILS) approach. Steer aircraft to runway and authorize the approach.</div>` +
      `<div class="line"> <span hidden class="checkmark check-0">&check;</span> <span class="cross check-0">&times;</span> <span class="text">select plane</span></div>` +
      `<div class="line"> <span hidden class="checkmark check-1">&check;</span> <span class="cross check-1">&times;</span> <span class="text">lower to approach altitude of 5000ft or below</span></div>` +
      `<div class="line"> <span hidden class="checkmark check-2">&check;</span> <span class="cross check-2">&times;</span> <span class="text">turn towards runway</span></div>` +
      `<div class="line"> <span hidden class="checkmark check-3">&check;</span> <span class="cross check-3">&times;</span> <span class="text">when in range, click land</span></div>`;
      
      addToGame(createPlaneArrivalStage(canvasObj));
      state.dialogBox = { top: 0.07, left: 0.3, width: 0.6, html };
    }, 1000);
  }
  
  if(elapsedTime > 22000 && isLastStage(Stages.ArrivalLand) && event === Events.Freeze) {
    event = Events.WaitForInput;
  }

  if (isAtStage(Stages.ArrivalLand) && event === Events.WaitForInput && !isPlaneSelected) {
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = flightStripFirst(screenSize);
    setGameLoopState(state)(false);
  }
  
  if(isAtStage(Stages.ArrivalLand) && event === Events.WaitForInput && isPlaneSelected) {
    event = Events.Selected;
    altitudeValue = null;
    isPlaneSelected = false;
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = controlPanelAltitude(screenSize);
    document.querySelector('.checkmark.check-0').removeAttribute('hidden');
    document.querySelector('.cross.check-0').setAttribute('hidden', true);
  }

  if(isAtStage(Stages.ArrivalLand) && event === Events.Selected && altitudeValue) {
    if(altitudeValue <= 5000) {
      altitudeValue = null;
      event = Events.WaitForInput1;
      headingValue = null;
      document.querySelector('.checkmark.check-1').removeAttribute('hidden');
      document.querySelector('.cross.check-1').setAttribute('hidden', true);
      return;
    }
  }

  if(isAtStage(Stages.ArrivalLand) && (event === Events.WaitForInput1) && !headingValue) {
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = controlPanelHeading(screenSize);
  }

  if(isAtStage(Stages.ArrivalLand) && event === Events.WaitForInput1 && headingValue) {
    if(headingValue <= 272 && headingValue >= 260) {
      headingValue = null;
      event = Events.WaitForInput2;
      buttonLanding = false;
      document.querySelector('.checkmark.check-2').removeAttribute('hidden');
      document.querySelector('.cross.check-2').setAttribute('hidden', true);
      return;
    }
  }

  if(isAtStage(Stages.ArrivalLand) && event === Events.WaitForInput2 && !buttonLanding) {
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = controlPanelLanding(screenSize);
    event = Events.Selected2;
  }

  if(isAtStage(Stages.ArrivalLand) && event === Events.Selected2 && buttonLanding) {
    state.focusCircleType = null;
    document.querySelector('.checkmark.check-3').removeAttribute('hidden');
    document.querySelector('.cross.check-3').setAttribute('hidden', true);
  }
}