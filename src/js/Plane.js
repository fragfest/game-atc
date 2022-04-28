const Square = require('./Square');

export const DestinationType = Object.freeze({
  Arrival: 'arrival',
  Departure: 'departure',
});

export const create = (destinationType, { width, height, canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl, clickCB }) => {
  // pick arrival/destination
  // for arrival
  // set runway (based on half day)
  // pick spawn quadrant + waypoint hold, set heading
  // select flight num + airframe + wake
  // set altitude somewhere above 7000, set speed above 250

  const square = new Square('AC123',
    canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl,
    { x: width / 2 + 200, y: height / 2 - 300, heading: '030', altitude: 100, speed: 300 },
    { destinationType, airframe: 'B738', wakeRating: 'M', waypoint: 'LAM', runway: '27R' }
  );
  square.clickEventCB = () => clickCB(square);

  return {
    square,
  }
};

/////////////////////////////////////////////////////////
// PRIVATE
/////////////////////////////////////////////////////////