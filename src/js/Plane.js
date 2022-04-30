const Square = require('./Square');
const { convHdgDegToThreeDigits } = require('./utils');
const { getFlightArrival } = require('./flights/LHR');

export const DestinationType = Object.freeze({
  Arrival: 'arrival',
  Departure: 'departure',
});

export const create = ({ width, height, canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl, clickCB }) => {
  // set runway (based on half day)

  let destinationType = DestinationType.Departure;
  if (Math.random() > isArrivalIfRndAbove) destinationType = DestinationType.Arrival;

  let square;
  if (destinationType === DestinationType.Arrival) {
    // sections numbered from NW going clockwise: 1 - 8
    const sectionsCount = 8;
    const section = Math.ceil(Math.random() * sectionsCount);
    const newPlane = spawn(width, height, section);
    const altitude = setAlt();

    let newFlight;
    if (destinationType === DestinationType.Arrival) {
      newFlight = getFlightArrival(spawned);
    }
    if (!newFlight) {
      spawned = [];
      newFlight = getFlightArrival(spawned);
    }
    spawned.push(newFlight);

    square = new Square(
      setRndFlightTitle(newFlight),
      canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl,
      { x: newPlane.x, y: newPlane.y, heading: newPlane.heading, altitude, speed: 250 },
      { destinationType, airframe: newFlight.airframe, wakeRating: newFlight.wake, waypoint: 'LAM', runway: '27R' }
    );
    square.clickEventCB = () => clickCB(square);
  }

  return { square };
};

////////////// PRIVATE //////////////////////////////////////
const isArrivalIfRndAbove = 0 // 0.5;

let spawned = [];

const rand = (min, max) => min + Math.random() * (max - min);
const setRndFlightTitle = obj => obj.airlineCode + Math.floor((Math.random() * 1000));
const setAlt = () => Math.floor(rand(7000, 10000) / 100) * 100;

const spawn = (width, height, sectionInt) => {
  if (sectionInt === 1) {
    return {
      x: 0,
      y: rand(0, height / 2 - 200),
      heading: convHdgDegToThreeDigits(rand(120, 140)),
    };
  }
  if (sectionInt === 2) {
    return {
      x: rand(0, width / 2 - 200),
      y: 0,
      heading: convHdgDegToThreeDigits(rand(120, 140)),
    };
  }
  if (sectionInt === 3) {
    return {
      x: rand(width / 2 + 200, width),
      y: 0,
      heading: convHdgDegToThreeDigits(rand(220, 240)),
    };
  }
  if (sectionInt === 4) {
    return {
      x: width,
      y: rand(0, height / 2 - 200),
      heading: convHdgDegToThreeDigits(rand(220, 240)),
    };
  }
  if (sectionInt === 5) {
    return {
      x: width,
      y: rand(height / 2 + 200, height),
      heading: convHdgDegToThreeDigits(rand(310, 330)),
    };
  }
  if (sectionInt === 6) {
    return {
      x: rand(width / 2 + 200, width),
      y: height,
      heading: convHdgDegToThreeDigits(rand(310, 330)),
    };
  }
  if (sectionInt === 7) {
    return {
      x: rand(0, width / 2 - 200),
      y: height,
      heading: convHdgDegToThreeDigits(rand(40, 60)),
    };
  }
  if (sectionInt === 8) {
    return {
      x: 0,
      y: rand(height / 2 + 200, height),
      heading: convHdgDegToThreeDigits(rand(40, 60)),
    };
  }
};