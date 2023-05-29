import { VictoryEvents, subscribeVictory } from './victory';
import { KeyboardEvents, subscribeKeyboard as subscribe } from '../events/keyboard';
import { DestinationType } from "../aircraft/airframe";
import { nextWaypoint } from "../utils";
import { setGameLoopState } from './game';

const isDeparture = (plane) => plane.destinationType === DestinationType.Departure;
const isArrival = (plane) => plane.destinationType === DestinationType.Arrival;

/**
 * @param {VueThis} self is needed to keep a reference to computed: self.planesSorted
 * @param {Array} arrivalWaypoints list of waypoint name strings
 * @param {VueRef} planeSelVueRef vue ref to plane selected object
 * @param {Function} controlPanelFocusFn function to focus input field in controlPanel
 * @param {Function} selectPlaneFn function to set the selected plane
 * @param {Function} gamePopupFn function to set the game over pop-up
 */
export const setup = (
  self,
  arrivalWaypoints,
  planeSelVueRef,
  controlPanelFocusFn,
  selectPlaneFn,
  gamePopupFn,
) => {
  const gameOver = () => {
    setGameLoopState(false);
    gamePopupFn();
  }

  subscribeVictory(VictoryEvents.Success, () => gameOver());
  subscribeVictory(VictoryEvents.Failed, () => gameOver());

  const selectEV = (newIndex) => {
    const planeSelected = self.planesSorted[newIndex];
    planeSelVueRef.value = planeSelected;
    controlPanelFocusFn()
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
      plane.setWaypoint(waypoint);
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
}