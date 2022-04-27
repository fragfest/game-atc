const Square = require('./Square');

export const DestinationType = {
  Arrival: 'arrival',
  Departure: 'departure',
};

export const create = (destinationType, { width, height, canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl, clickCB }) => {
  const square = new Square('AC123',
    canvasObjEntity, canvasObjText, canvasObjHeading, canvasEntityEl,
    { x: width / 2 + 10, y: height / 2 + 20, heading: '270', altitude: 100, speed: 180 },
    { destinationType, airframe: 'B738', wakeRating: 'M', waypoint: 'LAM', runway: '27R' }
  );
  square.clickEventCB = () => clickCB(square);

  return {
    square,
    // update: square.update,
  }
};

/////////////////////////////////////////////////////////
// PRIVATE
/////////////////////////////////////////////////////////