
/* =================================
   1. SELECT HTML ELEMENTS
================================= */

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");
const remainingCount = document.getElementById("remaining-count");

const formMessage = document.getElementById("form-message");
const emptyMessage = document.getElementById("empty-message");
const clearCompletedButton = document.getElementById("clear-completed");


/* =================================
   2. STORE TASKS
================================= */

let tasks = [];
let nextTaskId = 1;


/* =================================
   3. DISPLAY FEEDBACK MESSAGE
================================= */

function showMessage(message, isError = false) {
    formMessage.textContent = message;

    formMessage.style.color = isError ? "#b91c1c" : "#15803d";
}


/* =================================
   4. UPDATE TASK COUNTERS
================================= */

function updateCounters() {
    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const remaining = total - completed;

    totalCount.textContent = total;
    completedCount.textContent = completed;
    remainingCount.textContent = remaining;

    emptyMessage.hidden = total > 0;
}


/* =================================
   5. DISPLAY TASKS ON THE PAGE
================================= */

function renderTasks() {
    taskList.replaceChildren();

    tasks.forEach(function(task) {

        const listItem = document.createElement("li");
        listItem.className = "task-item";

        if (task.completed) {
            listItem.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            "Mark " + task.text + " as complete"
        );

        checkbox.addEventListener("change", function() {
            toggleTask(task.id);
        });

        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute(
            "aria-label",
            "Delete " + task.text
        );

        deleteButton.addEventListener("click", function() {
            deleteTask(task.id);
        });

        listItem.append(checkbox, taskText, deleteButton);
        taskList.appendChild(listItem);
    });

    updateCounters();
}


/* =================================
   6. ADD A NEW TASK
================================= */

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        showMessage("Please enter a task before adding.", true);
        taskInput.focus();
        return;
    }

    const newTask = {
        id: nextTaskId++,
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    renderTasks();

    showMessage("Task added successfully!");

    taskForm.reset();
    taskInput.focus();
});


/* =================================
   7. MARK TASK AS COMPLETE
================================= */

function toggleTask(taskId) {
    tasks = tasks.map(function(task) {
        if (task.id === taskId) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    renderTasks();
}


/* =================================
   8. DELETE A TASK
================================= */

function deleteTask(taskId) {
    tasks = tasks.filter(function(task) {
        return task.id !== taskId;
    });

    renderTasks();

    showMessage("Task deleted successfully!");
}


/* =================================
   9. CLEAR COMPLETED TASKS
================================= */

clearCompletedButton.addEventListener("click", function() {

    const completedTasks = tasks.filter(function(task) {
        return task.completed;
    }).length;

    if (completedTasks === 0) {
        showMessage("There are no completed tasks to clear.", true);
        return;
    }

    tasks = tasks.filter(function(task) {
        return !task.completed;
    });

    renderTasks();

    showMessage("Completed tasks cleared successfully!");
});


/* =================================
   10. INITIAL PAGE SETUP
================================= */

renderTasks();