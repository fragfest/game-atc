import Aircraft from '../aircraft/Aircraft';
import { ElapsedTimes } from './utilsTutorial';

let event = '';
const Events = Object.freeze({
  WaitForInput0: 'WaitForInput0',
  WaitForSelected0: 'WaitForSelected0',
});

export const stageConflict = (
  state,
  elapsedTime,
  entityManagerArr,
  completeStageFn
) => {
  const planes = entityManagerArr.filter((x) => x instanceof Aircraft);
  const planesWithProximityAlert = planes.filter((x) => x.hasProximityAlert);
  const isConflictFree = planes.length >= 2 && !planesWithProximityAlert.length;
  const isCircleShowing = planes.find((x) => x.isShowCircle);

  if (!event) {
    event = Events.WaitForInput0;
    state.dialogBox = { top: 0.07, left: 0.1, width: 0.48, html: '<clear>' };

    setTimeout(() => {
      const html =
        `<div class="line"><b>Conflict (TCAS) - Ensure spacing between planes</b><br></div>` +
        `<div class="line">When planes get too close, create spacing of 3 miles or 1000 feet.<br>` +
        `For this scenario the conflict circles button has been toggled.<br></div>` +
        `<div class="line"> <span hidden class="checkmark check-0">&check;</span> <span class="cross check-0">&times;</span> <span class="text">Use any commands to end the conflict</span></div>`;

      state.dialogBox = { top: 0.04, left: 0.45, width: 0.52, html };
    }, 1000);

    setTimeout(() => {
      const buttonEl = document.querySelector('#button-tcas-circle');
      if (!isCircleShowing) buttonEl.click();
    }, 2000);
  }

  if (
    elapsedTime > ElapsedTimes.ConflictFirstInputMs &&
    event === Events.WaitForInput0
  ) {
    event = Events.WaitForSelected0;
  }

  if (isConflictFree && event === Events.WaitForSelected0) {
    event = '';
    completeStageFn();
  }

  if (isConflictFree) {
    document.querySelector('.checkmark.check-0')?.removeAttribute('hidden');
    document.querySelector('.cross.check-0')?.setAttribute('hidden', true);
  } else {
    document.querySelector('.checkmark.check-0')?.setAttribute('hidden', true);
    document.querySelector('.cross.check-0')?.removeAttribute('hidden');
  }
};
