import Square from './Square';

export const FocusCircleType = Object.freeze({
  Rectangle: 'Rectangle',
  Circle: 'Circle',
});

export const HoldingPosition = Object.freeze({
  North: 'north',
  South: 'south',
});

export const WaypointType = Object.freeze({
  Arrival: 'arrival',
  Departure: 'departure',
});

export const DestinationType = Object.freeze({
  Arrival: 'arrival',
  Departure: 'departure',
});

export const Direction = Object.freeze({
  None: 'none',
  Left: 'left',
  Right: 'right',
});

export const isSquare = (obj) => obj instanceof Square;
export const isDeparture = (obj) =>
  isSquare(obj) && obj.destinationType === DestinationType.Departure;
export const isArrival = (obj) =>
  isSquare(obj) && obj.destinationType === DestinationType.Arrival;
