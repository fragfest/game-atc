import { isAircraft } from '../types.js';
import { getDepartureCount, getArrivalCount } from '../utils.js';
import { getAirportByLevel, getLevelObj } from './getLevel.js';

/**
 * @typedef {import('../airports/airports.js').Airport} Airport
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
    // LHR
    if (gameLevel === 1) return spawnDeparturesOnly(spawnArg, airport);
    if (gameLevel === 2) return spawnArrivalsOnly(spawnArg, airport);
    if (gameLevel === 3) return spawnBalanced(spawnArg, airport);
    if (gameLevel === 4) return spawnBalanced(spawnArg, airport);
    if (gameLevel === 5) return spawnBalanced(spawnArg, airport);
    if (gameLevel === 6) return spawnBalanced(spawnArg, airport);
    // JFK
    if (gameLevel === 7) return spawnBalanced(spawnArg, airport);
    if (gameLevel === 8) return spawnBalanced(spawnArg, airport);
    if (gameLevel === 9) return spawnBalanced(spawnArg, airport);
    if (gameLevel === 10) return spawnMoreArrivals(spawnArg, airport);
    if (gameLevel === 11) return spawnBalanced(spawnArg, airport);
    // HND
    if (gameLevel === 12) return spawnBalanced(spawnArg, airport);
    if (gameLevel === 13) return spawnBalanced(spawnArg, airport);
    if (gameLevel === 14) return spawnBalanced(spawnArg, airport);
    if (gameLevel === 15) return spawnBalanced(spawnArg, airport);
    if (gameLevel === 16) return spawnBalanced(spawnArg, airport);
    // AMS
    if (gameLevel === 17) return spawnBalanced(spawnArg, airport);
    if (gameLevel === 18) return spawnBalanced(spawnArg, airport);
    if (gameLevel === 19) return spawnMoreArrivals(spawnArg, airport);
    if (gameLevel === 20) return spawnBalanced(spawnArg, airport);
    if (gameLevel === 21) return spawnBalanced(spawnArg, airport);
    // YVR

    throw new Error('unknown level: ' + gameLevel);
  };
  return spawnFn;
};

const noChance = 0;
const baseChance = 0.03;
const highChance = 0.1;
const veryHighChance = 0.5;
const guaranteedChance = 1;
const chanceDepartureBase = 0.4;
const chanceDepartureHigh = chanceDepartureBase / 10;

/**
 * @param {LevelArg} arg
 * @param {Airport} airport
 * @returns none
 */
export const spawnDeparturesOnly = (arg, airport) => {
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

/**
 * @param {LevelArg} arg
 * @param {Airport} airport
 * @returns none
 */
export const spawnArrivalsOnly = (arg, airport) => {
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

  aircraftFn(getChanceFn(baseChance), noChance, flightObj, airport);
};

/**
 * @param {LevelArg} arg
 * @param {Airport} airport
 * @param {Number} chanceDeparture
 * @param {Number} time flight timer in seconds
 * @returns none
 */
export const spawnBalancedCommon = (arg, airport, chanceDeparture, time) => {
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
  const flightObj = { time };

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
  aircraftFn(getChanceFn(chance), chanceDeparture, flightObj, airport);
};

/**
 * @param {LevelArg} arg
 * @param {Airport} airport
 * @returns none
 */
export const spawnBalanced = (arg, airport) => {
  const chanceDeparture = chanceDepartureBase;
  const time = 18 * 60;
  spawnBalancedCommon(arg, airport, chanceDeparture, time);
};

/**
 * @param {LevelArg} arg
 * @param {Airport} airport
 * @returns none
 */
export const spawnMoreArrivals = (arg, airport) => {
  const chanceDeparture = chanceDepartureHigh;
  const time = 20 * 60;
  spawnBalancedCommon(arg, airport, chanceDeparture, time);
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
