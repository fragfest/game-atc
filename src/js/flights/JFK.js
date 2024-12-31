import { Airframes } from '../aircraft/airframe';
import { DestinationType } from '../types';

export const getFlightArrival = (spawned) => {
  const flightsUnspawned = flightsArrival.filter(isNotSpawned(spawned));
  const total = flightsUnspawned.length;
  if (total === 0) return null;

  const flightObj = flightsUnspawned[getRndIndex(total)];
  flightObj.time = setTimeSecs();
  return flightObj;
};

export const getFlightDeparture = (spawned) => {
  const flightsUnspawned = flightsDeparture.filter(isNotSpawned(spawned));
  const total = flightsUnspawned.length;
  if (total === 0) return null;

  const flightObj = flightsUnspawned[getRndIndex(total)];
  flightObj.time = setTimeSecs();
  return flightObj;
};

////////////// PRIVATE //////////////////////////////////////
const setTimeSecs = () => 15 * 60;
const getRndIndex = (total) => Math.floor(Math.random() * total);
const isNotSpawned = (spawnedArr) => (obj) =>
  !spawnedArr.find((x) => x.flight === obj.flight);

// NOTE time is being patched to contain {number} seconds
const flightsArrival = [
  {
    type: DestinationType.Arrival,
    time: '04:46',
    flight: 'D0362',
    city: 'Leipzig',
    airport: 'LEJ',
    airlineCode: 'D0',
    airline: 'DHL',
    airframe: Airframes.B763,
  },
  {
    type: DestinationType.Arrival,
    time: '06:14',
    flight: 'B6348',
    city: 'Las Vegas',
    airport: 'LAS',
    airlineCode: 'B6',
    airline: 'JetBlue',
    airframe: Airframes.A321,
  },
  {
    type: DestinationType.Arrival,
    time: '06:29',
    flight: 'DL548',
    city: 'Phoenix',
    airport: 'PHX',
    airlineCode: 'DL',
    airline: 'Delta Airlines',
    airframe: Airframes.A321,
  },
  {
    type: DestinationType.Arrival,
    time: '06:56',
    flight: 'B6604',
    city: 'Vancouver',
    airport: 'YVR',
    airlineCode: 'B6',
    airline: 'JetBlue',
    airframe: Airframes.A321,
  },
  {
    type: DestinationType.Arrival,
    time: '07:00',
    flight: 'AA974',
    city: 'Rio de Janeiro',
    airport: 'GIG',
    airlineCode: 'AA',
    airline: 'American Airlines',
    airframe: Airframes.B772,
  },
  {
    type: DestinationType.Arrival,
    time: '08:40',
    flight: 'EY1',
    city: 'Abu Dhabi',
    airport: 'AUH',
    airlineCode: 'EY',
    airline: 'Etihad Airways',
    airframe: Airframes.A388,
  },
  {
    type: DestinationType.Arrival,
    time: '10:40',
    flight: 'AF2',
    city: 'Paris',
    airport: 'CDG',
    airlineCode: 'AF',
    airline: 'Air France',
    airframe: Airframes.B772,
  },
  {
    type: DestinationType.Arrival,
    time: '11:25',
    flight: 'BA117',
    city: 'London',
    airport: 'LHR',
    airlineCode: 'BA',
    airline: 'British Airways',
    airframe: Airframes.B77W,
  },
  {
    type: DestinationType.Arrival,
    time: '11:35',
    flight: 'DL47',
    city: 'Amsterdam',
    airport: 'AMS',
    airlineCode: 'DL',
    airline: 'Delta Airlines',
    airframe: Airframes.A333,
  },
  {
    type: DestinationType.Arrival,
    time: '13:05',
    flight: 'LX16',
    city: 'Zurich',
    airport: 'ZRH',
    airlineCode: 'LX',
    airline: 'Swiss',
    airframe: Airframes.A333,
  },
  {
    type: DestinationType.Arrival,
    time: '14:40',
    flight: 'DL9905',
    city: 'Dublin',
    airport: 'DUB',
    airlineCode: 'DL',
    airline: 'Delta Airlines',
    airframe: Airframes.B763,
  },
  {
    type: DestinationType.Arrival,
    time: '14:50',
    flight: 'AM402',
    city: 'Mexico City',
    airport: 'MEX',
    airlineCode: 'AM',
    airline: 'Aeromexico',
    airframe: Airframes.B38M,
  },
  {
    type: DestinationType.Arrival,
    time: '14:59',
    flight: 'AA532',
    city: 'Chicago',
    airport: 'ORD',
    airlineCode: 'AA',
    airline: 'American Airlines',
    airframe: Airframes.A319,
  },
  {
    type: DestinationType.Arrival,
    time: '07:25',
    flight: 'DL452',
    city: 'Seattle',
    airport: 'SEA',
    airlineCode: 'DL',
    airline: 'Delta Airlines',
    airframe: Airframes.A321,
  },
];

// NOTE time is being patched to contain {number} seconds
const flightsDeparture = [
  {
    type: DestinationType.Departure,
    time: '20:15',
    flight: 'SQ25',
    city: 'Frankfurt',
    airport: 'FRA',
    airlineCode: 'SQ',
    airline: 'Singapore Airlines',
    airframe: Airframes.B77W,
  },
  {
    type: DestinationType.Departure,
    time: '20:16',
    flight: 'DL1233',
    city: 'Austin',
    airport: 'AUS',
    airlineCode: 'DL',
    airline: 'Delta Airlines',
    airframe: Airframes.A319,
  },
  {
    type: DestinationType.Departure,
    time: '20:20',
    flight: 'AA292',
    city: 'Delhi',
    airport: 'DEL',
    airlineCode: 'AA',
    airline: 'American Airlines',
    airframe: Airframes.B789,
  },
  {
    type: DestinationType.Departure,
    time: '23:00',
    flight: 'EK202',
    city: 'Dubai',
    airport: 'DXB',
    airlineCode: 'EK',
    airline: 'Emirates',
    airframe: Airframes.A388,
  },
  {
    type: DestinationType.Departure,
    time: '23:20',
    flight: 'BA182',
    city: 'London',
    airport: 'LHR',
    airlineCode: 'BA',
    airline: 'British Airways',
    airframe: Airframes.B77W,
  },
  {
    type: DestinationType.Departure,
    time: '00:50',
    flight: 'NH159',
    city: 'Tokyo',
    airport: 'HND',
    airlineCode: 'NH',
    airline: 'All Nippon Airways',
    airframe: Airframes.B772,
  },
  {
    type: DestinationType.Departure,
    time: '01:45',
    flight: 'MU7758',
    city: 'Shanghai',
    airport: 'PVG',
    airlineCode: 'MU',
    airline: 'China Eastern Airlines',
    airframe: Airframes.A333,
  },
  {
    type: DestinationType.Departure,
    time: '06:00',
    flight: 'AA76',
    city: 'San Francisco',
    airport: 'SFO',
    airlineCode: 'AA',
    airline: 'American Airlines',
    airframe: Airframes.A321,
  },
  {
    type: DestinationType.Departure,
    time: '06:00',
    flight: 'AA171',
    city: 'Los Angeles',
    airport: 'LAX',
    airlineCode: 'AA',
    airline: 'American Airlines',
    airframe: Airframes.A321,
  },
  {
    type: DestinationType.Departure,
    time: '06:30',
    flight: 'B6745',
    city: 'Santo Domingo',
    airport: 'SDQ',
    airlineCode: 'B6',
    airline: 'JetBlue',
    airframe: Airframes.A321,
  },
  {
    type: DestinationType.Departure,
    time: '06:55',
    flight: 'DL892',
    city: 'Salt Lake City',
    airport: 'SLC',
    airlineCode: 'DL',
    airline: 'Delta Airlines',
    airframe: Airframes.B763,
  },
  {
    type: DestinationType.Departure,
    time: '12:00',
    flight: 'KE82',
    city: 'Seoul',
    airport: 'ICN',
    airlineCode: 'KE',
    airline: 'Korean Air',
    airframe: Airframes.B748,
  },
  {
    type: DestinationType.Departure,
    time: '12:45',
    flight: 'MS986',
    city: 'Cairo',
    airport: 'CAI',
    airlineCode: 'MS',
    airline: 'Egyptair',
    airframe: Airframes.B77W,
  },
  {
    type: DestinationType.Departure,
    time: '13:45',
    flight: 'KQ3',
    city: 'Nairobi',
    airport: 'NBO',
    airlineCode: 'KQ',
    airline: 'Kenya Airlines',
    airframe: Airframes.B788,
  },
];
