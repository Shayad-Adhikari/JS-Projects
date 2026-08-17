let tasks = [];
let editingId = null;

/* Load Tasks */

function loadData() {
  const saved = localStorage.getItem("shayadTasks");

  if (saved) {
    tasks = JSON.parse(saved);
  } else {
    tasks = [];
  }

  updateGreeting();
  renderTasks();
}

/* Greeting */

function updateGreeting() {
  const hour = new Date().getHours();

  let greet = "Good Morning";

  if (hour >= 12 && hour < 18) {
    greet = "Good Afternoon";
  } else if (hour >= 18) {
    greet = "Good Evening";
  }

  document.getElementById(
    "greeting"
  ).textContent = `${greet}, Shayad`;
}

/* Save Tasks */

function saveData() {
  localStorage.setItem(
    "shayadTasks",
    JSON.stringify(tasks)
  );
}

/* Render Tasks */

function renderTasks(filteredTasks = null) {
  const currentTasks =
    filteredTasks !== null ? filteredTasks : tasks;

  const onHold = currentTasks.filter(
    (task) => !task.completed
  );

  const completed = currentTasks.filter(
    (task) => task.completed
  );

  /* On Hold */

  document.getElementById("onHoldTasks").innerHTML =
    onHold.length
      ? onHold
          .map(
            (task) => `
              <div class="task-item">

                <div
                  class="task-checkbox"
                  onclick="toggleTask(${task.id})"
                ></div>

                <div class="task-content">
                  <div class="task-title">
                    ${task.title}
                  </div>
                </div>

                <span class="status-badge status-${task.status}">
                  ${
                    task.status === "progress"
                      ? "In Progress"
                      : task.status.charAt(0).toUpperCase() +
                        task.status.slice(1)
                  }
                </span>

                <div class="priority-badge priority-${task.priority}">
                  <i class="fas fa-circle"></i>

                  ${
                    task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1)
                  }
                </div>

                <button
                  class="icon-btn small-btn"
                  onclick="editTask(${task.id})"
                >
                  <i class="fas fa-pen"></i>
                </button>

                <button
                  class="icon-btn small-btn"
                  onclick="deleteTask(${task.id})"
                >
                  <i class="fas fa-trash"></i>
                </button>

              </div>
            `
          )
          .join("")
      : '<p class="empty-message">No tasks on hold</p>';

  /* Completed */

  document.getElementById("completedTasks").innerHTML =
    completed.length
      ? completed
          .map(
            (task) => `
              <div class="task-item">

                <div
                  class="task-checkbox completed"
                  onclick="toggleTask(${task.id})"
                ></div>

                <div class="task-content">
                  <div class="task-title completed">
                    ${task.title}
                  </div>
                </div>

                <span class="status-badge status-completed">
                  Completed
                </span>

                <div class="priority-badge priority-${task.priority}">
                  <i class="fas fa-circle"></i>

                  ${
                    task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1)
                  }
                </div>

                <button
                  class="icon-btn small-btn"
                  onclick="editTask(${task.id})"
                >
                  <i class="fas fa-pen"></i>
                </button>

                <button
                  class="icon-btn small-btn"
                  onclick="deleteTask(${task.id})"
                >
                  <i class="fas fa-trash"></i>
                </button>

              </div>
            `
          )
          .join("")
      : '<p class="empty-message">No completed tasks</p>';

  /* Statistics */

  const total = tasks.length;

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const pending = total - completedCount;

  const rate = total
    ? Math.round((completedCount / total) * 100)
    : 0;

  document.getElementById("taskCount").textContent =
    pending;

  document.getElementById("totalTasks").textContent =
    total;

  document.getElementById("completedCount").textContent =
    completedCount;

  document.getElementById("pendingCount").textContent =
    pending;

  document.getElementById(
    "completionRateValue"
  ).textContent = `${rate}%`;

  document.getElementById(
    "totalProgress"
  ).style.width = `${rate}%`;

  document.getElementById(
    "completionProgress"
  ).style.width = `${rate}%`;

  saveData();
}

/* Toggle Task */

function toggleTask(id) {
  const task = tasks.find(
    (task) => task.id === id
  );

  if (task) {
    task.completed = !task.completed;

    task.status = task.completed
      ? "completed"
      : "pending";

    renderTasks();
  }
}

/* Delete Task */

function deleteTask(id) {
  if (
    confirm(
      "Are you sure you want to delete this task?"
    )
  ) {
    tasks = tasks.filter(
      (task) => task.id !== id
    );

    renderTasks();
  }
}

/* Open Modal */

function openModal() {
  document
    .getElementById("taskModal")
    .classList.add("active");
}

/* Close Modal */

function closeModal() {
  document
    .getElementById("taskModal")
    .classList.remove("active");

  document
    .getElementById("taskForm")
    .reset();

  editingId = null;
}

/* Add / Update Task */

document
  .getElementById("taskForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const title =
      document.getElementById("taskTitle").value;

    const status =
      document.getElementById("taskStatus").value;

    const priority =
      document.getElementById("taskPriority").value;

    if (editingId) {
      const task = tasks.find(
        (task) => task.id === editingId
      );

      if (task) {
        task.title = title;
        task.status = status;
        task.priority = priority;
        task.completed =
          status === "completed";
      }
    } else {
      tasks.push({
        id: Date.now(),
        title: title,
        status: status,
        priority: priority,
        completed:
          status === "completed",
      });
    }

    renderTasks();
    closeModal();
  });

/* Edit Task */

function editTask(id) {
  editingId = id;

  const task = tasks.find(
    (task) => task.id === id
  );

  if (task) {
    document.getElementById(
      "taskTitle"
    ).value = task.title;

    document.getElementById(
      "taskStatus"
    ).value = task.status;

    document.getElementById(
      "taskPriority"
    ).value = task.priority;

    openModal();
  }
}

/* Search */

document
  .getElementById("searchInput")
  .addEventListener("input", function () {
    const searchTerm =
      this.value.toLowerCase().trim();

    const filteredTasks = tasks.filter(
      (task) =>
        task.title
          .toLowerCase()
          .includes(searchTerm)
    );

    renderTasks(filteredTasks);
  });

/* Start */

loadData();