import { ScoreEvents, subscribeScore } from './score';

/**
 * @typedef {import('./score.js').Score} Score
 */

// NOTE: key & values must match
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
}

export const getFinalLevel = () => FinalLevel;

/**
 * @param {VictoryEvents} victoryEvent
 * @param {scoreCB} cb
 */
export const subscribeVictory = (victoryEvent, cb) => {
  if (!VictoryEvents[victoryEvent]) throw new Error('unknown victory event: ' + victoryEvent);
  document.addEventListener(victoryEvent, () => cb());
};

export const setGoal = levelNum => {
  const goals = GoalsLevels[levelNum] || {...Goals};
  localStorage.setItem('goals', JSON.stringify(goals));
};

export const getGoals = () => {
  const goals = JSON.parse(localStorage.getItem('goals'));
  return goals || {...Goals};
}

export const isDeparturesSuccess = (departuresCount) => departuresCount >= getGoals().Departures;
export const isArrivalsSuccess = (arrivalsCount) => arrivalsCount >= getGoals().Arrivals;
export const isFailedCondition = (failedCount) => failedCount >= getGoals().Failed;
export const isExceededTaxiingCondition = (taxiQueueCount) => taxiQueueCount >= getGoals().TaxiQueue;
export const isConflictCondition = (conflictCount) => conflictCount >= getGoals().Conflict;

/**
 * @param {Score} score
 * @returns {Boolean}
 */
export const isVictory = score => isDeparturesSuccess(score.departures) &&
  isArrivalsSuccess(score.arrivals) &&
  !isFailedCondition(score.failed) &&
  !isExceededTaxiingCondition(score.taxiQueue) &&
  !isConflictCondition(score.conflict);

/**
 * @param {Score} score
 * @returns {Boolean}
 */
export const isDefeat = score => isFailedCondition(score.failed) ||
  isConflictCondition(score.conflict) ||
  isExceededTaxiingCondition(score.taxiQueue);

// PRIVATE //////////////////////////////////////////////////

const FinalLevel = 3;

const GoalsLevels = {
  0: {
    Arrivals: 1,
    Departures: 1,
    Failed: 2,
    TaxiQueue: 4,
    Conflict: 999,
    SpawnRate: 1,
  },
  1: {
    Arrivals: 16,
    Departures: 8,
    Failed: 3,
    TaxiQueue: 8,
    Conflict: 60,
    SpawnRate: 1,
  },
  2: {
    Arrivals: 32,
    Departures: 16,
    Failed: 2,
    TaxiQueue: 8,
    Conflict: 30,
    SpawnRate: 2,
  },
  3: {
    Arrivals: 32,
    Departures: 16,
    Failed: 1,
    TaxiQueue: 6,
    Conflict: 15,
    SpawnRate: 3,
  },
};

/**
 * @typedef {object} Goals
 * @property {number} Departures
 * @property {number} Arrivals
 * @property {number} Failed
 * @property {number} TaxiQueue
 * @property {number} Conflict
 * @property {number} SpawnRate
 */
const Goals = {
  Arrivals: 0,
  Departures: 0,
  Failed: 0,
  TaxiQueue: 0,
  Conflict: 0,
  SpawnRate: 0,
};

const publishSuccess = () => {
  document.dispatchEvent(new CustomEvent(VictoryEvents.Success));
}

const publishFailed = () => {
  document.dispatchEvent(new CustomEvent(VictoryEvents.Failed));
}