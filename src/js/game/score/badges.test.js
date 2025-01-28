import {
  describe,
  beforeEach,
  test,
  jest,
  expect,
  afterEach,
} from '@jest/globals';
import { Badges, isAchievedBlueSky, isNewAchievementBlueSky } from './badges';
import * as Score from './score';
import * as Victory from '../victory';

Score.setDebugUnitTests();

let badges = [];
global.localStorage = { getItem: jest.fn(() => JSON.stringify(badges)) };

describe('isAchievedBlueSky', () => {
  afterEach(() => {
    badges = [];
  });

  describe('when BlueSky already in achieved badges', () => {
    test('should return true', () => {
      badges = [Badges.BlueSky];
      expect(isAchievedBlueSky()).toBeTruthy();
    });
  });

  describe('when BlueSky not in achieved badges', () => {
    let historyRecords;
    let victory;

    beforeEach(() => {
      badges = [];
      historyRecords = [
        {
          level: 5,
          historyScore: { turbulence: 0, wake: 0 },
        },
        {
          level: 6,
          historyScore: { turbulence: 0, wake: 0 },
        },
      ];
      jest
        .spyOn(Score, 'getHistoryRecords')
        .mockImplementation(() => historyRecords);
      jest.spyOn(Victory, 'isVictory').mockImplementation(() => victory);
    });

    describe('when history has: all weather levels victory. wake=0, turbulence=0', () => {
      beforeEach(() => {
        victory = true;
      });
      test('should return true', () => {
        expect(isAchievedBlueSky()).toBeTruthy();
      });
    });

    describe('when history has: one weather level victory. wake=0, turbulence=0', () => {
      beforeEach(() => {
        jest.spyOn(Victory, 'isVictory').mockImplementationOnce(() => false);
        jest.spyOn(Victory, 'isVictory').mockImplementationOnce(() => true);
      });
      test('should return false', () => {
        expect(isAchievedBlueSky()).toBeFalsy();
      });
    });

    describe('when history has: all weather level victory. wake!=0, turbulence=0', () => {
      beforeEach(() => {
        victory = true;
        historyRecords[1].historyScore.wake = 0.1;
      });
      test('should return false', () => {
        expect(isAchievedBlueSky()).toBeFalsy();
      });
    });

    describe('when history has: all weather level victory. wake=0, turbulence!=0', () => {
      beforeEach(() => {
        victory = true;
        historyRecords[1].historyScore.turbulence = 0.1;
      });
      test('should return false', () => {
        expect(isAchievedBlueSky()).toBeFalsy();
      });
    });
  });
});

describe('isNewAchievementBlueSky', () => {
  let historyRecords;

  beforeEach(() => {
    badges = [];
    historyRecords = [
      {
        level: 5,
        historyScore: { turbulence: 0, wake: 0 },
      },
      {
        level: 6,
        historyScore: { turbulence: 0, wake: 0 },
      },
    ];
    jest
      .spyOn(Score, 'getHistoryRecords')
      .mockImplementation(() => historyRecords);
    jest.spyOn(Victory, 'isVictory').mockImplementation(() => true);
  });

  describe('when BlueSky already in achieved badges, history conditions not met', () => {
    beforeEach(() => {
      badges = [Badges.BlueSky];
      historyRecords[0].historyScore.wake = 0.1;
    });
    test('should return false', () => {
      expect(isNewAchievementBlueSky()).toBeFalsy();
    });
  });

  describe('when BlueSky not in achieved badges, history conditions met', () => {
    test('should return true', () => {
      expect(isNewAchievementBlueSky()).toBeTruthy();
    });
  });
});
