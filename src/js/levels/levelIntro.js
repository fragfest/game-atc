import { fillHtmlQueue } from '../game/gameEvents';
import { getLevelObj } from './getLevel';

export const showLevelIntro = (msgPopup, cb) => {
  const { msgPopupTop, msgPopupLeft, msgPopupWidth, msgPopupHtmlQueue } =
    msgPopup;

  const obj = getLevelObj().introFn();

  if (obj.width) {
    fillHtmlQueue('<clear>', msgPopupHtmlQueue);
    setTimeout(() => {
      const levelStr = `LEVEL ${obj.levelNum}`;
      const dialogBox = { top: 0.2, left: 0.2, width: obj.width, html: '' };
      msgPopupTop.value = dialogBox.top;
      msgPopupLeft.value = dialogBox.left;
      msgPopupWidth.value = dialogBox.width;
      dialogBox.html =
        `<h2 class="green">${levelStr}</h2>` +
        `<h3 class="green">${obj.airportHeading}</h3>` +
        `<div class="line"><b>${obj.airportSubheading}</b></div>` +
        `<div class="text">${obj.text1}</div>`;
      fillHtmlQueue(dialogBox.html, msgPopupHtmlQueue);
    }, 1000);
  }

  setTimeout(() => {
    fillHtmlQueue('<clear>', msgPopupHtmlQueue);
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
      return {
        displayTimeMs: 20000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `New York International (JFK)`,
        airportSubheading: `Southbound Operations - quiet day, weather: clear`,
        text1: `Welcome to New York,&nbsp;<b>Controller</b>! We have a quiet shift for you to get accustomed to new flight operations.`,
      };
    }

    if (gameLevel === 8) {
      return {
        displayTimeMs: 16000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `New York International (JFK)`,
        airportSubheading: `Southbound Operations - weather: clear`,
        text1: `A typical busy day at JFK, at least the weather forecast is clear.`,
      };
    }

    // TODO introduce emergency here
    if (gameLevel === 9) {
      return {
        displayTimeMs: 16000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `New York International (JFK)`,
        airportSubheading: `Southbound Operations - weather: moderate`,
        text1: `Moderate weather has moved into the area. traffic will be reasonable as long as nothing unexpected happens.`,
      };
    }

    if (gameLevel === 10) {
      return {
        displayTimeMs: 16000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `New York International (JFK)`,
        airportSubheading: `Southbound Operations - weather: clear`,
        text1: `Delays at other airports have resulted in an incoming traffic spike. We trust in your abilities to manage the mayhem, good luck <b>Controller</b>.`,
      };
    }

    if (gameLevel === 11) {
      return {
        displayTimeMs: 16000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `New York International (JFK)`,
        airportSubheading: `Southbound Operations - weather: heavy`,
        text1: `A large weather system is present. Keeping pilots and passengers happy will be tricky`,
      };
    }

    // TODO remove below

    // return {
    //   displayTimeMs: 1000,
    //   width: 0.72,
    //   levelNum: gameLevel,
    //   airportHeading: ``,
    //   airportSubheading: ``,
    //   text1: ``,
    // };

    // if (gameLevel === 8) {
    //   return {
    //     displayTimeMs: 20000,
    //     width: 0.72,
    //     levelNum: gameLevel,
    //     airportHeading: `Tokyo Haneda (HND)`,
    //     airportSubheading: `South Wind Operations - quiet day, weather: clear`,
    //     text1: `Welcome to Tokyo,&nbsp;<b>Controller</b>! We have a quiet shift for you to get accustomed to new flight operations.`,
    //   };
    // }

    // if (gameLevel === 9) {
    //   return {
    //     displayTimeMs: 20000,
    //     width: 0.72,
    //     levelNum: gameLevel,
    //     airportHeading: `Amsterdam Schiphol (AMS)`,
    //     airportSubheading: `South Wind Operations - quiet day, weather: clear`,
    //     text1: `Welcome to Amsterdam,&nbsp;<b>Controller</b>! We have a quiet shift for you to get accustomed to new flight operations.`,
    //   };
    // }

    // if (gameLevel === 10) {
    //   return {
    //     displayTimeMs: 20000,
    //     width: 0.72,
    //     levelNum: gameLevel,
    //     airportHeading: `Vancouver International (YVR)`,
    //     airportSubheading: `West Wind Operations - quiet day, weather: clear`,
    //     text1: `Welcome to Vancouver,&nbsp;<b>Controller</b>! We have a quiet shift for you to get accustomed to new flight operations.`,
    //   };
    // }

    throw new Error('unknown level: ' + gameLevel);
  };
};
