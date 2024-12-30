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
    time: '17:15',
    flight: 'JL5',
    city: 'New York',
    airport: 'JFK',
    airlineCode: 'JL',
    airline: 'Japan Airlines',
    airframe: Airframes.A350,
  },
  {
    type: DestinationType.Arrival,
    time: '17:15',
    flight: 'NH32',
    city: 'Osaka',
    airport: 'ITM',
    airlineCode: 'NH',
    airline: 'All Nippon Airways',
    airframe: Airframes.B788,
  },
  {
    type: DestinationType.Arrival,
    time: '17:20',
    flight: 'JL988',
    city: 'Okinawa',
    airport: 'OKA',
    airlineCode: 'JL',
    airline: 'Japan Airlines',
    airframe: Airframes.B763,
  },
  {
    type: DestinationType.Arrival,
    time: '17:25',
    flight: 'NH614',
    city: 'Miyazaki',
    airport: 'KMI',
    airlineCode: 'NH',
    airline: 'All Nippon Airways',
    airframe: Airframes.B772,
  },
  {
    type: DestinationType.Arrival,
    time: '17:30',
    flight: 'JL15',
    city: 'Los Angeles',
    airport: 'LAX',
    airlineCode: 'JL',
    airline: 'Japan Airlines',
    airframe: Airframes.B77W,
  },
  {
    type: DestinationType.Arrival,
    time: '17:55',
    flight: 'OZ1045',
    city: 'Seoul',
    airport: 'GMP',
    airlineCode: 'OZ',
    airline: 'Asiana Airlines',
    airframe: Airframes.A333,
  },
  {
    type: DestinationType.Arrival,
    time: '18:05',
    flight: 'NH70',
    city: 'Sapporo',
    airport: 'CTS',
    airlineCode: 'NH',
    airline: 'All Nippon Airways',
    airframe: Airframes.B788,
  },
  {
    type: DestinationType.Arrival,
    time: '18:45',
    flight: 'NH115',
    city: 'Vancouver',
    airport: 'YVR',
    airlineCode: 'NH',
    airline: 'All Nippon Airways',
    airframe: Airframes.B789,
  },
  {
    type: DestinationType.Arrival,
    time: '19:25',
    flight: 'AF274',
    city: 'Paris',
    airport: 'CDG',
    airlineCode: 'AF',
    airline: 'Air France',
    airframe: Airframes.B77W,
  },
  {
    type: DestinationType.Arrival,
    time: '19:30',
    flight: 'NH962',
    city: 'Beijing',
    airport: 'PEK',
    airlineCode: 'NH',
    airline: 'All Nippon Airways',
    airframe: Airframes.B77W,
  },
  {
    type: DestinationType.Arrival,
    time: '20:50',
    flight: 'MU575',
    city: 'Shanghai',
    airport: 'PVG',
    airlineCode: 'MU',
    airline: 'China Eastern Airlines',
    airframe: Airframes.B77W,
  },
  {
    type: DestinationType.Arrival,
    time: '20:00',
    flight: 'QF59',
    city: 'Sydney',
    airport: 'SYD',
    airlineCode: 'QF',
    airline: 'Qantas',
    airframe: Airframes.A333,
  },
  {
    type: DestinationType.Arrival,
    time: '19:50',
    flight: 'NH758',
    city: 'Komatsu',
    airport: 'KMQ',
    airlineCode: 'NH',
    airline: 'All Nippon Airways',
    airframe: Airframes.A320,
  },
  {
    type: DestinationType.Arrival,
    time: '21:05',
    flight: 'NH598',
    city: 'Matsuyama',
    airport: 'MYJ',
    airlineCode: 'NH',
    airline: 'All Nippon Airways',
    airframe: Airframes.A321,
  },
];

// NOTE time is being patched to contain {number} seconds
const flightsDeparture = [
  {
    type: DestinationType.Departure,
    time: '17:10',
    flight: 'AA168',
    city: 'New York',
    airport: 'JFK',
    airlineCode: 'AA',
    airline: 'American Airlines',
    airframe: Airframes.B789,
  },
  {
    type: DestinationType.Departure,
    time: '17:10',
    flight: 'FM896',
    city: 'Shanghai',
    airport: 'PVG',
    airlineCode: 'FM',
    airline: 'Shanghai Airlines',
    airframe: Airframes.B738,
  },
  {
    type: DestinationType.Departure,
    time: '17:20',
    flight: 'DL8',
    city: 'Los Angeles',
    airport: 'LAX',
    airlineCode: 'DL',
    airline: 'Delta Airlines',
    airframe: Airframes.A350,
  },
  {
    type: DestinationType.Departure,
    time: '17:20',
    flight: 'NH285',
    city: 'Tokushima',
    airport: 'TKS',
    airlineCode: 'NH',
    airline: 'All Nippon Airways',
    airframe: Airframes.A320,
  },
  {
    type: DestinationType.Departure,
    time: '18:10',
    flight: 'JL99',
    city: 'Taipei',
    airport: 'TSA',
    airlineCode: 'JL',
    airline: 'Jet Linx Aviation',
    airframe: Airframes.B788,
  },
  {
    type: DestinationType.Departure,
    time: '18:20',
    flight: '6J37',
    city: 'Nagasaki',
    airport: 'NGS',
    airlineCode: '6J',
    airline: 'Solaseed Air',
    airframe: Airframes.B738,
  },
  {
    type: DestinationType.Departure,
    time: '18:50',
    flight: 'AC2',
    city: 'Toronto',
    airport: 'YYZ',
    airlineCode: 'AC',
    airline: 'Air Canada',
    airframe: Airframes.B77W,
  },
  {
    type: DestinationType.Departure,
    time: '19:00',
    flight: 'NH39',
    city: 'Osaka',
    airport: 'ITM',
    airlineCode: 'NH',
    airline: 'All Nippon Airways',
    airframe: Airframes.B788,
  },
  {
    type: DestinationType.Departure,
    time: '19:10',
    flight: 'NH299',
    city: 'Tottori',
    airport: 'TTJ',
    airlineCode: 'NH',
    airline: 'All Nippon Airways',
    airframe: Airframes.A320,
  },
  {
    type: DestinationType.Departure,
    time: '00:25',
    flight: 'NH843',
    city: 'Singapore',
    airport: 'SIN',
    airlineCode: 'NH',
    airline: 'All Nippon Airways',
    airframe: Airframes.B789,
  },
  {
    type: DestinationType.Departure,
    time: '18:30',
    flight: 'JL527',
    city: 'Sapporo',
    airport: 'CTS',
    airlineCode: 'JL',
    airline: 'Japan Airlines',
    airframe: Airframes.A350,
  },
  {
    type: DestinationType.Departure,
    time: '00:20',
    flight: 'TG661',
    city: 'Bangkok',
    airport: 'BKK',
    airlineCode: 'TG',
    airline: 'Thai Airways',
    airframe: Airframes.A350,
  },
  {
    type: DestinationType.Departure,
    time: '01:00',
    flight: 'JL41',
    city: 'London',
    airport: 'LHR',
    airlineCode: 'JL',
    airline: 'Japan Airlines',
    airframe: Airframes.B788,
  },
  {
    type: DestinationType.Departure,
    time: '06:25',
    flight: 'NH461',
    city: 'Okinawa',
    airport: 'OKA',
    airlineCode: 'NH',
    airline: 'All Nippon Airways',
    airframe: Airframes.A321,
  },
];
