export const Stages = Object.freeze({
  Intro: 'Intro',
  Departure: 'Departure',
  ArrivalLand: 'ArrivalLand',
  Waypoint: 'Waypoint',
  Conflict: 'Conflict',
  Done: 'Done',
});

export const ElapsedTimes = Object.freeze({
  DepartureStartMs: 12000,
  DepartureFirstInputMs: 26000,
  ArrivalLandStartMs: 4000,
  ArrivalLandFirstInputMs: 14000,
  WaypointStartMs: 4000,
  WaypointFirstInputMs: 6000,
  ConflictStartMs: 4000,
  ConflictFirstInputMs: 16000,
});
