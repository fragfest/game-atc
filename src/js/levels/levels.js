import { isSquare } from '../types.js';
import { getDepartureCount, getArrivalCount } from '../utils.js';

/**
 * @typedef {import('../game/score.js').Score} Score
 */
/**
 * @typedef {import('../game/victory.js').Goals} Goals
 */

const noChance = 0;
const baseChance = 0.03;
const highChance = 0.1;
const veryHighChance = 0.5;
const guaranteedChance = 1;
const chanceDepartureBase = 0.4;

/**
 * @typedef {Function} GetSpawnChance
 * @param {number} chanceOfPlanePerSec
 * @returns {number}
 */
/**
 * @typedef {Function} SpawnPlane
 * @param {number} chanceOfPlane
 * @param {number} chanceOfDeparture
 * @param {object} flightObj
 */

/**
 * @param {Number} level
 * @param {Object} arg
 * @param {Array} arg.entityManagerArr
 * @param {Goals} arg.goals
 * @param {Score} arg.score
 * @param {GetSpawnChance} arg.getSpawnChanceFn
 * @param {SpawnPlane} arg.spawnPlaneFn
 * @returns none
 */
export const level = (level, arg) => {
  if (level === 1) return level1(arg);
  if (level === 2) return level2(arg);
  if (level === 3) return level3(arg);
  level1(arg);
};

/**
 * @param {Object} arg
 * @param {Array} arg.entityManagerArr
 * @param {Goals} arg.goals
 * @param {Score} arg.score
 * @param {GetSpawnChance} arg.getSpawnChanceFn
 * @param {SpawnPlane} arg.spawnPlaneFn
 * @returns none
 */
export const level1 = (arg) => {
  const { entityManagerArr, goals, score, getSpawnChanceFn, spawnPlaneFn } =
    arg;
  const flightObj = { time: 10 * 60 };
  const areDeparturesSpawned = noMoreDepartures(entityManagerArr, goals, score);
  const areAllSpawned = noMoreDeparturesArrivals(
    entityManagerArr,
    goals,
    score
  );
  if (areAllSpawned) return;

  if (areDeparturesSpawned) return;
  spawnPlaneFn(getSpawnChanceFn(highChance), guaranteedChance, flightObj);
};

/**
 * @param {Object} arg
 * @param {Array} arg.entityManagerArr
 * @param {Goals} arg.goals
 * @param {Score} arg.score
 * @param {GetSpawnChance} arg.getSpawnChanceFn
 * @param {SpawnPlane} arg.spawnPlaneFn
 * @returns none
 */
export const level2 = (arg) => {
  const { entityManagerArr, goals, score, getSpawnChanceFn, spawnPlaneFn } =
    arg;
  const flightObj = { time: 15 * 60 };
  const areArrivalsSpawned = noMoreArrivals(entityManagerArr, goals, score);
  const areAllSpawned = noMoreDeparturesArrivals(
    entityManagerArr,
    goals,
    score
  );
  if (areAllSpawned) return;

  if (areArrivalsSpawned) return;
  return spawnPlaneFn(getSpawnChanceFn(baseChance), noChance, flightObj);
};

/**
 * @param {Object} arg
 * @param {Array} arg.entityManagerArr
 * @param {Goals} arg.goals
 * @param {Score} arg.score
 * @param {GetSpawnChance} arg.getSpawnChanceFn
 * @param {SpawnPlane} arg.spawnPlaneFn
 * @returns none
 */
export const level3 = (arg) => {
  const { entityManagerArr, goals, score, getSpawnChanceFn, spawnPlaneFn } =
    arg;
  const count = entityManagerArr.filter(isSquare).length;
  const departureCount = getDepartureCount(entityManagerArr);
  const arrivalCount = getArrivalCount(entityManagerArr);
  const areDeparturesSpawned = noMoreDepartures(entityManagerArr, goals, score);
  const areArrivalsSpawned = noMoreArrivals(entityManagerArr, goals, score);
  const areAllSpawned = noMoreDeparturesArrivals(
    entityManagerArr,
    goals,
    score
  );
  const lowCount = 4;
  const flightObj = { time: 15 * 60 };

  if (areAllSpawned) return;

  let chance = baseChance;
  if (count <= lowCount) {
    chance = veryHighChance;
  }

  if (areDeparturesSpawned) {
    return spawnPlaneFn(getSpawnChanceFn(chance), noChance, flightObj);
  }
  if (areArrivalsSpawned) {
    return spawnPlaneFn(getSpawnChanceFn(chance), guaranteedChance, flightObj);
  }

  if (count <= lowCount) {
    if (departureCount > arrivalCount) {
      return spawnPlaneFn(getSpawnChanceFn(chance), noChance, flightObj);
    } else {
      return spawnPlaneFn(
        getSpawnChanceFn(chance),
        guaranteedChance,
        flightObj
      );
    }
  }

  // not a lowCount && both Arrivals + Departures remaining
  return spawnPlaneFn(getSpawnChanceFn(chance), chanceDepartureBase, flightObj);
};

// PRIVATE ////////////////////////////////////////////////////////////////

const departureGoalRemaining = (goals, score) =>
  goals.Departures - score.departures;
const arrivalGoalRemaining = (goals, score) => goals.Arrivals - score.arrivals;

const noMoreRemaining = (countFn, remainingFn) => (arr, goals, score) =>
  countFn(arr) >= remainingFn(goals, score);
const noMoreDepartures = noMoreRemaining(
  getDepartureCount,
  departureGoalRemaining
);
const noMoreArrivals = noMoreRemaining(getArrivalCount, arrivalGoalRemaining);
const noMoreDeparturesArrivals = (arr, goals, score) =>
  noMoreDepartures(arr, goals, score) && noMoreArrivals(arr, goals, score);
