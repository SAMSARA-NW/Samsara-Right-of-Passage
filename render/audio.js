(function () {

  const AUDIO_KEY = "samsara_audio_state";
  const TIME_KEY  = "samsara_audio_time";

  let audio = document.getElementById("samsara-audio");

  if (!audio) return;

  audio.loop = true;
  audio.volume = 0.35;

  // Restore playback state
  const shouldPlay = localStorage.getItem(AUDIO_KEY) === "playing";
  const savedTime  = parseFloat(localStorage.getItem(TIME_KEY));

  if (!isNaN(savedTime)) {
    audio.currentTime = savedTime;
  }

  if (shouldPlay) {
    audio.play().catch(() => {});
  }

  // Save time continuously
  setInterval(() => {
    if (!audio.paused) {
      localStorage.setItem(TIME_KEY, audio.currentTime);
    }
  }, 1000);

  // Persist state
  audio.addEventListener("play", () => {
    localStorage.setItem(AUDIO_KEY, "playing");
  });

  audio.addEventListener("pause", () => {
    localStorage.setItem(AUDIO_KEY, "paused");
  });

})();
