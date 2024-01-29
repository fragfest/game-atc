import { ElapsedTimes } from './typesTutorial';
import { DestinationType, FocusCircleType } from '../types';
import {
  controlPanelHolding,
  flightStripThird,
  flightStripThirdWaypoint,
} from './focusCircleTutorial';

let event = '';
const Events = Object.freeze({
  WaitForSelected0: 'WaitForSelected0',
  WaitForInput0: 'WaitForInput0',
  WaitForInput1: 'WaitForInput1',
  WaitForInput2: 'WaitForInput2',
  WaitForInput3: 'WaitForInput3',
});

let isSetCheckmarkPlaneSelected = false;
let isValidCheckmarkPlaneSelected = false;
let isSetCheckmarkWaypoint = false;
let isValidWaypoint = false;
let isSetCheckmarkHolding = false;
let isValidHolding = false;

export const stageWaypoint = (
  state,
  objEventCB,
  screenSize,
  elapsedTime,
  planeSelected,
  addToGameFn,
  setGameLoopStateFn,
  completeStageFn
) => {
  if (!event) {
    event = Events.WaitForSelected0;
    objEventCB.isPlaneSelected = false;

    state.dialogBox = { top: 0.04, left: 0.2, width: 0.57, html: '<clear>' };
    setTimeout(() => {
      const html =
        `<div class="line"><b>Arrival - Hold at waypoint</b><br></div>` +
        `<div class="line"> Set arriving aircraft's waypoint and direct it to circle in a holding pattern</div>` +
        `<div class="line"> <span hidden class="checkmark check-0">&check;</span> <span class="cross check-0">&times;</span> <span class="text">Select second arriving aircraft (Arrows)</span></div>` +
        `<div class="line"> <span hidden class="checkmark check-1">&check;</span> <span class="cross check-1">&times;</span> <span class="text">Select arrival waypoint BIG (W)</span></div>` +
        `<div class="line"> <span hidden class="checkmark check-2">&check;</span> <span class="cross check-2">&times;</span> <span class="text">Activate hold at waypoint (H)</span></div>`;

      addToGameFn();
      state.dialogBox = { top: 0.04, left: 0.2, width: 0.57, html };
    }, 1000);
  }

  const isReadyFirstInput = elapsedTime > ElapsedTimes.WaypointFirstInputMs;
  const isSecondArrivalPlaneSelected =
    objEventCB.isPlaneSelected &&
    planeSelected?.destinationType === DestinationType.Arrival &&
    !planeSelected?.landing;

  if (
    isReadyFirstInput &&
    event === Events.WaitForSelected0 &&
    !isSecondArrivalPlaneSelected
  ) {
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = flightStripThird(screenSize);
    setGameLoopStateFn(false);
  }

  if (event === Events.WaitForSelected0 && isSecondArrivalPlaneSelected) {
    event = Events.WaitForInput0;
    isSetCheckmarkPlaneSelected = true;
  }

  if (event === Events.WaitForInput0 && isSetCheckmarkPlaneSelected) {
    event = Events.WaitForInput1;
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = flightStripThirdWaypoint(screenSize);
  }

  const isWaypointSelected =
    isSecondArrivalPlaneSelected && planeSelected?.waypoint === 'BIG';
  if (event === Events.WaitForInput1 && isWaypointSelected) {
    event = Events.WaitForInput2;
    isSetCheckmarkWaypoint = true;
  }

  if (event === Events.WaitForInput2 && isSetCheckmarkWaypoint) {
    event = Events.WaitForInput3;
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = controlPanelHolding(screenSize);
  }

  const isHoldingSelected =
    isSecondArrivalPlaneSelected && planeSelected?.isHolding;
  if (event === Events.WaitForInput3 && isHoldingSelected) {
    state.focusCircleType = null;
    isSetCheckmarkHolding = true;
  }

  if (isSetCheckmarkPlaneSelected && isSecondArrivalPlaneSelected) {
    isValidCheckmarkPlaneSelected = true;
  } else {
    isValidCheckmarkPlaneSelected = false;
  }

  if (isSetCheckmarkWaypoint && isWaypointSelected) {
    isValidWaypoint = true;
  }
  if (
    isSetCheckmarkWaypoint &&
    isSecondArrivalPlaneSelected &&
    !isWaypointSelected
  ) {
    isValidWaypoint = false;
  }

  if (isSetCheckmarkHolding && isHoldingSelected) {
    isValidHolding = true;
  }
  if (
    isSetCheckmarkHolding &&
    isSecondArrivalPlaneSelected &&
    !isHoldingSelected
  ) {
    isValidHolding = false;
  }

  if (isValidCheckmarkPlaneSelected && isValidWaypoint && isValidHolding) {
    completeStageFn();
    setTimeout(() => {
      state.dialogBox = { top: 0.07, left: 0.3, width: 0.57, html: '<clear>' };
    }, 5000);
  }

  if (!isReadyFirstInput) return;

  if (isValidCheckmarkPlaneSelected) {
    document.querySelector('.checkmark.check-0')?.removeAttribute('hidden');
    document.querySelector('.cross.check-0')?.setAttribute('hidden', true);
  } else {
    document.querySelector('.checkmark.check-0')?.setAttribute('hidden', true);
    document.querySelector('.cross.check-0')?.removeAttribute('hidden');
  }

  if (isValidWaypoint) {
    document.querySelector('.checkmark.check-1')?.removeAttribute('hidden');
    document.querySelector('.cross.check-1')?.setAttribute('hidden', true);
  } else {
    document.querySelector('.checkmark.check-1')?.setAttribute('hidden', true);
    document.querySelector('.cross.check-1')?.removeAttribute('hidden');
  }

  if (isValidHolding) {
    document.querySelector('.checkmark.check-2')?.removeAttribute('hidden');
    document.querySelector('.cross.check-2')?.setAttribute('hidden', true);
  } else {
    document.querySelector('.checkmark.check-2')?.setAttribute('hidden', true);
    document.querySelector('.cross.check-2')?.removeAttribute('hidden');
  }
};
