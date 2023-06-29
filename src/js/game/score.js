import { setGoal, getFinalLevel } from "./victory";

// NOTE: key & values must match
export const ScoreEvents = Object.freeze({
  ScoreEV: 'ScoreEV',
})

export const getBaseScore = () => 100;

export const setup = () => {
  resetScore();
  const score = getScore();
  const highestLevel = getHighestLevelCompleted();
  const nextLevel = highestLevel ? (highestLevel + 1) : 0;

  score.level = (nextLevel <= getFinalLevel()) ? nextLevel : getFinalLevel();
  setScore(score);
  setGoal(score.level);
}

export const resetScore = () => {
  const score = getScore();
  score.departures = 0;
  score.arrivals = 0;
  score.failed = 0;
  score.taxiQueue = 0;
  score.conflict = 0;
  setScore(score);
}

export const setTaxiQueue = (queueLength) => {
  const score = getScore();
  score.taxiQueue = queueLength;
  setScore(score);
  publishScore(score);
}

export const levelComplete = (scoreTotal) => {
  const score = getScore();
  setScoreHistory(score.level, scoreTotal);

  const nextLevel = score.level + 1;
  score.level = (nextLevel <= getFinalLevel()) ? nextLevel : getFinalLevel();
  setScore(score);
}

export const levelRetry = (level) => {
  const score = getScore();
  score.level = level;
  if(score.level <= 0) score.level = 1;

  setScore(score);
  setGoal(score.level);
}

export const getHighestLevelCompleted = () => {
  const sorted = getScoreHistory().sort((a, b) => b.level - a.level);
  if(!sorted.length) return 0;
  return sorted[0].level;
}

export const planeGoAroundPenalty = () => {
  const score = getScore();
  score.failed += 1;
  setScore(score);
  publishScore(score);
}

export const resetProximity = (plane) => {
  proximityPairs[plane.id] = null;
}

export const uniqueProximityPair = (planeOne, planeTwo, timestampMs) => {
  const proximityPairPlaneTwo = proximityPairs[planeTwo.id] || {};
  const oppositePairFound = proximityPairPlaneTwo.id === planeOne.id;
  if (oppositePairFound) return false;

  const proximityPairPlaneOne = proximityPairs[planeOne.id];
  if(proximityPairPlaneOne) return true;

  proximityPairs[planeOne.id] = { id: planeTwo.id, startTimestampMs: timestampMs };
  return true;
}

export const planeProximityPenalty = (planeOne, planeTwo, timestampMs) => {
  const bothPlanesInConflict = planeOne.hasProximityAlert && planeTwo.hasProximityAlert;
  if (!bothPlanesInConflict) return null;

  const proximityPairPlaneOne = proximityPairs[planeOne.id];
  if(!proximityPairPlaneOne) return null;

  const startTimeSec = proximityPairPlaneOne.startTimestampMs / 1000;
  const currentTimeSec = timestampMs / 1000;
  if(!startTimeSec || !currentTimeSec) return null;
  
  proximityPairPlaneOne.startTimestampMs = timestampMs;
  const timeDiffSec = currentTimeSec - startTimeSec;
  
  const score = getScore();
  const conflictNew = score.conflict + timeDiffSec;
  score.conflict = Number(conflictNew.toFixed(3));
  setScore(score);
  publishScore(score);

  return (-1 * timeDiffSec).toFixed(3) + 's';
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
 * @returns {Array.<ScoreHistory>}
 */
export const getScoreHistory = () => {
  const scoreHistory = JSON.parse(localStorage.getItem('score-history'));
  return scoreHistory || [];
}

/**
 * @returns {Score}
 */
export const getScore = () => {
  const score = JSON.parse(localStorage.getItem('score'));
  return score || {...Score};
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

// PRIVATE //////////////////////////////////////////////////
let proximityPairs = {};

/**
 * @param {number} level 
 */
const removeScoreHistoryItem = level => {
  const scoreHistArr = getScoreHistory();
  const indexRemove = scoreHistArr.findIndex(x => x.level === level);
  if(indexRemove === -1) return;

  scoreHistArr.splice(indexRemove, 1);
  localStorage.setItem('score-history', JSON.stringify(scoreHistArr));
}

/**
 * @param {number} level 
 * @param {number} score 
 */
const setScoreHistory = (level, score) => {
  removeScoreHistoryItem(level);

  const scoreHistArr = getScoreHistory();
  scoreHistArr.push({ level, score });
  localStorage.setItem('score-history', JSON.stringify(scoreHistArr));
}

/**
 * @param {Score} score 
 */
const setScore = score => {
  localStorage.setItem('score', JSON.stringify(score));
}

/**
 * @typedef {object} ScoreHistory
 * @property {number} level
 * @property {number} score
 */ 

/**
 * @typedef {object} Score
 * @property {number} level
 * @property {number} departures
 * @property {number} arrivals
 * @property {number} failed
 * @property {number} taxiQueue
 * @property {number} conflict
 */
const Score = {
  level: 0,
  departures: 0,
  arrivals: 0,
  failed: 0,
  taxiQueue: 0,
  conflict: 0,
}

/**
 * @param {Score} score
 */
const publishScore = (score) => {
  const scoreEvent = ScoreEvents.ScoreEV; // TODO might be needed when specified in a future func arg
  if (!ScoreEvents[scoreEvent]) throw new Error('unknown score event: ' + scoreEvent);
  document.dispatchEvent(new CustomEvent(scoreEvent, { detail: { score } }));
}