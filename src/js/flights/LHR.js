import { Airframes, DestinationType } from '../aircraft/airframe';

export const getFlightArrival = (spawned) => {
  const isNotSpawned = obj => !spawned.find(x => x.flight === obj.flight)

  const flightsUnspawned = flightsArrival.filter(isNotSpawned);
  const total = flightsUnspawned.length;
  if (total === 0) return null;

  const index = Math.floor(Math.random() * total);
  return flightsUnspawned[index];
}

////////////// PRIVATE //////////////////////////////////////
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