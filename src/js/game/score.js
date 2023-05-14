import { setGoal } from "./victory";

// NOTE: key & values must match
export const ScoreEvents = Object.freeze({
  ScoreEV: 'ScoreEV',
})

export const setup = () => {
  resetScore();
  const score = getScore();
  const nextLevel = score.levelComplete + 1;
  score.level = nextLevel;
  setScore(score);
  setGoal(nextLevel);
}

export const resetScore = () => {
  const score = getScore();
  score.departures = 0;
  score.arrivals = 0;
  score.failed = 0;
  setScore(score);
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
  const score = getScore();
  score.failed += 1;
  setScore(score);
  publishScore(score);
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
  const score = getScore();
  score.departures += 1;
  setScore(score);
  publishScore(score);
}

export const planeLandSuccess = () => {
  const score = getScore();
  score.arrivals += 1;
  setScore(score);
  publishScore(score);
}

export const planeLeaveFail = () => {
  const score = getScore();
  score.failed += 1;
  setScore(score);
  publishScore(score);
}

/**
 * @returns {Score}
 */
export const getScore = () => {
  const score = JSON.parse(localStorage.getItem('score'));
  return score || {...Score};
}

// PRIVATE //////////////////////////////////////////////////
let _scoreTotal = 0;
let proximityPairs = {};

const setScore = score => {
  localStorage.setItem('score', JSON.stringify(score));
}

/**
 * @typedef {object} Score
 * @property {number} levelComplete
 * @property {number} level
 * @property {number} departures
 * @property {number} arrivals
 * @property {number} failed
 */
let Score = {
  levelComplete: 0,
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