import { ElapsedTimes } from "./typesTutorial";
import { FocusCircleType } from "../types";
import {
  controlPanelAltitude,
  flightStripQueue,
  controlPanelTakeoff,
} from "./focusCircleTutorial";

let event = "";
const Events = Object.freeze({
  WaitForInput0: "WaitForInput0",
  WaitForInput1: "WaitForInput1",
  WaitForInput2: "WaitForInput2",
  WaitForInput3: "WaitForInput3",
  WaitForInput4: "WaitForInput4",
  WaitForSelected0: "WaitForSelected0",
});

let isSetCheckmarkTaxiQueue = false;
let isSetCheckmarkTakeoff = false;
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
    objEventCB.isPlaneSelected = false;
    event = Events.WaitForInput0;
    state.dialogBox = { top: 0.04, left: 0.2, width: 0.67, html: "<clear>" };

    setTimeout(() => {
      const html =
        `<div class="line"><b>Departure - Take off and Handoff</b><br></div>` +
        `<div class="line"> Start aircraft departure roll. Once airborne, climb aircraft and direct to handoff waypoint. Brackets show keyboard shortcut keys.</div>` +
        `<div class="line"> <span hidden class="checkmark check-0">&check;</span> <span class="cross check-0">&times;</span> <span class="text">Select plane from taxi queue (Arrows)</span></div>` +
        `<div class="line"> <span hidden class="checkmark check-1">&check;</span> <span class="cross check-1">&times;</span> <span class="text">Start takeoff roll (T)</span></div>` +
        `<div class="line"> <span hidden class="checkmark check-2">&check;</span> <span class="cross check-2">&times;</span> <span class="text">Wait until airborne, then set handoff altitude of 6000ft or above (Enter: set and cycle)</span></div>` +
        `<div class="line"> <span hidden class="checkmark check-3">&check;</span> <span class="cross check-3">&times;</span> <span class="text">Set handoff, aircraft will steer towards departure waypoint DET (H)</span></div>`;

      addToGameFn();
      state.dialogBox = { top: 0.04, left: 0.2, width: 0.67, html };
    }, 1000);
  }

  let allowCheckmarkUpdate = false;
  if (elapsedTime > ElapsedTimes.DepartureFirstInputMs) {
    allowCheckmarkUpdate = true;
  }

  if (
    elapsedTime > ElapsedTimes.DepartureFirstInputMs &&
    event === Events.WaitForInput0 &&
    !objEventCB.isPlaneSelected
  ) {
    event = Events.WaitForSelected0;
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = flightStripQueue(screenSize);
    setGameLoopStateFn(false);
  }

  if (objEventCB.isPlaneSelected) {
    event = Events.WaitForInput1;
    objEventCB.isPlaneSelected = false;
    isSetCheckmarkTaxiQueue = true;
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = controlPanelTakeoff(screenSize);
  }

  if (event === Events.WaitForInput1 && objEventCB.buttonTakeoff) {
    event = Events.WaitForInput2;
    objEventCB.buttonTakeoff = false;
    state.focusCircleType = null;
    isSetCheckmarkTakeoff = true;
    objEventCB.altitudeValue = null;
  }

  if (event === Events.WaitForInput2 && !objEventCB.altitudeValue) {
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = controlPanelAltitude(screenSize);
  }

  if (event === Events.WaitForInput2 && objEventCB.altitudeValue) {
    if (objEventCB.altitudeValue >= 6000) {
      state.focusCircleType = null;
      isSetCheckmarkAltitude = true;
      event = Events.WaitForInput3;
      objEventCB.buttonHandoff = false;
    }
  }

  if (isSetCheckmarkAltitude) {
    if (objEventCB.altitudeValue >= 6000) isValidCheckmarkAltitude = true;
    else isValidCheckmarkAltitude = false;
  }

  if (event === Events.WaitForInput3 && !objEventCB.buttonHandoff) {
    state.focusCircleType = FocusCircleType.Rectangle;
    state.focusCircle = controlPanelTakeoff(screenSize);
  }

  if (event === Events.WaitForInput3 && objEventCB.buttonHandoff) {
    objEventCB.buttonHandoff = false;
    state.focusCircleType = null;
    isSetCheckmarkHandoff = true;
    event = Events.WaitForInput4;
  }

  if (planeSelected && isSetCheckmarkHandoff) {
    isValidCheckmarkHandoff = planeSelected.isHandoff;
  }

  if (
    isSetCheckmarkTaxiQueue &&
    isSetCheckmarkTakeoff &&
    isValidCheckmarkAltitude &&
    isValidCheckmarkHandoff
  ) {
    completeStageFn();
  }

  if (!allowCheckmarkUpdate) return;

  if (isSetCheckmarkTaxiQueue) {
    document.querySelector(".checkmark.check-0")?.removeAttribute("hidden");
    document.querySelector(".cross.check-0")?.setAttribute("hidden", true);
  }

  if (isSetCheckmarkTakeoff) {
    document.querySelector(".checkmark.check-1")?.removeAttribute("hidden");
    document.querySelector(".cross.check-1")?.setAttribute("hidden", true);
  }

  if (isValidCheckmarkAltitude) {
    document.querySelector(".checkmark.check-2")?.removeAttribute("hidden");
    document.querySelector(".cross.check-2")?.setAttribute("hidden", true);
  } else {
    document.querySelector(".checkmark.check-2")?.setAttribute("hidden", true);
    document.querySelector(".cross.check-2")?.removeAttribute("hidden");
  }

  if (isValidCheckmarkHandoff) {
    document.querySelector(".checkmark.check-3")?.removeAttribute("hidden");
    document.querySelector(".cross.check-3")?.setAttribute("hidden", true);
  } else {
    document.querySelector(".checkmark.check-3")?.setAttribute("hidden", true);
    document.querySelector(".cross.check-3")?.removeAttribute("hidden");
  }
};
