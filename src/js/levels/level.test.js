import { describe, beforeEach, test, jest, expect } from '@jest/globals';
import { level1, level2, level3 } from './level1-3.js';
import * as types from '../types';
import * as utils from '../utils';

describe('Level', () => {
  let entityManagerArr, goals, score;
  let GetSpawnChance, SpawnPlane;

  describe('level 1 & 2', () => {
    beforeEach(() => {
      jest.spyOn(types, 'isSquare').mockImplementation(() => true);
      entityManagerArr = [];
      goals = { Arrivals: 1, Departures: 1 };
      GetSpawnChance = jest.fn(() => 0.123);
      SpawnPlane = jest.fn(() => true);
    });

    test('level 1 spawn more', () => {
      score = { arrivals: 0, departures: 0 };
      const ret = level1(
        entityManagerArr,
        goals,
        score,
        GetSpawnChance,
        SpawnPlane
      );

      expect(ret).toBe(true);
      expect(GetSpawnChance).toHaveBeenCalledWith(0.1);
      expect(SpawnPlane).toHaveBeenCalledWith(0.123, 1, { time: 600 });
    });

    test('level 1 spawn complete', () => {
      score = { arrivals: 1, departures: 1 };
      const ret = level1(
        entityManagerArr,
        goals,
        score,
        GetSpawnChance,
        SpawnPlane
      );

      expect(ret).toBeFalsy();
      expect(GetSpawnChance).not.toHaveBeenCalled();
      expect(SpawnPlane).not.toHaveBeenCalled();
    });

    test('level 2 spawn more', () => {
      score = { arrivals: 0, departures: 0 };
      const ret = level2(
        entityManagerArr,
        goals,
        score,
        GetSpawnChance,
        SpawnPlane
      );

      expect(ret).toBe(true);
      expect(GetSpawnChance).toHaveBeenCalledWith(0.03);
      expect(SpawnPlane).toHaveBeenCalledWith(0.123, 0, { time: 900 });
    });

    test('level 2 spawn complete', () => {
      score = { arrivals: 1, departures: 1 };
      const ret = level2(
        entityManagerArr,
        goals,
        score,
        GetSpawnChance,
        SpawnPlane
      );

      expect(ret).toBeFalsy();
      expect(GetSpawnChance).not.toHaveBeenCalled();
      expect(SpawnPlane).not.toHaveBeenCalled();
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
      GetSpawnChance = jest.fn(() => 0.123);
      SpawnPlane = jest.fn(() => true);
    });

    test('spawn complete', () => {
      score = { arrivals: 8, departures: 8 };
      const ret = level3(
        entityManagerArr,
        goals,
        score,
        GetSpawnChance,
        SpawnPlane
      );

      expect(ret).toBeFalsy();
    });

    test('lowCount spawn departure', () => {
      jest.spyOn(utils, 'getDepartureCount').mockImplementation(() => 1);
      score = { arrivals: 2, departures: 1 };
      const ret = level3(
        entityManagerArr,
        goals,
        score,
        GetSpawnChance,
        SpawnPlane
      );

      expect(ret).toBe(true);
      expect(GetSpawnChance).toHaveBeenCalledWith(0.5);
      expect(SpawnPlane).toHaveBeenCalledWith(0.123, 1, { time: 900 });
    });

    test('lowCount spawn arrival', () => {
      jest.spyOn(utils, 'getArrivalCount').mockImplementation(() => 1);
      score = { arrivals: 1, departures: 2 };
      const ret = level3(
        entityManagerArr,
        goals,
        score,
        GetSpawnChance,
        SpawnPlane
      );

      expect(ret).toBe(true);
      expect(GetSpawnChance).toHaveBeenCalledWith(0.5);
      expect(SpawnPlane).toHaveBeenCalledWith(0.123, 0, { time: 900 });
    });

    test('not lowCount spawn random', () => {
      const arrLarge = [...entityManagerArr];
      arrLarge.push({ destinationType: types.DestinationType.Departure });
      jest.spyOn(utils, 'getArrivalCount').mockImplementation(() => 2);
      jest.spyOn(utils, 'getDepartureCount').mockImplementation(() => 3);
      score = { arrivals: 2, departures: 3 };
      const ret = level3(arrLarge, goals, score, GetSpawnChance, SpawnPlane);

      expect(ret).toBe(true);
      expect(GetSpawnChance).toHaveBeenCalledWith(0.03);
      expect(SpawnPlane).toHaveBeenCalledWith(0.123, 0.4, { time: 900 });
    });

    test('when all departures done, spawn arrivals', () => {
      score = { arrivals: 1, departures: 8 };
      const ret = level3(
        entityManagerArr,
        goals,
        score,
        GetSpawnChance,
        SpawnPlane
      );

      expect(ret).toBe(true);
      expect(GetSpawnChance).toHaveBeenCalledWith(0.5);
      expect(SpawnPlane).toHaveBeenCalledWith(0.123, 0, { time: 900 });
    });

    test('when all arrivals done, spawn departures', () => {
      score = { arrivals: 8, departures: 1 };
      const ret = level3(
        entityManagerArr,
        goals,
        score,
        GetSpawnChance,
        SpawnPlane
      );

      expect(ret).toBe(true);
      expect(GetSpawnChance).toHaveBeenCalledWith(0.5);
      expect(SpawnPlane).toHaveBeenCalledWith(0.123, 1, { time: 900 });
    });
  });
});
