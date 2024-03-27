//Variables:
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const completedTasks = document.querySelector('.completed-tasks');
const clearBtn = document.querySelector('.clear-tasks');
const clearCompletedBtn = document.querySelector('.clear-completed-tasks');
const taskInput = document.querySelector('#task');

// Event load function
loadFunction();

function loadFunction() {
    // Add task
    form.addEventListener('submit', addTask);
    // Remove tasks
    taskList.addEventListener('click', removeTask);
    // Clear tasks
    clearBtn.addEventListener('click', clearTasks);
    //remove completed tasks
    completedTasks.addEventListener('click', removeCompletedTask);
    // Clear completed tasks
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
}

// Add task function
function addTask(e) {
    e.preventDefault(); // Prevent form submission

    const taskDescription = taskInput.value;
    const priority = document.querySelector('input[name="priority"]:checked');
    const dueDate = document.querySelector('#due-date').value;

    if (taskDescription === '') {
        alert('Please add a task');
        return;
    }

    if (!priority) {
        alert('Please select a priority');
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

    // Set background color based on priority
    if (taskObject.priority === 'high') {
        li.style.backgroundColor = 'red';
        li.style.color = 'white';
    } else if (taskObject.priority === 'medium') {
        li.style.backgroundColor = 'yellow';
        li.style.color = 'black';
    } else if (taskObject.priority === 'low') {
        li.style.backgroundColor = 'green';
        li.style.color = 'white';
    }

    li.innerHTML = `<span class="task-description">${taskObject.description}</span>
                    <span class="task-due-date">${taskObject.dueDate}</span>`;

    const removeIcon = document.createElement('a');
    removeIcon.className = 'delete-item secondary-content';
    removeIcon.innerHTML = '<i class="fa fa-remove"></i>';

    const completeIcon = document.createElement('a');
    completeIcon.className = 'complete-item secondary-content';
    completeIcon.innerHTML = '<i class="fa fa-check"></i>';

    li.appendChild(removeIcon);
    li.appendChild(completeIcon);

    taskList.appendChild(li);
    storeTask(taskObject);

    taskInput.value = '';
    priority.checked = false;
    document.querySelector('#due-date').value = '';
}


// Remove task function
function removeTask(e) {
    if (e.target.parentElement.classList.contains('delete-item')) {
        if (confirm('Are You Sure?')) {
            e.target.parentElement.parentElement.remove();
        }
    } else if (e.target.parentElement.classList.contains('complete-item')) {
        const taskDescription = e.target.parentElement.parentElement.querySelector('.task-description').textContent.trim();

        if (taskDescription) {
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.appendChild(document.createTextNode(taskDescription));
            completedTasks.appendChild(li);
        }

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
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const uncompletedTasks = tasks.filter((task) => !task.completed);
    localStorage.setItem('tasks', JSON.stringify(uncompletedTasks));
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

    tasks.forEach(function (task) {
        const li = document.createElement('li');
        li.className = 'collection-item';

        // Set background color and font color based on priority
        if (task.priority === 'high') {
            li.style.backgroundColor = 'red';
            li.style.color = 'white';
        } else if (task.priority === 'medium') {
            li.style.backgroundColor = 'yellow';
            li.style.color = 'black';
        } else if (task.priority === 'low') {
            li.style.backgroundColor = 'green';
            li.style.color = 'white';
        }

        li.innerHTML = `<span class="task-description">${task.description}</span>
                        <span class="task-due-date">${task.dueDate}</span>`;

        const removeIcon = document.createElement('a');
        removeIcon.className = 'delete-item secondary-content';
        removeIcon.innerHTML = '<i class="fa fa-remove"></i>';

        const completeIcon = document.createElement('a');
        completeIcon.className = 'complete-item secondary-content';
        completeIcon.innerHTML = '<i class="fa fa-check"></i>';

        li.appendChild(removeIcon);
        li.appendChild(completeIcon);

        if (task.completed) {
            completedTasks.appendChild(li);
        } else {
            taskList.appendChild(li);
        }
    });
}

// Initialize date picker
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.datepicker');
    var options = {
        format: 'yyyy-mm-dd',
    };
    var instances = M.Datepicker.init(elems, options);
});

// Load tasks from local storage on page load
loadTasks();
