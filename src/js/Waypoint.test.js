import {
  describe,
  test,
  expect,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals';
import * as jestExtended from 'jest-extended';
import Waypoint from './Waypoint';
import Square from './Square';
import * as sound from './game/sound';

import { Direction, ScreenSizes } from './utils';
import { getWaypoint } from '../js/airports/LHR';
import { DestinationType } from './aircraft/airframe';
import { JSDOM } from 'jsdom';

expect.extend(jestExtended);

describe('Waypoint', () => {
  let entityLayerObj;
  let textLayerObj;
  let screenSize;
  let flightObj;

  const dom = new JSDOM();
  global.document = dom.window.document;

  beforeEach(() => {
    // eslint-disable-next-line no-global-assign
    Image = jest.fn(() => global.document.createElement('img'));
    jest.spyOn(sound, 'playLoop').mockImplementation(() => {});
    jest.spyOn(sound, 'play').mockImplementation(() => {});
    jest.spyOn(sound, 'stop').mockImplementation(() => {});
  });

  beforeEach(() => {
    entityLayerObj = { ctx: {} };
    textLayerObj = {
      ctx: {
        fillStyle: '',
        font: '',
        fillText: () => jest.fn(),
      },
    };
    screenSize = ScreenSizes.Large;
    flightObj = { flight: '' };
  });

  test('constructor', () => {
    const waypointObj = getWaypoint('LAM', screenSize);
    const waypoint = new Waypoint(
      'TEST',
      entityLayerObj,
      textLayerObj,
      screenSize,
      waypointObj
    );
    expect(waypoint.class).toBe('waypoint');
    expect(waypoint.type).toBe('arrival');
    expect(waypoint.westSideTurnDirection).toBe(Direction.Right);
    expect(waypoint.eastSideTurnDirection).toBe(Direction.Left);
  });

  describe('update', () => {
    let waypoint;
    let htmlDiv;
    let planeObj;
    let plane;
    let entityManagerArr;

    describe('Departure', () => {
      beforeEach(() => {
        const waypointObj = getWaypoint('BPK', screenSize);
        waypoint = new Waypoint(
          'TEST',
          entityLayerObj,
          textLayerObj,
          screenSize,
          waypointObj
        );

        htmlDiv = global.document.createElement('div');
        planeObj = {
          airframeObj: { images: { iconSize: 1 } },
          waypoint: 'TEST',
          destinationType: DestinationType.Departure,
        };
        const positionObj = {
          heading: '300',
          x: waypoint.x + 5,
          y: waypoint.y + 5,
          altitude: 6000,
        };
        plane = new Square(
          flightObj,
          entityLayerObj,
          textLayerObj,
          {},
          htmlDiv,
          positionObj,
          planeObj
        );
        plane.isHandoff = true;

        entityManagerArr = [plane];

        jest.spyOn(plane, 'setDistPrevHandoff');
        jest.spyOn(plane, 'setHeadingTarget');
        jest.spyOn(plane, 'setHandoff');
      });

      test('plane continuing passed waypoint', () => {
        plane.distPrevHandoff = 5;
        waypoint.update({ entityManagerArr });

        expect(plane.setHandoff).toHaveBeenCalledWith(false);
        expect(plane.setDistPrevHandoff).toHaveBeenNthCalledWith(1, Infinity);
        expect(plane.setDistPrevHandoff).toHaveBeenNthCalledWith(
          2,
          7.0710678118654755
        );
        expect(plane.setHeadingTarget).toHaveBeenNthCalledWith(
          1,
          plane.headingRad,
          false,
          false,
          Direction.None
        );

        expect(plane.setHandoff).toHaveBeenCalledBefore(
          plane.setDistPrevHandoff
        );
        expect(plane.setDistPrevHandoff).toHaveBeenCalledBefore(
          plane.setHeadingTarget
        );
      });

      test('plane heading towards waypoint', () => {
        plane.distPrevHandoff = 10;
        waypoint.update({ entityManagerArr });
        expect(plane.setHandoff).not.toHaveBeenCalled();
        expect(plane.setDistPrevHandoff).toHaveBeenCalledTimes(1);
        expect(plane.setHeadingTarget).toHaveBeenCalledWith(
          3.9269908169872414,
          false,
          false,
          Direction.None
        );

        expect(plane.setDistPrevHandoff).toHaveBeenCalledBefore(
          plane.setHeadingTarget
        );
      });
    });

    describe('Arrival', () => {
      beforeEach(() => {
        const waypointObj = getWaypoint('LAM', screenSize);
        waypoint = new Waypoint(
          'TEST',
          entityLayerObj,
          textLayerObj,
          screenSize,
          waypointObj
        );
        htmlDiv = global.document.createElement('div');
        planeObj = {
          airframeObj: { images: { iconSize: 1 } },
          waypoint: 'TEST',
          destinationType: DestinationType.Arrival,
        };
        const positionObj = {
          heading: '120',
          x: waypoint.x + 100,
          y: waypoint.y + 100,
          altitude: 6000,
        };
        plane = new Square(
          flightObj,
          entityLayerObj,
          textLayerObj,
          {},
          htmlDiv,
          positionObj,
          planeObj
        );
        plane.isHolding = true;
        entityManagerArr = [plane];
        jest.spyOn(plane, 'setDistPrevHolding');
        jest.spyOn(plane, 'setHeadingTarget');
        jest.spyOn(plane, 'setIsAtWaypoint');
      });

      afterEach(() => {
        expect(plane.setDistPrevHolding).toHaveBeenCalledBefore(
          plane.setHeadingTarget
        );
      });

      describe('plane is close', () => {
        test('SE of waypoint: Test all calls', () => {
          plane.x = waypoint.x + 5;
          plane.y = waypoint.y + 5;

          waypoint.update({ entityManagerArr });
          expect(plane.setIsAtWaypoint).toHaveBeenCalledWith(true);
          expect(plane.setDistPrevHolding).toHaveBeenNthCalledWith(
            1,
            7.0710678118654755
          );
          expect(plane.setHeadingTarget).toHaveBeenNthCalledWith(
            1,
            3.9269908169872414,
            false,
            true,
            Direction.Right
          );
        });

        test('SW of waypoint', () => {
          plane.x = waypoint.x - 5;
          plane.y = waypoint.y + 5;

          waypoint.update({ entityManagerArr });
          expect(plane.setHeadingTarget).toHaveBeenNthCalledWith(
            1,
            -0.7853981633974483,
            false,
            true,
            Direction.Left
          );
        });

        test('NW of waypoint', () => {
          plane.x = waypoint.x - 5;
          plane.y = waypoint.y - 5;

          waypoint.update({ entityManagerArr });
          expect(plane.setHeadingTarget).toHaveBeenNthCalledWith(
            1,
            0.7853981633974483,
            false,
            true,
            Direction.Left
          );
        });

        test('NE of waypoint', () => {
          plane.x = waypoint.x + 5;
          plane.y = waypoint.y - 5;

          waypoint.update({ entityManagerArr });
          expect(plane.setHeadingTarget).toHaveBeenNthCalledWith(
            1,
            2.356194490192345,
            false,
            true,
            Direction.Right
          );
        });
      });

      describe('plane heading towards waypoint', () => {
        test('test all calls', () => {
          waypoint.update({ entityManagerArr });
          expect(plane.setDistPrevHolding).toHaveBeenNthCalledWith(
            1,
            141.4213562373095
          );
          expect(plane.setHeadingTarget).toHaveBeenNthCalledWith(
            1,
            3.9269908169872414,
            false,
            true,
            Direction.None
          );
        });
      });

      describe('plane holding at waypoint', () => {
        test('test all calls', () => {
          plane.x = waypoint.x + 5;
          plane.y = waypoint.y + 5;
          plane.isAtWaypoint = true;

          waypoint.update({ entityManagerArr });
          expect(plane.setDistPrevHolding).toHaveBeenNthCalledWith(
            1,
            7.0710678118654755
          );
          expect(plane.setHeadingTarget).toHaveBeenNthCalledWith(
            1,
            3.9269908169872414,
            false,
            true,
            null
          );
        });
      });
    });
  });
});
