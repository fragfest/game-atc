import { setGoal } from "./victory";

// NOTE: key & values must match
export const ScoreEvents = Object.freeze({
  ScoreEV: 'ScoreEV',
})

export const setup = () => {
  Score.level = _levelComplete;
  const nextLevel = _levelComplete + 1;
  setGoal(nextLevel);
}

/**
 * @callback scoreCB
 * @param {Score}
 */

/**
 * @param {ScoreEvents} scoreEvent
 * @param {scoreCB} cb
 */
export const subscribeScore = (scoreEvent, cb) => {
  if (!ScoreEvents[scoreEvent]) throw new Error('unknown score event: ' + scoreEvent);
  document.addEventListener(scoreEvent, (ev) => {
    cb(ev.detail.score);
  });
}

export const planeGoAroundPenalty = () => {
  Score.failed += 1;
  publishScore({ ...Score });
}

export const resetProximity = () => {
  proximityPairs = {};
}
export const uniqueProximityPair = (planeOne, planeTwo) => {
  const oppositePairFound = proximityPairs[planeTwo.id] === planeOne.id;
  if (oppositePairFound) return false;

  proximityPairs[planeOne.id] = planeTwo.id;
  return true;
}
export const planeProximityPenalty = (planeOne, planeTwo) => {
  const bothPlanesInConflict = planeOne.hasProximityAlert && planeTwo.hasProximityAlert;
  if (!bothPlanesInConflict) return null;

  _scoreTotal -= 1;
  const score = { ...Score, scoreTotal: _scoreTotal };
  publishScore(score);
  return -1;
}

export const planeHandoffSuccess = () => {
  Score.departures += 1;
  publishScore({ ...Score });
}

export const planeLandSuccess = () => {
  Score.arrivals += 1;
  publishScore({ ...Score });
}

export const planeLeaveFail = () => {
  Score.failed += 1;
  publishScore({ ...Score });
}

/**
 * @returns {Score}
 */
export const getScore = () => ({ ...Score });

// PRIVATE //////////////////////////////////////////////////
let _scoreTotal = 0;
let _levelComplete = 0;
let proximityPairs = {};

/**
 * @typedef {object} Score
 * @property {number} level current level
 * @property {number} departures
 * @property {number} arrivals
 * @property {number} failed
 */
let Score = {
  level: 0,
  departures: 0,
  arrivals: 0,
  failed: 0,
};

/**
 * @param {Score} score
 */
const publishScore = (score) => {
  const scoreEvent = ScoreEvents.ScoreEV; // TODO might be needed when specified in a future func arg
  if (!ScoreEvents[scoreEvent]) throw new Error('unknown score event: ' + scoreEvent);
  document.dispatchEvent(new CustomEvent(scoreEvent, { detail: { score } }));
}