export const MaydayScenario = Object.freeze({
  Level9Fire: 'Level9Fire',
});

export const getMaydayLevels = () => [9];

export const getMaydayInfo = (scenario) => {
  if (scenario === MaydayScenario.Level9Fire) {
    return {
      title: 'engine fire',
      action: 'land immediately',
      detail1: 'unable to gain altitude',
      detail2: 'flight controls degraded',
      progressTitle: 'flight control quality',
    };
  }

  return {
    title: 'EMERGENCY',
    action: 'land now',
    detail1: '',
    detail2: '',
    progressTitle: '',
  };
};
// TODO
// performance modifiers
