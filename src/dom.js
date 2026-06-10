const selectors = {
  landing: '#landing',
  arRoot: '#arRoot',
  hud: '#hud',
  orientationPrompt: '#orientationPrompt',
  startButton: '#startButton',
  bootStatus: '#bootStatus',
  bootSequence: '#bootSequence',
  bootProgress: '#bootProgress',
  runnerProgress: '#runnerProgress',
  bootRunner: '#bootRunner',
  bootStepText: '#bootStepText',
  npcSprite: '#npcSprite',
  npcMood: '#npcMood',
  npcMessage: '#npcMessage',
  trackingBadge: '#trackingBadge',
  activeTitle: '#activeTitle',
  activeSummary: '#activeSummary',
  storyCard: '#storyCard',
  storyKicker: '#storyKicker',
  storyTitle: '#storyTitle',
  storyText: '#storyText',
  infoButton: '#infoButton',
  glowButton: '#glowButton',
  hotspotButton: '#hotspotButton',
  photoButton: '#photoButton',
  calibrationButton: '#calibrationButton',
  resetButton: '#resetButton',
  infoPanel: '#infoPanel',
  closeInfoButton: '#closeInfoButton',
  calibrationPanel: '#calibrationPanel',
  calibrationFields: '#calibrationFields',
  posterModal: '#posterModal',
  posterPreview: '#posterPreview',
  downloadPoster: '#downloadPoster',
  closePosterButton: '#closePosterButton',
  posterCanvas: '#posterCanvas'
};

export function getElements() {
  return Object.fromEntries(
    Object.entries(selectors).map(([key, selector]) => [key, document.querySelector(selector)])
  );
}
