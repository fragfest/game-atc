#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const AIRPORT_CONFIG = {
  AMS: { domain: 'amsterdam-airport.com', statusPath: '/schiphol-flight-status' },
  HND: { domain: 'tokyo-haneda-airport.com', statusPath: '/haneda-flight-status' },
  JFK: { domain: 'airport-jfk.com', statusPath: '/jfk-flight-status' },
  LHR: { domain: 'airport-london-heathrow.com', statusPath: '/lhr-flight-status' },
  YVR: { domain: 'vancouver-airport.com', statusPath: '/vancouver-flight-status' },
};

const AIRFRAME_MAP = [
  ['Airbus A380-800', 'A388'],
  ['Airbus A350-1000', 'A35K'],
  ['Airbus A350-900', 'A359'],
  ['Airbus A330-900', 'A339'],
  ['Airbus A330-300', 'A333'],
  ['Airbus A330-200', 'A332'],
  ['Airbus A321neo', 'A321'],
  ['Airbus A321-200', 'A321'],
  ['Airbus A321', 'A321'],
  ['Airbus A320-200', 'A320'],
  ['Airbus A320', 'A320'],
  ['Airbus A319-100', 'A319'],
  ['Airbus A319', 'A319'],
  ['Boeing 787-10', 'B78X'],
  ['Boeing 787-9', 'B789'],
  ['Boeing 787-8', 'B788'],
  ['Boeing 777-300ER', 'B77W'],
  ['Boeing 777-F', 'B77L'],
  ['Boeing 777-200', 'B772'],
  ['Boeing 737 MAX 9', 'B39M'],
  ['Boeing 737MAX 8', 'B38M'],
  ['Boeing 737 MAX 8', 'B38M'],
  ['Boeing 737-800', 'B738'],
  ['Boeing 767-300', 'B763'],
  ['Boeing 747-8', 'B748'],
  ['Boeing 747-400', 'B744'],
];

function mapEquipment(text) {
  for (const [name, code] of AIRFRAME_MAP) {
    if (text.includes(name)) return code;
  }
  return null;
}

async function fetchPage(url) {
  let response;
  try {
    response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AirframeFetcher/1.0)' },
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    return { error: err.message };
  }
  if (!response.ok) {
    return { error: `HTTP ${response.status}` };
  }
  const html = await response.text();
  const match = html.match(/Equipment:\s*([^<]+)/i);
  if (!match) {
    return { error: 'Equipment field not found on page' };
  }
  return { text: match[1].trim().replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ') };
}

async function main() {
  const airportCode = process.argv[2];

  if (!airportCode) {
    console.error('Usage: node scripts/fetch-airframes.mjs <AIRPORT_CODE>');
    console.error('Supported codes: AMS, HND, JFK, LHR, YVR');
    process.exit(1);
  }

  const code = airportCode.toUpperCase();
  const config = AIRPORT_CONFIG[code];

  if (!config) {
    console.error(`Unknown airport code: ${code}`);
    console.error('Supported codes: AMS, HND, JFK, LHR, YVR');
    process.exit(1);
  }

  const filePath = join(__dirname, '..', 'src', 'js', 'flights', `${code}.js`);
  let content;
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch (err) {
    console.error(`Error reading ${filePath}: ${err.message}`);
    process.exit(1);
  }

  const flights = [];

  const arrivalsMatch = content.match(/export\s+const\s+flightsArrival\s*=\s*\[([\s\S]*?)\];/);
  if (arrivalsMatch) {
    const re = /flight:\s*'([^']+)'/g;
    let m;
    while ((m = re.exec(arrivalsMatch[1])) !== null) {
      flights.push({ flight: m[1], direction: 'arrival' });
    }
  }

  const departuresMatch = content.match(/export\s+const\s+flightsDeparture\s*=\s*\[([\s\S]*?)\];/);
  if (departuresMatch) {
    const re = /flight:\s*'([^']+)'/g;
    let m;
    while ((m = re.exec(departuresMatch[1])) !== null) {
      flights.push({ flight: m[1], direction: 'departure' });
    }
  }

  if (flights.length === 0) {
    console.error('No flights found in airport file');
    process.exit(1);
  }

  const results = {};
  let delay = 0;

  for (const { flight, direction } of flights) {
    await new Promise((r) => setTimeout(r, delay));
    delay = 600;

    const baseUrl = `https://${config.domain}${config.statusPath}`;
    let result = await fetchPage(`${baseUrl}?${direction}=${flight}`);

    if (result.error) {
      const otherDir = direction === 'arrival' ? 'departure' : 'arrival';
      const fallback = await fetchPage(`${baseUrl}?${otherDir}=${flight}`);

      if (fallback.error) {
        console.error(`[${flight}] Not found (${result.error}, also tried ${otherDir}: ${fallback.error})`);
        results[flight] = { airframe: null, source: null, error: `Not found (${result.error})` };
        continue;
      }
      result = fallback;
    }

    const airframeCode = mapEquipment(result.text);
    if (airframeCode) {
      results[flight] = { airframe: airframeCode, source: result.text };
    } else {
      console.error(`[${flight}] Unmapped equipment: "${result.text}"`);
      results[flight] = { airframe: null, source: result.text };
    }
  }

  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(`Fatal error: ${err.message}`);
  process.exit(1);
});
