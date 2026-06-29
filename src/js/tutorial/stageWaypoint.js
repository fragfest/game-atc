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

    isSetCheckmarkPlaneSelected = false;
    isValidCheckmarkPlaneSelected = false;
    isSetCheckmarkWaypoint = false;
    isValidWaypoint = false;
    isSetCheckmarkHolding = false;
    isValidHolding = false;

    state.dialogBox = { top: 0.04, left: 0.2, width: 0.62, html: '<clear>' };
    setTimeout(() => {
      const html =
        `<div class="line"><b>Arrival - Hold at waypoint</b><br></div>` +
        `<div class="line"> Set arriving aircraft's waypoint and direct it to circle in a holding pattern</div>` +
        `<div class="line"> <span class="checkmark check-0 hidden">&check;</span> <span class="cross check-0">&times;</span> <span class="text">Select second arriving aircraft (Arrows)</span></div>` +
        `<div class="line"> <span class="checkmark check-1 hidden">&check;</span> <span class="cross check-1">&times;</span> <span class="text">Select arrival waypoint BIG (W)</span></div>` +
        `<div class="line"> <span class="checkmark check-2 hidden">&check;</span> <span class="cross check-2">&times;</span> <span class="text">Activate hold at waypoint (H)</span></div>`;

      addToGameFn();
      state.dialogBox = { top: 0.04, left: 0.2, width: 0.65, html };
    }, 1000);
  }

  const flightstripArrivalIndex = 1;
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
    resetFocus(state.focusObj);
    state.focusObj.flightStripArrFocusIndex = flightstripArrivalIndex;
    state.focusObj.isFlightStripArrFocus = true;
    setGameLoopStateFn(false);
  }

  if (event === Events.WaitForSelected0 && isSecondArrivalPlaneSelected) {
    event = Events.WaitForInput0;
    isSetCheckmarkPlaneSelected = true;
  }

  if (event === Events.WaitForInput0 && isSetCheckmarkPlaneSelected) {
    state.focusObj.isFlightStripArrFocus = false;
    state.focusObj.flightStripArrFocusIndex = flightstripArrivalIndex;
    state.focusObj.isFlightStripArrWaypointFocus = true;
  }

  const isWaypointSelected =
    !planeSelected?.landing && planeSelected?.waypoint === 'BIG';
  if (event === Events.WaitForInput0 && isWaypointSelected) {
    isSetCheckmarkWaypoint = true;
  }

  if (event === Events.WaitForInput0 && isSetCheckmarkWaypoint) {
    state.focusObj.isFlightStripArrWaypointFocus = false;
    state.focusObj.isControlPanelHoldHandoffFocus = true;
  }

  const isHoldingSelected = !planeSelected?.landing && planeSelected?.isHolding;
  if (event === Events.WaitForInput0 && isHoldingSelected) {
    resetFocus(state.focusObj);
    isSetCheckmarkHolding = true;
  }

  if (isSetCheckmarkPlaneSelected && isSecondArrivalPlaneSelected) {
    isValidCheckmarkPlaneSelected = true;
  } else {
    isValidCheckmarkPlaneSelected = false;
  }

  if (isSetCheckmarkWaypoint && isWaypointSelected) {
    isValidWaypoint = true;
  } else {
    isValidWaypoint = false;
  }

  if (isSetCheckmarkHolding && isHoldingSelected) {
    isValidHolding = true;
  } else {
    isValidHolding = false;
  }

  if (isValidCheckmarkPlaneSelected && isValidWaypoint && isValidHolding) {
    event = '';
    completeStageFn();
    setTimeout(() => {
      state.dialogBox = { top: 0.07, left: 0.3, width: 0.62, html: '<clear>' };
    }, 5000);
  }

  if (!isReadyFirstInput) return;

  if (isValidCheckmarkPlaneSelected) {
    document.querySelector('.checkmark.check-0')?.classList.remove('hidden');
    document.querySelector('.cross.check-0')?.classList.add('hidden');
  } else {
    document.querySelector('.checkmark.check-0')?.classList.add('hidden');
    document.querySelector('.cross.check-0')?.classList.remove('hidden');
  }

  if (isValidWaypoint) {
    document.querySelector('.checkmark.check-1')?.classList.remove('hidden');
    document.querySelector('.cross.check-1')?.classList.add('hidden');
  } else {
    document.querySelector('.checkmark.check-1')?.classList.add('hidden');
    document.querySelector('.cross.check-1')?.classList.remove('hidden');
  }

  if (isValidHolding) {
    document.querySelector('.checkmark.check-2')?.classList.remove('hidden');
    document.querySelector('.cross.check-2')?.classList.add('hidden');
  } else {
    document.querySelector('.checkmark.check-2')?.classList.add('hidden');
    document.querySelector('.cross.check-2')?.classList.remove('hidden');
  }
};
