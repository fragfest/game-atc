import { describe, beforeEach, test, expect } from '@jest/globals';
import { degreesToRad, isHeadingWithinArc } from './utils';

describe('util', () => {
  describe('isAngleWithinArc', () => {
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
    });
  });
});
