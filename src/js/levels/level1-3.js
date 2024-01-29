import { isSquare } from '../types';
import { getDepartureCount, getArrivalCount } from '../utils';
import { isTaxiQueueAlmostFull } from '../game/game';

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
const chanceDepartureLow = 0.1;

/**
 * @typedef {Function} GetSpawnChance
 * @param {number} chanceOfPlanePerSec
 * @returns {number}
 */
/**
 * @typedef {Function} SpawnPlane
 * @param {number} chanceOfPlane
 * @param {number} chanceOfDeparture
 */

/**
 * @param {Array} entityManagerArr
 * @param {Goals} goals
 * @param {Score} score
 * @param {GetSpawnChance} GetSpawnChance
 * @param {SpawnPlane} SpawnPlane
 * @returns none
 */
export const level1 = (
  entityManagerArr,
  goals,
  score,
  GetSpawnChance,
  SpawnPlane
) => {
  const departureCount = getDepartureCount(entityManagerArr);
  const areAllSpawned = noMoreDeparturesArrivals(
    entityManagerArr,
    goals,
    score
  );
  const isLowCount = score.departures + departureCount <= 3;

  if (areAllSpawned) return;

  if (isTaxiQueueAlmostFull(entityManagerArr)) {
    return SpawnPlane(GetSpawnChance(baseChance), chanceDepartureLow);
  }
  if (isLowCount) {
    return SpawnPlane(GetSpawnChance(baseChance), guaranteedChance);
  }

  return SpawnPlane(GetSpawnChance(highChance), guaranteedChance);
};

/**
 * @param {Array} entityManagerArr
 * @param {Goals} goals
 * @param {Score} score
 * @param {GetSpawnChance} GetSpawnChance
 * @param {SpawnPlane} SpawnPlane
 * @returns none
 */
export const level2 = (
  entityManagerArr,
  goals,
  score,
  GetSpawnChance,
  SpawnPlane
) => {
  const areAllSpawned = noMoreDeparturesArrivals(
    entityManagerArr,
    goals,
    score
  );

  if (areAllSpawned) return;
  return SpawnPlane(GetSpawnChance(baseChance), noChance);
};

/**
 * @param {Array} entityManagerArr
 * @param {Goals} goals
 * @param {Score} score
 * @param {GetSpawnChance} GetSpawnChance
 * @param {SpawnPlane} SpawnPlane
 * @returns none
 */
export const level3 = (
  entityManagerArr,
  goals,
  score,
  GetSpawnChance,
  SpawnPlane
) => {
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

  if (areAllSpawned) return;

  let chance = baseChance;
  if (count <= lowCount) {
    chance = veryHighChance;
  }

  if (areDeparturesSpawned) {
    return SpawnPlane(GetSpawnChance(chance), noChance);
  }
  if (isTaxiQueueAlmostFull(entityManagerArr)) {
    return SpawnPlane(GetSpawnChance(chance), chanceDepartureLow);
  }
  if (areArrivalsSpawned) {
    return SpawnPlane(GetSpawnChance(chance), guaranteedChance);
  }

  if (count <= lowCount) {
    if (departureCount > arrivalCount) {
      return SpawnPlane(GetSpawnChance(chance), noChance);
    } else {
      return SpawnPlane(GetSpawnChance(chance), guaranteedChance);
    }
  }

  // not a lowCount && both Arrivals + Departures remaining
  return SpawnPlane(GetSpawnChance(chance), chanceDepartureBase);
};

// PRIvATE ////////////////////////////////////////////////////////////////

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
