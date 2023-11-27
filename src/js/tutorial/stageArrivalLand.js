import { FocusCircleType } from "../types";
import { flightStripFirst, controlPanelAltitude, controlPanelHeading, controlPanelLanding } from "./focusCircleTutorial.js";

let event = '';
const Events = Object.freeze({
  WaitForSelected0: 'WaitForSelected0',
  WaitForInput0: 'WaitForInput0',
  WaitForInput1: 'WaitForInput1',
  WaitForInput2: 'WaitForInput2',
  WaitForInput3: 'WaitForInput3',
})

let isSetCheckmarkAltitude = false;
let isValidCheckmarkAltitude = false;
let isSetCheckmarkHeading = false;
let isValidCheckmarkHeading = false;
let isSetCheckmarkLanding = false;
let isValidCheckmarkLanding = false;

export const stageArrivalLand = (state, objEventCB, screenSize, elapsedTime, planeSelected, addToGameFn, setGameLoopStateFn, completeStageFn) => {
  if (!event) {
    event = Events.WaitForInput0;
    state.dialogBox = { top: 0.1, left: 0.4, width: 0.50, html: '<clear>' };

    setTimeout(() => {
      const html = `<b>Arrival - Land Aircraft</b><br>` +
      `<div class="line"> Descend aircraft for an assisted (ILS) approach. Steer aircraft to runway and authorize the approach.</div>` +
      `<div class="line"> <span hidden class="checkmark check-0">&check;</span> <span class="cross check-0">&times;</span> <span class="text">select plane</span></div>` +
      `<div class="line"> <span hidden class="checkmark check-1">&check;</span> <span class="cross check-1">&times;</span> <span class="text">lower to approach altitude of 5000ft or below</span></div>` +
      `<div class="line"> <span hidden class="checkmark check-2">&check;</span> <span class="cross check-2">&times;</span> <span class="text">change heading to runway 27L</span></div>` +
      `<div class="line"> <span hidden class="checkmark check-3">&check;</span> <span class="cross check-3">&times;</span> <span class="text">when in range, click land</span></div>`;
      
      addToGameFn();
      state.dialogBox = { top: 0.07, left: 0.3, width: 0.6, html };
    }, 1000);
  }
  
  if((elapsedTime > 28000) && (event === Events.WaitForInput0)) {
    event = Events.WaitForSelected0;
    objEventCB.isPlaneSelected = false;
  }

  if ((event === Events.WaitForSelected0) && !objEventCB.isPlaneSelected) {
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = flightStripFirst(screenSize);
    setGameLoopStateFn(false);
  }
  
  if((event === Events.WaitForSelected0) && objEventCB.isPlaneSelected) {
    event = Events.WaitForInput1;
    objEventCB.altitudeValue = null;
    objEventCB.isPlaneSelected = false;
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = controlPanelAltitude(screenSize);
    document.querySelector('.checkmark.check-0').removeAttribute('hidden');
    document.querySelector('.cross.check-0').setAttribute('hidden', true);
  }

  if((event === Events.WaitForInput1) && objEventCB.altitudeValue) {
    if(objEventCB.altitudeValue <= 5000) {
      objEventCB.altitudeValue = null;
      isSetCheckmarkAltitude = true;
      event = Events.WaitForInput2;
      objEventCB.headingValue = null;
      return;
    }
  }

  if(planeSelected && isSetCheckmarkAltitude) {
    if(planeSelected.altitude <= 5000) isValidCheckmarkAltitude = true;
    else isValidCheckmarkAltitude = false;
  }

  if((event === Events.WaitForInput2) && !objEventCB.headingValue) {
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = controlPanelHeading(screenSize);
  }

  if((event === Events.WaitForInput2) && objEventCB.headingValue) {
    if(objEventCB.headingValue <= 280 && objEventCB.headingValue >= 260) {
      objEventCB.headingValue = null;
      isSetCheckmarkHeading = true;
      event = Events.WaitForInput3;
      objEventCB.buttonLanding = false;
      return;
    }
  }

  if(planeSelected && isSetCheckmarkHeading) {
    const heading = parseInt(planeSelected.heading);
    if(heading <= 280 && heading >= 260) isValidCheckmarkHeading = true;
    else isValidCheckmarkHeading = false;
  }

  if((event === Events.WaitForInput3) && !objEventCB.buttonLanding) {
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = controlPanelLanding(screenSize);
  }

  if((event === Events.WaitForInput3) && objEventCB.buttonLanding) {
    state.focusCircleType = null;
    objEventCB.buttonLanding = false;
    isSetCheckmarkLanding = true;
  }

  if(planeSelected && isSetCheckmarkLanding) {
    if(planeSelected.landing) isValidCheckmarkLanding = true;
    else isValidCheckmarkLanding = false;
  }

  if(isValidCheckmarkAltitude && isValidCheckmarkHeading && isValidCheckmarkLanding) {
    completeStageFn();
    setTimeout(() => {
      state.dialogBox = { top: 0.07, left: 0.3, width: 0.6, html: '<clear>' };
    }, 5000);
  }

  if(isValidCheckmarkAltitude) {
    document.querySelector('.checkmark.check-1')?.removeAttribute('hidden');
    document.querySelector('.cross.check-1')?.setAttribute('hidden', true);
  } else {
    document.querySelector('.checkmark.check-1')?.setAttribute('hidden', true);
    document.querySelector('.cross.check-1')?.removeAttribute('hidden');
  }

  if(isValidCheckmarkHeading) {
    document.querySelector('.checkmark.check-2')?.removeAttribute('hidden');
    document.querySelector('.cross.check-2')?.setAttribute('hidden', true);
  } else {
    document.querySelector('.checkmark.check-2')?.setAttribute('hidden', true);
    document.querySelector('.cross.check-2')?.removeAttribute('hidden');
  }

  if(isValidCheckmarkLanding) {
    document.querySelector('.checkmark.check-3')?.removeAttribute('hidden');
    document.querySelector('.cross.check-3')?.setAttribute('hidden', true);
  } else {
    document.querySelector('.checkmark.check-3')?.setAttribute('hidden', true);
    document.querySelector('.cross.check-3')?.removeAttribute('hidden');
  }

}