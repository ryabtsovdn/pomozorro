const DEFAULT_INTERVAL = 25 * 60;

chrome.alarms.create("timerSec", {
  periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "timerSec") {
    chrome.storage.local.get(["timer", "isRunning"], (res) => {
      if (res.isRunning) {
        const timer = res.timer + 1;

        if (timer === DEFAULT_INTERVAL) {
          this.registration.showNotification("PomoZorro", {
            body: "Pomodoro timer is over!",
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

chrome.storage.local.get(["timer", "isRunning"], (res) => {
  chrome.storage.local.set({
    timer: res.timer ?? 0,
    isRunning: res.isRunning ?? false,
  });
});
