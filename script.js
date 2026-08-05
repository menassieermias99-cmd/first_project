// State Management
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// DOM Elements
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("to-do");
const doneList = document.getElementById("done");

// Save to LocalStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render Tasks to UI
function renderTasks() {
  // Clear existing lists
  todoList.innerHTML = "";
  doneList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
      <div class="task-content">
        <input 
          type="checkbox" 
          ${task.completed ? "checked" : ""} 
          onchange="toggleTask(${task.id})" 
        />
        <span class="task-text">${escapeHTML(task.text)}</span>
      </div>
      <button class="delete-btn" onclick="deleteTask(${task.id})" aria-label="Delete task">&times;</button>
    `;

    if (task.completed) {
      doneList.appendChild(li);
    } else {
      todoList.appendChild(li);
    }
  });
}

// Add New Task
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = todoInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  todoInput.value = "";
});

// Toggle Task Completion State
window.toggleTask = function (id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  saveTasks();
  renderTasks();
};

// Delete Task
window.deleteTask = function (id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
};

// Helper function to prevent XSS attacks
function escapeHTML(str) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[tag] || tag,
  );
}

// Initial render on page load
renderTasks();
