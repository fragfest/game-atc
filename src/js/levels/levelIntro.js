import { fillHtmlQueue } from '../game/gameEvents';
import { getLevelObj } from './getLevel';

/**
 * @param {Object} msgPopup Object with vue refs of the popup window
 * @param {Object} argOut
 * @param {Function} argOut.cancel when called, cancels window
 * @param {Function} doneCB called when popup display complete
 */
export const showLevelIntro = (msgPopup, argOut, doneCB) => {
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

  let isShowLevel = true;
  let isFirstCancel = true;

  const timeoutId = setTimeout(() => {
    isShowLevel = false;
    fillHtmlQueue('<clear>', msgPopupHtmlQueue);
    doneCB();
  }, obj.displayTimeMs || 0);

  argOut.cancel = () => {
    if (isFirstCancel) {
      isFirstCancel = false;
      return;
    }
    if (!isShowLevel) return;
    if (!timeoutId) return;

    isShowLevel = false;
    clearTimeout(timeoutId);
    setTimeout(() => {
      fillHtmlQueue('<clear>', msgPopupHtmlQueue);
    }, 1000);
    setTimeout(() => doneCB(), 4000);
  };
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

const debugSkipIntro = false;

/**
 * @param {Number} gameLevel
 * @returns {IntroFunc}
 */
export const getIntro = (gameLevel) => {
  return () => {
    if (debugSkipIntro) {
      return {
        displayTimeMs: 1000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: ``,
        airportSubheading: ``,
        text1: ``,
      };
    }

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
        airportSubheading: `Southbound Operations - weather: clear`,
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
        text1: `A large weather system is approaching the airport. let's get arrivals and departures completed as soon as possible.`,
      };
    }

    if (gameLevel === 12) {
      return {
        displayTimeMs: 20000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `Tokyo Haneda (HND)`,
        airportSubheading: `South Wind Operations - weather: clear`,
        text1: `Welcome to Tokyo,&nbsp;<b>Controller</b>! We have a quiet shift for you to get accustomed to new flight operations.`,
      };
    }

    if (gameLevel === 13) {
      return {
        displayTimeMs: 16000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `Tokyo Haneda (HND)`,
        airportSubheading: `South Wind Operations - weather: clear`,
        text1: `Let's keep those runways busy and our customers happy.`,
      };
    }

    if (gameLevel === 14) {
      return {
        displayTimeMs: 16000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `Tokyo Haneda (HND)`,
        airportSubheading: `South Wind Operations - weather: moderate`,
        text1: `Some scattered weather. Avoid turbulence so we can give our customers a smooth ride.`,
      };
    }

    if (gameLevel === 15) {
      return {
        displayTimeMs: 16000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `Tokyo Haneda (HND)`,
        airportSubheading: `South Wind Operations - weather: clear`,
        text1: `A quiet unremarkable day orchestrating a typical sky over the Greater Tokyo Area.`,
      };
    }

    if (gameLevel === 16) {
      return {
        displayTimeMs: 16000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `Tokyo Haneda (HND)`,
        airportSubheading: `South Wind Operations - weather: severe`,
        text1: `We have lingering turbulent weather from the last typhoon. If possible, navigate around all the remaining pockets of weather.`,
      };
    }

    if (gameLevel === 17) {
      return {
        displayTimeMs: 20000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `Amsterdam Schiphol (AMS)`,
        airportSubheading: `Southbound Operations - weather: clear`,
        text1: `Welcome to Amsterdam,&nbsp;<b>Controller</b>! We have a quiet shift for you to get accustomed to new flight operations.`,
      };
    }

    if (gameLevel === 18) {
      return {
        displayTimeMs: 16000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `Amsterdam Schiphol (AMS)`,
        airportSubheading: `Southbound Operations - weather: clear`,
        text1: `Let's keep those runways busy and our customers happy.`,
      };
    }

    if (gameLevel === 19) {
      return {
        displayTimeMs: 16000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `Amsterdam Schiphol (AMS)`,
        airportSubheading: `Southbound Operations - weather: clear`,
        text1: `Delays across Europe are leading to high numbers of arrivals. We heard you're the best don't let us down, <b>Controller</b>!`,
      };
    }

    if (gameLevel === 20) {
      return {
        displayTimeMs: 16000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `Amsterdam Schiphol (AMS)`,
        airportSubheading: `Southbound Operations - weather: minor`,
        text1: `Just need to avoid a small weather cell moving through the area. Some light bird activity near the runways, unlikely to cause problems.`,
      };
    }

    if (gameLevel === 21) {
      return {
        displayTimeMs: 16000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `Amsterdam Schiphol (AMS)`,
        airportSubheading: `Southbound Operations - weather: clear`,
        text1: `With your magic touch, <b>Controller</b>, we hope to improve our on-time percentage and keep our demanding customers satisfied.`,
      };
    }

    if (gameLevel === 22) {
      return {
        displayTimeMs: 20000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `Vancouver International (YVR)`,
        airportSubheading: `West Wind Operations - weather: clear`,
        text1: `Welcome to Vancouver,&nbsp;<b>Controller</b>! We have a quiet shift for you to get accustomed to new flight operations.`,
      };
    }

    if (gameLevel === 23) {
      return {
        displayTimeMs: 16000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `Vancouver International (YVR)`,
        airportSubheading: `West Wind Operations - weather: clear`,
        text1: `Busy runways with short delays help keep our paying airline and passenger customers content.`,
      };
    }

    if (gameLevel === 24) {
      return {
        displayTimeMs: 16000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `Vancouver International (YVR)`,
        airportSubheading: `West Wind Operations - weather: minor`,
        text1: `Only some light rain is moving through the area.`,
      };
    }

    if (gameLevel === 25) {
      return {
        displayTimeMs: 16000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `Vancouver International (YVR)`,
        airportSubheading: `West Wind Operations - weather: minor`,
        text1: `Another day taming the maelstrom, including long-haul fuel-hungry cross-pacific flights.`,
      };
    }

    if (gameLevel === 26) {
      return {
        displayTimeMs: 16000,
        width: 0.72,
        levelNum: gameLevel,
        airportHeading: `Vancouver International (YVR)`,
        airportSubheading: `West Wind Operations - weather: severe`,
        text1: `Typical rainy day in the pacific northwest. We have to contend with many scattered storm cells.`,
      };
    }

    throw new Error('unknown level: ' + gameLevel);
  };
};
