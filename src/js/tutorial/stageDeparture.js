import { ElapsedTimes, resetFocus } from './utilsTutorial';
import { DestinationType } from '../types';

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

    isSetCheckmarkTaxiQueue = false;
    isValidCheckmarkTaxiQueue = false;
    isSetCheckmarkTakeoff = false;
    isValidCheckmarkTakeoff = false;
    isSetCheckmarkAltitude = false;
    isValidCheckmarkAltitude = false;
    isSetCheckmarkHandoff = false;
    isValidCheckmarkHandoff = false;

    state.dialogBox = { top: 0.1, left: 0.1, width: 0.5, html: '<clear>' };
    setTimeout(() => {
      const html =
        `<div class="line"><b>Departure - Take off and Handoff</b><br></div>` +
        `<div class="line"> Start aircraft departure roll. Once airborne, climb aircraft and direct to handoff waypoint. Keyboard shortcuts shown in brackets ().</div>` +
        `<div class="line"> <span class="checkmark check-0 hidden"></span> <span class="cross check-0"></span> <span class="text">Select plane from taxi queue (Arrows)</span></div>` +
        `<div class="line"> <span class="checkmark check-1 hidden"></span> <span class="cross check-1"></span> <span class="text">Start takeoff roll (T)</span></div>` +
        `<div class="line"> <span class="checkmark check-2 hidden"></span> <span class="cross check-2"></span> <span class="text">Once airborne type "060" to set handoff altitude of 6000ft, or set it higher (Enter: sets value)</span></div>` +
        `<div class="line"> <span class="checkmark check-3 hidden"></span> <span class="cross check-3"></span> <span class="text">Set handoff, aircraft will steer towards departure waypoint DET (H)</span></div>`;

      addToGameFn();
      state.dialogBox = { top: 0.04, left: 0.1, width: 0.8, html };
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
    resetFocus(state.focusObj);
    state.focusObj.isFlightStripDepFocus = true;
    setGameLoopStateFn(false);
  }

  if (event === Events.WaitForSelected0 && objEventCB.isPlaneSelected) {
    event = Events.WaitForInput0;
    isSetCheckmarkTaxiQueue = true;
  }

  if (event === Events.WaitForInput0 && isSetCheckmarkTaxiQueue) {
    event = Events.WaitForInput1;
    resetFocus(state.focusObj);
    state.focusObj.isControlPanelTakeoffLandFocus = true;
  }

  if (event === Events.WaitForInput1 && objEventCB.buttonTakeoff) {
    resetFocus(state.focusObj);
    state.focusObj.isControlPanelAltitudeFocus = true;
    isSetCheckmarkTakeoff = true;
  }

  if (event === Events.WaitForInput1 && objEventCB.altitudeValue) {
    if (objEventCB.altitudeValue >= 6000) {
      resetFocus(state.focusObj);
      state.focusObj.isControlPanelHoldHandoffFocus = true;
      isSetCheckmarkAltitude = true;
    }
  }

  if (event === Events.WaitForInput1 && objEventCB.buttonHandoff) {
    resetFocus(state.focusObj);
    isSetCheckmarkHandoff = true;
  }

  if (isSetCheckmarkTaxiQueue && isDeparturePlaneSelected) {
    isValidCheckmarkTaxiQueue = true;
  }

  if (isSetCheckmarkTakeoff) {
    isValidCheckmarkTakeoff = true;
  }

  const isValidAltitude = planeSelected?.altitudeTarget >= 6000;
  if (isSetCheckmarkAltitude && isValidAltitude) {
    isValidCheckmarkAltitude = true;
  } else {
    isValidCheckmarkAltitude = false;
  }

  const isValidHandoff = !!planeSelected?.isHandoff;
  if (isSetCheckmarkHandoff && isValidHandoff) {
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
    event = '';
    completeStageFn();
  }

  // delay checkmark update until instructions dialog box complete
  if (!isReadyFirstInput) return;

  if (isValidCheckmarkTaxiQueue) {
    document.querySelector('.checkmark.check-0')?.classList.remove('hidden');
    document.querySelector('.cross.check-0')?.classList.add('hidden');
  }

  if (isValidCheckmarkTakeoff) {
    document.querySelector('.checkmark.check-1')?.classList.remove('hidden');
    document.querySelector('.cross.check-1')?.classList.add('hidden');
  }

  if (isValidCheckmarkAltitude) {
    document.querySelector('.checkmark.check-2')?.classList.remove('hidden');
    document.querySelector('.cross.check-2')?.classList.add('hidden');
  } else {
    document.querySelector('.checkmark.check-2')?.classList.add('hidden');
    document.querySelector('.cross.check-2')?.classList.remove('hidden');
  }

  if (isValidCheckmarkHandoff) {
    document.querySelector('.checkmark.check-3')?.classList.remove('hidden');
    document.querySelector('.cross.check-3')?.classList.add('hidden');
  } else {
    document.querySelector('.checkmark.check-3')?.classList.add('hidden');
    document.querySelector('.cross.check-3')?.classList.remove('hidden');
  }
};
