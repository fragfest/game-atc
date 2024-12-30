import Aircraft from './Aircraft';
import { DestinationType } from '../types';
import {
  getScreenSize,
  convHdgDegToThreeDigits,
  convHdgRadToThreeDigits,
  randMinMax,
} from '../utils';
import { getPerformance } from './airframe';
import { getGoals } from '../game/victory';
import { getScore } from '../game/score/score';
import { callAircraftFnByLevel } from '../levels/levels';
import {
  getFlightArrival,
  getFlightDeparture,
  getRunwayRnd,
  getWaypointBySection,
  getWaypointDepartureRnd,
} from '../airports/airports';

/**
 * @callback CreateAircraft
 * @returns {Aircraft}
 */
/**
 * @callback CreateAircraftRnd
 * @param {CreateAircraft} createAircraft
 * @param {Number} chanceOfPlane
 */

/**
 * @callback gameTickCB
 * @param {Number} deltaTimeMs
 */
/**
 * @param {Object} canvasObj
 * @param {Array} entityManagerArr
 * @param {CreateAircraftRnd} createAircraftRndFn
 * @returns {gameTickCB}
 */
export const spawnPlaneGameTick =
  (canvasObj, entityManagerArr, createAircraftRndFn) => (deltaTimeMs) => {
    const goals = getGoals();
    const score = getScore();
    const spawnRate = goals.SpawnRate || 1;

    const aircraftFn = (
      chanceOfPlane,
      chanceOfDeparture,
      flightObj,
      airport
    ) => {
      createAircraftRndFn(() => {
        return createAircraftRndDestinationType(
          { ...canvasObj, flightObj: { ...flightObj } },
          chanceOfDeparture,
          airport
        );
      }, chanceOfPlane);
    };

    const getChanceFn = (chanceOfPlanePerSec) => {
      const spawnRateModifier = 0.7;
      const chanceOfPlaneBase = (chanceOfPlanePerSec * deltaTimeMs) / 1000;
      return chanceOfPlaneBase * (spawnRate * spawnRateModifier);
    };

    callAircraftFnByLevel({
      entityManagerArr,
      goals,
      score,
      getChanceFn,
      aircraftFn,
    });
  };

export const createAircraftRndDestinationType = (
  {
    entityManagerArr,
    width,
    height,
    canvasObjEntity,
    canvasObjText,
    canvasObjHeading,
    canvasEntityEl,
    flightObj,
    clickCB,
  },
  chanceOfDeparture,
  airport
) => {
  let destinationType = DestinationType.Arrival;
  if (Math.random() < chanceOfDeparture) {
    destinationType = DestinationType.Departure;
  }

  const canvasObjs = {
    canvasObjEntity,
    canvasObjText,
    canvasObjHeading,
    canvasEntityEl,
    width,
    height,
  };

  if (destinationType === DestinationType.Arrival) {
    const aircraft = createAircraftArrival(
      entityManagerArr,
      canvasObjs,
      flightObj,
      airport,
      clickCB
    );
    return aircraft;
  }

  if (destinationType === DestinationType.Departure) {
    const aircraft = createAircraftDeparture(
      entityManagerArr,
      canvasObjs,
      flightObj,
      airport,
      clickCB
    );
    return aircraft;
  }
};

// PRIVATE /////////////////////////////////////////////////////////////////

const createAircraftArrival = (
  entityManagerArr,
  canvasObjs,
  flightObjArg = {},
  airport,
  clickCB
) => {
  const {
    canvasObjEntity,
    canvasObjText,
    canvasObjHeading,
    canvasEntityEl,
    width,
    height,
  } = canvasObjs;

  const runwayTitleRnd = getRunwayRnd(DestinationType.Arrival, airport);
  const runway = entityManagerArr.find((x) => x.title === runwayTitleRnd);

  // sections numbered from WNW going clockwise: 1 - 8
  const sectionsCount = 8;
  const section = Math.ceil(Math.random() * sectionsCount);
  const newPlane = spawnArrival(airport, width, height, section);
  const altitude = setAlt();
  const speed = setSpd();

  const flight = createFlight(getFlightArrival(airport));
  const flightObj = { ...flight, ...flightObjArg };
  const airframeObj = getPerformance(flight.airframe, getScreenSize());

  const aircraft = new Aircraft(
    flightObj,
    canvasObjEntity,
    canvasObjText,
    canvasObjHeading,
    canvasEntityEl,
    {
      x: newPlane.x,
      y: newPlane.y,
      heading: newPlane.heading,
      altitude,
      speed,
    },
    {
      destinationType: DestinationType.Arrival,
      airframeObj,
      waypoint: newPlane.waypoint,
      runway: runway.title,
      airport,
    }
  );
  aircraft.clickEventCB = () => clickCB(aircraft);
  return aircraft;
};

const createAircraftDeparture = (
  entityManagerArr,
  canvasObjs,
  flightObjArg = {},
  airport,
  clickCB
) => {
  const { canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl } =
    canvasObjs;
  const runwayTitleRnd = getRunwayRnd(DestinationType.Departure, airport);
  const runway = entityManagerArr.find((x) => x.title === runwayTitleRnd);

  const newPlane = {
    x: runway.x,
    y: runway.y,
    heading: convHdgRadToThreeDigits(runway.runwayHeading),
    waypoint: getWaypointDepartureRnd(airport),
  };
  const altitude = 0;
  const speed = 0;

  const flight = createFlight(getFlightDeparture(airport));
  const flightObj = { ...flight, ...flightObjArg };
  const airframeObj = getPerformance(flight.airframe, getScreenSize());

  const aircraft = new Aircraft(
    flightObj,
    canvasObjEntity,
    canvasObjText,
    canvasObjHeading,
    canvasEntityEl,
    {
      x: newPlane.x,
      y: newPlane.y,
      heading: newPlane.heading,
      altitude,
      speed,
    },
    {
      destinationType: DestinationType.Departure,
      airframeObj,
      waypoint: newPlane.waypoint,
      runway: runway.title,
      airport,
    }
  );
  aircraft.clickEventCB = () => clickCB(aircraft);
  return aircraft;
};

let spawned = [];
const createFlight = (getFlightFn) => {
  let newFlight = getFlightFn(spawned);
  if (!newFlight) {
    spawned = [];
    newFlight = getFlightFn(spawned);
  }
  spawned.push(newFlight);
  return newFlight;
};

const setAlt = () => Math.floor(randMinMax(7000, 10000) / 100) * 100;
const setSpd = () => Math.floor(randMinMax(230, 250) / 5) * 5;

const spawnArrival = (airport, width, height, sectionInt) => {
  const waypoint = getWaypointBySection(airport)(sectionInt);
  if (sectionInt === 1) {
    return {
      x: 0,
      y: randMinMax(0, height / 2 - 200),
      heading: convHdgDegToThreeDigits(randMinMax(120, 140)),
      waypoint,
    };
  }
  if (sectionInt === 2) {
    return {
      x: randMinMax(0, width / 2 - 200),
      y: 0,
      heading: convHdgDegToThreeDigits(randMinMax(120, 140)),
      waypoint,
    };
  }
  if (sectionInt === 3) {
    return {
      x: randMinMax(width / 2 + 200, width),
      y: 0,
      heading: convHdgDegToThreeDigits(randMinMax(220, 240)),
      waypoint,
    };
  }
  if (sectionInt === 4) {
    return {
      x: width,
      y: randMinMax(0, height / 2 - 200),
      heading: convHdgDegToThreeDigits(randMinMax(220, 240)),
      waypoint,
    };
  }
  if (sectionInt === 5) {
    return {
      x: width,
      y: randMinMax(height / 2 + 200, height),
      heading: convHdgDegToThreeDigits(randMinMax(310, 330)),
      waypoint,
    };
  }
  if (sectionInt === 6) {
    return {
      x: randMinMax(width / 2 + 200, width),
      y: height,
      heading: convHdgDegToThreeDigits(randMinMax(310, 330)),
      waypoint,
    };
  }
  if (sectionInt === 7) {
    return {
      x: randMinMax(0, width / 2 - 200),
      y: height,
      heading: convHdgDegToThreeDigits(randMinMax(40, 60)),
      waypoint,
    };
  }
  if (sectionInt === 8) {
    return {
      x: 0,
      y: randMinMax(height / 2 + 200, height),
      heading: convHdgDegToThreeDigits(randMinMax(40, 60)),
      waypoint,
    };
  }
};
