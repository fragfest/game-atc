# ATC Game — Conventions

## Pre-existing test failures

6 test files fail with `self is not defined` due to `encrypt-storage` in Node env. These are pre-existing and should be ignored. Don't attempt to fix them.

## Updating flights for an airport

Each airport file in `src/js/flights/` exports `flightsArrival` (14 entries) and `flightsDeparture` (14 entries).

### Process

1. Scrape real schedule data from the airport's FR24 mirror. The URL pattern is `{airport-name}-airport.com` (e.g., tokyo-haneda-airport.com, vancouver-airport.com, airport-jfk.com, amsterdam-airport.com). LHR is the exception: use airport-london-heathrow.com. Fetch the airport's arrivals/departures pages. Note: some mirrors (HND, YVR) may 404 on flight status pages.
2. Run `node scripts/fetch-airframes.mjs <ICAO>` (e.g., `node scripts/fetch-airframes.mjs JFK`) to fetch real airframe data from each flight's FR24 status page. If it returns null, check the airport's FR24 mirror directly. Map flights to an airframe from `Airframes` enum in `src/js/aircraft/airframe.js`. Use plausible real-world aircraft types for the route (e.g. A388 for Emirates long-haul, A320 for European short-haul).
3. Select 14 arrivals and 14 departures with a diverse mix:
   - Some long-haul (e.g. AA, EK, QR, AC, JL)
   - Some European/regional (e.g. AF, KL, LH, BA intra-Europe)
   - Some domestic (e.g. BA UK domestic)
   - Diverse airlines (don't make it all British Airways)
   - No duplicate destinations within the same direction (e.g. don't pick two departures to Sapporo)
4. Sort each array by time ascending.
5. Remove any mayday flight entries (mayday is a game mechanic, not schedule data).
6. Re-mark 3 arrival flights as mayday (`isMayday: true`, `maydayScenario: MaydayScenario.Level25Fuel`). Select trans-Pacific arrivals from Asian cities (e.g. Seoul, Hong Kong, Beijing, Tokyo).
7. Run `npm run lint` and verify no errors.
8. Run `npx vitest run` and verify no new failures (pre-existing failures are expected).
