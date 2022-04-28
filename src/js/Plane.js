const Square = require('./Square');

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
    // pick spawn quadrant + waypoint hold, set heading
    // sections numbered from NW going clockwise: 1 - 4
    const section = Math.ceil(Math.random() / 0.25);
    const newPlane = spawn(width, height, section);

    // select flight num + airframe + wake
    // set altitude somewhere above 7000, set speed above 250

    square = new Square('AC123',
      canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl,
      { x: newPlane.x, y: newPlane.y, heading: newPlane.heading, altitude: 100, speed: 200 },
      { destinationType, airframe: 'B738', wakeRating: 'M', waypoint: 'LAM', runway: '27R' }
    );
    square.clickEventCB = () => clickCB(square);
  }

  return { square };
};

/////////////////////////////////////////////////////////
// PRIVATE
/////////////////////////////////////////////////////////
const isArrivalIfRndAbove = 0 // 0.5;

const spawn = (width, height, sectionInt) => {
  const rand = (min, max) => min + Math.random() * (max - min);

  if (sectionInt === 1) {
    return {
      x: rand(0, width / 2),
      y: 0,
      heading: '120',
    };
  }
  if (sectionInt === 2) {
    return {
      x: rand(width / 2, width),
      y: 0,
      heading: '240',
    };
  }
  if (sectionInt === 3) {
    return {
      x: rand(width / 2, width),
      y: height,
      heading: '330',
    };
  }
  if (sectionInt === 4) {
    return {
      x: rand(0, width / 2),
      y: height,
      heading: '030',
    };
  }
};