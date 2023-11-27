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
import { getFlightArrival, getFlightDeparture } from '../flights/LHR';
import { Waypoints, Runways } from '../airports/LHR';
import { DestinationType, getPerformance } from '../aircraft/airframe';
import { Stages, ElapsedTimes } from './typesTutorial';
import { stageArrivalLand } from './stageArrivalLand';
import { stageDeparture } from './stageDeparture';

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

const objEventCB = {
  buttonTakeoff: false,
  buttonLanding: false,
  headingValue: null,
  altitudeValue: null,
  isPlaneSelected: false,
};

export const buttonHandoffFn = isHandoff => objEventCB.buttonHandoff = isHandoff;
export const buttonTakeoffFn = isTakeoff => objEventCB.buttonTakeoff = isTakeoff;
export const buttonLandingFn = isLanding => objEventCB.buttonLanding = isLanding;
export const headingUpdatedFn = hdgVal => objEventCB.headingValue = hdgVal;
export const altitudeUpdatedFn = altVal => objEventCB.altitudeValue = altVal;
export const planeSelectedFn = (state) => {
  objEventCB.isPlaneSelected = true;
  setGameLoopState(state)(true);
};

// PRIVATE /////////////////////////////////////////////////////////////////////////////

const createPlaneDepartureStage = ({
  screenSize, entityManagerArr, canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl, clickCB
}) => {
  const destinationType = DestinationType.Departure;
  const runway = entityManagerArr.find(x => x.title === '27L');

  const newPlane = {
    x: runway.x,
    y: runway.y,
    heading: '270',
    waypoint: 'DET',
  };
  const altitude = 0;
  const speed = 0;

  const flight = getFlightDeparture([]);
  const airframeObj = getPerformance(flight.airframe, screenSize);

  const square = new Square(flight, canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl,
    { x: newPlane.x, y: newPlane.y, heading: newPlane.heading, altitude, speed },
    { destinationType, airframeObj, waypoint: newPlane.waypoint, runway: runway.title }
  );
  square.clickEventCB = () => clickCB(square);

  return square;
}

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

let stage = '';
const stageCompleted = [];

const isAtStage = stageArg => stageArg === stage && !stageCompleted.find(x => x === stage);
const isLastStage = stageArg => stageArg === stage;
const completeStage = stageArg => {
  if(stageCompleted.find(x => x === stageArg)) return;
  stageCompleted.push(stageArg);
}

let startTimeStageDeparture = 0;

const tutorial = (state, entityManagerArr, startTime, canvasObj, screenSize) => () => {
  const addToGame = entityManagerAdd(entityManagerArr);
  const planeSelected = entityManagerArr.find(x => x.isSelected);
  
  const now = Date.now();
  const elapsedTime = now - startTime;
  
  if(elapsedTime > 500 && stage === '') {
    // stage = Stages.Intro;
    stage = Stages.Departure;
    startTimeStageDeparture = elapsedTime;
  }

  if (isAtStage(Stages.Intro)) {
    const html = `Welcome <b>Trainee</b>, <br><br> Before directing real traffic we need you to qualify on the Future Flight Ops system.<br>` +
    ` Complete all the training scenarios so we feel safe letting you lose on the paying public. <br><br> Good Luck!`;
    state.dialogBox = { top: 0.1, left: 0.1, width: 0.50, html };
    completeStage(Stages.Intro);
  }
  
  if(elapsedTime > ElapsedTimes.ArrivalLandStartMs && isLastStage(Stages.Intro)) {
    stage = Stages.ArrivalLand;
  }

  if(isAtStage(Stages.ArrivalLand)) {
    stageArrivalLand(state, objEventCB, screenSize, elapsedTime, planeSelected,
      () => addToGame(createPlaneArrivalStage(canvasObj)),
      setGameLoopState(state),
      () => {
        completeStage(Stages.ArrivalLand);
        startTimeStageDeparture = elapsedTime;
        stage = Stages.Departure;
      });
  }

  const elapsedTimeDeparture = elapsedTime - startTimeStageDeparture;
  if((elapsedTimeDeparture > ElapsedTimes.DepartureStartMs) && isAtStage(Stages.Departure)) {
    const obj = {...canvasObj, entityManagerArr };
    stageDeparture(state, objEventCB, screenSize, elapsedTimeDeparture, planeSelected,
      () => addToGame(createPlaneDepartureStage(obj)),
      setGameLoopState(state),
      () => {
        completeStage(Stages.Departure);
      }
    );
  }

}

