const MIN_INTERVAL = 1;
const MAX_INTERVAL = 60;

const timerIntervalInput = document.getElementById("timer-interval");
const saveBtn = document.getElementById("save-options-btn");

timerIntervalInput.addEventListener("change", (event) => {
  const { value } = event.target;

  chrome.storage.local.get(["options"], (res) => {
    if (value < MIN_INTERVAL || value > MAX_INTERVAL) {
      timerIntervalInput.value = res.options.defaultInterval;
    }
  });
});

saveBtn.addEventListener("click", () => {
  const options = {
    interval: timerIntervalInput.value,
  };

  chrome.storage.local.get(["options"], (res) => {
    chrome.storage.local.set({
      timer: 0,
      isRunning: false,
      options: {
        ...res.options,
        ...options,
      },
    });
  });
});

chrome.storage.local.get(["options"], (res) => {
  timerIntervalInput.value = res.options.interval;
});
