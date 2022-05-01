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
    type: 'arrival',
    time: '06:20',
    flight: 'VS4',
    city: 'New York',
    airport: 'JFK',
    airlineCode: 'VS',
    airline: 'Virgin Atlantic',
    airframe: 'A333',
  },
  {
    type: 'arrival',
    time: '06:20',
    flight: 'UA110',
    city: 'New York',
    airport: 'EWR',
    airlineCode: 'UA',
    airline: 'United Airlines',
    airframe: 'B763',
  },
  {
    type: 'arrival',
    time: '06:25',
    flight: 'AA50',
    city: 'Dallas',
    airport: 'DFW',
    airlineCode: 'AA',
    airline: 'American Airlines',
    airframe: 'B77W',
  },
  {
    type: 'arrival',
    time: '07:25',
    flight: 'BA303',
    city: 'Paris',
    airport: 'CDG',
    airlineCode: 'BA',
    airline: 'British Airways',
    airframe: 'A320',
  },
  {
    type: 'arrival',
    time: '07:05',
    flight: 'EK7',
    city: 'Dubai',
    airport: 'DXB',
    airlineCode: 'EK',
    airline: 'Emirates',
    airframe: 'A388',
  },
];