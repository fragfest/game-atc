// HND
import {
  getWaypointArrivalsAll as getWaypointArrivalsHND,
  getRunwayRnd as getRunwayRndHND,
  getWaypointDepartureRnd as getWaypointDepartureRndHND,
  getWaypointBySection as getWaypointBySectionHND,
  getMapImage as getMapImageHND,
  getMapEntities as getMapEntitiesHND,
} from './HND';
import {
  getFlightDeparture as getFlightDepartureHND,
  getFlightArrival as getFlightArrivalHND,
} from '../flights/HND';
// END HND

// JFK
import {
  getWaypointArrivalsAll as getWaypointArrivalsJFK,
  getRunwayRnd as getRunwayRndJFK,
  getWaypointDepartureRnd as getWaypointDepartureRndJFK,
  getWaypointBySection as getWaypointBySectionJFK,
  getMapImage as getMapImageJFK,
  getMapEntities as getMapEntitiesJFK,
} from './JFK';
import {
  getFlightDeparture as getFlightDepartureJFK,
  getFlightArrival as getFlightArrivalJFK,
} from '../flights/JFK';
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
import {
  getFlightDeparture as getFlightDepartureLHR,
  getFlightArrival as getFlightArrivalLHR,
} from '../flights/LHR';
// END LHR

export const Airport = Object.freeze({
  Heathrow: 'Heathrow',
  NewYorkJFK: 'NewYorkJFK',
  TokyoHND: 'TokyoHND',
});

export const getMapImageOpacity = (airport) => {
  if (airport === Airport.Heathrow) return 0.5;
  if (airport === Airport.NewYorkJFK) return 0.4;
  if (airport === Airport.TokyoHND) return 0.3;

  throw new Error('unknown airport: ' + airport);
};

export const getMapImage = (airport) => {
  if (airport === Airport.Heathrow) return getMapImageLHR();
  if (airport === Airport.NewYorkJFK) return getMapImageJFK();
  if (airport === Airport.TokyoHND) return getMapImageHND();

  throw new Error('unknown airport: ' + airport);
};

export const getWaypointArrivalsAll = (airport) => {
  if (airport === Airport.Heathrow) return getWaypointArrivalsLHR();
  if (airport === Airport.NewYorkJFK) return getWaypointArrivalsJFK();
  if (airport === Airport.TokyoHND) return getWaypointArrivalsHND();

  throw new Error('unknown airport: ' + airport);
};

export const getWaypointBySection = (airport) => (sectionInt) => {
  if (airport === Airport.Heathrow) return getWaypointBySectionLHR(sectionInt);
  if (airport === Airport.NewYorkJFK)
    return getWaypointBySectionJFK(sectionInt);
  if (airport === Airport.TokyoHND) return getWaypointBySectionHND(sectionInt);

  throw new Error('unknown airport: ' + airport);
};

export const getWaypointDepartureRnd = (airport) => {
  if (airport === Airport.Heathrow) return getWaypointDepartureRndLHR();
  if (airport === Airport.NewYorkJFK) return getWaypointDepartureRndJFK();
  if (airport === Airport.TokyoHND) return getWaypointDepartureRndHND();

  throw new Error('unknown airport: ' + airport);
};

export const getFlightDeparture = (airport) => (spawned) => {
  if (airport === Airport.Heathrow) return getFlightDepartureLHR(spawned);
  if (airport === Airport.NewYorkJFK) return getFlightDepartureJFK(spawned);
  if (airport === Airport.TokyoHND) return getFlightDepartureHND(spawned);

  throw new Error('unknown airport: ' + airport);
};

export const getFlightArrival = (airport) => (spawned) => {
  if (airport === Airport.Heathrow) return getFlightArrivalLHR(spawned);
  if (airport === Airport.NewYorkJFK) return getFlightArrivalJFK(spawned);
  if (airport === Airport.TokyoHND) return getFlightArrivalHND(spawned);

  throw new Error('unknown airport: ' + airport);
};

export const getRunwayRnd = (destinationType, airport) => {
  if (airport === Airport.Heathrow) return getRunwayRndLHR();
  if (airport === Airport.NewYorkJFK) return getRunwayRndJFK();
  if (airport === Airport.TokyoHND) return getRunwayRndHND(destinationType);

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
  if (airport === Airport.TokyoHND) return getMapEntitiesHND();

  throw new Error('unknown airport: ' + airport);
};
