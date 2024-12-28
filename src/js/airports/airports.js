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

export const Airport = Object.freeze({
  Heathrow: 'Heathrow',
  NewYorkJFK: 'NewYorkJFK',
});

export const getMapImageOpacity = (airport) => {
  if (airport === Airport.Heathrow) return 0.5;
  if (airport === Airport.NewYorkJFK) return 0.4;

  throw new Error('unknown airport: ' + airport);
};

export const getMapImage = (airport) => {
  if (airport === Airport.Heathrow) return getMapImageLHR();
  if (airport === Airport.NewYorkJFK) return getMapImageJFK();

  throw new Error('unknown airport: ' + airport);
};

export const getWaypointArrivalsAll = (airport) => {
  if (airport === Airport.Heathrow) return getWaypointArrivalsLHR();
  if (airport === Airport.NewYorkJFK) return getWaypointArrivalsJFK();

  throw new Error('unknown airport: ' + airport);
};

export const getWaypointBySection = (airport) => (sectionInt) => {
  if (airport === Airport.Heathrow) return getWaypointBySectionLHR(sectionInt);
  if (airport === Airport.NewYorkJFK)
    return getWaypointBySectionJFK(sectionInt);

  throw new Error('unknown airport: ' + airport);
};

export const getWaypointDepartureRnd = (airport) => {
  if (airport === Airport.Heathrow) return getWaypointDepartureRndLHR();
  if (airport === Airport.NewYorkJFK) return getWaypointDepartureRndJFK();

  throw new Error('unknown airport: ' + airport);
};

export const getFlightDeparture = (airport) => (spawned) => {
  if (airport === Airport.Heathrow) return getFlightDepartureLHR(spawned);
  if (airport === Airport.NewYorkJFK) return getFlightDepartureJFK(spawned);

  throw new Error('unknown airport: ' + airport);
};

export const getFlightArrival = (airport) => (spawned) => {
  if (airport === Airport.Heathrow) return getFlightArrivalLHR(spawned);
  if (airport === Airport.NewYorkJFK) return getFlightArrivalJFK(spawned);

  throw new Error('unknown airport: ' + airport);
};

export const getRunwayRnd = (airport) => {
  if (airport === Airport.Heathrow) return getRunwayRndLHR();
  if (airport === Airport.NewYorkJFK) return getRunwayRndJFK();

  throw new Error('unknown airport: ' + airport);
};

export const getMapEntities = (airport) => {
  if (airport === Airport.NewYorkJFK) return getMapEntitiesJFK();
  if (airport === Airport.Heathrow) return getMapEntitiesLHR();

  throw new Error('unknown airport: ' + airport);
};
