import { createPositionMayday } from '../game/score/mayday.js';
import { MaydayScenario } from '../types.js';
import { isAircraft } from '../types.js';
import { getDepartureCount, getArrivalCount } from '../utils.js';
import { getAirportByLevel, getLevelObj } from './getLevel.js';

/**
 * @typedef {import('../flights/flights.js')} FlightObj
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
 * @param {FlightObj} flightObj
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
    const maydayLevel9 = spawnBalancedMayday(MaydayScenario.Level9Fire);
    const maydayLevel15 = spawnBalancedMayday(MaydayScenario.Level15Decompress);
    const maydayLevel20 = spawnBalancedMayday(MaydayScenario.Level20BirdStrike);
    const maydayLevel25 = spawnBalancedMayday(MaydayScenario.Level25Fuel);

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
    if (gameLevel === 9) return maydayLevel9(spawnArg, airport);
    if (gameLevel === 10) return spawnMoreArrivals(spawnArg, airport);
    if (gameLevel === 11) return spawnBalanced(spawnArg, airport);
    // HND
    if (gameLevel === 12) return spawnBalanced(spawnArg, airport);
    if (gameLevel === 13) return spawnBalanced(spawnArg, airport);
    if (gameLevel === 14) return spawnBalanced(spawnArg, airport);
    if (gameLevel === 15) return maydayLevel15(spawnArg, airport);
    if (gameLevel === 16) return spawnBalanced(spawnArg, airport);
    // AMS
    if (gameLevel === 17) return spawnBalanced(spawnArg, airport);
    if (gameLevel === 18) return spawnBalanced(spawnArg, airport);
    if (gameLevel === 19) return spawnMoreArrivals(spawnArg, airport);
    if (gameLevel === 20) return maydayLevel20(spawnArg, airport);
    if (gameLevel === 21) return spawnBalanced(spawnArg, airport);
    // YVR
    if (gameLevel === 22) return spawnBalanced(spawnArg, airport);
    if (gameLevel === 23) return spawnBalanced(spawnArg, airport);
    if (gameLevel === 24) return spawnBalanced(spawnArg, airport);
    // if (gameLevel === 25) return spawnMoreArrivals(spawnArg, airport);
    if (gameLevel === 25) return maydayLevel25(spawnArg, airport);
    if (gameLevel === 26) return spawnBalanced(spawnArg, airport);

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
  const flightObj = { time: 14 * 60 };
  const areDeparturesSpawned = noMoreDepart(entityManagerArr, goals, score);
  const areAllSpawned = noMoreDepartOrArrive(entityManagerArr, goals, score);
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
  const areArrivalsSpawned = noMoreArrive(entityManagerArr, goals, score);
  const areAllSpawned = noMoreDepartOrArrive(entityManagerArr, goals, score);
  if (areAllSpawned) return;
  if (areArrivalsSpawned) return;

  aircraftFn(getChanceFn(baseChance), noChance, flightObj, airport);
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
  const areDeparturesSpawned = noMoreDepart(entityManagerArr, goals, score);
  const areArrivalsSpawned = noMoreArrive(entityManagerArr, goals, score);
  const areAllSpawned = noMoreDepartOrArrive(entityManagerArr, goals, score);
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

export const getSpawnMayday = (arg, maydayScenario) => {
  const { entityManagerArr, getChanceFn, score } = arg;
  const maydayCount = score.maydaySpawn;
  const count = entityManagerArr.filter(isAircraft).length;

  let time = 10 * 60;
  let isMayday = false;

  if (maydayCount >= 1) return { isMayday, time };
  let chance = 0;

  if (maydayScenario === MaydayScenario.Level9Fire) {
    time = createPositionMayday(maydayScenario).time;

    if (count > 12) {
      chance = guaranteedChance;
    } else if (count > 10) {
      chance = veryHighChance;
    } else if (count > 8) {
      chance = highChance;
    } else {
      chance = 0;
    }

    if (Math.random() <= getChanceFn(chance)) {
      isMayday = true;
      return { isMayday, time };
    }
    return { isMayday, time };
  }

  if (maydayScenario === MaydayScenario.Level15Decompress) {
    time = createPositionMayday(maydayScenario).time;

    if (count > 14) {
      chance = guaranteedChance;
    } else if (count > 12) {
      chance = veryHighChance;
    } else if (count > 10) {
      chance = highChance;
    } else {
      chance = 0;
    }

    if (Math.random() <= getChanceFn(chance)) {
      isMayday = true;
      return { isMayday, time };
    }
    return { isMayday, time };
  }

  if (maydayScenario === MaydayScenario.Level20BirdStrike) {
    const time = 18 * 60;

    if (count > 12) {
      chance = guaranteedChance;
    } else if (count > 10) {
      chance = veryHighChance;
    } else if (count > 8) {
      chance = highChance;
    } else {
      chance = 0;
    }

    if (Math.random() <= getChanceFn(chance)) {
      isMayday = true;
      return { isMayday, time };
    }
    return { isMayday, time };
  }

  if (maydayScenario === MaydayScenario.Level25Fuel) {
    time = createPositionMayday(maydayScenario).time;

    if (count > 14) {
      chance = guaranteedChance;
    } else if (count > 12) {
      chance = veryHighChance;
    } else if (count > 10) {
      chance = highChance;
    } else {
      chance = 0;
    }

    if (Math.random() <= getChanceFn(chance)) {
      isMayday = true;
      return { isMayday, time };
    }
    return { isMayday, time };
  }

  console.error('unknown maydayScenario');
  return { isMayday, time };
};

/**
 * @param {MaydayScenario} maydayScenario
 * @param {LevelArg} arg
 * @param {Airport} airport
 */
export const spawnBalancedMayday = (maydayScenario) => (arg, airport) => {
  const { getChanceFn, aircraftFn } = arg;
  const { isMayday, time } = getSpawnMayday(arg, maydayScenario);

  if (isMayday) {
    if (maydayScenario === MaydayScenario.Level20BirdStrike) {
      const flightObj = { time, isMayday: true, maydayScenario };
      aircraftFn(
        getChanceFn(guaranteedChance),
        guaranteedChance,
        flightObj,
        airport
      );
      return;
    }

    const flightObj = {
      flight: 'MAYDAY',
      time,
      isMayday: true,
      maydayScenario,
    };
    aircraftFn(getChanceFn(guaranteedChance), noChance, flightObj, airport);
    return;
  }

  const timeDefault = 18 * 60;
  spawnBalancedCommon(arg, airport, chanceDepartureBase, timeDefault);
};

////////////////////////////////////////////////////////////////////////
// PRIVATE
////////////////////////////////////////////////////////////////////////
const departingCount = (obj) => getDepartureCount(obj);
const arrivingCount = (obj) => getArrivalCount(obj);

const departureGoalRemaining = (goals, score) =>
  goals.Departures - score.departures;
const arrivalGoalRemaining = (goals, score) => goals.Arrivals - score.arrivals;
const noMoreRemaining = (countFn, remainingFn) => (arr, goals, score) =>
  countFn(arr) >= remainingFn(goals, score);

const noMoreDepart = noMoreRemaining(departingCount, departureGoalRemaining);
const noMoreArrive = noMoreRemaining(arrivingCount, arrivalGoalRemaining);
const noMoreDepartOrArrive = (arr, goals, score) =>
  noMoreDepart(arr, goals, score) && noMoreArrive(arr, goals, score);
