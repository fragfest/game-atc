import { isAircraft } from '../types.js';
import { getDepartureCount, getArrivalCount } from '../utils.js';
import { getAirportByLevel, getLevelObj } from './getLevel.js';

/**
 * @typedef {import('../types.js').Airport} Airport
 * @typedef {import('../game/score/score.js').Score} Score
 * @typedef {import('../game/victory.js').Goals} Goals
 */

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
 * @param {Airport} airport
 */
/**
 * @typedef {Object} LevelArg
 * @property {Array} entityManagerArr
 * @property {Goals} goals
 * @property {Score} score
 * @property {GetSpawnChance} getChanceFn
 * @property {SpawnPlane} aircraftFn
 */

/**
 * @typedef {Function} LevelFunc
 * @param {Object} arg
 * @param {LevelArg} arg.levelArg
 */

/**
 * @param {Object} arg
 * @param {LevelArg} arg.levelArg
 * @returns none
 */
export const callAircraftFnByLevel = (arg) => {
  getLevelObj().levelFn(arg);
};

/**
 * @param {Number} gameLevel
 * @returns {LevelFunc}
 */
export const getSpawnByGameLevel = (gameLevel) => {
  const spawnFn = (spawnArg) => {
    const airport = getAirportByLevel(gameLevel);
    if (gameLevel === 1) return spawnPlaneLevel1(spawnArg, airport);
    if (gameLevel === 2) return spawnPlaneLevel2(spawnArg, airport);
    if (gameLevel === 3) return spawnPlaneLevel3(spawnArg, airport);
    if (gameLevel === 4) return spawnPlaneLevel3(spawnArg, airport);
    if (gameLevel === 5) return spawnPlaneLevel3(spawnArg, airport);
    if (gameLevel === 6) return spawnPlaneLevel3(spawnArg, airport);
    if (gameLevel === 7) return spawnPlaneLevel1(spawnArg, airport);
    return spawnPlaneLevel3(spawnArg, airport);
  };
  return spawnFn;
};

////////////////////////////////////////////////////////////////////////
// SPAWN LEVEL 1
////////////////////////////////////////////////////////////////////////
const noChance = 0;
const baseChance = 0.03;
const highChance = 0.1;
const veryHighChance = 0.5;
const guaranteedChance = 1;
const chanceDepartureBase = 0.4;

/**
 * @param {Object} arg
 * @param {Array} arg.entityManagerArr
 * @param {Goals} arg.goals
 * @param {Score} arg.score
 * @param {GetSpawnChance} arg.getChanceFn
 * @param {SpawnPlane} arg.aircraftFn
 * @param {String} airport
 * @returns none
 */
export const spawnPlaneLevel1 = (arg, airport) => {
  const { entityManagerArr, goals, score, getChanceFn, aircraftFn } = arg;
  const flightObj = { time: 10 * 60 };
  const areDeparturesSpawned = noMoreDepartures(entityManagerArr, goals, score);
  const areAllSpawned = noMoreDeparturesArrivals(
    entityManagerArr,
    goals,
    score
  );
  if (areAllSpawned) return;

  if (areDeparturesSpawned) return;
  aircraftFn(getChanceFn(highChance), guaranteedChance, flightObj, airport);
};

////////////////////////////////////////////////////////////////////////
// SPAWN LEVEL 2
////////////////////////////////////////////////////////////////////////
/**
 * @param {Object} arg
 * @param {Array} arg.entityManagerArr
 * @param {Goals} arg.goals
 * @param {Score} arg.score
 * @param {GetSpawnChance} arg.getChanceFn
 * @param {SpawnPlane} arg.aircraftFn
 * @param {String} airport
 * @returns none
 */
export const spawnPlaneLevel2 = (arg, airport) => {
  const { entityManagerArr, goals, score, getChanceFn, aircraftFn } = arg;
  const flightObj = { time: 18 * 60 };
  const areArrivalsSpawned = noMoreArrivals(entityManagerArr, goals, score);
  const areAllSpawned = noMoreDeparturesArrivals(
    entityManagerArr,
    goals,
    score
  );
  if (areAllSpawned) return;

  if (areArrivalsSpawned) return;
  return aircraftFn(getChanceFn(baseChance), noChance, flightObj, airport);
};

////////////////////////////////////////////////////////////////////////
// SPAWN LEVEL 3
////////////////////////////////////////////////////////////////////////
/**
 * @param {Object} arg
 * @param {Array} arg.entityManagerArr
 * @param {Goals} arg.goals
 * @param {Score} arg.score
 * @param {GetSpawnChance} arg.getChanceFn
 * @param {SpawnPlane} arg.aircraftFn
 * @param {String} airport
 * @returns none
 */
export const spawnPlaneLevel3 = (arg, airport) => {
  const { entityManagerArr, goals, score, getChanceFn, aircraftFn } = arg;
  const count = entityManagerArr.filter(isAircraft).length;
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
  const flightObj = { time: 18 * 60 };

  if (areAllSpawned) return;

  let chance = baseChance;
  if (count <= lowCount) {
    chance = veryHighChance;
  }

  if (areDeparturesSpawned) {
    return aircraftFn(getChanceFn(chance), noChance, flightObj, airport);
  }
  if (areArrivalsSpawned) {
    return aircraftFn(
      getChanceFn(chance),
      guaranteedChance,
      flightObj,
      airport
    );
  }

  if (count <= lowCount) {
    if (departureCount > arrivalCount) {
      return aircraftFn(getChanceFn(chance), noChance, flightObj, airport);
    } else {
      return aircraftFn(
        getChanceFn(chance),
        guaranteedChance,
        flightObj,
        airport
      );
    }
  }

  // not a lowCount && both Arrivals + Departures remaining
  return aircraftFn(
    getChanceFn(chance),
    chanceDepartureBase,
    flightObj,
    airport
  );
};

////////////////////////////////////////////////////////////////////////
// PRIVATE
////////////////////////////////////////////////////////////////////////

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
