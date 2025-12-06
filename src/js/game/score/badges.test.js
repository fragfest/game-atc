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

  describe('when BlueSky in achieved badges and historyRecords populated', () => {
    let historyRecords;
    let victory;

    beforeEach(() => {
      badges = [];
      historyRecords = [
        {
          level: 5,
          historyScore: { turbulence: 0, wake: 0 },
        },
      ];
      jest
        .spyOn(Score, 'getHistoryRecords')
        .mockImplementation(() => historyRecords);
      jest.spyOn(Victory, 'isVictory').mockImplementation(() => victory);
    });

    describe('when BlueSky not in achieved badges history', () => {
      describe('when history has: weather level 1 victory. wake=0, turbulence=0', () => {
        beforeEach(() => {
          victory = true;
        });
        test('should return badge level 1', () => {
          expect(getBadgeLevelCompletedBlueSky()).toEqual(1);
        });
      });

      describe('when history has: weather level 1 fail. wake=0, turbulence=0', () => {
        beforeEach(() => {
          jest.spyOn(Victory, 'isVictory').mockImplementationOnce(() => false);
        });
        test('should return null', () => {
          expect(getBadgeLevelCompletedBlueSky()).toBeNull();
        });
      });

      describe('when history has: weather level 1 victory. wake!=0, turbulence=0', () => {
        beforeEach(() => {
          victory = true;
          historyRecords[0].historyScore.wake = 0.1;
        });
        test('should return false', () => {
          expect(getBadgeLevelCompletedBlueSky()).toBeNull();
        });
      });

      describe('when history has: weather level 1 victory. wake=0, turbulence!=0', () => {
        beforeEach(() => {
          victory = true;
          historyRecords[0].historyScore.turbulence = 0.1;
        });
        test('should return false', () => {
          expect(getBadgeLevelCompletedBlueSky()).toBeNull();
        });
      });
    });

    describe('when BlueSky level 1 in achieved badges history', () => {
      beforeEach(() => {
        victory = true;
        badges = [Badges.BlueSky1];
      });

      describe('history has level 2 victory', () => {
        beforeEach(() => {
          historyRecords = [
            {
              level: 6,
              historyScore: { turbulence: 0, wake: 0 },
            },
            {
              level: 9,
              historyScore: { turbulence: 0, wake: 0 },
            },
            {
              level: 11,
              historyScore: { turbulence: 0, wake: 0 },
            },
            {
              level: 14,
              historyScore: { turbulence: 0, wake: 0 },
            },
          ];
          jest
            .spyOn(Score, 'getHistoryRecords')
            .mockImplementation(() => historyRecords);
          jest.spyOn(Victory, 'isVictory').mockImplementation(() => victory);
        });

        test('should return 2', () => {
          expect(getBadgeLevelCompletedBlueSky()).toEqual(2);
        });
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
      {
        level: 9,
        historyScore: { turbulence: 0, wake: 0 },
      },
      {
        level: 11,
        historyScore: { turbulence: 0, wake: 0 },
      },
    ];
    jest
      .spyOn(Score, 'getHistoryRecords')
      .mockImplementation(() => historyRecords);
    jest.spyOn(Victory, 'isVictory').mockImplementation(() => true);
  });

  describe('when BlueSky1 in achieved badges; BlueSky2 history condition failed', () => {
    beforeEach(() => {
      badges = [Badges.BlueSky1];
      historyRecords[0].historyScore.wake = 0.1;
    });
    test('should return false', () => {
      expect(isNewAchievementBlueSky()).toBeFalsy();
    });
  });

  describe('when badges empty; BlueSky2 history condition passed', () => {
    beforeEach(() => {
      badges = [];
    });
    test('should return true', () => {
      expect(isNewAchievementBlueSky()).toBeTruthy();
    });
  });
});
