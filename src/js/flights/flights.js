import * as YVR from './YVR';
import * as AMS from './AMS';
import * as LHR from './LHR';
import * as JFK from './JFK';
import * as HND from './HND';
import { Airport } from '../airports/airports';

/**
 * @typedef {import('../types.js').DestinationType} DestinationType
 * @typedef {import('../aircraft/airframe.js').Airframes} Airframes
 */

/**
 * @typedef FlightObj
 * @property {DestinationType} type
 * @property {String} time
 * @property {String} flight
 * @property {String} city
 * @property {String} airport
 * @property {String} airlineCode
 * @property {String} airline
 * @property {Airframes} airframe
 */
/**
 * @typedef SpawnFn
 * @param {Array} spawned
 * @returns {FlightObj}
 */

/**
 * return arrival flight spawn function
 * @param {Airport} airport
 * @returns {SpawnFn}
 */
export const getFlightArrival = (airport) => (spawned) => {
  if (airport === Airport.LondonLHR) return flightArrival(LHR, spawned);
  if (airport === Airport.NewYorkJFK) return flightArrival(JFK, spawned);
  if (airport === Airport.TokyoHND) return flightArrival(HND, spawned);
  if (airport === Airport.AmsterdamAMS) return flightArrival(AMS, spawned);
  if (airport === Airport.VancouverYVR) return flightArrival(YVR, spawned);

  throw new Error('unknown airport: ' + airport);
};

/**
 * return departure flight spawn function
 * @param {Airport} airport
 * @returns {SpawnFn}
 */
export const getFlightDeparture = (airport) => (spawned) => {
  if (airport === Airport.LondonLHR) return flightDeparture(LHR, spawned);
  if (airport === Airport.NewYorkJFK) return flightDeparture(JFK, spawned);
  if (airport === Airport.TokyoHND) return flightDeparture(HND, spawned);
  if (airport === Airport.AmsterdamAMS) return flightDeparture(AMS, spawned);
  if (airport === Airport.VancouverYVR) return flightDeparture(YVR, spawned);

  throw new Error('unknown airport: ' + airport);
};

////////////////////////////////////////////////////////////
// PRIVATE
////////////////////////////////////////////////////////////

const setTimeSecs = () => 15 * 60;
const getRndIndex = (total) => Math.floor(Math.random() * total);
const isNotSpawned = (spawnedArr) => (obj) =>
  !spawnedArr.find((x) => x.flight === obj.flight);

// NOTE time is being patched to contain {number} seconds
const flightArrival = (flightModule, spawned) => {
  const unspawned = flightModule.flightsArrival.filter(isNotSpawned(spawned));
  const total = unspawned.length;
  if (total === 0) return null;

  const flightObj = { ...unspawned[getRndIndex(total)] };
  flightObj.time = setTimeSecs();
  return flightObj;
};

const flightDeparture = (flightModule, spawned) => {
  const unspawned = flightModule.flightsDeparture.filter(isNotSpawned(spawned));
  const total = unspawned.length;
  if (total === 0) return null;

  const flightObj = { ...unspawned[getRndIndex(total)] };
  flightObj.time = setTimeSecs();
  return flightObj;
};
