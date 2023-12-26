import Square from '../Square';
import { ElapsedTimes } from './typesTutorial';

let event = '';
const Events = Object.freeze({
  WaitForInput0: 'WaitForInput0',
  WaitForInput1: 'WaitForInput1',
  WaitForInput2: 'WaitForInput2',
  WaitForInput3: 'WaitForInput3',
  WaitForInput4: 'WaitForInput4',
  WaitForSelected0: 'WaitForSelected0',
});

export const stageConflict = (
  state,
  elapsedTime,
  entityManagerArr,
  completeStageFn
) => {
  if (!event) {
    event = Events.WaitForInput0;
    state.dialogBox = { top: 0.07, left: 0.1, width: 0.43, html: '<clear>' };

    setTimeout(() => {
      const html =
        `<div class="line"><b>Conflict (TCAS) - Ensure spacing between planes</b><br></div>` +
        `<div class="line">When planes get too close, create spacing of 3 miles or 1000 feet.<br>` +
        `For this scenario the optional conflict circles are enabled.<br></div>` +
        `<div class="line"> <span hidden class="checkmark check-0">&check;</span> <span class="cross check-0">&times;</span> <span class="text">Use any commands to end the conflict</span></div>`;

      state.dialogBox = { top: 0.07, left: 0.5, width: 0.43, html };
    }, 1000);
  }

  const planes = entityManagerArr.filter((x) => x instanceof Square);
  const planesWithProximityAlert = planes.filter((x) => x.hasProximityAlert);
  const isConflictFree = planes.length >= 2 && !planesWithProximityAlert.length;
  const isCircleShowing = planes.find((x) => x.isShowCircle);

  if (
    elapsedTime > ElapsedTimes.ConflictFirstInputMs &&
    event === Events.WaitForInput0
  ) {
    event = Events.WaitForSelected0;
    const buttonEl = document.querySelector('#button-tcas-circle');
    if (!isCircleShowing) buttonEl.click();
  }

  if (isConflictFree && event === Events.WaitForSelected0) {
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
