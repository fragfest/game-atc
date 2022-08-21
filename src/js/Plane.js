import Square from './Square';
import { leftPadZeros, convHdgDegToThreeDigits, convHdgRadToThreeDigits } from './utils';
import { getFlightArrival, getFlightDeparture } from './flights/LHR';
import { DestinationType, getPerformance } from './aircraft/airframe';
import { Waypoints } from './airports/LHR';

export const create = ({ runway, screenSize, width, height, canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl, clickCB }) => {
  const runwayTitle = runway.title;

  let destinationType = DestinationType.Departure;
  if (Math.random() > isArrivalIfRndAbove) destinationType = DestinationType.Arrival;

  let square;
  if (destinationType === DestinationType.Arrival) {
    // sections numbered from WNW going clockwise: 1 - 8
    const sectionsCount = 8;
    const section = Math.ceil(Math.random() * sectionsCount);
    const newPlane = spawn(width, height, section);
    const altitude = setAlt();
    const speed = setSpd();

    let newFlight;
    newFlight = getFlightArrival(spawned);
    if (!newFlight) {
      spawned = [];
      newFlight = getFlightArrival(spawned);
    }
    spawned.push(newFlight);
    const airframeObj = getPerformance(newFlight.airframe, screenSize);

    square = new Square(
      setRndFlightTitle(newFlight),
      canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl,
      // { x: width / 2 + 500, y: height / 2 + 0, heading: '360', altitude: 1200, speed: 200 },
      { x: newPlane.x, y: newPlane.y, heading: newPlane.heading, altitude, speed },
      { destinationType, airframeObj, waypoint: newPlane.waypoint, runway: runwayTitle }
    );
    square.clickEventCB = () => clickCB(square);
  }

  if (destinationType === DestinationType.Departure) {
    // TODO lanes instead of sections for departures

    const newPlane = {
      x: runway.x,
      y: runway.y,
      heading: convHdgRadToThreeDigits(runway.runwayHeading),
      waypoint: Waypoints.LAM,
    };
    const altitude = 0;
    const speed = 0;

    let newFlight;
    newFlight = getFlightDeparture(spawned);
    if (!newFlight) {
      spawned = [];
      newFlight = getFlightDeparture(spawned);
    }
    spawned.push(newFlight);
    const airframeObj = getPerformance(newFlight.airframe, screenSize);

    square = new Square(
      setRndFlightTitle(newFlight),
      canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl,
      { x: newPlane.x, y: newPlane.y, heading: newPlane.heading, altitude, speed },
      { destinationType, airframeObj, waypoint: newPlane.waypoint, runway: runwayTitle }
    );
    square.clickEventCB = () => clickCB(square);
  }

  return { square };
};

////////////// PRIVATE ////////////////////////////////////////////////
const isArrivalIfRndAbove = 0.5;

let spawned = [];

const rand = (min, max) => min + Math.random() * (max - min);
const setRndFlightTitle = obj => {
  return obj.airlineCode + leftPadZeros(Math.floor((Math.random() * 1000)));
};
const setAlt = () => Math.floor(rand(7000, 10000) / 100) * 100;
const setSpd = () => Math.floor(rand(250, 300) / 5) * 5;

const spawn = (width, height, sectionInt) => {
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