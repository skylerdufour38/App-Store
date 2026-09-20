const soundConfigs = {
  mammal: { frequency: 180, type: 'triangle', duration: 1.2 },
  bird: { frequency: 980, type: 'sine', duration: 0.9 },
  insect: { frequency: 1250, type: 'square', duration: 0.8 }
};

const playSound = (key) => {
  const config = soundConfigs[key];
  if (!config) return;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  const audioContext = new AudioContextClass();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = config.type;
  oscillator.frequency.value = config.frequency;
  gainNode.gain.value = 0.04;

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + config.duration);
  setTimeout(() => audioContext.close(), config.duration * 1000 + 100);
};

const playButtons = document.querySelectorAll('.play-btn');

playButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const { sound } = button.dataset;
    playSound(sound);

    const originalLabel = button.textContent;
    button.textContent = 'Playing...';
    button.disabled = true;

    setTimeout(() => {
      button.textContent = originalLabel;
      button.disabled = false;
    }, 750);
  });
});
