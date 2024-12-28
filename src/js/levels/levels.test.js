import { describe, beforeEach, test, jest, expect } from '@jest/globals';
import { callAircraftFnByLevel } from './levels.js';
import * as scoreJs from '../game/score/score.js';
import * as types from '../types.js';
import * as utils from '../utils.js';
import { Airport } from '../airports/airports.js';

describe('Level', () => {
  let airport;
  let entityManagerArr, goals, score, level;
  let getChanceFn, aircraftFn;

  describe('level 1 & 2', () => {
    beforeEach(() => {
      jest.spyOn(types, 'isAircraft').mockImplementation(() => true);
      jest.spyOn(scoreJs, 'getScore').mockImplementation(() => ({ level }));

      airport = Airport.Heathrow;
      entityManagerArr = [];
      goals = { Arrivals: 1, Departures: 1 };
      getChanceFn = jest.fn(() => 0.123);
      aircraftFn = jest.fn(() => true);
    });

    describe('level 1', () => {
      beforeEach(() => {
        level = 1;
      });

      test('spawn more', () => {
        score = { arrivals: 0, departures: 0 };
        callAircraftFnByLevel({
          entityManagerArr,
          goals,
          score,
          getChanceFn,
          aircraftFn,
        });

        expect(getChanceFn).toHaveBeenCalledWith(0.1);
        expect(aircraftFn).toHaveBeenCalledWith(
          0.123,
          1,
          { time: 600 },
          airport
        );
      });

      test('only spawn departures', () => {
        score = { arrivals: 0, departures: 1 };
        callAircraftFnByLevel({
          entityManagerArr,
          goals,
          score,
          getChanceFn,
          aircraftFn,
        });

        expect(getChanceFn).not.toHaveBeenCalled();
        expect(aircraftFn).not.toHaveBeenCalled();
      });

      test('spawn complete', () => {
        score = { arrivals: 1, departures: 1 };
        callAircraftFnByLevel({
          entityManagerArr,
          goals,
          score,
          getChanceFn,
          aircraftFn,
        });

        expect(getChanceFn).not.toHaveBeenCalled();
        expect(aircraftFn).not.toHaveBeenCalled();
      });
    });

    describe('level 2', () => {
      beforeEach(() => {
        level = 2;
      });
      test('spawn more', () => {
        score = { arrivals: 0, departures: 0 };
        callAircraftFnByLevel({
          entityManagerArr,
          goals,
          score,
          getChanceFn,
          aircraftFn,
        });

        expect(getChanceFn).toHaveBeenCalledWith(0.03);
        expect(aircraftFn).toHaveBeenCalledWith(
          0.123,
          0,
          { time: 1080 },
          airport
        );
      });

      test('only spawn arrivals', () => {
        score = { arrivals: 1, departures: 0 };
        callAircraftFnByLevel({
          entityManagerArr,
          goals,
          score,
          getChanceFn,
          aircraftFn,
        });

        expect(getChanceFn).not.toHaveBeenCalled();
        expect(aircraftFn).not.toHaveBeenCalled();
      });

      test('spawn complete', () => {
        score = { arrivals: 1, departures: 1 };
        callAircraftFnByLevel({
          entityManagerArr,
          goals,
          score,
          getChanceFn,
          aircraftFn,
        });

        expect(getChanceFn).not.toHaveBeenCalled();
        expect(aircraftFn).not.toHaveBeenCalled();
      });
    });
  });

  describe('level 3', () => {
    beforeEach(() => {
      jest.spyOn(utils, 'getDepartureCount').mockImplementation(() => 2);
      jest.spyOn(utils, 'getArrivalCount').mockImplementation(() => 2);

      level = 3;
      airport = Airport.Heathrow;
      entityManagerArr = [
        { destinationType: types.DestinationType.Departure },
        { destinationType: types.DestinationType.Departure },
        { destinationType: types.DestinationType.Arrival },
        { destinationType: types.DestinationType.Arrival },
      ];
      goals = { Arrivals: 8, Departures: 8 };
      getChanceFn = jest.fn(() => 0.123);
      aircraftFn = jest.fn(() => true);
    });

    test('spawn complete', () => {
      score = { arrivals: 8, departures: 8 };
      callAircraftFnByLevel({
        entityManagerArr,
        goals,
        score,
        getChanceFn,
        aircraftFn,
      });

      expect(getChanceFn).not.toHaveBeenCalled();
      expect(aircraftFn).not.toHaveBeenCalled();
    });

    test('lowCount spawn departure', () => {
      jest.spyOn(utils, 'getDepartureCount').mockImplementation(() => 1);
      score = { arrivals: 2, departures: 1 };
      callAircraftFnByLevel({
        entityManagerArr,
        goals,
        score,
        getChanceFn,
        aircraftFn,
      });

      expect(getChanceFn).toHaveBeenCalledWith(0.5);
      expect(aircraftFn).toHaveBeenCalledWith(
        0.123,
        1,
        { time: 1080 },
        airport
      );
    });

    test('lowCount spawn arrival', () => {
      jest.spyOn(utils, 'getArrivalCount').mockImplementation(() => 1);
      score = { arrivals: 1, departures: 2 };
      callAircraftFnByLevel({
        entityManagerArr,
        goals,
        score,
        getChanceFn,
        aircraftFn,
      });

      expect(getChanceFn).toHaveBeenCalledWith(0.5);
      expect(aircraftFn).toHaveBeenCalledWith(
        0.123,
        0,
        { time: 1080 },
        airport
      );
    });

    test('not lowCount spawn random', () => {
      const arrLarge = [...entityManagerArr];
      arrLarge.push({ destinationType: types.DestinationType.Departure });
      jest.spyOn(utils, 'getArrivalCount').mockImplementation(() => 2);
      jest.spyOn(utils, 'getDepartureCount').mockImplementation(() => 3);
      score = { arrivals: 2, departures: 3 };
      callAircraftFnByLevel({
        entityManagerArr: arrLarge,
        goals,
        score,
        getChanceFn,
        aircraftFn,
      });

      expect(getChanceFn).toHaveBeenCalledWith(0.03);
      expect(aircraftFn).toHaveBeenCalledWith(
        0.123,
        0.4,
        { time: 1080 },
        airport
      );
    });

    test('when all departures done, spawn arrivals', () => {
      score = { arrivals: 1, departures: 8 };
      callAircraftFnByLevel({
        entityManagerArr,
        goals,
        score,
        getChanceFn,
        aircraftFn,
      });

      expect(getChanceFn).toHaveBeenCalledWith(0.5);
      expect(aircraftFn).toHaveBeenCalledWith(
        0.123,
        0,
        { time: 1080 },
        airport
      );
    });

    test('when all arrivals done, spawn departures', () => {
      score = { arrivals: 8, departures: 1 };
      callAircraftFnByLevel({
        entityManagerArr,
        goals,
        score,
        getChanceFn,
        aircraftFn,
      });

      expect(getChanceFn).toHaveBeenCalledWith(0.5);
      expect(aircraftFn).toHaveBeenCalledWith(
        0.123,
        1,
        { time: 1080 },
        airport
      );
    });
  });
});
