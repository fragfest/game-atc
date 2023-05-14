import { ScoreEvents, subscribeScore } from './score';

/**
 * @typedef {import('./score.js').Score} Score
 */

// NOTE: key & values must match
export const VictoryEvents = Object.freeze({
  Success: 'Success',
  Failed: 'Failed',
});

/**
 * @param {VictoryEvents} victoryEvent
 * @param {scoreCB} cb
 */
export const subscribeVictory = (victoryEvent, cb) => {
  if (!VictoryEvents[victoryEvent]) throw new Error('unknown victory event: ' + victoryEvent);
  document.addEventListener(victoryEvent, () => cb());
};

export const setGoal = (levelNum) => {
  let goals = {};
  if (levelNum <= 1) goals = { ...GoalsLevel1 };
  localStorage.setItem('goals', JSON.stringify(goals));
};

export const getGoals = () => {
  const goals = JSON.parse(localStorage.getItem('goals'));
  return goals || {...Goals};
}

export const GoalsLevel1 = Object.freeze({
  Arrivals: 50,
  Departures: 30,
  Failed: 1,
});

export const isDeparturesSuccess = (departuresCount) => departuresCount >= getGoals().Departures;
export const isArrivalsSuccess = (arrivalsCount) => arrivalsCount >= getGoals().Arrivals;
export const isFailedCondition = (failedCount) => failedCount >= getGoals().Failed;
/**
 * @param {Score} score 
 * @returns {Boolean}
 */
export const isVictory = score => isDeparturesSuccess(score.departures) &&
  isArrivalsSuccess(score.arrivals) &&
  !isFailedCondition(score.failed);

export const setup = () => {
  subscribeScore(ScoreEvents.ScoreEV, (score) => {
    if (isFailedCondition(score.failed)) {
      return publishFailed();
    }
    if (isVictory(score)) {
      return publishSuccess();
    }
  });
}

// PRIVATE //////////////////////////////////////////////////

/**
 * @typedef {object} Goals
 * @property {number} Departures
 * @property {number} Arrivals
 * @property {number} Failed
 */
let Goals = {
  Arrivals: 0,
  Departures: 0,
  Failed: 0,
};


const publishSuccess = () => {
  document.dispatchEvent(new CustomEvent(VictoryEvents.Success));
}

const publishFailed = () => {
  document.dispatchEvent(new CustomEvent(VictoryEvents.Failed));
}