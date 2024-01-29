import { ElapsedTimes } from './typesTutorial';
import { DestinationType, FocusCircleType } from '../types';
import {
  controlPanelAltitude,
  flightStripQueue,
  controlPanelTakeoff,
} from './focusCircleTutorial';

let event = '';
const Events = Object.freeze({
  WaitForSelected0: 'WaitForSelected0',
  WaitForInput0: 'WaitForInput0',
  WaitForInput1: 'WaitForInput1',
  WaitForInput2: 'WaitForInput2',
  WaitForInput3: 'WaitForInput3',
});

let isSetCheckmarkTaxiQueue = false;
let isValidCheckmarkTaxiQueue = false;
let isSetCheckmarkTakeoff = false;
let isValidCheckmarkTakeoff = false;
let isSetCheckmarkAltitude = false;
let isValidCheckmarkAltitude = false;
let isSetCheckmarkHandoff = false;
let isValidCheckmarkHandoff = false;

export const stageDeparture = (
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
    objEventCB.buttonTakeoff = false;
    objEventCB.altitudeValue = null;
    objEventCB.buttonHandoff = null;

    state.dialogBox = { top: 0.1, left: 0.1, width: 0.5, html: '<clear>' };
    setTimeout(() => {
      const html =
        `<div class="line"><b>Departure - Take off and Handoff</b><br></div>` +
        `<div class="line"> Start aircraft departure roll. Once airborne, climb aircraft and direct to handoff waypoint. Keyboard shortcuts shown in brackets.</div>` +
        `<div class="line"> <span hidden class="checkmark check-0">&check;</span> <span class="cross check-0">&times;</span> <span class="text">Select plane from taxi queue (Arrows)</span></div>` +
        `<div class="line"> <span hidden class="checkmark check-1">&check;</span> <span class="cross check-1">&times;</span> <span class="text">Start takeoff roll (T)</span></div>` +
        `<div class="line"> <span hidden class="checkmark check-2">&check;</span> <span class="cross check-2">&times;</span> <span class="text">Wait until airborne, then set handoff altitude of 6000ft or above (Enter: set and cycle)</span></div>` +
        `<div class="line"> <span hidden class="checkmark check-3">&check;</span> <span class="cross check-3">&times;</span> <span class="text">Set handoff, aircraft will steer towards departure waypoint DET (H)</span></div>`;

      addToGameFn();
      state.dialogBox = { top: 0.04, left: 0.2, width: 0.7, html };
    }, 1000);
  }

  const isDeparturePlaneSelected =
    planeSelected?.destinationType === DestinationType.Departure;
  const isReadyFirstInput = elapsedTime > ElapsedTimes.DepartureFirstInputMs;

  if (
    isReadyFirstInput &&
    event === Events.WaitForSelected0 &&
    !objEventCB.isPlaneSelected
  ) {
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = flightStripQueue(screenSize);
    setGameLoopStateFn(false);
  }

  if (event === Events.WaitForSelected0 && objEventCB.isPlaneSelected) {
    event = Events.WaitForInput0;
    isSetCheckmarkTaxiQueue = true;
  }

  if (event === Events.WaitForInput0 && isSetCheckmarkTaxiQueue) {
    event = Events.WaitForInput1;
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = controlPanelTakeoff(screenSize);
  }

  if (event === Events.WaitForInput1 && objEventCB.buttonTakeoff) {
    event = Events.WaitForInput2;
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = controlPanelAltitude(screenSize);
    isSetCheckmarkTakeoff = true;
  }

  if (event === Events.WaitForInput2 && objEventCB.altitudeValue) {
    if (objEventCB.altitudeValue >= 6000) {
      event = Events.WaitForInput3;
      state.focusCircleType = FocusCircleType.Rectangle;
      state.focusCircle = controlPanelTakeoff(screenSize);
      isSetCheckmarkAltitude = true;
    }
  }

  if (event === Events.WaitForInput3 && objEventCB.buttonHandoff) {
    state.focusCircleType = null;
    isSetCheckmarkHandoff = true;
  }

  if (isSetCheckmarkTaxiQueue && isDeparturePlaneSelected) {
    isValidCheckmarkTaxiQueue = true;
  }

  if (isSetCheckmarkTakeoff && isDeparturePlaneSelected) {
    isValidCheckmarkTakeoff = true;
  }

  const isValidAltitude = planeSelected?.altitudeTarget >= 6000;
  if (isSetCheckmarkAltitude && isDeparturePlaneSelected && isValidAltitude) {
    isValidCheckmarkAltitude = true;
  } else {
    isValidCheckmarkAltitude = false;
  }

  const isValidHandoff = !!planeSelected?.isHandoff;
  if (isSetCheckmarkHandoff && isDeparturePlaneSelected && isValidHandoff) {
    isValidCheckmarkHandoff = true;
  } else {
    isValidCheckmarkHandoff = false;
  }

  if (
    isValidCheckmarkTaxiQueue &&
    isValidCheckmarkTakeoff &&
    isValidCheckmarkAltitude &&
    isValidCheckmarkHandoff
  ) {
    completeStageFn();
  }

  // delay checkmark update until instructions dialog box complete
  if (!isReadyFirstInput) return;

  if (isValidCheckmarkTaxiQueue) {
    document.querySelector('.checkmark.check-0')?.removeAttribute('hidden');
    document.querySelector('.cross.check-0')?.setAttribute('hidden', true);
  }

  if (isValidCheckmarkTakeoff) {
    document.querySelector('.checkmark.check-1')?.removeAttribute('hidden');
    document.querySelector('.cross.check-1')?.setAttribute('hidden', true);
  }

  if (isValidCheckmarkAltitude) {
    document.querySelector('.checkmark.check-2')?.removeAttribute('hidden');
    document.querySelector('.cross.check-2')?.setAttribute('hidden', true);
  } else {
    document.querySelector('.checkmark.check-2')?.setAttribute('hidden', true);
    document.querySelector('.cross.check-2')?.removeAttribute('hidden');
  }

  if (isValidCheckmarkHandoff) {
    document.querySelector('.checkmark.check-3')?.removeAttribute('hidden');
    document.querySelector('.cross.check-3')?.setAttribute('hidden', true);
  } else {
    document.querySelector('.checkmark.check-3')?.setAttribute('hidden', true);
    document.querySelector('.cross.check-3')?.removeAttribute('hidden');
  }
};
