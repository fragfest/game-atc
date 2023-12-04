import { ElapsedTimes } from './typesTutorial';
import { FocusCircleType } from '../types';
import { controlPanelHolding, flightStripThird, flightStripThirdWaypoint } from './focusCircleTutorial';
import { DestinationType } from '../aircraft/airframe';

let event = '';
const Events = Object.freeze({
  WaitForInput0: 'WaitForInput0',
  WaitForInput1: 'WaitForInput1',
  WaitForInput2: 'WaitForInput2',
  WaitForInput3: 'WaitForInput3',
  WaitForInput4: 'WaitForInput4',
  WaitForSelected0: 'WaitForSelected0',
});

let isSetCheckmarkPlaneSelected = false;
let isSetCheckmarkWaypoint = false;
let isValidWaypoint = false;
let isSetCheckmarkHolding = false;
let isValidHolding = false;

export const stageWaypoint = (state, objEventCB, screenSize, elapsedTime, planeSelected, addToGameFn, setGameLoopStateFn, completeStageFn) => {
  if (!event) {
    objEventCB.isPlaneSelected = false;
    event = Events.WaitForInput0;
    state.dialogBox = { top: 0.07, left: 0.3, width: 0.57, html: '<clear>' };

    setTimeout(() => {
      const html = `<div class="line"><b>Arrival - Hold at waypoint</b><br></div>` +
      `<div class="line"> Set arriving aircraft's waypoint and direct it to circle in a holding pattern</div>` +
      `<div class="line"> <span hidden class="checkmark check-0">&check;</span> <span class="cross check-0">&times;</span> <span class="text">Select second arriving aircraft (Arrows)</span></div>` +
      `<div class="line"> <span hidden class="checkmark check-1">&check;</span> <span class="cross check-1">&times;</span> <span class="text">Select arrival waypoint BIG (W)</span></div>` +
      `<div class="line"> <span hidden class="checkmark check-2">&check;</span> <span class="cross check-2">&times;</span> <span class="text">Activate hold at waypoint (H)</span></div>`;
      
      addToGameFn();
      state.dialogBox = { top: 0.07, left: 0.3, width: 0.57, html };
    }, 1000);
  }

  let allowCheckmarkUpdate = false;
  if(elapsedTime > ElapsedTimes.ArrivalLandFirstInputMs) {
    allowCheckmarkUpdate = true;
  }

  if((elapsedTime > ElapsedTimes.WaypointFirstInputMs ) && (event === Events.WaitForInput0)) {
    event = Events.WaitForSelected0;
    objEventCB.isPlaneSelected = false;
  }

  const isThirdPlaneSelected = objEventCB.isPlaneSelected && (planeSelected?.destinationType === DestinationType.Arrival) && !planeSelected?.landing;

  if ((event === Events.WaitForSelected0) && !isThirdPlaneSelected) {
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = flightStripThird(screenSize);
    setGameLoopStateFn(false);
  }

  if((event === Events.WaitForSelected0) && isThirdPlaneSelected) {
    event = Events.WaitForInput1;
    objEventCB.isPlaneSelected = false;
    isSetCheckmarkPlaneSelected = true;
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = flightStripThirdWaypoint(screenSize);
  }

  const isWaypointSelected = !planeSelected?.landing && (planeSelected?.waypoint === 'BIG');

  if(event === Events.WaitForInput1 && isWaypointSelected) {
    isSetCheckmarkWaypoint = true;
    event = Events.WaitForInput2;
    objEventCB.buttonIsHolding = false;
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = controlPanelHolding(screenSize);
  }

  if(isSetCheckmarkWaypoint && isWaypointSelected) {
    isValidWaypoint = true;
  } else {
    isValidWaypoint = false;
  }

  const isHoldingSelected = isWaypointSelected && planeSelected?.isHolding;

  if(event === Events.WaitForInput2 && objEventCB.buttonIsHolding && isHoldingSelected) {
    event = Events.WaitForInput3;
    isSetCheckmarkHolding = true;
    state.focusCircleType = null;
  }

  if(isSetCheckmarkHolding && isHoldingSelected) {
    isValidHolding = true;
  } else {
    isValidHolding = false;
  }

  if(isSetCheckmarkPlaneSelected && isValidWaypoint && isValidHolding) {
    completeStageFn();
    setTimeout(() => {
      state.dialogBox = { top: 0.07, left: 0.3, width: 0.57, html: '<clear>' };
    }, 5000);
  }

  if(!allowCheckmarkUpdate) return;

  if(isSetCheckmarkPlaneSelected) {
    document.querySelector('.checkmark.check-0')?.removeAttribute('hidden');
    document.querySelector('.cross.check-0')?.setAttribute('hidden', true);
  }

  if(isValidWaypoint) {
    document.querySelector('.checkmark.check-1')?.removeAttribute('hidden');
    document.querySelector('.cross.check-1')?.setAttribute('hidden', true);
  } else {
    document.querySelector('.checkmark.check-1')?.setAttribute('hidden', true);
    document.querySelector('.cross.check-1')?.removeAttribute('hidden');
  }

  if(isValidHolding) {
    document.querySelector('.checkmark.check-2')?.removeAttribute('hidden');
    document.querySelector('.cross.check-2')?.setAttribute('hidden', true);
  } else {
    document.querySelector('.checkmark.check-2')?.setAttribute('hidden', true);
    document.querySelector('.cross.check-2')?.removeAttribute('hidden');
  }
}