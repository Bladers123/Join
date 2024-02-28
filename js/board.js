let tasks = [];
let currentDraggedElement;
let currentTaskModal = [];

async function initBoard() {
    tasks = JSON.parse((await getItem("tasks")) || "[]");
    updateTasks();
}

async function updateTasks() {
    let sections = {
        toDo: document.getElementById("toDo"),
        inProgress: document.getElementById("inProgress"),
        feedback: document.getElementById("feedback"),
        done: document.getElementById("done"),
    };

    document.getElementById("toDo").innerHTML = "";
    document.getElementById("inProgress").innerHTML = "";
    document.getElementById("feedback").innerHTML = "";
    document.getElementById("done").innerHTML = "";

    tasks.forEach((task) => {
        let taskTemplate = generateTodoHTML(task);
        sections[task.progress].innerHTML += taskTemplate;
    });
}

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(event) {
    event.preventDefault();
}

async function moveTo(category) {
    let foundIndex = tasks.findIndex((task) => task.id === currentDraggedElement);
    if (foundIndex !== -1) tasks[foundIndex].progress = category;
    else {
        console.error("Element nicht gefunden in tasks");
        return;
    }
    updateTasks();
    await setItem("tasks", JSON.stringify(tasks));
}

function generateTodoHTML(task) {
    let circleTemplate = getCircleTemplate(task);
    let prioSVG = getPrioSVG(task);
    let totalSubtasks = task.subtasks.length;
    let completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
    let progressValue = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    let subTaskWrapperHTML = totalSubtasks > 0 ?

        generateTodoSubtask(progressValue, completedSubtasks, totalSubtasks) : '';
    return generateTodoCardModal(task, subTaskWrapperHTML, circleTemplate, prioSVG);

}

function getCircleTemplate(task) {
    return task.assignedTo.map(person => {
        let initials = person.name.split(" ").map(namePart => namePart.charAt(0)).join("");
        let backgroundColor = person.bg ? ` style="background-color: ${person.bg};"` : '';
        return `<div class="profileBadge"${backgroundColor}>${initials}</div>`;
    }).join("");
}

function getPrioSVG(task) {
    switch (task.priority) {
        case "Low":
            return getPrioLowSVG();
        case "Medium":
            return getPrioMediumSVG();
        case "Urgent":
            return getPrioUrgentSVG();
        default:
            return "";
    }
}

function handleSearchChange(searchText) {
    if (searchText.trim() === "") {
        updateTasks();
    } else {
        let filteredTasks = tasks.filter((task) =>
            task.title.toLowerCase().includes(searchText.toLowerCase()) ||
            task.description.toLowerCase().includes(searchText.toLowerCase())
        );
        updateFilteredTasks(filteredTasks);
    }
}

function updateFilteredTasks(filteredTasks) {
    let sections = {
        toDo: document.getElementById("toDo"),
        inProgress: document.getElementById("inProgress"),
        feedback: document.getElementById("feedback"),
        done: document.getElementById("done"),
    };

    Object.keys(sections).forEach((section) => {
        sections[section].innerHTML = "";
    });

    filteredTasks.forEach((task) => {
        let taskTemplate = generateTodoHTML(task);
        if (sections[task.progress]) {
            sections[task.progress].innerHTML += taskTemplate;
        }
    });
}

function highlight(id) {
    document.getElementById(id).classList.add("contentContainerHover");
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove("contentContainerHover");
}

function closeCardModal(id) {
    document.getElementById(id).classList.add("d-none");
}

function openCardModal(taskId) {
    let task = tasks.find((task) => task.id.toString() === taskId.toString());
    if (task) {
        document.getElementById("cardModalID").innerHTML = getTaskTemplate(task);
    } else console.error("Task nicht gefunden");
}

function getAssignedToTemplate(assignedTo) {
    return assignedTo.map(person => {
        let initials = person.name.split(" ").map(name => name[0]).join("");
        return /*html*/`
            <div class="assignedContact">
                <div class="nameCircleWrapper">
                    <div class="nameCircle" style="background-color: ${person.bg};">${initials}</div>
                    <p class="assignedName">${person.name}</p>
                </div>
            </div>
        `}).join("");
}

function getSubtasksTemplate(subtasks, taskId) {
    return subtasks.map((subtask) => {
        const isChecked = subtask.completed ? 'checked' : '';
        return /*html*/`
            <div class="subtask">
                <input class="checkbox" type="checkbox" ${isChecked} onclick="toggleSubtaskCompleted(${taskId}, ${subtask.id})"/>
                <div class="checkboxDescription">${subtask.title}</div>
            </div>
            `;
    }).join("");
}

async function toggleSubtaskCompleted(taskId, subtaskId) {
    let taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        let subtaskIndex = tasks[taskIndex].subtasks.findIndex(subtask => subtask.id === subtaskId);
        if (subtaskIndex !== -1) {
            tasks[taskIndex].subtasks[subtaskIndex].completed = !tasks[taskIndex].subtasks[subtaskIndex].completed;
            await setItem("tasks", JSON.stringify(tasks));
            updateTasks();
        }
    }
}

function getTaskTemplate(task) {
    let assignedToHtml = getAssignedToTemplate(task.assignedTo);
    let subtasksHtml = getSubtasksTemplate(task.subtasks, task.id);
    let prioSVG = getPrioSVG(task);
    currentTaskModal = task;
    return generateTaskTemplateHTML(task, assignedToHtml, subtasksHtml, prioSVG);

}

async function deleteTask(taskId) {
    closeCardModal('cardModal-container');
    tasks = tasks.filter(task => task.id !== taskId);
    await setItem("tasks", JSON.stringify(tasks));
    updateTasks();
}

async function loadAddTaskTemplate(progress) {
    document.getElementById("addTaskModalID").innerHTML = addTaskTemplate();
    await initTask(progress);
    createdFromBoard = true;
    console.log(createdFromBoard);
}

async function editTask() {
    await initTask('noProgress');
    document.getElementById('cardModal-container').innerHTML = editTaskTemplate();
    setEditValuesOfTaskModal();
    rotateIcon('nav-image-assigned');
}

function setEditValuesOfTaskModal() {
    document.getElementById('input-title').value = currentTaskModal.title;
    document.getElementById('textArea-description').value = currentTaskModal.description;
    document.getElementById('input-due-date').value = currentTaskModal.dueDate;
    selectAssignedPersons();
    updateAssignedItemsUI();
    editAssignsArray();
    editSubtasksArray();
    document.getElementById('medium-button-id').classList.add('active');
}

async function saveEditTask() {
    let taskUpdated = false;
    let updatedTask = null;

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        if (task.id === currentTaskModal.id) {
            task.title = document.getElementById('input-title').value;
            task.description = document.getElementById('textArea-description').value;
            task.dueDate = document.getElementById('input-due-date').value;
            task.priority = document.querySelector('.prioButtons button.active').innerText.trim();
            task.subtasks = getUpdatedSubtasks();
            task.assignedTo = getSelectedAssigneds();
            taskUpdated = true;
            updatedTask = task;
            break;
        }
    }

    if (taskUpdated) {
        await setItem("tasks", JSON.stringify(tasks));
        updateTasks();
        document.getElementById("cardModalID").innerHTML = getTaskTemplate(updatedTask);
        console.log(updatedTask);
    }
}


function getSelectedAssigneds() {
    return assigneds.filter(assigned => assigned.selected).map(assigned => {
        return {
            name: assigned.name,
            bg: assigned.bg
        };
    });
}

function getUpdatedSubtasks() {
    let updatedSubtasks = [];
    let subtaskElements = document.querySelectorAll('.new-subtask-text');
    subtaskElements.forEach((element, index) => {
        updatedSubtasks.push({ id: index + 1, title: element.textContent, completed: false });
    });
    return updatedSubtasks;
}


function selectAssignedPersons() {
    if (currentTaskModal.assignedTo && currentTaskModal.assignedTo.length > 0) {
        currentTaskModal.assignedTo.forEach(assignedContact => {
            let found = assigneds.find(assigned => assigned.name.trim() === assignedContact.name.trim());
            if (found) {
                found.selected = true;
            }
        });
    }
}

function updateAssignedItemsUI() {
    assigneds.forEach(assigned => {
        if (assigned.selected) {
            let element = document.querySelector(`.assigned-item[data-name="${assigned.name}"]`);
            if (element) {
                let checkbox = element.querySelector('.checkbox');
                checkbox.checked = true;
                element.classList.add('active');
            }
        }
    });

    updateActiveInitialCircles();
}

function editAssignsArray() {
    let assigns = currentTaskModal['assignedTo'];
    let assignsContainer = document.getElementById('selectedUserCircle');
    assignsContainer.innerHTML = '';

    for (let a = 0; a < assigns.length; a++) {
        const assign = assigns[a];
        let editAssign = assign['name'];
        let editColor = assign['bg'];
        let initials = editAssign.split(" ").map(editAssign => editAssign[0]).join("");

        assignsContainer.innerHTML += `<div class="editCircleStyle">
        <div class="editprofileBadge" style="background-color:${editColor}">${initials}</div>
        `
    }
}

function editSubtasksArray() {
    let subtasks = currentTaskModal.subtasks;
    let subtaskContainer = document.getElementById('subtasks');
    subtaskContainer.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        let subtask = subtasks[i];
        let editSubtask = subtask.title;
        subtaskContainer.innerHTML += generateEditSubtasksHTML(subtask.id, editSubtask);
    }
}