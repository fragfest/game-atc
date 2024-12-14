import { fillHtmlQueue } from '../game/gameEvents';
import { getScore } from '../game/score/score';

export const showLevelIntro = (tutorialBox, cb) => {
  const {
    tutorialBoxTop,
    tutorialBoxLeft,
    tutorialBoxWidth,
    tutorialBoxHtmlQueue,
  } = tutorialBox;

  const level = getScore().level;
  const levelStr = `LEVEL ${level}`;
  const obj = getLevelObj(level);

  if (obj.width) {
    fillHtmlQueue('<clear>', tutorialBoxHtmlQueue);
    setTimeout(() => {
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

// PRIVATE ////////////////////////////////////////////////

const getLevelObj = (level) => {
  if (level === 1) {
    return {
      displayTimeMs: 20000,
      width: 0.72,
      airportHeading: `London Heathrow (LHR)`,
      airportSubheading: `Westbound Operations - early morning, departures only`,
      text1:
        `Your first shift will be during morning operations on a low volume day. ` +
        `Just a walk in the park,&nbsp;<b>Controller</b>!`,
    };
  }
  if (level === 2) {
    return {
      displayTimeMs: 18000,
      width: 0.72,
      airportHeading: `London Heathrow (LHR)`,
      airportSubheading: `Westbound Operations - early morning, mostly arrivals`,
      text1: `Another quiet day to get practice with arrival operations.`,
    };
  }
  if (level === 3) {
    return {
      displayTimeMs: 16000,
      width: 0.72,
      airportHeading: `London Heathrow (LHR)`,
      airportSubheading: `Westbound Operations - weather: clear`,
      text1: `A healthy mix of departures and arrivals. No bad weather to avoid.`,
    };
  }
  if (level === 4) {
    return {
      displayTimeMs: 16000,
      width: 0.72,
      airportHeading: `London Heathrow (LHR)`,
      airportSubheading: `Westbound Operations - weather: clear`,
      text1: `A very busy shift. Let's make use of our waypoint stacks and keep those runways busy.`,
    };
  }
  if (level === 5) {
    return {
      displayTimeMs: 16000,
      width: 0.72,
      airportHeading: `London Heathrow (LHR)`,
      airportSubheading: `Westbound Operations - weather: moderate`,
      text1: `Some scattered weather, try to direct traffic around weather turbulence. Let's avoid customer complaints of bumpy rides.`,
    };
  }
  if (level === 6) {
    return {
      displayTimeMs: 16000,
      width: 0.72,
      airportHeading: `London Heathrow (LHR)`,
      airportSubheading: `Westbound Operations - weather: heavy`,
      text1: `Many weather systems, but with some gaps of blue sky. Watch for wake turbulence when aircraft density increases.`,
    };
  }

  if (level === 7) {
    return {
      // displayTimeMs: 20000,
      displayTimeMs: 1000,
      width: 0.72,
      // airportHeading: `NEW NEW NEW (XXX)`,
      airportHeading: ``,
      // airportSubheading: `NEW Operations - early morning, departures only`,
      airportSubheading: ``,
      // text1: `Welcome to new airport NEW NEW NEW! We have a quiet morning for you to get accustomed to the new map.`,
      text1: ``,
    };
  }

  return {};
};
