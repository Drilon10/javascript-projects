const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');

let tasks = [];

// Load tasks from LocalStorage when page loads
loadTasks();

// Add new task
addBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();

  if (taskText === '') return;

  tasks.push(taskText);
  taskInput.value = '';

  saveTasks();
  renderTasks();
});

// Render tasks to the UI
function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';

    li.innerHTML = `
      <span>${task}</span>
      <button class="btn btn-sm btn-danger">Delete</button>
    `;

    li.querySelector('button').addEventListener('click', () => {
      deleteTask(index);
    });

    taskList.appendChild(li);
  });

  taskCount.textContent = tasks.length;
}

// Delete task from array
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Save tasks to LocalStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from LocalStorage
function loadTasks() {
  const storedTasks = localStorage.getItem('tasks');

  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    renderTasks();
  }
}
