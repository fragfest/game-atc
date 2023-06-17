import { Airframes, DestinationType } from '../aircraft/airframe';
import { leftPadZeros } from '../../js/utils';

export const getFlightArrival = (spawned) => {
  const flightsUnspawned = flightsArrival.filter(isNotSpawned(spawned));
  const total = flightsUnspawned.length;
  if (total === 0) return null;

  const flightObj = flightsUnspawned[getRndIndex(total)];
  flightObj.flight = setRndFlightTitle(flightObj);
  return flightObj;
};

export const getFlightDeparture = (spawned) => {
  const flightsUnspawned = flightsDeparture.filter(isNotSpawned(spawned));
  const total = flightsUnspawned.length;
  if (total === 0) return null;
  
  const flightObj = flightsUnspawned[getRndIndex(total)];
  flightObj.flight = setRndFlightTitle(flightObj);
  return flightObj;
};

////////////// PRIVATE //////////////////////////////////////
const setRndFlightTitle = obj => {
  return obj.airlineCode + leftPadZeros(Math.floor((Math.random() * 1000)));
};
const getRndIndex = total => Math.floor(Math.random() * total);
const isNotSpawned = spawnedArr => obj => !spawnedArr.find(x => x.flight === obj.flight)

const flightsArrival = [
  {
    type: DestinationType.Arrival,
    time: '06:20',
    flight: 'VS4',
    city: 'New York',
    airport: 'JFK',
    airlineCode: 'VS',
    airline: 'Virgin Atlantic',
    airframe: Airframes.A333,
  },
  {
    type: DestinationType.Arrival,
    time: '06:20',
    flight: 'UA110',
    city: 'New York',
    airport: 'EWR',
    airlineCode: 'UA',
    airline: 'United Airlines',
    airframe: Airframes.B763,
  },
  {
    type: DestinationType.Arrival,
    time: '06:25',
    flight: 'AA50',
    city: 'Dallas',
    airport: 'DFW',
    airlineCode: 'AA',
    airline: 'American Airlines',
    airframe: Airframes.B77W,
  },
  {
    type: DestinationType.Arrival,
    time: '07:25',
    flight: 'BA303',
    city: 'Paris',
    airport: 'CDG',
    airlineCode: 'BA',
    airline: 'British Airways',
    airframe: Airframes.A320,
  },
  {
    type: DestinationType.Arrival,
    time: '07:05',
    flight: 'EK7',
    city: 'Dubai',
    airport: 'DXB',
    airlineCode: 'EK',
    airline: 'Emirates',
    airframe: Airframes.A388,
  },
];

const flightsDeparture = [
  {
    type: DestinationType.Departure,
    time: '06:15',
    flight: 'BA472',
    city: 'Barcelona',
    airport: 'BCN',
    airlineCode: 'BA',
    airline: 'British Airways',
    airframe: Airframes.A320,
  },
  {
    type: DestinationType.Departure,
    time: '09:20',
    flight: 'VS3',
    city: 'New York',
    airport: 'JFK',
    airlineCode: 'VS',
    airline: 'Virgin Atlantic',
    airframe: Airframes.A333,
  },
  {
    type: DestinationType.Departure,
    time: '08:00',
    flight: 'UA883',
    city: 'New York',
    airport: 'EWR',
    airlineCode: 'UA',
    airline: 'United Airlines',
    airframe: Airframes.B763,
  },
  {
    type: DestinationType.Departure,
    time: '08:40',
    flight: 'AA51',
    city: 'Dallas',
    airport: 'DFW',
    airlineCode: 'AA',
    airline: 'American Airlines',
    airframe: Airframes.B77W,
  },
  {
    type: DestinationType.Departure,
    time: '10:25',
    flight: 'BA295',
    city: 'Chicago',
    airport: 'ORD',
    airlineCode: 'BA',
    airline: 'British Airways',
    airframe: Airframes.A388,
  },
];