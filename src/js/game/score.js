// NOTE: key & values must match
export const ScoreEvents = Object.freeze({
  ScoreEV: 'ScoreEV',
});

/**
 * @typedef {object} ScoreGoals
 * @property {number} Departures
 * @property {number} Arrivals
 * @property {number} Failed
 */
export const ScoreGoals = Object.freeze({
  Departures: 10,
  Arrivals: 8,
  Failed: 3,
});

// TODO load or start new game
let isSetup = false;
export const setup = () => {
  if (isSetup) return;
  isSetup = true;
};

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
};

export const planeGoAroundPenalty = () => {
  Score.failed += 1;
  publishScore({ ...Score });
};

export const resetProximity = () => {
  proximityPairs = {};
};
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
};

export const planeHandoffSuccess = () => {
  Score.departures += 1;
  publishScore({ ...Score });
}

export const planeLandSuccess = () => {
  Score.arrivals += 1;
  publishScore({ ...Score });
};

export const planeLeaveFail = () => {
  Score.failed += 1;
  publishScore({ ...Score });
};

// PRIVATE //////////////////////////////////////////////////
let _scoreTotal = 0;
let proximityPairs = {};

/**
 * @typedef {object} Score
 * @property {number} departures
 * @property {number} arrivals
 * @property {number} failed
 */
let Score = {
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
};