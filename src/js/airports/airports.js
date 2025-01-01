import { DestinationType } from '../types';

import * as YVR from './YVR';
import * as AMS from './AMS';
import * as HND from './HND';
import * as JFK from './JFK';
import * as LHR from './LHR';

export const Airport = Object.freeze({
  LondonLHR: 'LondonLHR',
  NewYorkJFK: 'NewYorkJFK',
  TokyoHND: 'TokyoHND',
  AmsterdamAMS: 'AmsterdamAMS',
  VancouverYVR: 'VancouverYVR',
});

export const getMapImageOpacity = (airport) => {
  if (airport === Airport.LondonLHR) return 0.5;
  if (airport === Airport.NewYorkJFK) return 0.4;
  if (airport === Airport.TokyoHND) return 0.3;
  if (airport === Airport.AmsterdamAMS) return 0.3;
  if (airport === Airport.VancouverYVR) return 0.3;

  throw new Error('unknown airport: ' + airport);
};

export const getMapImage = (airport) => {
  if (airport === Airport.LondonLHR) return '/img/maps/london.png';
  if (airport === Airport.NewYorkJFK) return '/img/maps/new-york.png';
  if (airport === Airport.TokyoHND) return '/img/maps/tokyo.png';
  if (airport === Airport.AmsterdamAMS) return '/img/maps/amsterdam.png';
  if (airport === Airport.VancouverYVR) return '/img/maps/vancouver.png';

  throw new Error('unknown airport: ' + airport);
};

export const getWaypointArrivalsAll = (airport) => {
  if (airport === Airport.LondonLHR) return waypointArrivalsAll(LHR);
  if (airport === Airport.NewYorkJFK) return waypointArrivalsAll(JFK);
  if (airport === Airport.TokyoHND) return waypointArrivalsAll(HND);
  if (airport === Airport.AmsterdamAMS) return waypointArrivalsAll(AMS);
  if (airport === Airport.VancouverYVR) return waypointArrivalsAll(YVR);

  throw new Error('unknown airport: ' + airport);
};

export const getWaypointBySection = (airport) => (sectionInt) => {
  if (airport === Airport.LondonLHR)
    return LHR.getWaypointBySection(sectionInt);
  if (airport === Airport.NewYorkJFK)
    return JFK.getWaypointBySection(sectionInt);
  if (airport === Airport.TokyoHND) return HND.getWaypointBySection(sectionInt);
  if (airport === Airport.AmsterdamAMS)
    return AMS.getWaypointBySection(sectionInt);
  if (airport === Airport.VancouverYVR)
    return YVR.getWaypointBySection(sectionInt);

  throw new Error('unknown airport: ' + airport);
};

export const getWaypointDepartureRnd = (airport) => {
  if (airport === Airport.LondonLHR) return waypointDepartureRnd(LHR);
  if (airport === Airport.NewYorkJFK) return waypointDepartureRnd(JFK);
  if (airport === Airport.TokyoHND) return waypointDepartureRnd(HND);
  if (airport === Airport.AmsterdamAMS) return waypointDepartureRnd(AMS);
  if (airport === Airport.VancouverYVR) return waypointDepartureRnd(YVR);

  throw new Error('unknown airport: ' + airport);
};

export const getRunwayRnd = (destinationType, airport) => {
  if (airport === Airport.LondonLHR) return runwayRnd(LHR, destinationType);
  if (airport === Airport.NewYorkJFK) return runwayRnd(JFK, destinationType);
  if (airport === Airport.TokyoHND) return runwayRnd(HND, destinationType);
  if (airport === Airport.AmsterdamAMS) return runwayRnd(AMS, destinationType);
  if (airport === Airport.VancouverYVR) return runwayRnd(YVR, destinationType);

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
  if (airport === Airport.LondonLHR) return LHR.getMapEntities();
  if (airport === Airport.NewYorkJFK) return JFK.getMapEntities();
  if (airport === Airport.TokyoHND) return HND.getMapEntities();
  if (airport === Airport.AmsterdamAMS) return AMS.getMapEntities();
  if (airport === Airport.VancouverYVR) return YVR.getMapEntities();

  throw new Error('unknown airport: ' + airport);
};

///////////////////////////////////////////////////////////////////////
// PRIVATE
///////////////////////////////////////////////////////////////////////

const runwayRnd = (airportModule, destinationType) => {
  const arriveOnly = airportModule.RunwaysArrivals;
  const departOnly = airportModule.RunwaysDepartures;

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
