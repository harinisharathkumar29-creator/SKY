// =============================================================================
// Simple To-Do List Application
// Built with Vanilla JavaScript for beginners
// =============================================================================

// Key used to store and retrieve tasks in browser LocalStorage
const STORAGE_KEY = 'simple_todo_tasks';

// Global array to hold all task objects in memory
// Each task has the structure: { id: string, text: string, completed: boolean }
let tasks = [];

// DOM Element References
const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const errorMessage = document.getElementById('error-message');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const taskCounter = document.getElementById('task-counter');
const completedCounter = document.getElementById('completed-counter');

// =============================================================================
// Helper Functions: Storage (LocalStorage)
// =============================================================================

/**
 * Loads saved tasks from the browser's LocalStorage.
 * If tasks exist, they are parsed from JSON into the `tasks` array.
 */
function loadTasks() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    try {
      tasks = JSON.parse(savedData);
    } catch (error) {
      console.error('Failed to parse tasks from localStorage:', error);
      tasks = [];
    }
  } else {
    tasks = [];
  }
}

/**
 * Saves the current `tasks` array to the browser's LocalStorage.
 * Converts the JavaScript array into a JSON string.
 */
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// =============================================================================
// Core Functions: Add, Toggle, Delete
// =============================================================================

/**
 * Adds a new task to the list after validation.
 * @param {string} text - The title/description of the task.
 */
function addTask(text) {
  const trimmedText = text.trim();

  // Feature 8: Prevent users from adding empty tasks
  if (trimmedText === '') {
    showError('Please enter a task before adding!');
    taskInput.classList.add('shake');
    taskInput.focus();
    return;
  }

  // Clear any existing error state
  clearError();

  // Create a new task object
  const newTask = {
    id: Date.now().toString(), // Generates a unique ID based on current timestamp
    text: trimmedText,
    completed: false
  };

  // Add the new task to our array
  tasks.push(newTask);

  // Save to LocalStorage and update the user interface
  saveTasks();
  renderTasks();

  // Clear the input field and refocus for quick entry
  taskInput.value = '';
  taskInput.focus();
}

/**
 * Toggles a task between completed and incomplete.
 * @param {string} id - The unique ID of the task to toggle.
 */
function toggleTask(id) {
  const task = tasks.find(item => item.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

/**
 * Deletes an individual task from the list.
 * @param {string} id - The unique ID of the task to delete.
 */
function deleteTask(id) {
  tasks = tasks.filter(item => item.id !== id);
  saveTasks();
  renderTasks();
}

// =============================================================================
// UI Rendering Functions
// =============================================================================

/**
 * Updates the counters that display total tasks and completed tasks.
 */
function updateStats() {
  const totalCount = tasks.length;
  const completedCount = tasks.filter(task => task.completed).length;

  taskCounter.textContent = `${totalCount} ${totalCount === 1 ? 'task' : 'tasks'}`;
  completedCounter.textContent = `${completedCount} completed`;
}

/**
 * Renders all tasks on the screen.
 * Handles the empty state, task elements, and stats counters.
 */
function renderTasks() {
  // Clear the existing list before re-rendering
  taskList.innerHTML = '';

  // Feature 7: Display a friendly message when there are no tasks
  if (tasks.length === 0) {
    emptyState.classList.add('visible');
  } else {
    emptyState.classList.remove('visible');
  }

  // Update the summary counter badges
  updateStats();

  // Loop through tasks and create HTML elements for each
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;

    // 1. Task content wrapper (clickable to toggle completion)
    const contentDiv = document.createElement('div');
    contentDiv.className = 'task-content';

    // Checkbox toggle button
    const checkboxBtn = document.createElement('button');
    checkboxBtn.type = 'button';
    checkboxBtn.className = 'checkbox-btn';
    checkboxBtn.setAttribute('aria-label', task.completed ? 'Mark task as incomplete' : 'Mark task as complete');
    checkboxBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;

    // Task text label
    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text; // textContent safely prevents HTML injection (XSS)

    contentDiv.appendChild(checkboxBtn);
    contentDiv.appendChild(textSpan);

    // 2. Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    `;

    // Put together the list item
    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);

    // Append to the list in the DOM
    taskList.appendChild(li);
  });
}

/**
 * Displays a validation error message below the input field.
 * @param {string} message - The error message text.
 */
function showError(message) {
  errorMessage.textContent = message;
}

/**
 * Clears the error message and removes the shake animation.
 */
function clearError() {
  errorMessage.textContent = '';
  taskInput.classList.remove('shake');
}

// =============================================================================
// Event Listeners
// =============================================================================

// Handles form submission (both clicking "Add Task" button and pressing Enter key)
todoForm.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent page reload on form submit
  addTask(taskInput.value);
});

// Clears the error message as soon as the user starts typing
taskInput.addEventListener('input', function () {
  if (errorMessage.textContent !== '') {
    clearError();
  }
});

// Remove shake animation class after it finishes playing
taskInput.addEventListener('animationend', function () {
  taskInput.classList.remove('shake');
});

// Event delegation on task list for toggling and deleting tasks
taskList.addEventListener('click', function (event) {
  const target = event.target;
  const taskItem = target.closest('.task-item');
  if (!taskItem) return;

  const taskId = taskItem.dataset.id;

  // If clicked inside the delete button, delete the task
  if (target.closest('.delete-btn')) {
    deleteTask(taskId);
    return;
  }

  // If clicked inside the task content or checkbox button, toggle complete status
  if (target.closest('.task-content') || target.closest('.checkbox-btn')) {
    toggleTask(taskId);
  }
});

// =============================================================================
// Initialization on page load
// =============================================================================

// Restore saved tasks and render initial state when page loads
document.addEventListener('DOMContentLoaded', function () {
  loadTasks();
  renderTasks();
});
