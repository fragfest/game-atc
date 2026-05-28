import { fillHtmlQueue } from './gameEvents';
import { getScore } from './score/score';
import { isFailedCondition, isConflictCondition, isDelayed } from './victory';

/**
 * @param {Object} msgPopup contains vue ref properties
 * @param {Boolean} isSuccess
 */
export const gameOver = (msgPopup, isSuccess) => {
  if (isSuccess) return;

  const { msgPopupTop, msgPopupLeft, msgPopupWidth, msgPopupHtmlQueue } =
    msgPopup;

  const score = getScore();
  const isFailed = isFailedCondition(score.level, score.failed);
  const isConflict = isConflictCondition(score.level, score.conflict);
  const isDelayedFail = isDelayed(score.level, score.delayed);

  let title = 'Failure';
  let crossText = 'Exceeded minimum conditions';
  if (isFailed) {
    title = 'Handoff/Landing deviations excessive';
    crossText = 'Failed handoffs/landings';
  } else if (isConflict) {
    title = 'Traffic minimums exceeded';
    crossText = 'Conflict (seconds)';
  } else if (isDelayedFail) {
    title = 'Flight delays excessive';
    crossText = 'Delays';
  }

  fillHtmlQueue('<clear>', msgPopupHtmlQueue);

  setTimeout(() => {
    const dialogBox = { top: 0.1, left: 0.1, width: 0.6, html: '' };
    msgPopupTop.value = dialogBox.top;
    msgPopupLeft.value = dialogBox.left;
    msgPopupWidth.value = dialogBox.width;
    dialogBox.html =
      `<b>${title}</b><br><br>` +
      `You are relieved of duty, <b>Controller</b>! Another controller will take over.` +
      `<div class="line"></div>` +
      `<div class="line"><span class="cross">&times;</span> <span class="text"><b>${crossText}</b></span></div>`;

    fillHtmlQueue(dialogBox.html, msgPopupHtmlQueue);
  }, 1000);
};
