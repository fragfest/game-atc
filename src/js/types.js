export const HoldingPosition = Object.freeze({
  North: 'north',
  South: 'south',
});

export const RunwayType = Object.freeze({
  ArrivalOnly: 'arrivalOnly',
  DepartureOnly: 'departureOnly',
  Both: 'both',
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

export const isRunway = (obj) => obj.classType === 'Runway';
export const isWaypoint = (obj) => obj.classType === 'Waypoint';
export const isAircraft = (obj) => obj.classType === 'Aircraft';

export const isDeparture = (obj) =>
  isAircraft(obj) && obj.destinationType === DestinationType.Departure;
export const isArrival = (obj) =>
  isAircraft(obj) && obj.destinationType === DestinationType.Arrival;
export const isAirborne = (obj) =>
  isAircraft(obj) && !obj.isTaxiing && !obj.takeoff && !obj.isTouchedDown;
