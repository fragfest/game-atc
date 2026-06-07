# Airframe Accuracy for Airport Flight Data

## Goal
Ensure the `airframe` property on every flight in `src/js/flights/*.js` matches real-world data from FR24 mirror sources, not guesses. Fix existing mismatches across all 5 airports and update the AGENTS.md process so future updates use source data.

## Root Cause
The AGENTS.md process for updating flights says "Use plausible real-world aircraft types" — this is hand-wavy and leads to incorrect airframe assignments (e.g., KL682 assigned B789 when it's really B77W).

## Solution Components

### Component 1: `scripts/fetch-airframes.mjs`
A Node script that reads an airport's existing flight file, looks up each flight's aircraft type from the FR24 mirror, and outputs a JSON airframe mapping.

**Input:** Airport code (e.g., `AMS`)  
**Output:** JSON to stdout: `{ "KL682": { airframe: "B77W", source: "Boeing 777-300ER" }, ... }`

**Sources mapping:**
| Airport code | FR24 mirror URL | Arrivals path | Departures path |
|---|---|---|---|
| AMS | amsterdam-airport.com | /schiphol-arrivals | /schiphol-departures |
| HND | tokyo-haneda-airport.com | /haneda-arrivals | /haneda-departures |
| JFK | airport-jfk.com | /jfk-arrivals | /jfk-departures |
| LHR | airport-london-heathrow.com | /lhr-arrivals | /lhr-departures |
| YVR | vancouver-airport.com | /vancouver-arrivals | /vancouver-departures |

**Process per airport:**
1. Read `src/js/flights/<AIRPORT>.js` to extract all flight numbers
2. For each flight number, fetch its individual status page (e.g., `amsterdam-airport.com/schiphol-flight-status?arrival=KL682`)
3. Parse the "Equipment:" field from the "Airline information" section on the status page
4. Map the human-readable aircraft description (e.g., "Boeing 787-9") to an `Airframes` enum value
5. Output JSON mapping

**Aircraft name → Airframes mapping:**
```
Boeing 787-9        → B789
Boeing 787-10       → B78X
Boeing 787-8        → B788
Boeing 777-300ER    → B77W
Boeing 777-200      → B772
Boeing 777-F        → B77L
Airbus A380-800     → A388
Airbus A350-1000    → A35K
Airbus A350-900     → A359
Airbus A330-300     → A333
Airbus A330-200     → A332
Airbus A330-900     → A339
Airbus A321-200     → A321
Airbus A320-200     → A320
Airbus A319-100     → A319
Boeing 737-800      → B738
Boeing 737 MAX 8    → B38M
Boeing 737 MAX 9    → B39M
Boeing 767-300      → B763
Boeing 747-8        → B748
Boeing 747-400      → B744
```
(Extendable as needed for unmapped types)

**Usage examples:**
```
node scripts/fetch-airframes.mjs AMS
node scripts/fetch-airframes.mjs LHR
```

### Component 2: Fix existing flight files
Run the script for each airport, compare the output against the current JS files, and manually correct any mismatches.

**Known mismatch examples (from current files):**
- AMS KL682 (Vancouver): currently B789, should be B77W
- (others to be discovered by running the script)

For each airport:
1. Run `node scripts/fetch-airframes.mjs <AIRPORT>`
2. Diff the output against the file's current `airframe` values
3. Update the JS file with corrected airframes
4. Run `npm run lint && npx vitest run`

### Component 3: Update AGENTS.md process
Replace vague step 2:

> *Before (step 2):* "Map each flight to an airframe from `Airframes` enum. Use plausible real-world aircraft types for the route (e.g. A388 for Emirates long-haul, A320 for European short-haul)."

> *After (step 2):* "Run `node scripts/fetch-airframes.mjs <AIRPORT>` to get actual aircraft assignments from FR24 source data. Each flight's individual status page on the FR24 mirror lists the equipment type. Use the script's output as the authoritative source for `airframe` values. If the script can't resolve a flight (e.g., status page unavailable), check the airline's fleet or a site like planespotters.net."

Part of step 3's verification also changes: after step 6 (re-mark mayday flights), run:
> "Run `node scripts/fetch-airframes.mjs <AIRPORT>` and verify no unexpected airframe mismatches."

## Risk
- FR24 mirror individual status pages may change structure, requiring parser updates
- Some aircraft descriptions from FR24 may not cleanly map to Airframes enum values — the script should warn about unmapped types
- Rate-limiting: fetching 28 individual pages per airport is fine, but the mapping table must handle common variants (e.g., "Boeing 777-300ER" vs "B777-300ER")

## Verification
- `node scripts/fetch-airframes.mjs <AIRPORT>` produces valid JSON with correct Airframes values
- `npm run lint` passes
- `npx vitest run` shows no new failures
- No flight in any airport file has an `airframe` that contradicts the FR24 source data
