let tasks = [];

let currentDraggedElement;

async function initBoard() {
    tasks = JSON.parse((await getItem("tasks")) || "[]");
    updateTasks();
}

function updateTasks() {
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
    let progressValue = task.subtasks.length === 1 ? 50 : task.subtasks.length === 2 ? 100 : 0;
    return /*html*/ `
    <div onclick="openCardModal(this.getAttribute('data-task-id'))" data-task-id="${task.id}" draggable="true" ondragstart="startDragging(${task.id})" class="toDoCard">
         <div class="toDoCardContent">
             <div class="badge">
                 <p class="badgeText">${task.progress}</p>
             </div>
             <div class="cardTextWrapper">
                 <p class="cardHeadline">${task.title}</p>
                 <p class="cardDescription">${task.description}</p>
             </div>
             <div class="subTaskWrapper">
                 <progress id="file" value="${progressValue}" max="100"></progress>
                 <div class="subtask">
                     <p>${task.subtasks.length}/2</p>
                     <p>Subtasks</p>
                 </div>
             </div>
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
    return task.assignedTo
        .map((person) => {
            let initials = person
                .split(" ")
                .map((namePart) => namePart.charAt(0))
                .join("");
            return `<div class="profileBadge">${initials}</div>`;
        })
        .join("");
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

function getPrioUrgentSVG() {
    return /*html*/ `
        <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.6528 15.2547C19.4182 15.2551 19.1896 15.1803 19.0007 15.0412L10.7487 8.958L2.49663 15.0412C2.38078 15.1267 2.24919 15.1887 2.10939 15.2234C1.96959 15.2582 1.82431 15.2651 1.68184 15.2437C1.53937 15.2223 1.40251 15.1732 1.27906 15.099C1.15562 15.0247 1.04801 14.927 0.96238 14.8112C0.876751 14.6954 0.814779 14.5639 0.780002 14.4243C0.745226 14.2846 0.738325 14.1394 0.759696 13.997C0.802855 13.7095 0.958545 13.4509 1.19252 13.2781L10.0966 6.70761C10.2853 6.56802 10.5139 6.49268 10.7487 6.49268C10.9835 6.49268 11.212 6.56802 11.4007 6.70761L20.3048 13.2781C20.4908 13.415 20.6286 13.6071 20.6988 13.827C20.7689 14.0469 20.7678 14.2833 20.6955 14.5025C20.6232 14.7216 20.4834 14.9124 20.2962 15.0475C20.1089 15.1826 19.8837 15.2551 19.6528 15.2547Z" fill="#FF3D00"/>
        <path d="M19.6528 9.50568C19.4182 9.50609 19.1896 9.43124 19.0007 9.29214L10.7487 3.20898L2.49663 9.29214C2.26266 9.46495 1.96957 9.5378 1.68184 9.49468C1.39412 9.45155 1.13532 9.29597 0.962385 9.06218C0.789449 8.82838 0.716541 8.53551 0.7597 8.24799C0.802859 7.96048 0.95855 7.70187 1.19252 7.52906L10.0966 0.958588C10.2853 0.818997 10.5139 0.743652 10.7487 0.743652C10.9835 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4908 7.66598 20.6286 7.85809 20.6988 8.07797C20.769 8.29785 20.7678 8.53426 20.6955 8.75344C20.6232 8.97262 20.4834 9.16338 20.2962 9.29847C20.1089 9.43356 19.8837 9.50608 19.6528 9.50568Z" fill="#FF3D00"/>
        </svg>
    `;
}

function getPrioMediumSVG() {
    return /*html*/ `
        <svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_5_843)">
                <path d="M16.5685 7.16664L1.43151 7.16664C1.18446 7.16664 0.947523 7.06779 0.772832 6.89183C0.598141 6.71587 0.5 6.47722 0.5 6.22837C0.5 5.97953 0.598141 5.74087 0.772832 5.56491C0.947523 5.38895 1.18446 5.2901 1.43151 5.2901L16.5685 5.2901C16.8155 5.2901 17.0525 5.38895 17.2272 5.56491C17.4019 5.74087 17.5 5.97953 17.5 6.22837C17.5 6.47722 17.4019 6.71587 17.2272 6.89183C17.0525 7.06779 16.8155 7.16664 16.5685 7.16664Z" fill="#FFA800"/>
                <path d="M16.5685 2.70986L1.43151 2.70986C1.18446 2.70986 0.947523 2.611 0.772832 2.43504C0.598141 2.25908 0.5 2.02043 0.5 1.77158C0.5 1.52274 0.598141 1.28409 0.772832 1.10813C0.947523 0.932166 1.18446 0.833313 1.43151 0.833313L16.5685 0.833313C16.8155 0.833313 17.0525 0.932166 17.2272 1.10813C17.4019 1.28409 17.5 1.52274 17.5 1.77158C17.5 2.02043 17.4019 2.25908 17.2272 2.43504C17.0525 2.611 16.8155 2.70986 16.5685 2.70986Z" fill="#FFA800"/></g><defs>
            <clipPath id="clip0_5_843">
                 <rect width="17" height="6.33333" fill="white" transform="translate(0.5 0.833313)" />
             </clipPath>
         </defs>
       </svg>
    `;
}

function getPrioLowSVG() {
    return /*html*/ `
        <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.2485 9.50589C10.0139 9.5063 9.7854 9.43145 9.59655 9.29238L0.693448 2.72264C0.57761 2.63708 0.47977 2.52957 0.405515 2.40623C0.33126 2.28289 0.282043 2.14614 0.260675 2.00379C0.217521 1.71631 0.290421 1.42347 0.463337 1.1897C0.636253 0.955928 0.895022 0.800371 1.18272 0.757248C1.47041 0.714126 1.76347 0.786972 1.99741 0.95976L10.2485 7.04224L18.4997 0.95976C18.6155 0.874204 18.7471 0.812285 18.8869 0.777538C19.0266 0.742791 19.1719 0.735896 19.3144 0.757248C19.4568 0.7786 19.5937 0.82778 19.7171 0.901981C19.8405 0.976181 19.9481 1.07395 20.0337 1.1897C20.1194 1.30545 20.1813 1.43692 20.2161 1.57661C20.2509 1.71629 20.2578 1.86145 20.2364 2.00379C20.215 2.14614 20.1658 2.28289 20.0916 2.40623C20.0173 2.52957 19.9195 2.63708 19.8036 2.72264L10.9005 9.29238C10.7117 9.43145 10.4831 9.5063 10.2485 9.50589Z" fill="#7AE229"/>
        <path d="M10.2485 15.2544C10.0139 15.2548 9.7854 15.18 9.59655 15.0409L0.693448 8.47117C0.459502 8.29839 0.30383 8.03981 0.260675 7.75233C0.217521 7.46485 0.290421 7.17201 0.463337 6.93824C0.636253 6.70446 0.895021 6.54891 1.18272 6.50578C1.47041 6.46266 1.76347 6.53551 1.99741 6.7083L10.2485 12.7908L18.4997 6.7083C18.7336 6.53551 19.0267 6.46266 19.3144 6.50578C19.602 6.54891 19.8608 6.70446 20.0337 6.93824C20.2066 7.17201 20.2795 7.46485 20.2364 7.75233C20.1932 8.03981 20.0376 8.29839 19.8036 8.47117L10.9005 15.0409C10.7117 15.18 10.4831 15.2548 10.2485 15.2544Z" fill="#7AE229"/>
        </svg>
    `;
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
}

function openAddTask() {
    document.getElementById("addTaskModal").classList.remove("d-none");
}

function openCardModal(taskId) {
    let task = tasks.find((task) => task.id.toString() === taskId.toString());
    if (task) {
        document.getElementById("cardModalID").innerHTML = getTaskTemplate(task);
    } else console.error("Task nicht gefunden");
}

function getAssignedToTemplate(assignedTo) {
    return assignedTo
        .map((person) => {
            let initials = person
                .split(" ")
                .map((name) => name[0])
                .join("");
            return `
            <div class="assignedContact">
                <div class="nameCircleWrapper">
                    <div class="nameCircle">${initials}</div>
                    <p class="assignedName">${person}</p>
                </div>
            </div>
        `;
        })
        .join("");
}

function getSubtasksTemplate(subtasks) {
    return subtasks
        .map((subtask) => {
            return `
            <div class="subtask">
                <input class="checkbox" type="checkbox"/>
                <div class="checkboxDescription">${subtask}</div>
            </div>
        `;
        })
        .join("");
}

function getTaskTemplate(task) {
    let assignedToHtml = getAssignedToTemplate(task.assignedTo);
    let subtasksHtml = getSubtasksTemplate(task.subtasks);
    let prioSVG = getPrioSVG(task);
    return /*html*/ `
        <div id="cardModal" class="openCardBackground">
                <div class="openTask">
                    <div class="cardHeader">
                        <div class="cardType">
                            <p class="cardTypeDescription">${task.category}</p>
                        </div>
                        <svg onclick="closeCardModal('cardModal')" class="closeIcon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                        <p class="subtaskTitle">Subtask</p>
                        <div class="subtaskCheckboxWrapper">
                           ${subtasksHtml}
                        </div>
                    </div>
                    <div class="footerWrapper">
                        <div class="deleteWrapper">
                            <img src="../img/delete.svg" alt="" />
                            <p class="delete">Delete</p>
                        </div>
                        <div class="deleteWrapper">
                            <img src="../img/edit.svg" alt="" />
                            <p class="delete">Edit</p>
                        </div>
                    </div>
                </div>
            </div>
    `;
}

function loadAddTaskTemplate() {
    document.getElementById("addTaskModalIDDDD").innerHTML = addTaskTemplate();
}

function addTaskTemplate() {
    return /*html*/`
    <div id="popup-container"></div>
    <div id="addTaskModal" class="modalBackground">      
    <div class="content">
            <form class="all" onsubmit="createTask(); return false;">
                <div class="addTaskHeader">
                    <h1 class="addTaskHeadline">Add Task</h1>
                    <svg onclick="closeCardModal('addTaskModal')" class="closeIcon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                <div class="task">
                    <div class="taskLeftSide">
                        <div class="margin-bot">
                            <p>Title<span class="colored-star">*</span></p>
                            <input id="input-title" placeholder="Enter a title" class="inputs" type="text" required />
                        </div>
                        <div class="margin-bot">
                            <p>Description</p>
                            <textarea id="textArea-description" placeholder="Enter a Description" class="textarea"></textarea>
                        </div>
                        <div class="margin-bot">
                            <p>Assigned to</p>
                            <div class="combobox" onclick="openOrCloseCheckBoxAreaForAssigned()">
                                <p id="assigned-text">Select contacts to assigned</p>
                                <img id="nav-image-assigned" src="../img/navigation.png" alt="navLogo" />
                            </div>
                            <div class="position-context">
                                <div id="checkBoxItemsAssigned" class="items"></div>
                            </div>
                            <div id="selectedUserCircle" class="selected-user-circle"></div>
                        </div>
                    </div>
                    <div class="divider"></div>
                    <div class="taskRightSide">
                        <div class="margin-bot">
                            <p>Due date<span class="colored-star">*</span></p>
                            <input id="input-due-date" placeholder="dd/mm/yyyy" class="inputs" type="date" required />
                        </div>
                        <div class="margin-bot">
                            <p>Prio</p>
                            <div class="prioButtons">
                                <button type="button" class="prio-urgent">
                                    Urgent
                                    <div class="prio-button-svg-container">
                                        <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_139307_4282)">
                                                <path
                                                    d="M19.6528 15.2547C19.4182 15.2551 19.1896 15.1803 19.0007 15.0412L10.7487 8.958L2.49663 15.0412C2.38078 15.1267 2.24919 15.1887 2.10939 15.2234C1.96959 15.2582 1.82431 15.2651 1.68184 15.2437C1.53937 15.2223 1.40251 15.1732 1.27906 15.099C1.15562 15.0247 1.04801 14.927 0.96238 14.8112C0.876751 14.6954 0.814779 14.5639 0.780002 14.4243C0.745226 14.2846 0.738325 14.1394 0.759696 13.997C0.802855 13.7095 0.958545 13.4509 1.19252 13.2781L10.0966 6.70761C10.2853 6.56802 10.5139 6.49268 10.7487 6.49268C10.9835 6.49268 11.212 6.56802 11.4007 6.70761L20.3048 13.2781C20.4908 13.415 20.6286 13.6071 20.6988 13.827C20.7689 14.0469 20.7678 14.2833 20.6955 14.5025C20.6232 14.7216 20.4834 14.9124 20.2962 15.0475C20.1089 15.1826 19.8837 15.2551 19.6528 15.2547Z"
                                                    fill="#FF3D00"
                                                />
                                                <path
                                                    d="M19.6528 9.50568C19.4182 9.50609 19.1896 9.43124 19.0007 9.29214L10.7487 3.20898L2.49663 9.29214C2.26266 9.46495 1.96957 9.5378 1.68184 9.49468C1.39412 9.45155 1.13532 9.29597 0.962385 9.06218C0.789449 8.82838 0.716541 8.53551 0.7597 8.24799C0.802859 7.96048 0.95855 7.70187 1.19252 7.52906L10.0966 0.958588C10.2853 0.818997 10.5139 0.743652 10.7487 0.743652C10.9835 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4908 7.66598 20.6286 7.85809 20.6988 8.07797C20.769 8.29785 20.7678 8.53426 20.6955 8.75344C20.6232 8.97262 20.4834 9.16338 20.2962 9.29847C20.1089 9.43356 19.8837 9.50608 19.6528 9.50568Z"
                                                    fill="#FF3D00"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_139307_4282">
                                                    <rect width="20" height="14.5098" fill="white" transform="translate(0.748535 0.745117)" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                </button>
                                <button type="button" class="prio-medium">
                                    Medium
                                    <div class="prio-button-svg-container">
                                        <svg width="21" height="8" viewBox="0 0 21 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_139307_4289)">
                                                <path
                                                    d="M19.1526 7.72528H1.34443C1.05378 7.72528 0.775033 7.60898 0.569514 7.40197C0.363995 7.19495 0.248535 6.91419 0.248535 6.62143C0.248535 6.32867 0.363995 6.0479 0.569514 5.84089C0.775033 5.63388 1.05378 5.51758 1.34443 5.51758H19.1526C19.4433 5.51758 19.722 5.63388 19.9276 5.84089C20.1331 6.0479 20.2485 6.32867 20.2485 6.62143C20.2485 6.91419 20.1331 7.19495 19.9276 7.40197C19.722 7.60898 19.4433 7.72528 19.1526 7.72528Z"
                                                    fill="#FFA800"
                                                />
                                                <path
                                                    d="M19.1526 2.48211H1.34443C1.05378 2.48211 0.775033 2.36581 0.569514 2.1588C0.363995 1.95179 0.248535 1.67102 0.248535 1.37826C0.248535 1.0855 0.363995 0.804736 0.569514 0.597724C0.775033 0.390712 1.05378 0.274414 1.34443 0.274414L19.1526 0.274414C19.4433 0.274414 19.722 0.390712 19.9276 0.597724C20.1331 0.804736 20.2485 1.0855 20.2485 1.37826C20.2485 1.67102 20.1331 1.95179 19.9276 2.1588C19.722 2.36581 19.4433 2.48211 19.1526 2.48211Z"
                                                    fill="#FFA800"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_139307_4289">
                                                    <rect width="20" height="7.45098" fill="white" transform="translate(0.248535 0.274414)" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                </button>
                                <button type="button" class="prio-low">
                                    Low
                                    <div class="prio-button-svg-container">
                                        <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M10.2485 9.50589C10.0139 9.5063 9.7854 9.43145 9.59655 9.29238L0.693448 2.72264C0.57761 2.63708 0.47977 2.52957 0.405515 2.40623C0.33126 2.28289 0.282043 2.14614 0.260675 2.00379C0.217521 1.71631 0.290421 1.42347 0.463337 1.1897C0.636253 0.955928 0.895022 0.800371 1.18272 0.757248C1.47041 0.714126 1.76347 0.786972 1.99741 0.95976L10.2485 7.04224L18.4997 0.95976C18.6155 0.874204 18.7471 0.812285 18.8869 0.777538C19.0266 0.742791 19.1719 0.735896 19.3144 0.757248C19.4568 0.7786 19.5937 0.82778 19.7171 0.901981C19.8405 0.976181 19.9481 1.07395 20.0337 1.1897C20.1194 1.30545 20.1813 1.43692 20.2161 1.57661C20.2509 1.71629 20.2578 1.86145 20.2364 2.00379C20.215 2.14614 20.1658 2.28289 20.0916 2.40623C20.0173 2.52957 19.9195 2.63708 19.8036 2.72264L10.9005 9.29238C10.7117 9.43145 10.4831 9.5063 10.2485 9.50589Z"
                                                fill="#7AE229"
                                            />
                                            <path
                                                d="M10.2485 15.2544C10.0139 15.2548 9.7854 15.18 9.59655 15.0409L0.693448 8.47117C0.459502 8.29839 0.30383 8.03981 0.260675 7.75233C0.217521 7.46485 0.290421 7.17201 0.463337 6.93824C0.636253 6.70446 0.895021 6.54891 1.18272 6.50578C1.47041 6.46266 1.76347 6.53551 1.99741 6.7083L10.2485 12.7908L18.4997 6.7083C18.7336 6.53551 19.0267 6.46266 19.3144 6.50578C19.602 6.54891 19.8608 6.70446 20.0337 6.93824C20.2066 7.17201 20.2795 7.46485 20.2364 7.75233C20.1932 8.03981 20.0376 8.29839 19.8036 8.47117L10.9005 15.0409C10.7117 15.18 10.4831 15.2548 10.2485 15.2544Z"
                                                fill="#7AE229"
                                            />
                                        </svg>
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div class="margin-bot">
                            <p>Category<span class="colored-star">*</span></p>
                            <div id="combobox-category" class="combobox" onclick="openOrCloseCheckBoxAreaForCategory()">
                                <p id="category-text">Select task category</p>
                                <img id="nav-image-category" src="../img/navigation.png" alt="navLogo" />
                            </div>
                            <div class="position-context">
                                <div id="itemsCategory" class="items"></div>
                            </div>
                            <div id="failureCategory" class="failure"></div>
                        </div>
                        <div class="margin-bot">
                            <p>Subtasks</p>
                            <div class="subtasks-input-container">
                                <input id="newSubtask" placeholder="Add new subtask" class="inputs" type="text" />
                                <svg onclick="addSubtask()" width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6.24854 8H1.24854C0.965202 8 0.727702 7.90417 0.536035 7.7125C0.344368 7.52083 0.248535 7.28333 0.248535 7C0.248535 6.71667 0.344368 6.47917 0.536035 6.2875C0.727702 6.09583 0.965202 6 1.24854 6H6.24854V1C6.24854 0.716667 6.34437 0.479167 6.53604 0.2875C6.7277 0.0958333 6.9652 0 7.24854 0C7.53187 0 7.76937 0.0958333 7.96104 0.2875C8.1527 0.479167 8.24854 0.716667 8.24854 1V6H13.2485C13.5319 6 13.7694 6.09583 13.961 6.2875C14.1527 6.47917 14.2485 6.71667 14.2485 7C14.2485 7.28333 14.1527 7.52083 13.961 7.7125C13.7694 7.90417 13.5319 8 13.2485 8H8.24854V13C8.24854 13.2833 8.1527 13.5208 7.96104 13.7125C7.76937 13.9042 7.53187 14 7.24854 14C6.9652 14 6.7277 13.9042 6.53604 13.7125C6.34437 13.5208 6.24854 13.2833 6.24854 13V8Z"
                                        fill="#2A3647"
                                    />
                                </svg>
                            </div>
                            <ul id="subtasks" class="subtasks-container"></ul>
                            <div id="subtasks-error-message" class="failure"></div>
                        </div>
                    </div>
                </div>
                <footer>
                    <p><span class="colored-star">*</span>This field is required</p>
                    <div class="clear-and-create-button-container">
                        <button class="clear-button" type="button" onclick="clearTask()">
                            <span class="clearText">Clear</span>
                            <img class="clear-image" src="../img/close.svg" />
                        </button>
                        <button class="create-button" type="submit">
                            Create Task
                            <img class="create-image" src="../img/check.png" />
                        </button>
                    </div>
                </footer>
            </form>
        </div>
    </div>`;
}
