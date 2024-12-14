import Runway from './Runway';
import Waypoint from '../canvas/Waypoint';

import {
  Runways as RunwaysLHR,
  getRunway as getRunwayLHR,
  getWaypoint as getWaypointLHR,
  getWaypointArrivalsAll as getWaypointArrivalsLHR,
  getWaypointDestinationsAll as getWaypointDestinationsLHR,
  getRunwayRnd as getRunwayRndLHR,
  getWaypointDepartureRnd as getWaypointDepartureRndLHR,
  getWaypointBySection as getWaypointBySectionLHR,
  getMapImage as getMapImageLHR,
} from './LHR';
import {
  getFlightDeparture as getFlightDepartureLHR,
  getFlightArrival as getFlightArrivalLHR,
} from '../flights/LHR';

export const Airport = Object.freeze({
  Heathrow: 'Heathrow',
});

export const getMapImage = (airport) => {
  if (airport === Airport.Heathrow) return getMapImageLHR();

  throw new Error('unknown airport: ' + airport);
};

export const getWaypointArrivalsAll = (airport) => {
  if (airport === Airport.Heathrow) return getWaypointArrivalsLHR();

  throw new Error('unknown airport: ' + airport);
};

export const getWaypointBySection = (airport) => (sectionInt) => {
  if (airport === Airport.Heathrow) return getWaypointBySectionLHR(sectionInt);

  throw new Error('unknown airport: ' + airport);
};

export const getWaypointDepartureRnd = (airport) => {
  if (airport === Airport.Heathrow) return getWaypointDepartureRndLHR();

  throw new Error('unknown airport: ' + airport);
};

export const getFlightDeparture = (airport) => (spawned) => {
  if (airport === Airport.Heathrow) return getFlightDepartureLHR(spawned);

  throw new Error('unknown airport: ' + airport);
};

export const getFlightArrival = (airport) => (spawned) => {
  if (airport === Airport.Heathrow) return getFlightArrivalLHR(spawned);

  throw new Error('unknown airport: ' + airport);
};

export const getRunwayRnd = (airport) => {
  if (airport === Airport.Heathrow) return getRunwayRndLHR();

  throw new Error('unknown airport: ' + airport);
};

// TODO create jsdoc typedef of Entity for func desc
export const getMapEntities = (airport) => {
  if (airport === Airport.Heathrow) {
    const runway27R = (argObj) => {
      return new Runway(
        RunwaysLHR.TwoSevenRight,
        argObj.imgLayerObj,
        argObj.screenSize,
        getRunwayLHR(RunwaysLHR.TwoSevenRight, argObj.screenSize)
      );
    };

    const runway27L = (argObj) => {
      return new Runway(
        RunwaysLHR.TwoSevenLeft,
        argObj.imgLayerObj,
        argObj.screenSize,
        getRunwayLHR(RunwaysLHR.TwoSevenLeft, argObj.screenSize)
      );
    };

    const waypointArrivals = getWaypointArrivalsLHR().map(
      (waypoint) => (argObj) => {
        return new Waypoint(
          waypoint,
          argObj.backgroundObj,
          argObj.headingLayerObj,
          argObj.screenSize,
          getWaypointLHR(waypoint, argObj.screenSize)
        );
      }
    );

    const waypointDepartures = getWaypointDestinationsLHR().map(
      (waypoint) => (argObj) => {
        return new Waypoint(
          waypoint,
          argObj.backgroundObj,
          argObj.headingLayerObj,
          argObj.screenSize,
          getWaypointLHR(waypoint, argObj.screenSize)
        );
      }
    );

    return [runway27L, runway27R].concat(waypointArrivals, waypointDepartures);
  }

  throw new Error('unknown airport: ' + airport);
};
