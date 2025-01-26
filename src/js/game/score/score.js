import { setGoal } from '../victory';
import { getFinalLevel } from '../../levels/getLevel';
import { historyRecordDebug } from '../../utils';

////////////////////////////////////////////////////////////////////////
// NOTE just importing score.secure fails tests for some strange reason
////////////////////////////////////////////////////////////////////////
// import {
//   getScoreBasicSecure,
//   getScoreSecure,
//   setScoreSecure,
//   getHistorySecure,
//   setHistorySecure,
//   getHistoryJwt,
//   getBadgesArrSecure,
//   setBadgesArrSecure,
//   getBadgesJwt,
// } from './score.secure';

// const debug = true;

// key & values must match
export const ScoreEvents = Object.freeze({
  ScoreEV: 'ScoreEV',
});

export const getBaseScore = () => 100;

export const setup = () => {
  const score = { ...Score };

  const highestLevel = getHighestLevelCompleted();
  const nextLevel = highestLevel === null ? 0 : highestLevel + 1;

  score.level = nextLevel <= getFinalLevel() ? nextLevel : getFinalLevel();
  setScore(score);
  setGoal(score.level);
};

export const resetScore = () => {
  const level = _getScore().level;
  setScore({ ...Score, level });
};

export const wakePenalty = (newScore) => {
  const score = getScore();
  score.wake += newScore;
  setScore(score);
  publishScore(score);
};

export const turbulencePenalty = (timeDiffMs) => {
  const score = getScore();
  const turbulenceNew = score.turbulence + timeDiffMs / 1000;
  score.turbulence = Number(turbulenceNew.toFixed(3));
  setScore(score);
  publishScore(score);
};

export const planeDelayFail = () => {
  const score = getScore();
  score.delayed += 1;
  setScore(score);
  publishScore(score);
};

export const levelComplete = (scoreTotal) => {
  const score = getScore();
  setHistoryRecord(score.level, { ...score, scoreTotal });
  historyRecordDebug();

  const nextLevel = score.level + 1;
  score.level = nextLevel <= getFinalLevel() ? nextLevel : getFinalLevel();
  setScore(score);
};

export const levelRetry = (level) => {
  const score = getScore();
  score.level = level;
  setScore(score);
  setGoal(score.level);
};

export const getHighestLevelCompleted = () => {
  const sorted = getHistoryRecords().sort((a, b) => b.level - a.level);
  if (!sorted.length) return null;
  return sorted[0].level;
};

export const resetProximity = (plane) => {
  proximityPairs[plane.id] = null;
};

export const uniqueProximityPair = (planeOne, planeTwo, timestampMs) => {
  const proximityPairPlaneTwo = proximityPairs[planeTwo.id] || {};
  const oppositePairFound = proximityPairPlaneTwo.id === planeOne.id;
  if (oppositePairFound) return false;

  const proximityPairPlaneOne = proximityPairs[planeOne.id];
  if (proximityPairPlaneOne) return true;

  proximityPairs[planeOne.id] = {
    id: planeTwo.id,
    startTimestampMs: timestampMs,
  };
  return true;
};

export const planeProximityPenalty = (planeOne, planeTwo, timestampMs) => {
  const bothPlanesInConflict =
    planeOne.hasProximityAlert && planeTwo.hasProximityAlert;
  if (!bothPlanesInConflict) return null;

  const proximityPairPlaneOne = proximityPairs[planeOne.id];
  if (!proximityPairPlaneOne) return null;

  const startTimeSec = proximityPairPlaneOne.startTimestampMs / 1000;
  const currentTimeSec = timestampMs / 1000;
  if (!startTimeSec || !currentTimeSec) return null;

  proximityPairPlaneOne.startTimestampMs = timestampMs;
  const timeDiffSec = currentTimeSec - startTimeSec;

  const score = getScore();
  const conflictNew = score.conflict + timeDiffSec;
  score.conflict = Number(conflictNew.toFixed(3));
  setScore(score);
  publishScore(score);

  return (-1 * timeDiffSec).toFixed(3) + 's';
};

export const planeHandoffSuccess = () => {
  const score = getScore();
  score.departures += 1;
  setScore(score);
  publishScore(score);
};

export const planeLandSuccess = () => {
  const score = getScore();
  score.arrivals += 1;
  setScore(score);
  publishScore(score);
};

export const planeLandFail = () => {
  const score = getScore();
  score.failed += 1;
  setScore(score);
  publishScore(score);
};

export const planeLeaveFail = () => {
  const score = getScore();
  score.failed += 1;
  setScore(score);
  publishScore(score);
};

/**
 * @param {ScoreEvents} scoreEvent
 * @param {scoreCB} cb
 */
export const subscribeScore = (scoreEvent, cb) => {
  if (!ScoreEvents[scoreEvent]) {
    throw new Error('unknown score event: ' + scoreEvent);
  }
  document.addEventListener(scoreEvent, (ev) => {
    cb(ev.detail.score);
  });
};

/**
 * @param {Score} score
 */
const publishScore = (score) => {
  // ScoreEvents unused
  const scoreEvent = ScoreEvents.ScoreEV;
  if (!ScoreEvents[scoreEvent])
    throw new Error('unknown score event: ' + scoreEvent);
  document.dispatchEvent(new CustomEvent(scoreEvent, { detail: { score } }));
};

/**
 * @returns {Array.<String>}
 */
export const getBadgesSecure = () => {
  // if (process.env.NODE_ENV === 'production' || debug) {
  //   const badges = getBadgesJwt();
  //   return badges || [];
  // }

  const badges = JSON.parse(localStorage.getItem('badges'));
  return badges || [];
};

/**
 * @returns {Array.<String>}
 */
export const getBadges = () => {
  // if (process.env.NODE_ENV === 'production' || debug) {
  //   const badges = getBadgesArrSecure();
  //   return badges || [];
  // }

  const badges = JSON.parse(localStorage.getItem('badges'));
  return badges || [];
};

/**
 * @param {Array.<String>} badges
 */
export const setBadges = (badges) => {
  // if (process.env.NODE_ENV === 'production' || debug) {
  //   setBadgesArrSecure(badges || []);
  //   return;
  // }

  localStorage.setItem('badges', JSON.stringify(badges));
};

/**
 * @returns {Array.<HistoryRecord>}
 */
export const getHistoryRecords = () => {
  // if (process.env.NODE_ENV === 'production' || debug) {
  //   const historyRecords = getHistorySecure();
  //   return historyRecords || [];
  // }

  const historyRecords = JSON.parse(localStorage.getItem('history-records'));
  return historyRecords || [];
};

/**
 * @returns {String}
 */
export const getHistoryRecordsSecure = () => {
  // if (process.env.NODE_ENV === 'production' || debug) {
  //   const recordsJwt = getHistoryJwt();
  //   return recordsJwt || '';
  // }

  const historyRecords = JSON.parse(localStorage.getItem('history-records'));
  return historyRecords || [];
};

/**
 * @callback scoreCB
 * @param {Score}
 */

let proximityPairs = {};

/**
 * @param {number} level
 */
const removeHistoryRecord = (level) => {
  const historyRecords = getHistoryRecords();
  const indexRemove = historyRecords.findIndex((x) => x.level === level);
  if (indexRemove === -1) return;

  historyRecords.splice(indexRemove, 1);

  // if (process.env.NODE_ENV === 'production' || debug) {
  //   setHistorySecure(historyRecords);
  //   historyRecordDebug();
  //   return;
  // }

  localStorage.setItem('history-records', JSON.stringify(historyRecords));
};

/**
 * @param {number} level
 * @param {HistoryScore} historyScore
 */
const setHistoryRecord = (level, historyScore) => {
  removeHistoryRecord(level);

  const historyRecords = getHistoryRecords();
  historyRecords.push({ v, level, historyScore });

  // if (process.env.NODE_ENV === 'production' || debug) {
  //   setHistorySecure(historyRecords);
  //   return;
  // }

  localStorage.setItem('history-records', JSON.stringify(historyRecords));
};

const v = '0.1.3';
/**
 * HistoryRecord schema v 0.1.3
 * @typedef {object} HistoryRecord
 * @property {string} v schema version
 * @property {number} level
 * @property {HistoryScore} historyScore
 */

/**
 * @typedef {object} HistoryScore
 * @property {Score} -- destructured Score props at this level
 * @property {number} scoreTotal
 */

/**
 * @typedef {object} Score
 * @property {number} level
 * @property {number} departures
 * @property {number} arrivals
 * @property {number} failed
 * @property {number} conflict
 * @property {number} delayed
 * @property {number} turbulence
 * @property {number} wake
 */
const Score = {
  level: 0,
  departures: 0,
  arrivals: 0,
  failed: 0,
  conflict: 0,
  delayed: 0,
  turbulence: 0,
  wake: 0,
};

/**
 * @returns {Score}
 */
export const getScore = () => {
  // if (process.env.NODE_ENV === 'production' || debug) {
  //   const score = getScoreSecure();
  //   return score || { ...Score };
  // }

  const score = JSON.parse(localStorage.getItem('score'));
  return score || { ...Score };
};

/**
 * @returns {Score}
 */
const _getScore = () => {
  // if (process.env.NODE_ENV === 'production' || debug) {
  //   const score = getScoreBasicSecure();
  //   return score || { ...Score };
  // }

  const score = JSON.parse(localStorage.getItem('score'));
  return score || { ...Score };
};

/**
 * @param {Score} score
 */
const setScore = (score) => {
  // if (process.env.NODE_ENV === 'production' || debug) {
  //   setScoreSecure(score);
  //   return;
  // }

  localStorage.setItem('score', JSON.stringify(score));
};
