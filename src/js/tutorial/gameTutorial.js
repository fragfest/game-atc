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
import { stageWaypoint } from './stageWaypoint';
import { stageConflict } from './stageConflict';
import { FocusCircleType } from '../types';
import { scorePanel } from './focusCircleTutorial';
import { ScoreEvents, subscribeScore } from '../game/score';
import { isVictory, publishSuccess } from '../game/victory';

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
  buttonIsHolding: false,
  buttonTakeoff: false,
  buttonLanding: false,
  headingValue: null,
  altitudeValue: null,
  isPlaneSelected: false,
};

export const buttonIsHoldingFn = isHolding => objEventCB.buttonIsHolding = isHolding;
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
  screenSize, canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl, clickCB, entityManagerArr
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
  screenSize, canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl, clickCB, positionObj
}) => {
  const flight = getFlightArrival([]);
  const destinationType = DestinationType.Arrival;

  const airframeObj = getPerformance(flight.airframe, screenSize);
  const waypoint = Waypoints.LAM;
  const runway = Runways.TwoSevenLeft;

  const square = new Square(flight, canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl,
    positionObj, { destinationType, airframeObj, waypoint, runway }
  );
  square.clickEventCB = () => clickCB(square);

  return square;
}

let stage = '';
const stageCompleted = [];

const isAtStage = stageArg => stageArg === stage && !stageCompleted.find(x => x === stage);
const completeStage = stageArg => {
  if(stageCompleted.find(x => x === stageArg)) return;
  stageCompleted.push(stageArg);
}

let startTimeStageArrival = 0;
let startTimeStageDeparture = 0;
let startTimeStageWaypoint = 0;
let startTimeStageConflict = 0;
let areConflictPlanesCreated = false;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TUTORIAL
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const tutorial = (state, entityManagerArr, startTime, canvasObj, screenSize) => () => {
  const addToGame = entityManagerAdd(entityManagerArr);
  const planeSelected = entityManagerArr.find(x => x.isSelected);
  
  const now = Date.now();
  const elapsedTime = now - startTime;
  
  if(elapsedTime > 500 && stage === '') {
    stage = Stages.Intro;
    startTimeStageWaypoint = elapsedTime;
  }

  if (isAtStage(Stages.Intro)) {
      const html = `Welcome <b>Trainee</b>, <br><br> Before directing real traffic we need you to qualify on the Future Flight Ops system.<br>` +
      ` Complete all the training scenarios so we feel safe letting you lose on the paying public. <br><br> Good Luck!`;
      state.dialogBox = { top: 0.1, left: 0.1, width: 0.50, html };
      completeStage(Stages.Intro);
      startTimeStageDeparture = elapsedTime;
      stage = Stages.Departure
  }
  
  const elapsedTimeDeparture = elapsedTime - startTimeStageDeparture;
  
  if(isAtStage(Stages.Departure) && (elapsedTimeDeparture > ElapsedTimes.DepartureStartMs)) {
    const obj = {...canvasObj, entityManagerArr };
    
    stageDeparture(state, objEventCB, screenSize, elapsedTimeDeparture, planeSelected,
      () => addToGame(createPlaneDepartureStage(obj)),
      setGameLoopState(state),
      () => {
        completeStage(Stages.Departure);
        startTimeStageArrival = elapsedTime;
        stage = Stages.ArrivalLand;
      }
    );
  }

  const elapsedTimeArrival = elapsedTime - startTimeStageArrival;

  if(isAtStage(Stages.ArrivalLand) && (elapsedTimeArrival > ElapsedTimes.ArrivalLandStartMs)) {
    const positionObj = { x: canvasObj.width / 1.35, y: canvasObj.height / 2, heading: '240', altitude: 5500, speed: 220 };
    const obj = { ...canvasObj, positionObj };

    stageArrivalLand(state, objEventCB, screenSize, elapsedTimeArrival, planeSelected,
      () => addToGame(createPlaneArrivalStage(obj)),
      setGameLoopState(state),
      () => {
        completeStage(Stages.ArrivalLand);
        startTimeStageWaypoint = elapsedTime;
        stage = Stages.Waypoint;
      });
  }

  const elapsedTimeWaypoint = elapsedTime - startTimeStageWaypoint;

  if(isAtStage(Stages.Waypoint) && (elapsedTimeWaypoint > ElapsedTimes.WaypointStartMs)) {
    const positionObj = { x: canvasObj.width / 1.4, y: canvasObj.height / 1.4, heading: '090', altitude: 6000, speed: 220 };
    const obj = { ...canvasObj, positionObj };

    stageWaypoint(state, objEventCB, screenSize, elapsedTimeWaypoint, planeSelected,
      () => addToGame(createPlaneArrivalStage(obj)),
      setGameLoopState(state),
      () => {
        completeStage(Stages.Waypoint);
        startTimeStageConflict = elapsedTime;
        stage = Stages.Conflict;
      });
  }

  const elapsedTimeConflict = elapsedTime - startTimeStageConflict;
  
  if(isAtStage(Stages.Conflict) && (elapsedTimeConflict > ElapsedTimes.ConflictStartMs)) {
    const positionObj = { x: 0.05 * canvasObj.width, y: canvasObj.height / 2.5, heading: '090', altitude: 6000, speed: 220 };
    const positionObjB = { ...positionObj, x: 1.2 * positionObj.x, y: 1.1 * positionObj.y, altitude: 6500 };
    const objA = { ...canvasObj, positionObj };
    const objB = { ...objA, positionObj: positionObjB };
    if(!areConflictPlanesCreated) {
      areConflictPlanesCreated = true;
      const planeA = createPlaneArrivalStage(objA)
      planeA.hasProximityAlert = true;
      const planeB = createPlaneArrivalStage(objB)
      planeB.hasProximityAlert = true;
      addToGame(planeA);
      addToGame(planeB);
    }

    stageConflict(state, elapsedTimeWaypoint, entityManagerArr,
      () => {
        completeStage(Stages.Conflict);
        setTimeout(() => stage = Stages.Done, 8000 );
      });
  }

  if(isAtStage(Stages.Done)) {
    state.dialogBox = { top: 0.07, left: 0.1, width: 0.5, html: '<clear>' };
    setTimeout(() => {
      const html = `Congratulations <b>Controller</b>, <br><br> Your training is complete and you are ready to direct real aircraft.<br>` +
      `Please wait for the <b>departures</b> and <b>arrivals</b> goals to complete<br><br>` +
      `Welcome to the Future Flight Ops system!`;
    state.dialogBox = { top: 0.1, left: 0.1, width: 0.50, html };
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = scorePanel(screenSize);
    }, 1000);

    setTimeout(() => {
      subscribeScore(ScoreEvents.ScoreEV, (score) => {
        if(isVictory(score)) publishSuccess();
      });
    }, 8000);

    completeStage(Stages.Done);
  }
}

