# LHR Flight Data Update

## Goal
Replace the hardcoded LHR flights in `src/js/flights/LHR.js` with real-world flight data from FlightRadar24 to keep schedules fresh.

## Scope
- **File**: `src/js/flights/LHR.js` — both `flightsArrival` and `flightsDeparture` arrays
- **Quantity**: 14 arrivals + 14 departures (same as before, fits existing levels/seeding)
- **Exclusions**: No mayday flights (game mechanic, not schedule data)
- **Airframes**: Only airframes already defined in `src/js/aircraft/airframe.js`

## Data Sources
- 241 real LHR arrivals scraped from airport-london-heathrow.com (mirrors FlightRadar24 data) on 2026-06-07.
- 232 real LHR departures scraped from airport-london-heathrow.com on 2026-06-07.

## Selection Criteria
- Diverse airlines (not all British Airways)
- Mix of long-haul, European, and UK domestic flights
- Plausible aircraft types for each route
- Airframe must exist in `Airframes` enum

## Selected Flights

| Flight | From | Code | Time | Airline | AirlineCode | Airframe | Type |
|---|---|---|---|---|---|---|---|
| BA78 | Accra | ACC | 06:15 | British Airways | BA | B78X | Long-haul |
| AA50 | Dallas | DFW | 06:20 | American Airlines | AA | B77W | Long-haul |
| QR11 | Doha | DOH | 06:25 | Qatar Airways | QR | B77W | Long-haul |
| BA911 | Frankfurt | FRA | 07:25 | British Airways | BA | A320 | European |
| BA1341 | Newcastle | NCL | 07:25 | British Airways | BA | A319 | UK domestic |
| KL1001 | Amsterdam | AMS | 07:40 | KLM | KL | B738 | European |
| BA999 | Berlin | BER | 07:45 | British Airways | BA | A320 | European |
| EI152 | Dublin | DUB | 08:05 | Aer Lingus | EI | A320 | European |
| BA1497 | Glasgow | GLA | 07:35 | British Airways | BA | A319 | UK domestic |
| EK7 | Dubai | DXB | 07:05 | Emirates | EK | A388 | Long-haul |
| BA54 | Johannesburg | JNB | 07:30 | British Airways | BA | B77W | Long-haul |
| AF1680 | Paris | CDG | 07:55 | Air France | AF | A321 | European |
| TG910 | Bangkok | BKK | 07:15 | Thai Airways | TG | B77W | Long-haul |
| BA1379 | Manchester | MAN | 08:15 | British Airways | BA | A320 | UK domestic |

## Selected Departures

| Flight | To | Code | Time | Airline | AirlineCode | Airframe | Type |
|---|---|---|---|---|---|---|---|
| VS3 | New York | JFK | 08:20 | Virgin Atlantic | VS | A333 | Long-haul |
| BA1436 | Edinburgh | EDI | 08:25 | British Airways | BA | A319 | UK domestic |
| AC853 | Toronto | YYZ | 08:30 | Air Canada | AC | B77W | Long-haul |
| BA472 | Barcelona | BCN | 08:50 | British Airways | BA | A320 | European |
| AA51 | Dallas | DFW | 08:55 | American Airlines | AA | B77W | Long-haul |
| AF1681 | Paris | CDG | 08:55 | Air France | AF | A321 | European |
| LH2471 | Munich | MUC | 09:00 | Lufthansa | LH | A320 | European |
| EK8 | Dubai | DXB | 09:05 | Emirates | EK | A388 | Long-haul |
| JL42 | Tokyo | HND | 09:10 | JAL | JL | B789 | Long-haul |
| BA1478 | Glasgow | GLA | 09:20 | British Airways | BA | A319 | UK domestic |
| BA139 | Mumbai | BOM | 09:40 | British Airways | BA | B77W | Long-haul |
| BA175 | New York | JFK | 10:10 | British Airways | BA | B77W | Long-haul |
| BA432 | Amsterdam | AMS | 10:10 | British Airways | BA | B738 | European |
| BA552 | Rome | FCO | 10:40 | British Airways | BA | A320 | European |

## Risk
- Airframe assignments are inferred (not from real data) — plausible per airline fleet but game performance could differ if wrong weight class chosen.

## Verification
- `yarn test` passes
- Flight numbers are unique (no duplicates within arrivals)
- All `airframe` values exist in `Airframes` enum
