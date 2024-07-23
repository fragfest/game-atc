import Square from './Square';
import { DestinationType } from './types';
import {
  getScreenSize,
  convHdgDegToThreeDigits,
  convHdgRadToThreeDigits,
  randMinMax,
} from './utils';
import { getFlightArrival, getFlightDeparture } from './flights/LHR';
import { getPerformance } from './aircraft/airframe';
import {
  Waypoints,
  getWaypointDepartureRnd,
  getRunwayRnd,
} from './airports/LHR';
import { getGoals } from './game/victory';
import { getScore } from './game/score';
import { level } from './levels/levels';

export const createPlane = (
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
    const square = createArrival(
      entityManagerArr,
      canvasObjs,
      flightObj || {},
      clickCB
    );
    return { square };
  }

  if (destinationType === DestinationType.Departure) {
    const square = createDeparture(
      entityManagerArr,
      canvasObjs,
      flightObj || {},
      clickCB
    );
    return { square };
  }
};

export const spawnRndPlane =
  (canvasObj, entityManagerArr, createSquare_entityFnArgChanceArg) =>
  (deltaTimeMs) => {
    const goals = getGoals();
    const score = getScore();
    const spawnRate = goals.SpawnRate || 1;

    const spawnPlaneFn = (chanceOfPlane, chanceOfDeparture, flightObj) =>
      createSquare_entityFnArgChanceArg(
        () =>
          createPlane(
            { ...canvasObj, flightObj: { ...flightObj } },
            chanceOfDeparture
          ).square,
        chanceOfPlane
      );

    const getSpawnChanceFn = (chanceOfPlanePerSec) => {
      const spawnRateModifier = 0.7;
      const chanceOfPlaneBase = (chanceOfPlanePerSec * deltaTimeMs) / 1000;
      return chanceOfPlaneBase * (spawnRate * spawnRateModifier);
    };

    level(score.level, {
      entityManagerArr,
      goals,
      score,
      getSpawnChanceFn,
      spawnPlaneFn,
    });
  };

// PRIVATE /////////////////////////////////////////////////////////////////

const createArrival = (entityManagerArr, canvasObjs, flightObjArg, clickCB) => {
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
  const flightObj = { ...flight, ...flightObjArg };
  const airframeObj = getPerformance(flight.airframe, getScreenSize());

  const square = new Square(
    flightObj,
    canvasObjEntity,
    canvasObjText,
    canvasObjHeading,
    canvasEntityEl,
    // {
    //   x: 650,
    //   y: 435,
    //   heading: '310',
    //   altitude: 5000,
    //   speed,
    // },
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

const createDeparture = (
  entityManagerArr,
  canvasObjs,
  flightObjArg,
  clickCB
) => {
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
  const flightObj = { ...flight, ...flightObjArg };
  const airframeObj = getPerformance(flight.airframe, getScreenSize());

  const square = new Square(
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

const setAlt = () => Math.floor(randMinMax(7000, 10000) / 100) * 100;
const setSpd = () => Math.floor(randMinMax(230, 250) / 5) * 5;

const spawnArrival = (width, height, sectionInt) => {
  if (sectionInt === 1) {
    return {
      x: 0,
      y: randMinMax(0, height / 2 - 200),
      heading: convHdgDegToThreeDigits(randMinMax(120, 140)),
      waypoint: Waypoints.LAM,
    };
  }
  if (sectionInt === 2) {
    return {
      x: randMinMax(0, width / 2 - 200),
      y: 0,
      heading: convHdgDegToThreeDigits(randMinMax(120, 140)),
      waypoint: Waypoints.LAM,
    };
  }
  if (sectionInt === 3) {
    return {
      x: randMinMax(width / 2 + 200, width),
      y: 0,
      heading: convHdgDegToThreeDigits(randMinMax(220, 240)),
      waypoint: Waypoints.LAM,
    };
  }
  if (sectionInt === 4) {
    return {
      x: width,
      y: randMinMax(0, height / 2 - 200),
      heading: convHdgDegToThreeDigits(randMinMax(220, 240)),
      waypoint: Waypoints.LAM,
    };
  }
  if (sectionInt === 5) {
    return {
      x: width,
      y: randMinMax(height / 2 + 200, height),
      heading: convHdgDegToThreeDigits(randMinMax(310, 330)),
      waypoint: Waypoints.BIG,
    };
  }
  if (sectionInt === 6) {
    return {
      x: randMinMax(width / 2 + 200, width),
      y: height,
      heading: convHdgDegToThreeDigits(randMinMax(310, 330)),
      waypoint: Waypoints.BIG,
    };
  }
  if (sectionInt === 7) {
    return {
      x: randMinMax(0, width / 2 - 200),
      y: height,
      heading: convHdgDegToThreeDigits(randMinMax(40, 60)),
      waypoint: Waypoints.BIG,
    };
  }
  if (sectionInt === 8) {
    return {
      x: 0,
      y: randMinMax(height / 2 + 200, height),
      heading: convHdgDegToThreeDigits(randMinMax(40, 60)),
      waypoint: Waypoints.BIG,
    };
  }
};
