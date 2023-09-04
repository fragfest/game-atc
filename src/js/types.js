import Square from './Square';

export const FocusCircleType = Object.freeze({
  Rectangle: 'Rectangle',
  Circle: 'Circle',
})

export const HoldingPosition = Object.freeze({
  North: 'north',
  South: 'south',
});

export const WaypointType = Object.freeze({
  Arrival: 'arrival',
  Departure: 'departure',
});

export const isSquare = obj => obj instanceof Square;
