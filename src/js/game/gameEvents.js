import { VictoryEvents, subscribeVictory } from './victory';
import {
  KeyboardEvents,
  subscribeKeyboard as subscribe,
} from '../events/keyboard';
import { isArrival, isDeparture } from '../types';
import { nextWaypoint } from '../utils';
import { setGameLoopState } from './game';
import {
  buttonIsHoldingFn,
  buttonHandoffFn,
  buttonTakeoffFn,
  buttonLandingFn,
  planeSelectedFn,
  headingUpdatedFn,
  altitudeUpdatedFn,
} from '../tutorial/gameTutorial';
import { gameOver } from './gameOver';

/**
 * @typedef {import('./game.js').State} State
 */

/**
 * @param {VueThis} self is needed to keep a reference to computed: self.planesSorted
 * @param {Array} arrivalWaypoints list of waypoint name strings
 * @param {VueRef} planeSelVueRef vue ref to plane selected object
 * @param {Function} controlPanelFocusFn function to focus input field in controlPanel
 * @param {Function} selectPlaneFn function to set the selected plane
 * @param {Function} gamePopupFn function to set the game over pop-up
 * @param {Object} tutorialBox contains vue ref properties
 * @param {State} state game state
 */
export const setup = (
  self,
  arrivalWaypoints,
  planeSelVueRef,
  controlPanelFocusFn,
  selectPlaneFn,
  gamePopupFn,
  tutorialBox,
  state
) => {
  let isGameOver = false;
  const gameOverFreezePopup = (delayMs) => {
    setGameLoopState(state)(false);
    setTimeout(() => {
      gamePopupFn();
    }, delayMs);
  };

  subscribeVictory(VictoryEvents.Success, () => {
    if (isGameOver) return;
    isGameOver = true;
    gameOver(tutorialBox, true);
    gameOverFreezePopup(2000);
  });

  subscribeVictory(VictoryEvents.Failed, () => {
    if (isGameOver) return;
    isGameOver = true;
    gameOver(tutorialBox, false);
    gameOverFreezePopup(12000);
  });

  const selectEV = (newIndex) => {
    const planeSelected = self.planesSorted[newIndex];
    planeSelVueRef.value = planeSelected;
    controlPanelFocusFn();
    selectPlaneFn();
  };

  const arrowDownEV = (index) => {
    if (self.planesSorted.length === 0) return;
    let newIndex = index + 1;
    if (newIndex >= self.planesSorted.length) newIndex = 0;
    selectEV(newIndex);
  };

  const arrowUpEV = (index) => {
    if (self.planesSorted.length === 0) return;
    let newIndex = index - 1;
    if (newIndex < 0) newIndex = self.planesSorted.length - 1;
    selectEV(newIndex);
  };

  const callMethodEV = (index, methodFn) => {
    if (self.planesSorted.length === 0) return;
    const planeSelected = self.planesSorted[index];
    if (!planeSelected) return;
    if (planeSelected.isNonInteractive && !planeSelected.isTaxiing) return;
    methodFn(planeSelected);
  };

  const getPlaneSelectedIndex = () => {
    const planeSelId = planeSelVueRef.value.id;
    const isSelected = (plane) => plane.id === planeSelId;
    return self.planesSorted.findIndex(isSelected);
  };

  subscribe(KeyboardEvents.KeyboardLetter_W_EV, () => {
    callMethodEV(getPlaneSelectedIndex(), (plane) => {
      const waypoint = nextWaypoint(arrivalWaypoints, plane);
      if (isArrival(plane)) plane.setWaypoint(waypoint);
    });
  });

  subscribe(KeyboardEvents.KeyboardLetter_T_EV, () => {
    callMethodEV(getPlaneSelectedIndex(), (plane) => {
      plane.startTakeoff();
    });
  });

  subscribe(KeyboardEvents.KeyboardLetter_H_EV, () => {
    callMethodEV(getPlaneSelectedIndex(), (plane) => {
      if (isArrival(plane)) plane.setHolding(!plane.isHolding);
      if (isDeparture(plane)) plane.setHandoff(!plane.isHandoff);
      controlPanelFocusFn();
    });
  });

  subscribe(KeyboardEvents.KeyboardLetter_L_EV, () => {
    callMethodEV(getPlaneSelectedIndex(), (plane) => plane.setLanding(true));
  });

  subscribe(KeyboardEvents.KeyboardArrowDownEV, () => {
    arrowDownEV(getPlaneSelectedIndex());
  });

  subscribe(KeyboardEvents.KeyboardArrowUpEV, () => {
    arrowUpEV(getPlaneSelectedIndex());
  });
};

/**
 * @param {VueRef} planeSelVueRef
 * @param {Array} entityManagerArr
 */
export const gameUpdateEventCB = (planeSelVueRef, entityManagerArr) => {
  const planeSelId = planeSelVueRef.value.id;
  const isFound = (plane) => plane.id === planeSelId;
  const planeSelFound = entityManagerArr.value.find(isFound);
  if (!planeSelFound) {
    planeSelVueRef.value = {};
  }
};

/**
 * @param {Object} tutorialEventArg
 * @param {State} state game state
 */
export const setupTutorialEvents = (tutorialEventArg, state) => {
  tutorialEventArg.setIsHoldingTutorial = (isHolding) =>
    buttonIsHoldingFn(isHolding);
  tutorialEventArg.setHandoffTutorial = (isTakeoff) =>
    buttonHandoffFn(isTakeoff);
  tutorialEventArg.setTakeoffTutorial = (isTakeoff) =>
    buttonTakeoffFn(isTakeoff);
  tutorialEventArg.setLandingTutorial = (isLanding) =>
    buttonLandingFn(isLanding);
  tutorialEventArg.updatedHeadingTutorial = (hdg) => headingUpdatedFn(hdg);
  tutorialEventArg.setPlaneTutorial = () => planeSelectedFn(state);
  tutorialEventArg.updatedAltitudeTutorial = (alt) => altitudeUpdatedFn(alt);
};

/**
 * @param {VueThis} self
 * @param {String} focusCircleTypeProp
 * @param {Object} tutorialBox contains vue ref properties
 * @param {Object} focusCircle
 * @param {Object} planeSelCBs object with planeSel funcs
 * @param {VueRef} planeSelVueRef vue ref to plane selected object
 * @param {State} state game state
 */
export const tutorialUpdateEventCB = (
  self,
  focusCircleTypeProp,
  tutorialBox,
  focusCircle,
  planeSelCBs,
  planeSelVueRef,
  state
) => {
  self[focusCircleTypeProp] = state.focusCircleType || '';

  if (state.focusCircle) {
    focusCircle.size = state.focusCircle.size;
    focusCircle.top = state.focusCircle.top;
    focusCircle.left = state.focusCircle.left;
    focusCircle.width = state.focusCircle.width;
    focusCircle.height = state.focusCircle.height;
  }

  const {
    tutorialBoxTop,
    tutorialBoxLeft,
    tutorialBoxWidth,
    tutorialBoxHtmlQueue,
  } = tutorialBox;
  if (state.dialogBox) {
    tutorialBoxTop.value = state.dialogBox.top;
    tutorialBoxLeft.value = state.dialogBox.left;
    tutorialBoxWidth.value = state.dialogBox.width;

    if (state.dialogBox.html.length) {
      fillHtmlQueue(state.dialogBox.html, tutorialBoxHtmlQueue);
      state.dialogBox.html = '';
    }
  }
  if (planeSelVueRef?.value?.id) {
    const planeSel = planeSelVueRef.value;
    if (planeSelCBs.setIsHoldingTutorial)
      planeSelCBs.setIsHoldingTutorial(planeSel.isHolding);
    if (planeSelCBs.setHandoffTutorial)
      planeSelCBs.setHandoffTutorial(planeSel.isHandoff);
    if (planeSelCBs.setTakeoffTutorial)
      planeSelCBs.setTakeoffTutorial(planeSel.takeoff);
    if (planeSelCBs.setLandingTutorial)
      planeSelCBs.setLandingTutorial(planeSel.landing);
  }
};

/**
 * @param {VueThis} self
 * @param {String} outputProp
 * @param {Array.<String>} inputQueue
 */
export const attachHtmlQueue = (self, outputProp, inputQueue) => {
  setInterval(() => {
    const letter = inputQueue.shift();
    if (!letter) return;
    if (letter === '<clear>') {
      self[outputProp] = '';
      return;
    }
    self[outputProp] += letter;
  }, 30);
};

/**
 * @param {String} inputHtmlStr
 * @param {Array.<String>} outputQueue
 */
export const fillHtmlQueue = (inputHtmlStr, outputQueue) => {
  let tag = '';
  inputHtmlStr.split('').forEach((letter) => {
    if (tag && (letter === '>' || letter === ';')) {
      letter = tag + letter;
      tag = '';
    } else if (tag || letter === '<' || letter === '&') {
      tag += letter;
      return;
    }
    outputQueue.push(letter);
  });
};
