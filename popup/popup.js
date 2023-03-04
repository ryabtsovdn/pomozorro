const DEFAULT_INTERVAL = 25 * 60;

const taskContainer = document.getElementById("tasks");
const addTaskBtn = document.getElementById("add-task-btn");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const timeElement = document.getElementById("time");

let tasks;

const renderTask = (id) => {
  const taskObj = tasks[id];
  const taskElement = document.createElement("div");
  taskElement.classList.add("task");
  taskElement.id = id;

  const taskTitle = document.createElement("input");
  taskTitle.type = "text";
  taskTitle.name = "task-title";
  taskTitle.placeholder = "Enter a task name";
  taskTitle.value = taskObj.title;
  taskTitle.addEventListener("change", () => {
    taskObj.title = taskTitle.value;
    saveTasks();
  });

  const removeBtn = document.createElement("input");
  removeBtn.type = "button";
  removeBtn.name = "remove-btn";
  removeBtn.value = "X";
  removeBtn.addEventListener("click", () => {
    removeTask(id);
    saveTasks();
  });

  taskElement.append(taskTitle);
  taskElement.append(removeBtn);
  taskContainer.append(taskElement);
};

const addNewTask = () => {
  const id = crypto.randomUUID();
  tasks[id] = { id, title: "" };
  renderTask(id);
};

const removeTask = (id) => {
  const taskRow = document.getElementById(id);
  taskRow.remove();
  delete tasks[id];
};

const renderTasks = () => {
  Object.keys(tasks).forEach((id) => {
    renderTask(id);
  });
};

const saveTasks = () => {
  chrome.storage.sync.set({
    tasks,
  });
};

const updateStartBtnTitle = (isRunning) => {
  const nextAction = isRunning ? "Stop" : "Start";
  startBtn.textContent = `${nextAction} timer`;
};

const resetTimer = () => {
  chrome.storage.local.set(
    {
      timer: 0,
      isRunning: false,
    },
    () => {
      updateStartBtnTitle(false);
    }
  );
};

const getTimeLeft = (timePassed, initial = DEFAULT_INTERVAL) => {
  return initial - timePassed;
};

const formatTime = (value) => {
  const timeLeft = Number(value);

  if (timeLeft <= 0) {
    resetTimer();
    return;
  }

  const minutes = `0${Math.floor(timeLeft / 60)}`.slice(-2);
  const seconds = `0${timeLeft - minutes * 60}`.slice(-2);

  return `${minutes}:${seconds}`;
};

const updateTime = (value) => {
  timeElement.textContent = formatTime(getTimeLeft(value));
};

addTaskBtn.addEventListener("click", () => {
  addNewTask();
});

startBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], (res) => {
    chrome.storage.local.set(
      {
        isRunning: !res.isRunning,
      },
      () => {
        updateStartBtnTitle(!res.isRunning);
      }
    );
  });
});

resetBtn.addEventListener("click", () => {
  resetTimer();
});

chrome.storage.local.get(["timer", "isRunning"], (res) => {
  updateStartBtnTitle(res.isRunning);
  updateTime(res.timer);
});

chrome.storage.sync.get(["tasks"], (res) => {
  tasks = res.tasks ?? {};
  renderTasks();
});

chrome.storage.onChanged.addListener((changes) => {
  const { timer: { newValue, oldValue } = {} } = changes;

  if (newValue !== oldValue) {
    updateTime(newValue);
  }
});
