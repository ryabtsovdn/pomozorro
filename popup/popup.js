const taskContainer = document.getElementById("tasks");
const addTaskBtn = document.getElementById("add-task-btn");

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

addTaskBtn.addEventListener("click", () => {
  addNewTask();
});

chrome.storage.sync.get(["tasks"], (res) => {
  tasks = res.tasks ?? {};
  renderTasks();
});
