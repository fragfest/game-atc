import { getLevelObj } from '../levels/getLevel.js';
import { ScoreEvents, subscribeScore } from './score/score.js';

/**
 * @typedef {import('./score/score.js').Score} Score
 */

// key & values must match
export const VictoryEvents = Object.freeze({
  Success: 'Success',
  Failed: 'Failed',
});

export const setup = () => {
  subscribeScore(ScoreEvents.ScoreEV, (score) => {
    if (isDefeat(score)) {
      return publishFailed();
    }
    if (isVictory(score)) {
      return publishSuccess();
    }
  });
};

/**
 * @param {VictoryEvents} victoryEvent
 * @param {scoreCB} cb
 */
export const subscribeVictory = (victoryEvent, cb) => {
  if (!VictoryEvents[victoryEvent]) {
    throw new Error('unknown victory event: ' + victoryEvent);
  }
  document.addEventListener(victoryEvent, () => cb());
};

export const setGoal = (levelNum) => {
  const goals = getLevelObj().goalFn(levelNum) || { ...Goals };
  localStorage.setItem('goals', JSON.stringify(goals));
};

// TODO replace with getGoalsByLevel()
export const getGoals = () => {
  const goals = JSON.parse(localStorage.getItem('goals'));
  return goals || { ...Goals };
};

export const isDelayed = (level, delayCount) =>
  delayCount >= getGoalsByLevel()(level).Delayed;
export const isDeparturesSuccess = (level, departuresCount) =>
  departuresCount >= getGoalsByLevel()(level).Departures;
export const isArrivalsSuccess = (level, arrivalsCount) =>
  arrivalsCount >= getGoalsByLevel()(level).Arrivals;
export const isFailedCondition = (level, failedCount) =>
  failedCount >= getGoalsByLevel()(level).Failed;
export const isConflictCondition = (level, conflictCount) =>
  conflictCount >= getGoalsByLevel()(level).Conflict;

/**
 * @param {Score} score
 * @returns {Boolean}
 */
export const isVictory = (score) => {
  return (
    isDeparturesSuccess(score.level, score.departures) &&
    isArrivalsSuccess(score.level, score.arrivals) &&
    !isDefeat(score)
  );
};

/**
 * @param {Score} score
 * @returns {Boolean}
 */
export const isDefeat = (score) =>
  isFailedCondition(score.level, score.failed) ||
  isConflictCondition(score.level, score.conflict) ||
  isDelayed(score.level, score.delayed);

export const publishSuccess = () => {
  document.dispatchEvent(new CustomEvent(VictoryEvents.Success));
};

export const publishFailed = () => {
  document.dispatchEvent(new CustomEvent(VictoryEvents.Failed));
};

/**
 * @typedef {Object} Goals
 * @property {Number} Arrivals
 * @property {Number} Departures
 * @property {Number} Failed
 * @property {Number} Conflict
 * @property {Number} SpawnRate
 * @property {Number} Delayed
 */
const Goals = {
  Arrivals: 0,
  Departures: 0,
  Failed: 0,
  Conflict: 0,
  SpawnRate: 0,
  Delayed: 0,
};

/**
 * @typedef {Function} GoalsFunc
 * @param {Number} gameLevel
 * @returns {Goals}
 */

/**
 * @returns {GoalsFunc}
 */
export const getGoalsByLevel = () => {
  return (gameLevel) => {
    // LHR
    if (gameLevel === 0) {
      return {
        Arrivals: 1,
        Departures: 1,
        Failed: 3,
        Conflict: 999,
        SpawnRate: 1,
        Delayed: 4,
      };
    }

    if (gameLevel === 1) {
      return {
        Arrivals: 0,
        Departures: 8,
        Failed: 3,
        Conflict: 60,
        SpawnRate: 1,
        Delayed: 4,
      };
    }

    if (gameLevel === 2) {
      return {
        Arrivals: 8,
        Departures: 1,
        Failed: 3,
        Conflict: 60,
        SpawnRate: 1,
        Delayed: 4,
      };
    }

    if (gameLevel === 3) {
      return {
        Arrivals: 8,
        Departures: 8,
        Failed: 3,
        Conflict: 60,
        SpawnRate: 1,
        Delayed: 6,
      };
    }

    if (gameLevel === 4) {
      return {
        Arrivals: 12,
        Departures: 12,
        Failed: 2,
        Conflict: 60,
        SpawnRate: 2,
        Delayed: 5,
      };
    }

    if (gameLevel === 5) {
      return {
        Arrivals: 12,
        Departures: 12,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 1.5,
        Delayed: 4,
      };
    }

    if (gameLevel === 6) {
      return {
        Arrivals: 12,
        Departures: 12,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 1.5,
        Delayed: 3,
      };
    }

    // JFK
    if (gameLevel === 7) {
      return {
        Arrivals: 8,
        Departures: 8,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 1,
        Delayed: 3,
      };
    }

    if (gameLevel === 8) {
      return {
        Arrivals: 12,
        Departures: 12,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 2,
        Delayed: 3,
      };
    }

    if (gameLevel === 9) {
      return {
        Arrivals: 12,
        Departures: 12,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 1.5,
        Delayed: 3,
      };
    }

    if (gameLevel === 10) {
      return {
        Arrivals: 18,
        Departures: 8,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 1.2,
        Delayed: 3,
      };
    }

    if (gameLevel === 11) {
      return {
        Arrivals: 12,
        Departures: 12,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 1.5,
        Delayed: 3,
      };
    }

    // HND
    if (gameLevel === 12) {
      return {
        Arrivals: 8,
        Departures: 8,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 1,
        Delayed: 3,
      };
    }

    if (gameLevel === 13) {
      return {
        Arrivals: 12,
        Departures: 12,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 2,
        Delayed: 3,
      };
    }

    if (gameLevel === 14) {
      return {
        Arrivals: 12,
        Departures: 12,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 1.5,
        Delayed: 3,
      };
    }

    if (gameLevel === 15) {
      return {
        Arrivals: 14,
        Departures: 14,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 1.2,
        Delayed: 3,
      };
    }

    if (gameLevel === 16) {
      return {
        Arrivals: 12,
        Departures: 12,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 1.2,
        Delayed: 3,
      };
    }

    // AMS
    if (gameLevel === 17) {
      return {
        Arrivals: 8,
        Departures: 8,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 1,
        Delayed: 3,
      };
    }

    if (gameLevel === 18) {
      return {
        Arrivals: 12,
        Departures: 12,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 1.2,
        Delayed: 3,
      };
    }

    if (gameLevel === 19) {
      return {
        Arrivals: 18,
        Departures: 8,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 1.2,
        Delayed: 3,
      };
    }

    if (gameLevel === 20) {
      return {
        Arrivals: 14,
        Departures: 14,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 1.5,
        Delayed: 3,
      };
    }

    if (gameLevel === 21) {
      return {
        Arrivals: 18,
        Departures: 18,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 2,
        Delayed: 2,
      };
    }

    // YVR
    if (gameLevel === 22) {
      return {
        Arrivals: 8,
        Departures: 8,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 1,
        Delayed: 2,
      };
    }

    if (gameLevel === 23) {
      return {
        Arrivals: 12,
        Departures: 12,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 1.5,
        Delayed: 2,
      };
    }

    if (gameLevel === 24) {
      return {
        Arrivals: 14,
        Departures: 14,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 1.5,
        Delayed: 2,
      };
    }

    if (gameLevel === 25) {
      return {
        Arrivals: 14,
        Departures: 8,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 1.5,
        Delayed: 2,
      };
    }

    if (gameLevel === 26) {
      return {
        Arrivals: 14,
        Departures: 14,
        Failed: 2,
        Conflict: 30,
        SpawnRate: 1.2,
        Delayed: 2,
      };
    }

    throw new Error('unknown level: ' + gameLevel);
  };
};
