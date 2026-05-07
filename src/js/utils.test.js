import { describe, beforeEach, test, expect } from '@jest/globals';
import {
  mergeSortKeys,
  convertToPosRad,
  createInterceptHeading,
  degreesToRad,
  isHeadingWithinArc,
} from './utils';

const hdg = (deg) => convertToPosRad(degreesToRad(deg));

describe('utils', () => {
  describe('mergeSortKeys', () => {
    let arr = [];
    let arrNew = [];
    let arrResult = [];

    describe('when merge arr START is within source arr, and merge arr end is PAST source arr ', () => {
      beforeEach(() => {
        arr = [
          { 'score#badges#userId': '00005000#010#user-id-0' },
          { 'score#badges#userId': '00004000#010#user-id-1' },
          { 'score#badges#userId': '00003000#010#user-id-player' },
          { 'score#badges#userId': '00002800#000#user-id-2' },
          { 'score#badges#userId': '00001000#000#user-id-player' },
        ];

        arrNew = [
          { 'score#badges#userId': '00003000#010#user-id-player' },
          { 'score#badges#userId': '00002800#000#user-id-2' },
          { 'score#badges#userId': '00001000#000#user-id-player' },
          { 'score#badges#userId': '00000800#000#user-id-3' },
          { 'score#badges#userId': '00000600#000#user-id-4' },
        ];

        arrResult = [
          { 'score#badges#userId': '00005000#010#user-id-0' },
          { 'score#badges#userId': '00004000#010#user-id-1' },
          { 'score#badges#userId': '00003000#010#user-id-player' },
          { 'score#badges#userId': '00002800#000#user-id-2' },
          { 'score#badges#userId': '00001000#000#user-id-player' },
          { 'score#badges#userId': '00000800#000#user-id-3' },
          { 'score#badges#userId': '00000600#000#user-id-4' },
        ];
      });
      test('then returns new larger arr grows with duplicates removed', () => {
        expect(mergeSortKeys(arr, arrNew)).toEqual(arrResult);
      });
    });

    describe('when merge arr START is within source arr, and merge arr end is WITHIN source arr ', () => {
      beforeEach(() => {
        arr = [
          { 'score#badges#userId': '00005000#010#user-id-0' },
          { 'score#badges#userId': '00004000#010#user-id-1' },
          { 'score#badges#userId': '00003000#010#user-id-player' },
          { 'score#badges#userId': '00002800#000#user-id-2' },
          { 'score#badges#userId': '00001000#000#user-id-player' },
        ];

        arrNew = [
          { 'score#badges#userId': '00004000#010#user-id-1' },
          { 'score#badges#userId': '00003000#010#user-id-player' },
          { 'score#badges#userId': '00002800#000#user-id-2' },
        ];
      });
      test('then returns new arr the same as source arr', () => {
        expect(mergeSortKeys(arr, arrNew)).toEqual(arr);
      });
    });
  });

  describe('createInterceptHeading', () => {
    let src = { x: 0, y: 0 };
    let dest = { x: 0, y: 0 };

    describe('when source is SE from destination', () => {
      beforeEach(() => {
        src = { x: 150, y: 150 };
        dest = { x: 100, y: 100 };
      });
      test('then intercept heading should return 315', () => {
        expect(createInterceptHeading(src, dest)).toEqual(hdg(315));
      });
    });

    describe('when source is NE from destination', () => {
      beforeEach(() => {
        src = { x: 150, y: 50 };
        dest = { x: 100, y: 100 };
      });
      test('then intercept heading should return 225', () => {
        expect(createInterceptHeading(src, dest)).toEqual(hdg(225));
      });
    });

    describe('when source is NW from destination', () => {
      beforeEach(() => {
        src = { x: 50, y: 50 };
        dest = { x: 100, y: 100 };
      });
      test('then intercept heading should return 135', () => {
        expect(createInterceptHeading(src, dest)).toEqual(hdg(135));
      });
    });

    describe('when source is SW from destination', () => {
      beforeEach(() => {
        src = { x: 50, y: 150 };
        dest = { x: 100, y: 100 };
      });
      test('then intercept heading should return 45', () => {
        expect(createInterceptHeading(src, dest)).toEqual(hdg(45));
      });
    });
  });

  describe('isHeadingWithinArc', () => {
    let hdg = 0;
    let arcCentre = 0;
    let arc = 0;

    describe('when arc angle 15deg', () => {
      beforeEach(() => {
        arc = 15;
      });

      describe('when arc centre in NE (45deg)', () => {
        beforeEach(() => {
          arcCentre = degreesToRad(45);
        });

        describe('then heading 31', () => {
          beforeEach(() => {
            hdg = degreesToRad(31);
          });
          test('should return true', () => {
            expect(isHeadingWithinArc(hdg, arcCentre, arc)).toBeTruthy();
          });
        });
        describe('then heading 59', () => {
          beforeEach(() => {
            hdg = degreesToRad(59);
          });
          test('should return true', () => {
            expect(isHeadingWithinArc(hdg, arcCentre, arc)).toBeTruthy();
          });
        });

        describe('then heading 61', () => {
          beforeEach(() => {
            hdg = degreesToRad(61);
          });
          test('should return false', () => {
            expect(isHeadingWithinArc(hdg, arcCentre, arc)).toBeFalsy();
          });
        });
        describe('then heading 225', () => {
          beforeEach(() => {
            hdg = degreesToRad(225);
          });
          test('should return false', () => {
            expect(isHeadingWithinArc(hdg, arcCentre, arc)).toBeFalsy();
          });
        });
      });

      describe('when arc centre in SE (135deg)', () => {
        beforeEach(() => {
          arcCentre = degreesToRad(135);
        });

        describe('then heading 130', () => {
          beforeEach(() => {
            hdg = degreesToRad(130);
          });
          test('should return true', () => {
            expect(isHeadingWithinArc(hdg, arcCentre, arc)).toBeTruthy();
          });
        });
        describe('then heading 150', () => {
          beforeEach(() => {
            hdg = degreesToRad(150);
          });
          test('should return true', () => {
            expect(isHeadingWithinArc(hdg, arcCentre, arc)).toBeTruthy();
          });
        });

        describe('then heading 180', () => {
          beforeEach(() => {
            hdg = Math.PI / 2; // 180deg
          });
          test('should return false', () => {
            expect(isHeadingWithinArc(hdg, arcCentre, arc)).toBeFalsy();
          });
        });
        describe('then heading 001', () => {
          beforeEach(() => {
            hdg = degreesToRad(1);
          });
          test('should return false', () => {
            expect(isHeadingWithinArc(hdg, arcCentre, arc)).toBeFalsy();
          });
        });
      });

      describe('when arc centre in SW (240deg)', () => {
        beforeEach(() => {
          arcCentre = degreesToRad(240);
        });

        describe('then heading 239', () => {
          beforeEach(() => {
            hdg = degreesToRad(239);
          });
          test('should return true', () => {
            expect(isHeadingWithinArc(hdg, arcCentre, arc)).toBeTruthy();
          });
        });
        describe('then heading 241', () => {
          beforeEach(() => {
            hdg = degreesToRad(241);
          });
          test('should return true', () => {
            expect(isHeadingWithinArc(hdg, arcCentre, arc)).toBeTruthy();
          });
        });

        describe('then heading 224', () => {
          beforeEach(() => {
            hdg = degreesToRad(224);
          });
          test('should return false', () => {
            expect(isHeadingWithinArc(hdg, arcCentre, arc)).toBeFalsy();
          });
        });
        describe('then heading 059', () => {
          beforeEach(() => {
            hdg = degreesToRad(59);
          });
          test('should return false', () => {
            expect(isHeadingWithinArc(hdg, arcCentre, arc)).toBeFalsy();
          });
        });
      });

      describe('when arc centre in NW (300deg)', () => {
        beforeEach(() => {
          arcCentre = degreesToRad(300);
        });

        describe('then heading 286', () => {
          beforeEach(() => {
            hdg = degreesToRad(286);
          });
          test('should return true', () => {
            expect(isHeadingWithinArc(hdg, arcCentre, arc)).toBeTruthy();
          });
        });
        describe('then heading 315', () => {
          beforeEach(() => {
            hdg = degreesToRad(315);
          });
          test('should return true', () => {
            expect(isHeadingWithinArc(hdg, arcCentre, arc)).toBeTruthy();
          });
        });

        describe('then heading 090', () => {
          beforeEach(() => {
            hdg = degreesToRad(90);
          });
          test('should return false', () => {
            expect(isHeadingWithinArc(hdg, arcCentre, arc)).toBeFalsy();
          });
        });
        describe('then heading 120', () => {
          beforeEach(() => {
            hdg = degreesToRad(120);
          });
          test('should return false', () => {
            expect(isHeadingWithinArc(hdg, arcCentre, arc)).toBeFalsy();
          });
        });
      });

      describe('when arc centre 005deg', () => {
        beforeEach(() => {
          arcCentre = degreesToRad(5);
        });

        describe('then heading 360', () => {
          beforeEach(() => {
            hdg = degreesToRad(360);
          });
          test('should return true', () => {
            expect(isHeadingWithinArc(hdg, arcCentre, arc)).toBeTruthy();
          });
        });
      });

      describe('when arc centre 90deg', () => {
        beforeEach(() => {
          arcCentre = degreesToRad(90);
        });

        describe('then heading 85', () => {
          beforeEach(() => {
            hdg = degreesToRad(85);
          });
          test('should return true', () => {
            expect(isHeadingWithinArc(hdg, arcCentre, arc)).toBeTruthy();
          });
        });
      });
    });
  });
});
