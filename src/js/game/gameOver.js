import { fillHtmlQueue } from './gameEvents';
import { getScore } from './score';
import {
  isFailedCondition,
  isConflictCondition,
  isExceededTaxiingCondition,
} from './victory';

/**
 * @param {Object} tutorialBox contains vue ref properties
 * @param {Boolean} isSuccess
 */
export const gameOver = (tutorialBox, isSuccess) => {
  if (isSuccess) return;

  const {
    tutorialBoxTop,
    tutorialBoxLeft,
    tutorialBoxWidth,
    tutorialBoxHtmlQueue,
  } = tutorialBox;

  const score = getScore();
  const isFailed = isFailedCondition(score.failed);
  const isConflict = isConflictCondition(score.conflict);
  const isTaxiFail = isExceededTaxiingCondition(score.taxiQueue);

  let title = 'Failure';
  let crossText = 'Exceeded minimum conditions';
  if (isFailed) {
    title = 'Handoff/Landing deviations excessive';
    crossText = 'Failed handoffs/landings';
  }
  if (isConflict) {
    title = 'Collision minimums exceeded';
    crossText = 'Conflict (seconds)';
  }
  if (isTaxiFail) {
    title = 'Takeoff queue excessive';
    crossText = 'Delays (taxiing slots)';
  }

  let html = '<clear>';
  const dialogBox = { top: 0.1, left: 0.1, width: 0.45, html };
  tutorialBoxTop.value = dialogBox.top;
  tutorialBoxLeft.value = dialogBox.left;
  tutorialBoxWidth.value = dialogBox.width;
  fillHtmlQueue(dialogBox.html, tutorialBoxHtmlQueue);

  setTimeout(() => {
    dialogBox.html =
      `<b>${title}</b><br><br>` +
      `You are relieved of duty, <b>Controller</b>! Another controller will take over.` +
      `<div class="line"></div>` +
      `<div class="line"><span class="cross">&times;</span> <span class="text"><b>${crossText}</b></span></div>`;
    fillHtmlQueue(dialogBox.html, tutorialBoxHtmlQueue);
  }, 1000);
};
