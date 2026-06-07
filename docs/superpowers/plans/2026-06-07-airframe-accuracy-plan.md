# Airframe Accuracy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure the `airframe` property on every flight in all 5 airport files matches real-world FR24 source data, and update the process so future updates use data instead of guesses.

**Architecture:** A Node script (`scripts/fetch-airframes.mjs`) reads an airport's JS flight file, fetches each flight's individual FR24 status page, parses the "Equipment:" field, maps it to the `Airframes` enum, and outputs a JSON mapping. Run it per airport, fix mismatches, update AGENTS.md.

**Tech Stack:** Node.js 24 (`.mjs` ESM, global `fetch`), regex-based HTML parsing (no external deps)

---

### Task 1: Create `scripts/fetch-airframes.mjs`

**Files:**
- Create: `scripts/fetch-airframes.mjs`
- (Reference only) `src/js/flights/AMS.js` — to understand data structure
- (Reference only) `src/js/aircraft/airframe.js` — for `Airframes` enum

- [ ] **Step 1: Create the script skeleton with airport URL mapping**

```javascript
// scripts/fetch-airframes.mjs

const AIRPORT_CONFIG = {
  AMS: { domain: 'amsterdam-airport.com', arrivals: '/schiphol-arrivals', departures: '/schiphol-departures' },
  HND: { domain: 'tokyo-haneda-airport.com', arrivals: '/haneda-arrivals', departures: '/haneda-departures' },
  JFK: { domain: 'airport-jfk.com', arrivals: '/jfk-arrivals', departures: '/jfk-departures' },
  LHR: { domain: 'airport-london-heathrow.com', arrivals: '/lhr-arrivals', departures: '/lhr-departures' },
  YVR: { domain: 'vancouver-airport.com', arrivals: '/vancouver-arrivals', departures: '/vancouver-departures' },
};

const AIRFRAME_MAP = [
  { match: 'Boeing 787-9', airframe: 'B789' },
  { match: 'Boeing 787-10', airframe: 'B78X' },
  { match: 'Boeing 787-8', airframe: 'B788' },
  { match: 'Boeing 777-300ER', airframe: 'B77W' },
  { match: 'Boeing 777-200', airframe: 'B772' },
  { match: 'Boeing 777-F', airframe: 'B77L' },
  { match: 'Airbus A380-800', airframe: 'A388' },
  { match: 'Airbus A350-1000', airframe: 'A35K' },
  { match: 'Airbus A350-900', airframe: 'A359' },
  { match: 'Airbus A330-300', airframe: 'A333' },
  { match: 'Airbus A330-200', airframe: 'A332' },
  { match: 'Airbus A330-900', airframe: 'A339' },
  { match: 'Airbus A321neo', airframe: 'A321' },
  { match: 'Airbus A321-200', airframe: 'A321' },
  { match: 'Airbus A321', airframe: 'A321' },
  { match: 'Airbus A320-200', airframe: 'A320' },
  { match: 'Airbus A320', airframe: 'A320' },
  { match: 'Airbus A319-100', airframe: 'A319' },
  { match: 'Airbus A319', airframe: 'A319' },
  { match: 'Boeing 737-800', airframe: 'B738' },
  { match: 'Boeing 737 MAX 8', airframe: 'B38M' },
  { match: 'Boeing 737 MAX 9', airframe: 'B39M' },
  { match: 'Boeing 767-300', airframe: 'B763' },
  { match: 'Boeing 747-8', airframe: 'B748' },
  { match: 'Boeing 747-400', airframe: 'B744' },
];

function mapAirframe(equipmentText) {
  for (const { match, airframe } of AIRFRAME_MAP) {
    if (equipmentText.includes(match)) return { airframe, source: equipmentText };
  }
  return { airframe: null, source: equipmentText };
}
```

- [ ] **Step 2: Add function to extract flights from an airport JS file**

The JS files consistently use `flight: 'XXXX'` patterns. Use regex to extract flight numbers.

```javascript
import { readFileSync } from 'node:fs';

function extractFlights(filePath, direction) {
  const content = readFileSync(filePath, 'utf-8');
  const flights = [];
  const lines = content.split('\n');
  let inSection = false;

  for (const line of lines) {
    if (line.includes(`flights${direction} = [`)) {
      inSection = true;
      continue;
    }
    if (inSection && line.includes('];')) {
      break;
    }
    if (inSection) {
      const match = line.match(/flight:\s*'([^']+)'/);
      if (match) flights.push(match[1]);
    }
  }
  return flights;
}
```

- [ ] **Step 3: Add function to fetch status page and parse equipment**

The status page URL depends on direction: `/schiphol-flight-status?arrival=FLIGHT` or `/schiphol-flight-status?departure=FLIGHT`.

The Equipment field appears in the HTML as: `<strong>Equipment:</strong> Boeing 787-9`

```javascript
function getStatusUrl(domain, flight, direction) {
  const param = direction === 'Arrival' ? 'arrival' : 'departure';
  return `https://${domain}/schiphol-flight-status?${param}=${flight}`;
}

async function fetchEquipment(domain, flight, direction) {
  const url = getStatusUrl(domain, flight, direction);
  const response = await fetch(url);
  if (!response.ok) return { airframe: null, source: `HTTP ${response.status}` };
  const html = await response.text();

  // Find Equipment: field in airline information section
  const match = html.match(/<strong>Equipment:<\/strong>\s*([^<]+)/);
  if (!match) return { airframe: null, source: 'Equipment field not found' };

  const equipmentText = match[1].trim();
  return mapAirframe(equipmentText);
}
```

- [ ] **Step 4: Add main function that ties it together**

```javascript
async function main() {
  const airportCode = process.argv[2];
  if (!airportCode || !AIRPORT_CONFIG[airportCode]) {
    console.error(`Usage: node scripts/fetch-airframes.mjs <AIRPORT>`);
    console.error(`Valid: ${Object.keys(AIRPORT_CONFIG).join(', ')}`);
    process.exit(1);
  }

  const config = AIRPORT_CONFIG[airportCode];
  const filePath = `src/js/flights/${airportCode}.js`;
  const results = {};

  for (const direction of ['Arrival', 'Departure']) {
    const flights = extractFlights(filePath, direction);
    for (const flight of flights) {
      const { airframe, source } = await fetchEquipment(config.domain, flight, direction);
      results[flight] = { airframe, source };
      const status = airframe ? `✓ ${airframe}` : `⚠ ${source}`;
      console.error(`  ${direction} ${flight}: ${status}`);
    }
  }

  // Output JSON to stdout
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
```

- [ ] **Step 5: Test the script on one airport**

```bash
node scripts/fetch-airframes.mjs AMS 2>&1
```

Expected: Script outputs JSON to stdout with airframe mappings for all 28 flights, with progress messages on stderr. Verifies that AMS KL682 is identified as B77W (not B789).

- [ ] **Step 6: Fix any issues and verify it works for all airports**

```bash
node scripts/fetch-airframes.mjs AMS > /tmp/ams.json 2>&1
node scripts/fetch-airframes.mjs LHR > /tmp/lhr.json 2>&1
node scripts/fetch-airframes.mjs HND > /tmp/hnd.json 2>&1
node scripts/fetch-airframes.mjs JFK > /tmp/jfk.json 2>&1
node scripts/fetch-airframes.mjs YVR > /tmp/yvr.json 2>&1
```

Check each output file for unmapped or null airframes.

---

### Task 2: Fix AMS flight airframes

**Files:**
- Modify: `src/js/flights/AMS.js`

- [ ] **Step 1: Run the script and diff against current file**

```bash
node scripts/fetch-airframes.mjs AMS > /tmp/ams-fetched.json 2>&1
node -e "
const d = JSON.parse(require('fs').readFileSync('/tmp/ams-fetched.json','utf-8'));
const mismatches = [];
// Read AMS.js and check each flight
const content = require('fs').readFileSync('src/js/flights/AMS.js','utf-8');
const lines = content.split('\n');
let inArrival = false, inDeparture = false;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('flightsArrival = [')) { inArrival = true; continue; }
  if (line.includes('flightsDeparture = [')) { inDeparture = true; inArrival = false; continue; }
  if (inArrival && line.includes('];')) { inArrival = false; continue; }
  if (inDeparture && line.includes('];')) { inDeparture = false; continue; }
  if ((inArrival || inDeparture) && line.includes('airframe:')) {
    const flightLine = lines[i-2] || lines[i-1];
    const flightMatch = flightLine.match(/flight:\s*'([^']+)'/);
    const currentMatch = line.match(/airframe:\s*Airframes\.(\w+)/);
    if (flightMatch && currentMatch) {
      const f = flightMatch[1];
      const current = currentMatch[1];
      const fetched = d[f] ? d[f].airframe : null;
      if (fetched && fetched !== current) {
        console.log(f + ': ' + current + ' => ' + fetched + ' (' + (d[f]?.source || '') + ')');
      }
    }
  }
}
"
```

Verify output shows expected mismatches (KL682: B789 → B77W and any others).

- [ ] **Step 2: Fix each mismatched airframe in AMS.js**

Use the script output to identify and fix each wrong airframe. Edit each `airframe: Airframes.XXXX` entry to the correct value.

```bash
# Use the mismatches output from step 1 to guide edits
```

- [ ] **Step 3: Run lint and tests**

```bash
npm run lint 2>&1
npx vitest run 2>&1 | tail -15
```

Expected: No lint errors, no new test failures.

---

### Task 3: Fix LHR flight airframes

**Files:**
- Modify: `src/js/flights/LHR.js`

- [ ] **Step 1: Run the script and diff**

Same approach as Task 2 step 1, but for LHR.

```bash
node scripts/fetch-airframes.mjs LHR > /tmp/lhr-fetched.json 2>&1
# (use the same diff script, same logic)
```

- [ ] **Step 2: Fix mismatches in LHR.js**

- [ ] **Step 3: Run lint and tests**

```bash
npm run lint 2>&1
npx vitest run 2>&1 | tail -15
```

---

### Task 4: Fix HND flight airframes

**Files:**
- Modify: `src/js/flights/HND.js`

- [ ] **Step 1: Run `node scripts/fetch-airframes.mjs HND` and diff**

- [ ] **Step 2: Fix mismatches in HND.js**

- [ ] **Step 3: Run `npm run lint && npx vitest run`**

---

### Task 5: Fix JFK flight airframes

**Files:**
- Modify: `src/js/flights/JFK.js`

- [ ] **Step 1: Run `node scripts/fetch-airframes.mjs JFK` and diff**

- [ ] **Step 2: Fix mismatches in JFK.js**

- [ ] **Step 3: Run `npm run lint && npx vitest run`**

---

### Task 6: Fix YVR flight airframes

**Files:**
- Modify: `src/js/flights/YVR.js`

- [ ] **Step 1: Run `node scripts/fetch-airframes.mjs YVR` and diff**

- [ ] **Step 2: Fix mismatches in YVR.js**

- [ ] **Step 3: Run `npm run lint && npx vitest run`**

---

### Task 7: Update AGENTS.md process

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Replace step 2 with data-driven process**

Replace:
```
2. Map each flight to an airframe from `Airframes` enum in `src/js/aircraft/airframe.js`. Use plausible real-world aircraft types for the route (e.g. A388 for Emirates long-haul, A320 for European short-haul).
```

With:
```
2. Run `node scripts/fetch-airframes.mjs <AIRPORT>` to get actual aircraft assignments from FR24 source data. Each flight's individual status page on the FR24 mirror lists the equipment type. Use the script's output as the authoritative source for `airframe` values. If the script can't resolve a flight (e.g., status page unavailable), check the airline's fleet or a site like planespotters.net.
```

- [ ] **Step 2: Add airframe verification step**

After step 6 (re-mark mayday flights), add:
```
7. Run `node scripts/fetch-airframes.mjs <AIRPORT>` and verify no unexpected airframe mismatches with the final selection.
```

Renumber subsequent steps.

- [ ] **Step 3: Commit all changes**

```bash
git add scripts/fetch-airframes.mjs AGENTS.md src/js/flights/
git commit -m "feat: script to fetch real airframes from FR24; fix all airport airframes"
```
