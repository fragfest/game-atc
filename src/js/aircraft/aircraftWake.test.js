import { describe, beforeEach, test, jest, expect } from '@jest/globals';
import { JSDOM } from 'jsdom';
import { calcWake } from './aircraftWake';
import Aircraft from './Aircraft';
import { DestinationType } from '../types';
import { WakeRating } from './airframe';

const testPlane = ({ x, y, altitude, heading }) => {
  const flightObj = { flight: '' };
  const entityLayerObj = { ctx: {} };
  const textLayerObj = {
    ctx: {
      fillStyle: '',
      font: '',
      fillText: () => jest.fn(),
    },
  };
  const htmlDiv = global.document.createElement('div');
  const positionObj = {
    heading,
    x,
    y,
    altitude,
  };
  const planeObj = {
    airframeObj: { images: { iconSize: 1 }, wake: WakeRating.M },
    destinationType: DestinationType.Arrival,
  };

  return new Aircraft(
    flightObj,
    entityLayerObj,
    textLayerObj,
    htmlDiv,
    positionObj,
    planeObj
  );
};

describe('calcWake', () => {
  const dom = new JSDOM();
  global.document = dom.window.document;
  let aircraft;

  beforeEach(() => {
    // eslint-disable-next-line no-global-assign
    Image = jest.fn(() => global.document.createElement('img'));
  });

  describe('when source plane at constant alt', () => {
    beforeEach(() => {
      aircraft = testPlane({ x: 0, y: 0, altitude: 3000, heading: '360' });
      aircraft.trailPixelArr = [
        { x: 0, y: 0, alt: 3000 },
        { x: 0, y: 5, alt: 3000 },
        { x: 0, y: 10, alt: 3000 },
        { x: 0, y: 15, alt: 3000 },
        { x: 0, y: 20, alt: 3000 },
        { x: 0, y: 25, alt: 3000 },
      ];
    });

    describe('when 1 plane in wake is: close, high', () => {
      let entityManagerArr;
      let wakePlane;
      beforeEach(() => {
        wakePlane = testPlane({ x: 0, y: 15, altitude: 2900, heading: '360' });
        entityManagerArr = [wakePlane];
      });
      test('should return duplicate of plane for each trailPixel point', () => {
        const retArr = calcWake({ entityManagerArr, aircraft });
        expect(retArr).toHaveLength(3);
        expect(retArr[0].strength).toEqual(2);
        expect(retArr[1].strength).toEqual(1.55);
        expect(retArr[2].strength).toEqual(1.1);
      });
    });

    describe('when 1 plane in wake is: close, low', () => {
      let entityManagerArr;
      let wakePlane;
      beforeEach(() => {
        wakePlane = testPlane({ x: 0, y: 5, altitude: 2600, heading: '360' });
        entityManagerArr = [wakePlane];
      });
      test('should return 0 planes', () => {
        const retArr = calcWake({ entityManagerArr, aircraft });
        expect(retArr).toHaveLength(0);
      });
    });

    describe('when 1 plane in wake is: far, high', () => {
      let entityManagerArr;
      let wakePlane;
      beforeEach(() => {
        wakePlane = testPlane({ x: 15, y: 30, altitude: 2900, heading: '090' });
        entityManagerArr = [wakePlane];
      });
      test('should return one plane at last trailPixel point', () => {
        const retArr = calcWake({ entityManagerArr, aircraft });
        expect(retArr).toHaveLength(1);
        expect(retArr[0].strength).toEqual(1.1);
      });
    });

    describe('when 1 plane in wake is: far, low', () => {
      let entityManagerArr;
      let wakePlane;
      beforeEach(() => {
        wakePlane = testPlane({ x: 15, y: 30, altitude: 2500, heading: '180' });
        entityManagerArr = [wakePlane];
      });
      test('should return one plane at last trailPixel point', () => {
        const retArr = calcWake({ entityManagerArr, aircraft });
        expect(retArr).toHaveLength(1);
        expect(retArr[0].strength).toEqual(1.1);
      });
    });

    describe('when 1 plane in wake, 1 plane outside', () => {
      let entityManagerArr;
      let wakePlane;
      let planeOutside;
      beforeEach(() => {
        wakePlane = testPlane({ x: 0, y: 15, altitude: 2900, heading: '360' });
        planeOutside = testPlane({
          x: 15,
          y: 15,
          altitude: 2900,
          heading: '090',
        });
        entityManagerArr = [wakePlane, planeOutside];
      });
      test('should return duplicate of 1 plane for each trailPixel point', () => {
        const retArr = calcWake({ entityManagerArr, aircraft });
        expect(retArr).toHaveLength(3);
        expect(retArr[0].plane.id).toEqual(wakePlane.id);
        expect(retArr[0].strength).toEqual(2);
        expect(retArr[1].plane.id).toEqual(wakePlane.id);
        expect(retArr[1].strength).toEqual(1.55);
        expect(retArr[2].plane.id).toEqual(wakePlane.id);
        expect(retArr[2].strength).toEqual(1.1);
      });
    });

    describe('when 2 planes in wake, 1 close & 1 far', () => {
      let entityManagerArr;
      let wakePlane0;
      let wakePlane1;
      beforeEach(() => {
        wakePlane0 = testPlane({ x: 0, y: 15, altitude: 2900, heading: '360' });
        wakePlane1 = testPlane({
          x: 15,
          y: 30,
          altitude: 2900,
          heading: '270',
        });
        entityManagerArr = [wakePlane0, wakePlane1];
      });
      test('should return duplicate of 2 planes for each trailPixel point', () => {
        const retArr = calcWake({ entityManagerArr, aircraft });
        expect(retArr).toHaveLength(4);
        expect(retArr[0].plane.id).toEqual(wakePlane0.id);
        expect(retArr[0].strength).toEqual(2);
        expect(retArr[1].plane.id).toEqual(wakePlane0.id);
        expect(retArr[1].strength).toEqual(1.55);
        expect(retArr[2].plane.id).toEqual(wakePlane0.id);
        expect(retArr[2].strength).toEqual(1.1);
        expect(retArr[3].plane.id).toEqual(wakePlane1.id);
        expect(retArr[3].strength).toEqual(1.1);
      });
    });

    describe('when source plane has larger airframe than wake plane', () => {
      let entityManagerArr;
      let wakePlane;
      beforeEach(() => {
        wakePlane = testPlane({ x: 15, y: 30, altitude: 2500, heading: '360' });
        aircraft.wake = WakeRating.J;
        entityManagerArr = [wakePlane];
      });
      test('should return stronger wake', () => {
        const retArr = calcWake({ entityManagerArr, aircraft });
        expect(retArr).toHaveLength(1);
        expect(retArr[0].strength).toEqual(3.3);
      });
    });
  });

  describe('when source plane ascending', () => {
    beforeEach(() => {
      aircraft = testPlane({ x: 0, y: 0, altitude: 3000, heading: '360' });
      aircraft.trailPixelArr = [
        { x: 0, y: 0, alt: 3000 },
        { x: 0, y: 5, alt: 3000 },
        { x: 0, y: 10, alt: 2950 },
        { x: 0, y: 15, alt: 2900 },
        { x: 0, y: 20, alt: 2850 },
        { x: 0, y: 25, alt: 2800 },
      ];
    });

    describe('wake plane below final source alt but above trail wake alt', () => {
      let entityManagerArr;
      let wakePlane;
      beforeEach(() => {
        wakePlane = testPlane({ x: 0, y: 30, altitude: 2900, heading: '090' });
        entityManagerArr = [wakePlane];
      });
      test('should return 0 wake planes', () => {
        const retArr = calcWake({ entityManagerArr, aircraft });
        expect(retArr).toHaveLength(0);
      });
    });

    describe('wake plane below final source alt but just below trail wake alt', () => {
      let entityManagerArr;
      let wakePlane;
      beforeEach(() => {
        wakePlane = testPlane({ x: 0, y: 30, altitude: 2700, heading: '090' });
        entityManagerArr = [wakePlane];
      });
      test('should return 1 wake plane', () => {
        const retArr = calcWake({ entityManagerArr, aircraft });
        expect(retArr).toHaveLength(1);
        expect(retArr[0].strength).toEqual(1.1);
      });
    });
  });

  describe('when source plane descending', () => {
    beforeEach(() => {
      aircraft = testPlane({ x: 0, y: 0, altitude: 3000, heading: '360' });
      aircraft.trailPixelArr = [
        { x: 0, y: 0, alt: 3000 },
        { x: 0, y: 5, alt: 3000 },
        { x: 0, y: 10, alt: 3050 },
        { x: 0, y: 15, alt: 3100 },
        { x: 0, y: 20, alt: 3150 },
        { x: 0, y: 25, alt: 3200 },
      ];
    });

    describe('wake plane below final source alt but above trail wake alt', () => {
      let entityManagerArr;
      let wakePlane;
      beforeEach(() => {
        wakePlane = testPlane({ x: 0, y: 30, altitude: 3300, heading: '090' });
        entityManagerArr = [wakePlane];
      });
      test('should return 0 wake planes', () => {
        const retArr = calcWake({ entityManagerArr, aircraft });
        expect(retArr).toHaveLength(0);
      });
    });

    describe('wake plane below final source alt but just below trail wake alt', () => {
      let entityManagerArr;
      let wakePlane;
      beforeEach(() => {
        wakePlane = testPlane({ x: 0, y: 30, altitude: 3100, heading: '090' });
        entityManagerArr = [wakePlane];
      });
      test('should return 1 wake plane', () => {
        const retArr = calcWake({ entityManagerArr, aircraft });
        expect(retArr).toHaveLength(1);
        expect(retArr[0].strength).toEqual(1.1);
      });
    });
  });
});
