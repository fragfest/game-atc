import Square from './Square';
import { isSquare } from './types';
import { convHdgDegToThreeDigits, convHdgRadToThreeDigits } from './utils';
import { getFlightArrival, getFlightDeparture } from './flights/LHR';
import { DestinationType, getPerformance } from './aircraft/airframe';
import { Waypoints, getWaypointDepartureRnd, getRunwayRnd } from './airports/LHR';
import { getGoals } from './game/victory';

export const create = ({
  entityManagerArr, screenSize, width, height,
  canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl, clickCB
}) => {
  const runwayTitleRnd = getRunwayRnd();
  const runway = entityManagerArr.find(x => x.title === runwayTitleRnd);

  let destinationType = DestinationType.Departure;
  if (Math.random() > isArrivalIfRndAbove) destinationType = DestinationType.Arrival;

  let square;
  
  if (destinationType === DestinationType.Arrival) {
    // sections numbered from WNW going clockwise: 1 - 8
    const sectionsCount = 8;
    const section = Math.ceil(Math.random() * sectionsCount);
    const newPlane = spawnArrival(width, height, section);
    const altitude = setAlt();
    const speed = setSpd();

    const flight = createFlight(getFlightArrival);
    const airframeObj = getPerformance(flight.airframe, screenSize);

    square = new Square(flight, canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl,
      // { x: width / 1.69, y: height / 1.88, heading: '270', altitude: 1200, speed: 180 }, // landing debug
      { x: newPlane.x, y: newPlane.y, heading: newPlane.heading, altitude, speed },
      { destinationType, airframeObj, waypoint: newPlane.waypoint, runway: runway.title }
    );
    square.clickEventCB = () => clickCB(square);
  }

  if (destinationType === DestinationType.Departure) {
    const newPlane = {
      x: runway.x,
      y: runway.y,
      heading: convHdgRadToThreeDigits(runway.runwayHeading),
      waypoint: getWaypointDepartureRnd(),
    };
    const altitude = 0;
    const speed = 0;

    const flight = createFlight(getFlightDeparture);
    const airframeObj = getPerformance(flight.airframe, screenSize);

    square = new Square(flight, canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl,
      // { x: width / 2 + 200, y: 40, heading: '270', altitude: 6500, speed: 200 },
      { x: newPlane.x, y: newPlane.y, heading: newPlane.heading, altitude, speed },
      { destinationType, airframeObj, waypoint: newPlane.waypoint, runway: runway.title }
    );
    square.clickEventCB = () => clickCB(square);
  }

  return { square };
};

export const spawnRndPlane = (canvasObj, entityManagerArr, createSquareEntityFnArgChanceArg) => (deltaTimeMs) => {
  const goals = getGoals();
  const spawnRateModifier = 0.7;
  const spawnRate = goals.SpawnRate || 1;

  const lowCount = 8;
  const highCount = 16;
  let chanceOfPlanePerSec = 0.03;

  const count = entityManagerArr.filter(isSquare).length;
  if (count < lowCount) chanceOfPlanePerSec = 0.1;
  if (count > highCount) chanceOfPlanePerSec = 0.005;
  const chanceOfPlaneBase = chanceOfPlanePerSec * deltaTimeMs / 1000;
  const chanceOfPlane = chanceOfPlaneBase * (spawnRate * spawnRateModifier);

  createSquareEntityFnArgChanceArg(() => create(canvasObj).square, chanceOfPlane);
}

////////////// PRIVATE ////////////////////////////////////////////////
const isArrivalIfRndAbove = 0.55;

let spawned = [];

const createFlight = (getFlightFn) => {
  let newFlight = getFlightFn(spawned);
  if (!newFlight) {
    spawned = [];
    newFlight = getFlightFn(spawned);
  }
  spawned.push(newFlight);
  return newFlight;
}

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