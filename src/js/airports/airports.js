import Runway from './Runway';
import Waypoint from '../canvas/Waypoint';

// LHR
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
// END LHR

// JFK
import {
  Runways as RunwaysJFK,
  getRunway as getRunwayJFK,
  getWaypoint as getWaypointJFK,
  getWaypointArrivalsAll as getWaypointArrivalsJFK,
  getWaypointDestinationsAll as getWaypointDestinationsJFK,
  getRunwayRnd as getRunwayRndJFK,
  getWaypointDepartureRnd as getWaypointDepartureRndJFK,
  getWaypointBySection as getWaypointBySectionJFK,
  getMapImage as getMapImageJFK,
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

// TODO create jsdoc typedef of Entity for func desc
export const getMapEntities = (airport) => {
  if (airport === Airport.NewYorkJFK) {
    const runway22L = (argObj) => {
      return new Runway(
        RunwaysJFK.TwentyTwoLeft,
        argObj.imgLayerObj,
        argObj.screenSize,
        getRunwayJFK(RunwaysJFK.TwentyTwoLeft, argObj.screenSize)
      );
    };

    const waypointArrivals = getWaypointArrivalsJFK().map(
      (waypoint) => (argObj) => {
        return new Waypoint(
          waypoint,
          argObj.backgroundObj,
          argObj.headingLayerObj,
          argObj.screenSize,
          getWaypointJFK(waypoint, argObj.screenSize)
        );
      }
    );

    const waypointDepartures = getWaypointDestinationsJFK().map(
      (waypoint) => (argObj) => {
        return new Waypoint(
          waypoint,
          argObj.backgroundObj,
          argObj.headingLayerObj,
          argObj.screenSize,
          getWaypointJFK(waypoint, argObj.screenSize)
        );
      }
    );
    return [runway22L].concat(waypointArrivals, waypointDepartures);
  }

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
