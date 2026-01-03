import Aircraft from './Aircraft';
import { DestinationType } from '../types';
import {
  getScreenSize,
  convHdgDegToThreeDigits,
  convHdgRadToThreeDigits,
  randMinMax,
} from '../utils';
import { getPerformance } from './airframe';
import { getGoalsByLevel } from '../game/victory';
import { getScore } from '../game/score/score';
import { callAircraftFnByLevel } from '../levels/levels';
import {
  getRunwayRnd,
  getWaypointBySection,
  getWaypointDepartureRnd,
} from '../airports/airports';
import { getFlightArrival, getFlightDeparture } from '../flights/flights';
import { MaydayScenario } from '../game/score/mayday';

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
    const score = getScore();
    const goals = getGoalsByLevel()(score.level);
    const spawnRate = goals.SpawnRate || 1;

    const aircraftFn = (
      chanceOfPlane,
      chanceOfDeparture,
      flightObjArg,
      airport
    ) => {
      const flightObj = { ...flightObjArg };

      createAircraftRndFn(() => {
        if (flightObj.isMayday) {
          return createAircraftMayday(
            { ...canvasObj, flightObj },
            chanceOfDeparture,
            airport
          );
        }

        return createAircraftRndDefault(
          { ...canvasObj, flightObj },
          chanceOfDeparture,
          airport
        );
      }, chanceOfPlane);
    };

    const getChanceFn = (chanceOfPlanePerSec) => {
      const spawnRateModifier = 0.7;
      const chanceOfPlaneBase = (chanceOfPlanePerSec * deltaTimeMs) / 1000;
      return chanceOfPlaneBase * (spawnRate * spawnRateModifier);
      // return 1;
    };

    callAircraftFnByLevel({
      entityManagerArr,
      goals,
      score,
      getChanceFn,
      aircraftFn,
    });
  };

export const createAircraftRndDefault = (
  {
    entityManagerArr,
    width,
    height,
    canvasObjEntity,
    canvasObjText,
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
    canvasEntityEl,
    width,
    height,
  };

  if (destinationType === DestinationType.Arrival) {
    const aircraft = createAircraftArrival(
      entityManagerArr,
      canvasObjs,
      flightObj,
      {},
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
      {},
      airport,
      clickCB
    );
    return aircraft;
  }
};

////////////////////////////////////////////////////////////////////////////
// PRIVATE
////////////////////////////////////////////////////////////////////////////

const createAircraftMayday = (
  {
    entityManagerArr,
    width,
    height,
    canvasObjEntity,
    canvasObjText,
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
    canvasEntityEl,
    width,
    height,
  };

  const position = createPositionMayday(
    flightObj.maydayScenario,
    width,
    height
  );

  if (destinationType === DestinationType.Arrival) {
    const aircraft = createAircraftArrival(
      entityManagerArr,
      canvasObjs,
      flightObj,
      position,
      airport,
      clickCB
    );

    aircraft.setIsMayday(true);
    return aircraft;
  }

  if (destinationType === DestinationType.Departure) {
    const aircraft = createAircraftDeparture(
      entityManagerArr,
      canvasObjs,
      flightObj,
      position,
      airport,
      clickCB
    );

    aircraft.setIsMayday(true);
    return aircraft;
  }
};

const createAircraftArrival = (
  entityManagerArr,
  canvasObjs,
  flightObjArg = {},
  positionObjArg = {},
  airport,
  clickCB
) => {
  const { canvasObjEntity, canvasObjText, canvasEntityEl, width, height } =
    canvasObjs;
  const runwayTitleRnd = getRunwayRnd(DestinationType.Arrival, airport);
  const runway = entityManagerArr.find((x) => x.title === runwayTitleRnd);

  if (!runway) {
    console.error('runway-arrival');
    console.error('entityManagerArr.length', entityManagerArr?.length);
    console.error('runway.title', runway?.title);
    console.error('runwayTitleRnd', runwayTitleRnd);
  }

  // sections numbered from WNW going clockwise: 1 - 8
  const sectionsCount = 8;
  const section = Math.ceil(Math.random() * sectionsCount);
  const newPlane = spawnArrival(airport, width, height, section);
  const altitude = setAlt();
  const speed = setSpd();

  const flight = createFlight(getFlightArrival(airport));
  const flightObj = { ...flight, ...flightObjArg };
  const position = {
    x: newPlane.x,
    y: newPlane.y,
    heading: newPlane.heading,
    altitude,
    speed,
  };
  const positionObj = { ...position, ...positionObjArg };

  const airframeObj = getPerformance(flight.airframe, getScreenSize());

  const aircraft = new Aircraft(
    flightObj,
    canvasObjEntity,
    canvasObjText,
    canvasEntityEl,
    positionObj,
    // {
    //   x: 600,
    //   y: 420,
    //   heading: '270',
    //   altitude: 1000,
    //   speed,
    // },
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
  positionObjArg = {},
  airport,
  clickCB
) => {
  const { canvasObjEntity, canvasObjText, canvasEntityEl } = canvasObjs;
  const runwayTitleRnd = getRunwayRnd(DestinationType.Departure, airport);
  const runway = entityManagerArr.find((x) => x.title === runwayTitleRnd);

  if (!runway) {
    console.error('runway-departure');
    console.error('entityManagerArr.length', entityManagerArr?.length);
    console.error('runway.title', runway?.title);
    console.error('runwayTitleRnd', runwayTitleRnd);
  }

  const waypoint = getWaypointDepartureRnd(airport);
  const position = {
    x: runway.x,
    y: runway.y,
    heading: convHdgRadToThreeDigits(runway.runwayHeading),
    altitude: 0,
    speed: 0,
  };
  const positionObj = { ...position, ...positionObjArg };

  const flight = createFlight(getFlightDeparture(airport));
  const flightObj = { ...flight, ...flightObjArg };
  const airframeObj = getPerformance(flight.airframe, getScreenSize());

  const aircraft = new Aircraft(
    flightObj,
    canvasObjEntity,
    canvasObjText,
    canvasEntityEl,
    positionObj,
    {
      destinationType: DestinationType.Departure,
      airframeObj,
      waypoint,
      runway: runway.title,
      airport,
    }
  );
  aircraft.clickEventCB = () => clickCB(aircraft);
  return aircraft;
};

/**
 * @param {import('../game/score/mayday').MaydayScenario} maydayScenario
 * @param {Number} width
 * @param {Number} height
 */
const createPositionMayday = (maydayScenario, width, height) => {
  if (maydayScenario === MaydayScenario.Level9Fire) {
    return {
      x: width / 2,
      y: 0 * height,
      heading: convHdgDegToThreeDigits(randMinMax(240, 120)),
      altitude: altMinMax(11000, 13000),
      speed: spdMinMax(280, 320),
    };
  }
};

let spawned = [];
/**
 * create a new FlightObj not already in spawned list of objects
 * @param {import('../flights/flights').SpawnFn} spawnFn
 * @returns {import('../flights/flights').FlightObj}
 */
const createFlight = (spawnFn) => {
  let newFlight = spawnFn(spawned);
  if (!newFlight) {
    spawned = [];
    newFlight = spawnFn(spawned);
  }
  spawned.push(newFlight);
  return newFlight;
};

const altMinMax = (min, max) => Math.floor(randMinMax(min, max) / 100) * 100;
const spdMinMax = (min, max) => Math.floor(randMinMax(min, max) / 5) * 5;
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
