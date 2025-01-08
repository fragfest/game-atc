import { describe, beforeEach, test, expect } from '@jest/globals';
import { getHeadingToEntity } from './entity';
import { degreesToRad } from './utils';

const hdg = (deg) => degreesToRad(deg);

describe('entity', () => {
  describe('getHeadingToEntity', () => {
    let entitySrc;
    let entityDest;

    describe('when entityDest in NE direction', () => {
      beforeEach(() => {
        entitySrc = { x: 0, y: 0 };
        entityDest = { x: 100, y: -100 };
      });
      test('should return 45deg', () => {
        expect(getHeadingToEntity(entitySrc)(entityDest)).toEqual(hdg(45));
      });
    });

    describe('when entityDest in SE direction', () => {
      beforeEach(() => {
        entitySrc = { x: 0, y: 0 };
        entityDest = { x: 100, y: 100 };
      });
      test('should return 135deg', () => {
        expect(getHeadingToEntity(entitySrc)(entityDest)).toEqual(hdg(135));
      });
    });

    describe('when entityDest in SW direction', () => {
      beforeEach(() => {
        entitySrc = { x: 0, y: 0 };
        entityDest = { x: -100, y: 100 };
      });
      test('should return 225deg', () => {
        expect(getHeadingToEntity(entitySrc)(entityDest)).toEqual(hdg(225));
      });
    });

    describe('when entityDest in NW direction', () => {
      beforeEach(() => {
        entitySrc = { x: 0, y: 0 };
        entityDest = { x: -100, y: -100 };
      });
      test('should return 315deg', () => {
        expect(getHeadingToEntity(entitySrc)(entityDest)).toEqual(hdg(315));
      });
    });
  });
});
