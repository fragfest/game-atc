import { ElapsedTimes } from './typesTutorial';
import { FocusCircleType } from '../types';
import { radToDegrees } from '../utils';
import {
  controlPanelAltitude,
  controlPanelHeading,
  controlPanelLanding,
  flightStripSecond,
} from './focusCircleTutorial.js';
import { DestinationType } from '../aircraft/airframe';

let event = '';
const Events = Object.freeze({
  WaitForSelected0: 'WaitForSelected0',
  WaitForInput0: 'WaitForInput0',
  WaitForInput1: 'WaitForInput1',
  WaitForInput2: 'WaitForInput2',
  WaitForInput3: 'WaitForInput3',
  WaitForInput4: 'WaitForInput4',
  WaitForInput5: 'WaitForInput5',
});

let isValidCheckmarkSelected = false;
let isSetCheckmarkAltitude = false;
let isValidCheckmarkAltitude = false;
let isSetCheckmarkHeading = false;
let isValidCheckmarkHeading = false;
let isSetCheckmarkLanding = false;
let isValidCheckmarkLanding = false;

export const stageArrivalLand = (
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
    objEventCB.isPlaneSelected = false;
    event = Events.WaitForInput0;
    state.dialogBox = { top: 0.07, left: 0.3, width: 0.61, html: '<clear>' };

    setTimeout(() => {
      const html =
        `<div class="line"><b>Arrival - Land Aircraft</b><br></div>` +
        `<div class="line"> Descend aircraft for an assisted (ILS) approach. Direct aircraft to runway and authorize the approach.</div>` +
        `<div class="line"> <span hidden class="checkmark check-0">&check;</span> <span class="cross check-0">&times;</span> <span class="text">Select arriving aircraft (Arrows)</span></div>` +
        `<div class="line"> <span hidden class="checkmark check-1">&check;</span> <span class="cross check-1">&times;</span> <span class="text">Lower to approach altitude of 5000ft or below (Enter)</span></div>` +
        `<div class="line"> <span hidden class="checkmark check-2">&check;</span> <span class="cross check-2">&times;</span> <span class="text">Change heading to runway 27L (Enter)</span></div>` +
        `<div class="line"> <span hidden class="checkmark check-3">&check;</span> <span class="cross check-3">&times;</span> <span class="text">When in range, click land (L)</span></div>`;

      addToGameFn();
      state.dialogBox = { top: 0.07, left: 0.3, width: 0.63, html };
    }, 1000);
  }

  let allowCheckmarkUpdate = false;
  if (elapsedTime > ElapsedTimes.ArrivalLandFirstInputMs) {
    allowCheckmarkUpdate = true;
  }

  const isArrivalPlaneSelected =
    planeSelected &&
    planeSelected.destinationType === DestinationType.Arrival &&
    objEventCB.isPlaneSelected;

  if (
    elapsedTime > ElapsedTimes.ArrivalLandFirstInputMs &&
    event === Events.WaitForInput0
  ) {
    event = Events.WaitForSelected0;
  }

  if (event === Events.WaitForSelected0 && !isArrivalPlaneSelected) {
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = flightStripSecond(screenSize);
    setGameLoopStateFn(false);
  }

  if (event === Events.WaitForSelected0 && isArrivalPlaneSelected) {
    event = Events.WaitForInput1;
    isValidCheckmarkSelected = true;
    objEventCB.altitudeValue = null;
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = controlPanelAltitude(screenSize);
  }

  if (
    event === Events.WaitForInput1 &&
    isArrivalPlaneSelected &&
    objEventCB.altitudeValue
  ) {
    if (objEventCB.altitudeValue <= 5000) {
      event = Events.WaitForInput2;
      objEventCB.altitudeValue = null;
      objEventCB.headingValue = null;
      isSetCheckmarkAltitude = true;
    }
  }

  if (event === Events.WaitForInput2 && isSetCheckmarkAltitude) {
    event = Events.WaitForInput3;
    if (planeSelected.altitudeTarget <= 5000) isValidCheckmarkAltitude = true;
    else isValidCheckmarkAltitude = false;
  }

  if (event === Events.WaitForInput3 && !objEventCB.headingValue) {
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = controlPanelHeading(screenSize);
  }

  if (
    event === Events.WaitForInput3 &&
    isArrivalPlaneSelected &&
    objEventCB.headingValue
  ) {
    if (objEventCB.headingValue >= 260 && objEventCB.headingValue <= 280) {
      event = Events.WaitForInput4;
      objEventCB.headingValue = null;
      objEventCB.buttonLanding = false;
      isSetCheckmarkHeading = true;
    }
  }

  if (
    event === Events.WaitForInput4 &&
    isArrivalPlaneSelected &&
    isSetCheckmarkHeading
  ) {
    const headingTargetDeg = radToDegrees(planeSelected.headingTargetRad);
    if (headingTargetDeg >= 260 && headingTargetDeg <= 280) {
      event = Events.WaitForInput5;
      objEventCB.buttonLanding = false;
      isValidCheckmarkHeading = true;
    } else {
      isValidCheckmarkHeading = false;
    }
  }

  if (event === Events.WaitForInput5 && !objEventCB.buttonLanding) {
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = controlPanelLanding(screenSize);
  }

  if (event === Events.WaitForInput5 && objEventCB.buttonLanding) {
    state.focusCircleType = null;
    objEventCB.buttonLanding = false;
    isSetCheckmarkLanding = true;
  }

  if (isArrivalPlaneSelected && isSetCheckmarkLanding) {
    if (planeSelected.landing) isValidCheckmarkLanding = true;
    else isValidCheckmarkLanding = false;
  }

  if (
    isValidCheckmarkSelected &&
    isValidCheckmarkAltitude &&
    isValidCheckmarkHeading &&
    isValidCheckmarkLanding
  ) {
    completeStageFn();
    setTimeout(() => {
      state.dialogBox = { top: 0.07, left: 0.3, width: 0.61, html: '<clear>' };
    }, 5000);
  }

  if (!allowCheckmarkUpdate) return;

  if (isValidCheckmarkSelected) {
    document.querySelector('.checkmark.check-0')?.removeAttribute('hidden');
    document.querySelector('.cross.check-0')?.setAttribute('hidden', true);
  }

  if (isValidCheckmarkAltitude) {
    document.querySelector('.checkmark.check-1')?.removeAttribute('hidden');
    document.querySelector('.cross.check-1')?.setAttribute('hidden', true);
  } else {
    document.querySelector('.checkmark.check-1')?.setAttribute('hidden', true);
    document.querySelector('.cross.check-1')?.removeAttribute('hidden');
  }

  if (isValidCheckmarkHeading) {
    document.querySelector('.checkmark.check-2')?.removeAttribute('hidden');
    document.querySelector('.cross.check-2')?.setAttribute('hidden', true);
  } else {
    document.querySelector('.checkmark.check-2')?.setAttribute('hidden', true);
    document.querySelector('.cross.check-2')?.removeAttribute('hidden');
  }

  if (isValidCheckmarkLanding) {
    document.querySelector('.checkmark.check-3')?.removeAttribute('hidden');
    document.querySelector('.cross.check-3')?.setAttribute('hidden', true);
  } else {
    document.querySelector('.checkmark.check-3')?.setAttribute('hidden', true);
    document.querySelector('.cross.check-3')?.removeAttribute('hidden');
  }
};
