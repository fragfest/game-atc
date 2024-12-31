import { DestinationType } from '../types';

import * as AMS from './AMS';
import * as HND from './HND';

// JFK
import {
  getWaypointArrivalsAll as getWaypointArrivalsJFK,
  getRunwayRnd as getRunwayRndJFK,
  getWaypointDepartureRnd as getWaypointDepartureRndJFK,
  getWaypointBySection as getWaypointBySectionJFK,
  getMapImage as getMapImageJFK,
  getMapEntities as getMapEntitiesJFK,
} from './JFK';
// END JFK

// LHR
import {
  getWaypointArrivalsAll as getWaypointArrivalsLHR,
  getRunwayRnd as getRunwayRndLHR,
  getWaypointDepartureRnd as getWaypointDepartureRndLHR,
  getWaypointBySection as getWaypointBySectionLHR,
  getMapImage as getMapImageLHR,
  getMapEntities as getMapEntitiesLHR,
} from './LHR';
// END LHR

export const Airport = Object.freeze({
  Heathrow: 'Heathrow',
  NewYorkJFK: 'NewYorkJFK',
  TokyoHND: 'TokyoHND',
  Amsterdam: 'Amsterdam',
});

export const getMapImageOpacity = (airport) => {
  if (airport === Airport.Heathrow) return 0.5;
  if (airport === Airport.NewYorkJFK) return 0.4;
  if (airport === Airport.TokyoHND) return 0.3;
  if (airport === Airport.Amsterdam) return 0.3;

  throw new Error('unknown airport: ' + airport);
};

export const getMapImage = (airport) => {
  if (airport === Airport.Heathrow) return getMapImageLHR();
  if (airport === Airport.NewYorkJFK) return getMapImageJFK();
  if (airport === Airport.TokyoHND) return '/img/maps/tokyo.png';
  if (airport === Airport.Amsterdam) return '/img/maps/amsterdam.png';

  throw new Error('unknown airport: ' + airport);
};

export const getWaypointArrivalsAll = (airport) => {
  if (airport === Airport.Heathrow) return getWaypointArrivalsLHR();
  if (airport === Airport.NewYorkJFK) return getWaypointArrivalsJFK();
  if (airport === Airport.TokyoHND) return waypointArrivalsAll(HND);
  if (airport === Airport.Amsterdam) return waypointArrivalsAll(AMS);

  throw new Error('unknown airport: ' + airport);
};

export const getWaypointBySection = (airport) => (sectionInt) => {
  if (airport === Airport.Heathrow) return getWaypointBySectionLHR(sectionInt);
  if (airport === Airport.NewYorkJFK)
    return getWaypointBySectionJFK(sectionInt);
  if (airport === Airport.TokyoHND) return HND.getWaypointBySection(sectionInt);
  if (airport === Airport.Amsterdam)
    return AMS.getWaypointBySection(sectionInt);

  throw new Error('unknown airport: ' + airport);
};

export const getWaypointDepartureRnd = (airport) => {
  if (airport === Airport.Heathrow) return getWaypointDepartureRndLHR();
  if (airport === Airport.NewYorkJFK) return getWaypointDepartureRndJFK();
  if (airport === Airport.TokyoHND) return waypointDepartureRnd(HND);
  if (airport === Airport.Amsterdam) return waypointDepartureRnd(AMS);

  throw new Error('unknown airport: ' + airport);
};

export const getRunwayRnd = (destinationType, airport) => {
  if (airport === Airport.Heathrow) return getRunwayRndLHR();
  if (airport === Airport.NewYorkJFK) return getRunwayRndJFK();
  if (airport === Airport.TokyoHND) return runwayRnd(HND, destinationType);
  if (airport === Airport.Amsterdam) return runwayRnd(AMS, destinationType);

  throw new Error('unknown airport: ' + airport);
};

/**
 * @typedef {Function} EntitySetupFn
 * @param {Object} setupArg
 * @param {Object} setupArg.imgLayerObj canvas object
 * @param {Object} setupArg.backgroundObj canvas object
 * @param {Object} setupArg.headingLayerObj canvas object
 * @param {Object} setupArg.screenSize
 */
/**
 * @returns {Array.<EntitySetupFn>}
 */
export const getMapEntities = (airport) => {
  if (airport === Airport.NewYorkJFK) return getMapEntitiesJFK();
  if (airport === Airport.Heathrow) return getMapEntitiesLHR();
  if (airport === Airport.TokyoHND) return HND.getMapEntities();
  if (airport === Airport.Amsterdam) return AMS.getMapEntities();

  throw new Error('unknown airport: ' + airport);
};

///////////////////////////////////////////////////////////////////////
// PRIVATE
///////////////////////////////////////////////////////////////////////

const runwayRnd = (airportModule, destinationType) => {
  const arriveOnly = airportModule.RunwaysArrivalOnly;
  const departOnly = airportModule.RunwaysDepartureOnly;

  let runwayArr = [];
  if (destinationType === DestinationType.Arrival) {
    runwayArr = Object.values(arriveOnly);
  }
  if (destinationType === DestinationType.Departure) {
    runwayArr = Object.values(departOnly);
  }
  const index = Math.floor(Math.random() * runwayArr.length);
  return runwayArr[index];
};

const waypointArrivalsAll = (airportModule) => {
  return Object.values(airportModule.WaypointArrivals);
};

const waypointDepartureRnd = (airportModule) => {
  const waypoints = Object.values(airportModule.WaypointDepartures);
  const index = Math.floor(Math.random() * waypoints.length);
  return waypoints[index];
};
