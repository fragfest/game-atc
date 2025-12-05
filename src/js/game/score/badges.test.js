import {
  describe,
  beforeEach,
  test,
  jest,
  expect,
  afterEach,
} from '@jest/globals';
import {
  Badges,
  getBadgeLevelCompletedBlueSky,
  isNewAchievementBlueSky,
} from './badges';
import * as Score from './score';
import * as Victory from '../victory';

Score.setDebugUnitTests();

let badges = [];
global.localStorage = { getItem: jest.fn(() => JSON.stringify(badges)) };

describe('getBadgeLevelCompletedBlueSky', () => {
  afterEach(() => {
    badges = [];
  });

  describe('when BlueSky1 already in achieved badges', () => {
    test('should return badge level 1', () => {
      badges = [Badges.BlueSky1];
      expect(getBadgeLevelCompletedBlueSky()).toEqual(1);
    });
  });

  describe('when BlueSky2 already in achieved badges', () => {
    test('should return badge level 2', () => {
      badges = [Badges.BlueSky2];
      expect(getBadgeLevelCompletedBlueSky()).toEqual(2);
    });
  });

  describe('when BlueSky1, BlueSky2 already in achieved badges', () => {
    test('should return badge level 2', () => {
      badges = [Badges.BlueSky1, Badges.BlueSky2];
      expect(getBadgeLevelCompletedBlueSky()).toEqual(2);
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

    describe('when history has: all weather levels victory for badge level 1. wake=0, turbulence=0', () => {
      beforeEach(() => {
        victory = true;
      });
      test('should return badge level 1', () => {
        expect(getBadgeLevelCompletedBlueSky()).toEqual(1);
      });
    });

    describe('when history has: only one weather level victory. wake=0, turbulence=0', () => {
      beforeEach(() => {
        jest.spyOn(Victory, 'isVictory').mockImplementationOnce(() => false);
        jest.spyOn(Victory, 'isVictory').mockImplementationOnce(() => true);
      });
      test('should return null', () => {
        expect(getBadgeLevelCompletedBlueSky()).toBeNull();
      });
    });

    describe('when history has: all weather level victory. wake!=0, turbulence=0', () => {
      beforeEach(() => {
        victory = true;
        historyRecords[1].historyScore.wake = 0.1;
      });
      test('should return false', () => {
        expect(getBadgeLevelCompletedBlueSky()).toBeNull();
      });
    });

    describe('when history has: all weather level victory. wake=0, turbulence!=0', () => {
      beforeEach(() => {
        victory = true;
        historyRecords[1].historyScore.turbulence = 0.1;
      });
      test('should return false', () => {
        expect(getBadgeLevelCompletedBlueSky()).toBeNull();
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
      badges = [Badges.BlueSky2];
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
