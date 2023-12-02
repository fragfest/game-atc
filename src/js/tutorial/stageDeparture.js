import { ElapsedTimes } from './typesTutorial';
import { FocusCircleType } from '../types';
import { controlPanelAltitude, flightStripQueue, controlPanelTakeoff } from './focusCircleTutorial';

let event = '';
const Events = Object.freeze({
  WaitForInput0: 'WaitForInput0',
  WaitForInput1: 'WaitForInput1',
  WaitForInput2: 'WaitForInput2',
  WaitForInput3: 'WaitForInput3',
  WaitForInput4: 'WaitForInput4',
  WaitForSelected0: 'WaitForSelected0',
});

let isSetCheckmarkTaxiQueue = false;
let isSetCheckmarkTakeoff = false;
let isSetCheckmarkAltitude = false;
let isValidCheckmarkAltitude = false;
let isSetCheckmarkHandoff = false;
let isValidCheckmarkHandoff = false;

export const stageDeparture = (state, objEventCB, screenSize, elapsedTime, planeSelected, addToGameFn, setGameLoopStateFn, completeStageFn) => {
  if (!event) {
    event = Events.WaitForInput0;
    state.dialogBox = { top: 0.07, left: 0.3, width: 0.6, html: '<clear>' };

    setTimeout(() => {
      const html = `<b>Departure - Take off & Handoff</b><br>` +
      `<div class="line"> Start aircraft departure roll. Once airborne, climb aircraft and steer to handoff waypoint.</div>` +
      `<div class="line"> <span hidden class="checkmark check-0">&check;</span> <span class="cross check-0">&times;</span> <span class="text">select plane from taxi queue</span></div>` +
      `<div class="line"> <span hidden class="checkmark check-1">&check;</span> <span class="cross check-1">&times;</span> <span class="text">start takeoff roll</span></div>` +
      `<div class="line"> <span hidden class="checkmark check-2">&check;</span> <span class="cross check-2">&times;</span> <span class="text">wait until airborne, then set handoff altitude of 6000ft or above</span></div>` +
      `<div class="line"> <span hidden class="checkmark check-3">&check;</span> <span class="cross check-3">&times;</span> <span class="text">set handoff, aircraft will steer towards waypoint</span></div>`;
      
      addToGameFn();
      state.dialogBox = { top: 0.07, left: 0.3, width: 0.6, html };
    }, 1000);
  }

  if((elapsedTime > ElapsedTimes.FirstInputMs ) && (event === Events.WaitForInput0)) {
    event = Events.WaitForSelected0;
    objEventCB.isPlaneSelected = false;
  }

  if ((event === Events.WaitForSelected0) && !objEventCB.isPlaneSelected) {
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = flightStripQueue(screenSize);
    setGameLoopStateFn(false);
  }

  if((event === Events.WaitForSelected0) && objEventCB.isPlaneSelected) {
    event = Events.WaitForInput1;
    objEventCB.isPlaneSelected = false;
    isSetCheckmarkTaxiQueue = true;
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = controlPanelTakeoff(screenSize);
  }

  if((event === Events.WaitForInput1) && objEventCB.buttonTakeoff) {
    event = Events.WaitForInput2;
    objEventCB.buttonTakeoff = false;
    state.focusCircleType = null;
    isSetCheckmarkTakeoff = true;
    objEventCB.altitudeValue = null;
  }

  if((event === Events.WaitForInput2) && !objEventCB.altitudeValue) {
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = controlPanelAltitude(screenSize);
  }

  if((event === Events.WaitForInput2) && objEventCB.altitudeValue) {
    if(objEventCB.altitudeValue >= 6000) {
      objEventCB.altitudeValue = null;
      state.focusCircleType = null;
      isSetCheckmarkAltitude = true;
      event = Events.WaitForInput3;
      objEventCB.buttonHandoff = false;
    }
  }

  if(planeSelected && isSetCheckmarkAltitude) {
    if(planeSelected.altitude >= 6000) isValidCheckmarkAltitude = true;
    else isValidCheckmarkAltitude = false
  }

  if((event === Events.WaitForInput3) && !objEventCB.buttonHandoff) {
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = controlPanelTakeoff(screenSize);
  }

  if((event === Events.WaitForInput3) && objEventCB.buttonHandoff) {
    objEventCB.buttonHandoff = false;
    state.focusCircleType = null;
    isSetCheckmarkHandoff = true;
    event = Events.WaitForInput4;
  }

  if(planeSelected && isSetCheckmarkHandoff) {
    isValidCheckmarkHandoff = planeSelected.isHandoff;
  }

  if(isSetCheckmarkTaxiQueue && isSetCheckmarkTakeoff && isValidCheckmarkAltitude && isValidCheckmarkHandoff) {
    completeStageFn();
    setTimeout(() => {
      state.dialogBox = { top: 0.07, left: 0.3, width: 0.6, html: '<clear>' };
    }, 5000);
  }

  if(isSetCheckmarkTaxiQueue) {
    document.querySelector('.checkmark.check-0')?.removeAttribute('hidden');
    document.querySelector('.cross.check-0')?.setAttribute('hidden', true);
  }
  
  if(isSetCheckmarkTakeoff) {
    document.querySelector('.checkmark.check-1')?.removeAttribute('hidden');
    document.querySelector('.cross.check-1')?.setAttribute('hidden', true);
  }

  if(isValidCheckmarkAltitude) {
    document.querySelector('.checkmark.check-2')?.removeAttribute('hidden');
    document.querySelector('.cross.check-2')?.setAttribute('hidden', true);
  } else {
    document.querySelector('.checkmark.check-2')?.setAttribute('hidden', true);
    document.querySelector('.cross.check-2')?.removeAttribute('hidden');
  }

  if(isValidCheckmarkHandoff) {
    document.querySelector('.checkmark.check-3')?.removeAttribute('hidden');
    document.querySelector('.cross.check-3')?.setAttribute('hidden', true);
  } else {
    document.querySelector('.checkmark.check-3')?.setAttribute('hidden', true);
    document.querySelector('.cross.check-3')?.removeAttribute('hidden');
  }

}