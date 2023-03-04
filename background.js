const DEFAULT_INTERVAL = 25;

chrome.alarms.create("timerSec", {
  periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "timerSec") {
    chrome.storage.local.get(["timer", "isRunning", "options"], (res) => {
      const {
        isRunning,
        options: { interval },
      } = res;

      if (isRunning) {
        const timer = res.timer + 1;

        if (timer === interval * 60) {
          this.registration.showNotification("PomoZorro", {
            body: `Pomodoro timer (${options.interval} min) is over!`,
            icon: "icon.png",
          });
        }

        chrome.storage.local.set({
          timer,
        });
      }
    });
  }
});

chrome.storage.local.get(["timer", "isRunning", "options"], (res) => {
  const { timer, isRunning, options } = res;

  chrome.storage.local.set({
    timer: timer ?? 0,
    isRunning: isRunning ?? false,
    options: {
      defaultInterval: options?.defaultInterval ?? DEFAULT_INTERVAL,
      interval: options?.interval || DEFAULT_INTERVAL,
    },
  });
});
