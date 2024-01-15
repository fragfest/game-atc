import Square from './Square';
import { isSquare } from './types';
import { getScreenSize } from './canvas/scale';
import { convHdgDegToThreeDigits, convHdgRadToThreeDigits } from './utils';
import { getFlightArrival, getFlightDeparture } from './flights/LHR';
import { DestinationType, getPerformance } from './aircraft/airframe';
import {
  Waypoints,
  getWaypointDepartureRnd,
  getRunwayRnd,
} from './airports/LHR';
import { getGoals } from './game/victory';
import { getScore } from './game/score';
import { isTaxiQueueAlmostFull } from './game/game';

export const createPlane = (
  {
    entityManagerArr,
    width,
    height,
    canvasObjEntity,
    canvasObjText,
    canvasObjHeading,
    canvasEntityEl,
    clickCB,
  },
  chanceOfDeparture
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
    const square = createArrival(canvasObjs, entityManagerArr, clickCB);
    return { square };
  }

  if (destinationType === DestinationType.Departure) {
    const square = createDeparture(canvasObjs, entityManagerArr, clickCB);
    return { square };
  }
};

// export const spawnRndPlane =
//   (canvasObj, entityManagerArr, createSquare_entityFnArgChanceArg) =>
//   (deltaTimeMs) => {
//     const goals = getGoals();
//     const score = getScore();
//     const spawnRateModifier = 0.7;
//     const spawnRate = goals.SpawnRate || 1;

//     let chanceOfPlanePerSec = 0.03;
//     const lowCount = 8;
//     const highCount = 16;
//     const highChance = 0.1;
//     const lowChance = 0.005;

//     const count = entityManagerArr.filter(isSquare).length;
//     if (count < lowCount) chanceOfPlanePerSec = highChance;
//     if (count > highCount) chanceOfPlanePerSec = lowChance;

//     const isDeparture = (obj) =>
//       isSquare(obj) && obj.destinationType === DestinationType.Departure;
//     const isArrival = (obj) =>
//       isSquare(obj) && obj.destinationType === DestinationType.Arrival;

//     const departureCount = entityManagerArr.filter(isDeparture).length;
//     const departureGoalRemaining = goals.Departures - score.departures;
//     const arrivalCount = entityManagerArr.filter(isArrival).length;
//     const arrivalGoalRemaining = goals.Arrivals - score.arrivals;

//     let chanceOfDeparture = 0.55;
//     let noMoreDepartures = false;
//     let noMoreArrivals = false;
//     if (departureCount >= departureGoalRemaining) {
//       chanceOfDeparture = 0;
//       chanceOfPlanePerSec = 0.5;
//       noMoreDepartures = true;
//     }
//     if (arrivalCount >= arrivalGoalRemaining) {
//       chanceOfDeparture = 1;
//       chanceOfPlanePerSec = 0.5;
//       noMoreArrivals = true;
//     }
//     if (isTaxiQueueAlmostFull(entityManagerArr)) {
//       chanceOfPlanePerSec = lowChance;
//     }

//     const chanceOfPlaneBase = (chanceOfPlanePerSec * deltaTimeMs) / 1000;
//     let chanceOfPlane = chanceOfPlaneBase * (spawnRate * spawnRateModifier);
//     if (noMoreDepartures && noMoreArrivals) chanceOfPlane = 0;

//     createSquare_entityFnArgChanceArg(
//       () => createPlane(canvasObj, chanceOfDeparture).square,
//       chanceOfPlane
//     );
//   };

////////////// PRIVATE ////////////////////////////////////////////////

export const spawnRndPlane =
  (canvasObj, entityManagerArr, createSquare_entityFnArgChanceArg) =>
  (deltaTimeMs) => {
    const goals = getGoals();
    const score = getScore();
    const spawnRate = goals.SpawnRate || 1;

    const chanceDepartureBase = 0.55;
    const baseChance = 0.03;
    // const lowChance = 0.005;
    const lowChance = 0.01;
    const highChance = 0.1;
    const taxiQueueChance = lowChance;

    const spawnPlane = (chanceOfPlane, chanceOfDeparture) =>
      createSquare_entityFnArgChanceArg(
        () => createPlane(canvasObj, chanceOfDeparture).square,
        chanceOfPlane
      );

    const getSpawnChance = (chanceOfPlanePerSec) => {
      const spawnRateModifier = 0.7;
      const chanceOfPlaneBase = (chanceOfPlanePerSec * deltaTimeMs) / 1000;
      return chanceOfPlaneBase * (spawnRate * spawnRateModifier);
    };

    const isDeparture = (obj) =>
      isSquare(obj) && obj.destinationType === DestinationType.Departure;
    const isArrival = (obj) =>
      isSquare(obj) && obj.destinationType === DestinationType.Arrival;

    const count = entityManagerArr.filter(isSquare).length;
    const departureCount = entityManagerArr.filter(isDeparture).length;
    const departureGoalRemaining = goals.Departures - score.departures;
    const arrivalCount = entityManagerArr.filter(isArrival).length;
    const arrivalGoalRemaining = goals.Arrivals - score.arrivals;

    const noMoreDepartures = departureCount >= departureGoalRemaining;
    const noMoreArrivals = arrivalCount >= arrivalGoalRemaining;
    if (noMoreDepartures && noMoreArrivals) return;

    if (spawnRate <= 1) {
      const chanceDeparture = 1;
      if (isTaxiQueueAlmostFull(entityManagerArr)) {
        return spawnPlane(getSpawnChance(taxiQueueChance), chanceDeparture);
      }
      if (score.departures + departureCount <= 3) {
        return spawnPlane(getSpawnChance(baseChance), chanceDeparture);
      }

      return spawnPlane(getSpawnChance(highChance), chanceDeparture);
    }

    if (spawnRate > 1) {
      return spawnPlane(getSpawnChance(baseChance), chanceDepartureBase);
    }
  };

const createArrival = (canvasObjs, entityManagerArr, clickCB) => {
  const {
    canvasObjEntity,
    canvasObjText,
    canvasObjHeading,
    canvasEntityEl,
    width,
    height,
  } = canvasObjs;

  const runwayTitleRnd = getRunwayRnd();
  const runway = entityManagerArr.find((x) => x.title === runwayTitleRnd);

  // sections numbered from WNW going clockwise: 1 - 8
  const sectionsCount = 8;
  const section = Math.ceil(Math.random() * sectionsCount);
  const newPlane = spawnArrival(width, height, section);
  const altitude = setAlt();
  const speed = setSpd();

  const flight = createFlight(getFlightArrival);
  const airframeObj = getPerformance(flight.airframe, getScreenSize());

  const square = new Square(
    flight,
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
    }
  );
  square.clickEventCB = () => clickCB(square);
  return square;
};

const createDeparture = (canvasObjs, entityManagerArr, clickCB) => {
  const { canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl } =
    canvasObjs;
  const runwayTitleRnd = getRunwayRnd();
  const runway = entityManagerArr.find((x) => x.title === runwayTitleRnd);

  const newPlane = {
    x: runway.x,
    y: runway.y,
    heading: convHdgRadToThreeDigits(runway.runwayHeading),
    waypoint: getWaypointDepartureRnd(),
  };
  const altitude = 0;
  const speed = 0;

  const flight = createFlight(getFlightDeparture);
  const airframeObj = getPerformance(flight.airframe, getScreenSize());

  const square = new Square(
    flight,
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
    }
  );
  square.clickEventCB = () => clickCB(square);
  return square;
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

const rand = (min, max) => min + Math.random() * (max - min);
const setAlt = () => Math.floor(rand(7000, 10000) / 100) * 100;
const setSpd = () => Math.floor(rand(230, 250) / 5) * 5;

const spawnArrival = (width, height, sectionInt) => {
  if (sectionInt === 1) {
    return {
      x: 0,
      y: rand(0, height / 2 - 200),
      heading: convHdgDegToThreeDigits(rand(120, 140)),
      waypoint: Waypoints.LAM,
    };
  }
  if (sectionInt === 2) {
    return {
      x: rand(0, width / 2 - 200),
      y: 0,
      heading: convHdgDegToThreeDigits(rand(120, 140)),
      waypoint: Waypoints.LAM,
    };
  }
  if (sectionInt === 3) {
    return {
      x: rand(width / 2 + 200, width),
      y: 0,
      heading: convHdgDegToThreeDigits(rand(220, 240)),
      waypoint: Waypoints.LAM,
    };
  }
  if (sectionInt === 4) {
    return {
      x: width,
      y: rand(0, height / 2 - 200),
      heading: convHdgDegToThreeDigits(rand(220, 240)),
      waypoint: Waypoints.LAM,
    };
  }
  if (sectionInt === 5) {
    return {
      x: width,
      y: rand(height / 2 + 200, height),
      heading: convHdgDegToThreeDigits(rand(310, 330)),
      waypoint: Waypoints.BIG,
    };
  }
  if (sectionInt === 6) {
    return {
      x: rand(width / 2 + 200, width),
      y: height,
      heading: convHdgDegToThreeDigits(rand(310, 330)),
      waypoint: Waypoints.BIG,
    };
  }
  if (sectionInt === 7) {
    return {
      x: rand(0, width / 2 - 200),
      y: height,
      heading: convHdgDegToThreeDigits(rand(40, 60)),
      waypoint: Waypoints.BIG,
    };
  }
  if (sectionInt === 8) {
    return {
      x: 0,
      y: rand(height / 2 + 200, height),
      heading: convHdgDegToThreeDigits(rand(40, 60)),
      waypoint: Waypoints.BIG,
    };
  }
};
