//Variables:
const form = document.querySelector('#task-form');
const taskList = document.querySelector('#task-list');
const completedTasks = document.querySelector('#completed-tasks');
const clearBtn = document.querySelector('#clear-tasks');
const clearCompletedBtn = document.querySelector('#clear-completed-tasks');
const taskInput = document.querySelector('#task');

// Event load function
loadFunction();

function loadFunction() {
    form.addEventListener('submit', addTask);
    taskList.addEventListener('click', removeTask);
    clearBtn.addEventListener('click', clearTasks);
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
}

// Add task function
function addTask(e) {
    e.preventDefault(); // Prevent form submission

    const taskDescription = taskInput.value;
    const priority = document.querySelector('input[name="priority"]:checked');
    const dueDate = document.querySelector('#due-date').value;

    if (taskDescription === '' || !priority) {
        alert('Please fill out all fields');
        return;
    }

    const taskObject = {
        description: taskDescription,
        priority: priority.value,
        dueDate: dueDate,
        completed: false,
    };

    const li = document.createElement('li');
    li.className = 'collection-item';
    li.style.backgroundColor = getPriorityColor(taskObject.priority);

    li.innerHTML = `<span class="task-description">${taskObject.description}</span>
                    <span class="task-due-date">${taskObject.dueDate}</span>`;

    const removeIcon = createIcon('fa-remove', 'delete-item');
    const completeIcon = createIcon('fa-check', 'complete-item');

    li.appendChild(removeIcon);
    li.appendChild(completeIcon);

    taskList.appendChild(li);
    storeTask(taskObject);

    // Clear form fields
    clearFormFields();
}

// Remove task function
function removeTask(e) {
    if (e.target.parentElement.classList.contains('delete-item')) {
        if (confirm('Are You Sure?')) {
            e.target.parentElement.parentElement.remove();
            removeTaskFromStorage(e.target.parentElement.parentElement);
        }
    } else if (e.target.parentElement.classList.contains('complete-item')) {
        const taskDescription = e.target.parentElement.parentElement.querySelector('.task-description').textContent.trim();
        moveTaskToCompleted(taskDescription);
        e.target.parentElement.parentElement.remove();
    }
}

// Clear tasks function
function clearTasks() {
    taskList.innerHTML = '';
    localStorage.removeItem('tasks');
}

// Clear completed tasks function
function clearCompletedTasks() {
    completedTasks.innerHTML = '';
    localStorage.removeItem('completedTasks');
}

// Store task in local storage
function storeTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage on page load
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => renderTask(task));
}

// Initialize date picker
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.datepicker');
    var options = {
        format: 'yyyy-mm-dd',
    };
    var instances = M.Datepicker.init(elems, options);

    loadTasks();
});

// Utility functions
function createIcon(iconClass, className) {
    const icon = document.createElement('a');
    icon.className = className + ' secondary-content';
    icon.innerHTML = `<i class="fa ${iconClass}"></i>`;
    return icon;
}

function getPriorityColor(priority) {
    switch (priority) {
        case 'high':
            return 'red';
        case 'medium':
            return 'yellow';
        case 'low':
            return 'green';
        default:
            return '';
    }
}

function clearFormFields() {
    taskInput.value = '';
    document.querySelectorAll('input[name="priority"]:checked').forEach(input => input.checked = false);
    document.querySelector('#due-date').value = '';
}

function removeTaskFromStorage(taskElement) {
    const taskDescription = taskElement.querySelector('.task-description').textContent.trim();
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.description !== taskDescription);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function moveTaskToCompleted(taskDescription) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    const taskIndex = tasks.findIndex(task => task.description === taskDescription);
    if (taskIndex !== -1) {
        const completedTask = tasks.splice(taskIndex, 1)[0];
        completedTask.completed = true;
        completedTasks.push(completedTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        renderTask(completedTask, true);
    }
}

function renderTask(task, completed = false) {
    const li = document.createElement('li');
    li.className = 'collection-item';
    li.style.backgroundColor = getPriorityColor(task.priority);
    li.innerHTML = `<span class="task-description">${task.description}</span>
                    <span class="task-due-date">${task.dueDate}</span>`;
    const removeIcon = createIcon('fa-remove', 'delete-item');
    li.appendChild(removeIcon);
    if (!completed) {
        const completeIcon = createIcon('fa-check', 'complete-item');
        li.appendChild(completeIcon);
    }
    if (completed) {
        completedTasks.appendChild(li);
    } else {
        taskList.appendChild(li);
    }
}
