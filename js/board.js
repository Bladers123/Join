let tasks = [];

let currentDraggedElement;

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
        /*html*/`
        <div class="subTaskWrapper">
            <progress id="file" value="${progressValue}" max="100"></progress>
            <div class="subtask">
                <p>${completedSubtasks}/${totalSubtasks}</p>
                <p>Subtasks</p>
            </div>
         </div>` : '';

    return /*html*/ `
    <div onclick="openCardModal(this.getAttribute('data-task-id'))" data-task-id="${task.id}" draggable="true" ondragstart="startDragging(${task.id})" class="toDoCard">
         <div class="toDoCardContent">
             <div class="badge" style="background-color: ${task.category === 'User Story' ? '#0038ff' : task.category === 'Technical Task' ? '#1FD7C1' : 'defaultBackgroundColor'};">
                 <p class="badgeText">${task.category}</p>
             </div>
             <div class="cardTextWrapper">
                 <p class="cardHeadline">${task.title}</p>
                 <p class="cardDescription">${task.description}</p>
             </div>
             ${subTaskWrapperHTML}
             <div class="cardFooter">
                 <div id="userCircle" class="avatarWrapper">
                    ${circleTemplate}
                 </div>
                 ${prioSVG}
             </div>
         </div>
       </div>
    `;
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
            console.log("Unbekannte Priorität:", task.priority);
            return "";
    }
}


function handleSearchChange(searchText) {
    if (searchText.trim() === "") {
        updateTasks();
    } else {
        let filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchText.toLowerCase()));
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
    window.location.href = "../html/board.html";
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
    return /*html*/ `
    <div id="cardModal-container">
        <div id="cardModal" class="openCardBackground">
                <div class="openTask">
                    <div class="cardHeader">
                    <div class="cardType" style="background-color: ${task.category === 'User Story' ? '#0038ff' : task.category === 'Technical Task' ? '#1FD7C1' : 'defaultBackgroundColor'};">

                            <p class="cardTypeDescription">${task.category}</p>
                        </div>
                        <svg onclick="closeCardModal('cardModal-container')" class="closeIcon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id="mask0_12_1578" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="4" y="4" width="24" height="24">
                                <rect x="4" y="4" width="24" height="24" fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask0_12_1578)">
                                <path
                                    d="M16 17.4L11.1 22.3C10.9167 22.4833 10.6834 22.575 10.4 22.575C10.1167 22.575 9.88338 22.4833 9.70005 22.3C9.51672 22.1167 9.42505 21.8833 9.42505 21.6C9.42505 21.3167 9.51672 21.0833 9.70005 20.9L14.6 16L9.70005 11.1C9.51672 10.9167 9.42505 10.6833 9.42505 10.4C9.42505 10.1167 9.51672 9.88332 9.70005 9.69999C9.88338 9.51665 10.1167 9.42499 10.4 9.42499C10.6834 9.42499 10.9167 9.51665 11.1 9.69999L16 14.6L20.9 9.69999C21.0834 9.51665 21.3167 9.42499 21.6 9.42499C21.8834 9.42499 22.1167 9.51665 22.3 9.69999C22.4834 9.88332 22.575 10.1167 22.575 10.4C22.575 10.6833 22.4834 10.9167 22.3 11.1L17.4 16L22.3 20.9C22.4834 21.0833 22.575 21.3167 22.575 21.6C22.575 21.8833 22.4834 22.1167 22.3 22.3C22.1167 22.4833 21.8834 22.575 21.6 22.575C21.3167 22.575 21.0834 22.4833 20.9 22.3L16 17.4Z"
                                    fill="#2A3647"
                                />
                            </g>
                        </svg>
                    </div>
                    <h1 class="cardHeadlineOverlay">${task.title}</h1>
                    <p class="cardSubheadline">${task.description}</p>
                    <div class="dateWrapper">
                        <p class="dateDescription">Due date:</p>
                        <p class="date">${task.dueDate}</p>
                    </div>
                    <div class="priorityWrapper">
                        <p class="priorityDescription">Priority:</p>
                        <div class="priority">
                            <p class="priorityGrade">${task.priority}</p>
                            ${prioSVG}
                        </div>
                    </div>
                    <div class="assignedToWrapper">
                        <p class="assignedToHeadline">Assigned To:</p>
                        <div class="assignedToNameWrapper">
                            ${assignedToHtml}
                        </div>
                    </div>
                    <div class="subtasksWrapper">
                        <p class="subtaskTitle">Subtasks:</p>
                        <div class="subtaskCheckboxWrapper">
                           ${subtasksHtml}
                        </div>
                    </div>
                    <div class="footerWrapper">
                        <div onclick="deleteTask(${task.id})" class="deleteWrapper">
                            <img src="../img/delete.svg" alt="" />
                            <p class="delete">Delete</p>
                        </div>
                        <div onclick="editTask()" class="deleteWrapper">
                            <img src="../img/edit.svg" alt="" />
                            <p class="delete">Edit</p>
                        </div>
                    </div>
                </div>
        </div>
    </div>
    `;
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
}

let currentTaskModal = [];

async function editTask() {
    console.log(currentTaskModal);
    await initTask('noProgress');
    document.getElementById('cardModal-container').innerHTML = editTaskTemplate();
    setEditValuesOfTaskModal();   
}

function setEditValuesOfTaskModal(){
    document.getElementById('input-title').value = currentTaskModal.title;
    document.getElementById('textArea-description').value = currentTaskModal.description;
    document.getElementById('input-due-date').value = currentTaskModal.dueDate;
    selectAssignedPersons();
    updateAssignedItemsUI(); 
    editAssignsArray();
    editSubtasksArray();
    document.getElementById('urgent-button-id').classList.add('active');
}

async function saveEditTask() {
    let newTitle = document.getElementById('input-title').value;
    let newDescription = document.getElementById('textArea-description').value;
    let newDate = document.getElementById('input-due-date').value;
    
    currentTaskModal.title = newTitle;
    currentTaskModal.description = newDescription;
    currentTaskModal.dueDate = newDate;

    updateTasks();
    await setItem("tasks", JSON.stringify(tasks));
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
    let subtasks = currentTaskModal['subtasks'];
    let uniqueId = `subtask-${subtaskId++}`;

    let subtaskContainer = document.getElementById('edit-subtasks');
    subtaskContainer.innerHTML = '';


    for (let s = 0; s < subtasks.length; s++) {
        const subtask = subtasks[s];
        let editSubtask = subtask['title']


        subtaskContainer.innerHTML += `
        <div onclick="editSubTask('${uniqueId}')" class="new-sub-task-container" id="${uniqueId}">
        <li class="new-subtask-text">${editSubtask}</li>
        <div class="new-subtask-image-container">
            <img onclick="editSubTask('${uniqueId}')" src="../img/edit.png" alt="edit">
            <img onclick="deleteSubTask('${uniqueId}')" src="../img/trash.png" alt="delete">
        </div>
    </div>`;
    }
}