import { describe, beforeEach, test, jest, expect } from '@jest/globals';
import {
  Badges,
  BadgesTypes,
  getBadgeLevelCompleted,
  isNewAchievement,
} from './badges';
import * as Score from './score';
import * as Victory from '../victory';

Score.setDebugUnitTests();

describe('getBadgeLevelCompleted', () => {
  let badges = [];
  let historyRecords = [];
  let victory;

  beforeEach(() => {
    badges = [];
    global.localStorage = { getItem: jest.fn(() => JSON.stringify(badges)) };

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

  describe('BlueSky', () => {
    beforeEach(() => {
      badges = [];
    });

    describe('when BlueSky1 already in achieved badges', () => {
      test('should return badge level 1', () => {
        badges = [Badges.BlueSky1];
        expect(getBadgeLevelCompleted(BadgesTypes.BlueSky)).toEqual(1);
      });
    });

    describe('when BlueSky2 already in achieved badges', () => {
      test('should return badge level 2', () => {
        badges = [Badges.BlueSky2];
        expect(getBadgeLevelCompleted(BadgesTypes.BlueSky)).toEqual(2);
      });
    });

    describe('when BlueSky1, BlueSky2 already in achieved badges', () => {
      test('should return badge level 2', () => {
        badges = [Badges.BlueSky1, Badges.BlueSky2];
        expect(getBadgeLevelCompleted(BadgesTypes.BlueSky)).toEqual(2);
      });
    });

    describe('when BlueSky in achieved badges and historyRecords populated', () => {
      describe('when BlueSky not in achieved badges history', () => {
        describe('when history has: weather level 1 victory. wake=0, turbulence=0', () => {
          beforeEach(() => {
            victory = true;
          });
          test('should return badge level 1', () => {
            expect(getBadgeLevelCompleted(BadgesTypes.BlueSky)).toEqual(1);
          });
        });

        describe('when history has: weather level 1 fail. wake=0, turbulence=0', () => {
          beforeEach(() => {
            jest
              .spyOn(Victory, 'isVictory')
              .mockImplementationOnce(() => false);
          });
          test('should return null', () => {
            expect(getBadgeLevelCompleted(BadgesTypes.BlueSky)).toBeNull();
          });
        });

        describe('when history has: weather level 1 victory. wake!=0, turbulence=0', () => {
          beforeEach(() => {
            victory = true;
            historyRecords[0].historyScore.wake = 0.1;
          });
          test('should return false', () => {
            expect(getBadgeLevelCompleted(BadgesTypes.BlueSky)).toBeNull();
          });
        });

        describe('when history has: weather level 1 victory. wake=0, turbulence!=0', () => {
          beforeEach(() => {
            victory = true;
            historyRecords[0].historyScore.turbulence = 0.1;
          });
          test('should return false', () => {
            expect(getBadgeLevelCompleted(BadgesTypes.BlueSky)).toBeNull();
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
            expect(getBadgeLevelCompleted(BadgesTypes.BlueSky)).toEqual(2);
          });
        });
      });
    });
  });
  describe('PushingTin', () => {
    beforeEach(() => {
      historyRecords = [
        {
          level: 3,
          historyScore: { idle: 0 },
        },
      ];

      jest
        .spyOn(Score, 'getHistoryRecords')
        .mockImplementation(() => historyRecords);
      jest.spyOn(Victory, 'isVictory').mockImplementation(() => victory);
    });

    describe('when PushingTin1 already in achieved badges', () => {
      test('should return badge level 1', () => {
        badges = [Badges.PushingTin1];
        expect(getBadgeLevelCompleted(BadgesTypes.PushingTin)).toEqual(1);
      });
    });

    describe('when PushingTin2 already in achieved badges', () => {
      test('should return badge level 2', () => {
        badges = [Badges.PushingTin2];
        expect(getBadgeLevelCompleted(BadgesTypes.PushingTin)).toEqual(2);
      });
    });

    describe('when PushingTin1, PushingTin2 already in achieved badges', () => {
      test('should return badge level 2', () => {
        badges = [Badges.PushingTin1, Badges.PushingTin2];
        expect(getBadgeLevelCompleted(BadgesTypes.PushingTin)).toEqual(2);
      });
    });

    describe('when PushingTin in achieved badges and historyRecords populated', () => {
      let historyRecords;
      let victory;

      beforeEach(() => {
        badges = [];
        historyRecords = [
          {
            level: 4,
            historyScore: { idle: 0, delayed: 0 },
          },
        ];

        jest
          .spyOn(Score, 'getHistoryRecords')
          .mockImplementation(() => historyRecords);
        jest.spyOn(Victory, 'isVictory').mockImplementation(() => victory);
      });

      describe('when PushingTin not in achieved badges history', () => {
        describe('when history has: idle level 1 victory. idle=0', () => {
          beforeEach(() => {
            victory = true;
          });
          test('should return badge level 1', () => {
            expect(getBadgeLevelCompleted(BadgesTypes.PushingTin)).toEqual(1);
          });
        });

        describe('when history has: idle level 1 fail. idle=1', () => {
          beforeEach(() => {
            historyRecords = [
              {
                level: 4,
                historyScore: { idle: 1 },
              },
            ];

            jest
              .spyOn(Victory, 'isVictory')
              .mockImplementationOnce(() => false);
          });
          test('should return null', () => {
            expect(getBadgeLevelCompleted(BadgesTypes.PushingTin)).toBeNull();
          });
        });

        describe('when history has: idle level 1 victory. idle=2', () => {
          beforeEach(() => {
            victory = true;
            historyRecords[0].historyScore.idle = 2;
          });
          test('should return false', () => {
            expect(getBadgeLevelCompleted(BadgesTypes.PushingTin)).toBeNull();
          });
        });
      });

      describe('when PushingTin level 1 in achieved badges history', () => {
        beforeEach(() => {
          victory = true;
          badges = [Badges.PushingTin1];
        });

        describe('history has level 2 victory', () => {
          beforeEach(() => {
            historyRecords = [
              {
                level: 4,
                historyScore: { idle: 0, delayed: 0 },
              },
              {
                level: 5,
                historyScore: { idle: 0, delayed: 0 },
              },
              {
                level: 6,
                historyScore: { idle: 0, delayed: 0 },
              },
            ];
            jest
              .spyOn(Score, 'getHistoryRecords')
              .mockImplementation(() => historyRecords);
            jest.spyOn(Victory, 'isVictory').mockImplementation(() => victory);
          });

          test('should return 2', () => {
            expect(getBadgeLevelCompleted(BadgesTypes.PushingTin)).toEqual(2);
          });
        });
      });
    });
  });
});

describe('isNewAchievement', () => {
  let badges = [];
  let historyRecords;
  describe('BlueSky', () => {
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

      global.localStorage = { getItem: jest.fn(() => JSON.stringify(badges)) };
    });

    describe('when BlueSky1 in achieved badges; BlueSky2 history condition failed', () => {
      beforeEach(() => {
        badges = [Badges.BlueSky1];
        historyRecords[0].historyScore.wake = 0.1;
        historyRecords[2].historyScore.turbulence = 0.1;
      });
      test('should return false', () => {
        expect(isNewAchievement(BadgesTypes.BlueSky)).toBeFalsy();
      });
    });

    describe('when badges empty; BlueSky1 history condition passed', () => {
      beforeEach(() => {
        badges = [];
      });
      test('should return true', () => {
        expect(isNewAchievement(BadgesTypes.BlueSky)).toBeTruthy();
      });
    });
  });

  describe('PushingTin', () => {
    beforeEach(() => {
      badges = [];
      historyRecords = [
        {
          level: 3,
          historyScore: { idle: 0, delayed: 0 },
        },
        {
          level: 4,
          historyScore: { idle: 0, delayed: 0 },
        },
      ];
      jest
        .spyOn(Score, 'getHistoryRecords')
        .mockImplementation(() => historyRecords);
      jest.spyOn(Victory, 'isVictory').mockImplementation(() => true);

      global.localStorage = { getItem: jest.fn(() => JSON.stringify(badges)) };
    });

    describe('when PushingTin1 in achieved badges; PushingTin2 history condition failed', () => {
      beforeEach(() => {
        badges = [Badges.PushingTin1];
        historyRecords[1].historyScore.idle = 1;
      });
      test('should return false', () => {
        expect(isNewAchievement(BadgesTypes.PushingTin)).toBeFalsy();
      });
    });

    describe('when badges empty; PushingTin1 history condition passed', () => {
      beforeEach(() => {
        badges = [];
        historyRecords[0].historyScore.idle = 1;
      });
      test('should return true', () => {
        expect(isNewAchievement(BadgesTypes.PushingTin)).toBeTruthy();
      });
    });
  });
});
