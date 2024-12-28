import { fillHtmlQueue } from '../game/gameEvents';
import { getLevelObj } from './getLevel';

export const showLevelIntro = (tutorialBox, cb) => {
  const {
    tutorialBoxTop,
    tutorialBoxLeft,
    tutorialBoxWidth,
    tutorialBoxHtmlQueue,
  } = tutorialBox;

  const obj = getLevelObj().introFn();

  if (obj.width) {
    fillHtmlQueue('<clear>', tutorialBoxHtmlQueue);
    setTimeout(() => {
      const levelStr = `LEVEL ${obj.levelNum}`;
      const dialogBox = { top: 0.2, left: 0.2, width: obj.width, html: '' };
      tutorialBoxTop.value = dialogBox.top;
      tutorialBoxLeft.value = dialogBox.left;
      tutorialBoxWidth.value = dialogBox.width;
      dialogBox.html =
        `<h2 class="green">${levelStr}</h2>` +
        `<h3 class="green">${obj.airportHeading}</h3>` +
        `<div class="line"><b>${obj.airportSubheading}</b></div>` +
        `<div class="text">${obj.text1}</div>`;
      fillHtmlQueue(dialogBox.html, tutorialBoxHtmlQueue);
    }, 1000);
  }

  setTimeout(() => {
    fillHtmlQueue('<clear>', tutorialBoxHtmlQueue);
    cb();
  }, obj.displayTimeMs || 0);
};

/**
 * @typedef {Object} IntroObj
 * @property {Number} displayTimeMs
 * @property {Number} width
 * @property {Number} levelNum
 * @property {String} airportHeading
 * @property {String} airportSubheading
 * @property {String} text1
 */

/**
 * @typedef {Function} IntroFunc
 * @returns {IntroObj}
 */

/**
 * @param {Number} gameLevel
 * @returns {IntroFunc}
 */
export const getIntro = (gameLevel) => {
  return () => {
    if (gameLevel === 1) {
      return {
        displayTimeMs: 20000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `London Heathrow (LHR)`,
        airportSubheading: `Westbound Operations - early morning, departures only`,
        text1:
          `Your first shift will be during morning operations on a low volume day. ` +
          `Just a walk in the park,&nbsp;<b>Controller</b>!`,
      };
    }

    if (gameLevel === 2) {
      return {
        displayTimeMs: 18000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `London Heathrow (LHR)`,
        airportSubheading: `Westbound Operations - early morning, mostly arrivals`,
        text1: `Another quiet day to get practice with arrival operations.`,
      };
    }

    if (gameLevel === 3) {
      return {
        displayTimeMs: 16000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `London Heathrow (LHR)`,
        airportSubheading: `Westbound Operations - weather: clear`,
        text1: `A healthy mix of departures and arrivals. No bad weather to avoid.`,
      };
    }

    if (gameLevel === 4) {
      return {
        displayTimeMs: 16000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `London Heathrow (LHR)`,
        airportSubheading: `Westbound Operations - weather: clear`,
        text1: `A very busy shift. Let's make use of our waypoint stacks and keep those runways busy.`,
      };
    }

    if (gameLevel === 5) {
      return {
        displayTimeMs: 16000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `London Heathrow (LHR)`,
        airportSubheading: `Westbound Operations - weather: moderate`,
        text1: `Some scattered weather, try to direct traffic around weather turbulence. Let's avoid customer complaints of bumpy rides.`,
      };
    }

    if (gameLevel === 6) {
      return {
        displayTimeMs: 16000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `London Heathrow (LHR)`,
        airportSubheading: `Westbound Operations - weather: heavy`,
        text1: `Many weather systems, but with some gaps of blue sky. Watch for wake turbulence when aircraft density increases.`,
      };
    }

    if (gameLevel === 7) {
      // return {
      //   displayTimeMs: 20000,
      //   width: 0.72,
      //   levelNum: gameLevel,
      //   airportHeading: `New York (JFK)`,
      //   airportSubheading: `Southbound Operations - early morning, departures only`,
      //   text1: `Welcome to New York! We have a quiet morning for you to get accustomed to the new flight ops,&nbsp;<b>Controller</b>.`,
      // };
      return {
        displayTimeMs: 1000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: ``,
        airportSubheading: ``,
        text1: ``,
      };
    }

    throw new Error('unknown level: ' + gameLevel);
  };
};
