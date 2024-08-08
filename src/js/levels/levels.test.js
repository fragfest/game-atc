import { describe, beforeEach, test, jest, expect } from '@jest/globals';
import { callAircraftFnByLevel } from './levels.js';
import * as types from '../types.js';
import * as utils from '../utils.js';

describe('Level', () => {
  let entityManagerArr, goals, score;
  let getChanceFn, aircraftFn;

  describe('level 1 & 2', () => {
    beforeEach(() => {
      jest.spyOn(types, 'isAircraft').mockImplementation(() => true);
      entityManagerArr = [];
      goals = { Arrivals: 1, Departures: 1 };
      getChanceFn = jest.fn(() => 0.123);
      aircraftFn = jest.fn(() => true);
    });

    test('level 1 spawn more', () => {
      score = { arrivals: 0, departures: 0 };
      callAircraftFnByLevel(1, {
        entityManagerArr,
        goals,
        score,
        getChanceFn,
        aircraftFn,
      });

      expect(getChanceFn).toHaveBeenCalledWith(0.1);
      expect(aircraftFn).toHaveBeenCalledWith(0.123, 1, { time: 600 });
    });

    test('level 1 only spawn departures', () => {
      score = { arrivals: 0, departures: 1 };
      callAircraftFnByLevel(1, {
        entityManagerArr,
        goals,
        score,
        getChanceFn,
        aircraftFn,
      });

      expect(getChanceFn).not.toHaveBeenCalled();
      expect(aircraftFn).not.toHaveBeenCalled();
    });

    test('level 1 spawn complete', () => {
      score = { arrivals: 1, departures: 1 };
      callAircraftFnByLevel(1, {
        entityManagerArr,
        goals,
        score,
        getChanceFn,
        aircraftFn,
      });

      expect(getChanceFn).not.toHaveBeenCalled();
      expect(aircraftFn).not.toHaveBeenCalled();
    });

    test('level 2 spawn more', () => {
      score = { arrivals: 0, departures: 0 };
      callAircraftFnByLevel(2, {
        entityManagerArr,
        goals,
        score,
        getChanceFn,
        aircraftFn,
      });

      expect(getChanceFn).toHaveBeenCalledWith(0.03);
      expect(aircraftFn).toHaveBeenCalledWith(0.123, 0, { time: 1080 });
    });

    test('level 2 only spawn arrivals', () => {
      score = { arrivals: 1, departures: 0 };
      callAircraftFnByLevel(2, {
        entityManagerArr,
        goals,
        score,
        getChanceFn,
        aircraftFn,
      });

      expect(getChanceFn).not.toHaveBeenCalled();
      expect(aircraftFn).not.toHaveBeenCalled();
    });

    test('level 2 spawn complete', () => {
      score = { arrivals: 1, departures: 1 };
      callAircraftFnByLevel(2, {
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

  describe('level 3', () => {
    beforeEach(() => {
      jest.spyOn(utils, 'getDepartureCount').mockImplementation(() => 2);
      jest.spyOn(utils, 'getArrivalCount').mockImplementation(() => 2);

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
      callAircraftFnByLevel(3, {
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
      callAircraftFnByLevel(3, {
        entityManagerArr,
        goals,
        score,
        getChanceFn,
        aircraftFn,
      });

      expect(getChanceFn).toHaveBeenCalledWith(0.5);
      expect(aircraftFn).toHaveBeenCalledWith(0.123, 1, { time: 1080 });
    });

    test('lowCount spawn arrival', () => {
      jest.spyOn(utils, 'getArrivalCount').mockImplementation(() => 1);
      score = { arrivals: 1, departures: 2 };
      callAircraftFnByLevel(3, {
        entityManagerArr,
        goals,
        score,
        getChanceFn,
        aircraftFn,
      });

      expect(getChanceFn).toHaveBeenCalledWith(0.5);
      expect(aircraftFn).toHaveBeenCalledWith(0.123, 0, { time: 1080 });
    });

    test('not lowCount spawn random', () => {
      const arrLarge = [...entityManagerArr];
      arrLarge.push({ destinationType: types.DestinationType.Departure });
      jest.spyOn(utils, 'getArrivalCount').mockImplementation(() => 2);
      jest.spyOn(utils, 'getDepartureCount').mockImplementation(() => 3);
      score = { arrivals: 2, departures: 3 };
      callAircraftFnByLevel(3, {
        entityManagerArr: arrLarge,
        goals,
        score,
        getChanceFn,
        aircraftFn,
      });

      expect(getChanceFn).toHaveBeenCalledWith(0.03);
      expect(aircraftFn).toHaveBeenCalledWith(0.123, 0.4, { time: 1080 });
    });

    test('when all departures done, spawn arrivals', () => {
      score = { arrivals: 1, departures: 8 };
      callAircraftFnByLevel(3, {
        entityManagerArr,
        goals,
        score,
        getChanceFn,
        aircraftFn,
      });

      expect(getChanceFn).toHaveBeenCalledWith(0.5);
      expect(aircraftFn).toHaveBeenCalledWith(0.123, 0, { time: 1080 });
    });

    test('when all arrivals done, spawn departures', () => {
      score = { arrivals: 8, departures: 1 };
      callAircraftFnByLevel(3, {
        entityManagerArr,
        goals,
        score,
        getChanceFn,
        aircraftFn,
      });

      expect(getChanceFn).toHaveBeenCalledWith(0.5);
      expect(aircraftFn).toHaveBeenCalledWith(0.123, 1, { time: 1080 });
    });
  });
});
