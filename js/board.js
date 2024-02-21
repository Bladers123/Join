let tasks = [];

let currentDraggedElement;

async function initBoard() {
    tasks = JSON.parse(await getItem('tasks') || '[]');
    updateTasks();
}

function updateTasks() {
    let sections = {
        toDo: document.getElementById("toDo"),
        inProgress: document.getElementById("inProgress"),
        feedback: document.getElementById("feedback"),
        done: document.getElementById("done")
    };

    document.getElementById("toDo").innerHTML = "";
    document.getElementById("inProgress").innerHTML = "";
    document.getElementById("feedback").innerHTML = "";
    document.getElementById("done").innerHTML = "";

    tasks.forEach(task => {
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
    let foundIndex = tasks.findIndex(task => task.id === currentDraggedElement);
    if (foundIndex !== -1)
        tasks[foundIndex].progress = category;
    else {
        console.error('Element nicht gefunden in tasks');
        return;
    }
    updateTasks();
    await setItem('tasks', JSON.stringify(tasks));
}

function generateTodoHTML(task) {
    let circleTemplate = getCircleTemplate(task);
    let prioSVG = getPrioSVG(task);
    let progressValue = task.subtasks.length === 1 ? 50 : task.subtasks.length === 2 ? 100 : 0;
    return /*html*/`
    <div onclick="openCardModal('cardModal')" draggable="true" ondragstart="startDragging(${task.id})" class="toDoCard">
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
    return task.assignedTo.map(person => {
        let initials = person.split(' ').map(namePart => namePart.charAt(0)).join('');
        return `<div class="profileBadge">${initials}</div>`;
    }).join('');
}

function getPrioSVG(task) {
    switch (task.priority) {
        case 'Low':
            return getPrioLowSVG();
        case 'Medium':
            return getPrioMediumSVG();
        case 'Urgent':
            return getPrioUrgentSVG();
        default:
            console.log('Unbekannte Priorität:', task.priority);
            return '';
    }
}


function getPrioUrgentSVG() {
    return /*html*/`
        <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.6528 15.2547C19.4182 15.2551 19.1896 15.1803 19.0007 15.0412L10.7487 8.958L2.49663 15.0412C2.38078 15.1267 2.24919 15.1887 2.10939 15.2234C1.96959 15.2582 1.82431 15.2651 1.68184 15.2437C1.53937 15.2223 1.40251 15.1732 1.27906 15.099C1.15562 15.0247 1.04801 14.927 0.96238 14.8112C0.876751 14.6954 0.814779 14.5639 0.780002 14.4243C0.745226 14.2846 0.738325 14.1394 0.759696 13.997C0.802855 13.7095 0.958545 13.4509 1.19252 13.2781L10.0966 6.70761C10.2853 6.56802 10.5139 6.49268 10.7487 6.49268C10.9835 6.49268 11.212 6.56802 11.4007 6.70761L20.3048 13.2781C20.4908 13.415 20.6286 13.6071 20.6988 13.827C20.7689 14.0469 20.7678 14.2833 20.6955 14.5025C20.6232 14.7216 20.4834 14.9124 20.2962 15.0475C20.1089 15.1826 19.8837 15.2551 19.6528 15.2547Z" fill="#FF3D00"/>
        <path d="M19.6528 9.50568C19.4182 9.50609 19.1896 9.43124 19.0007 9.29214L10.7487 3.20898L2.49663 9.29214C2.26266 9.46495 1.96957 9.5378 1.68184 9.49468C1.39412 9.45155 1.13532 9.29597 0.962385 9.06218C0.789449 8.82838 0.716541 8.53551 0.7597 8.24799C0.802859 7.96048 0.95855 7.70187 1.19252 7.52906L10.0966 0.958588C10.2853 0.818997 10.5139 0.743652 10.7487 0.743652C10.9835 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4908 7.66598 20.6286 7.85809 20.6988 8.07797C20.769 8.29785 20.7678 8.53426 20.6955 8.75344C20.6232 8.97262 20.4834 9.16338 20.2962 9.29847C20.1089 9.43356 19.8837 9.50608 19.6528 9.50568Z" fill="#FF3D00"/>
        </svg>
    `;
}

function getPrioMediumSVG() {
    return /*html*/`
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
    return /*html*/`
        <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.2485 9.50589C10.0139 9.5063 9.7854 9.43145 9.59655 9.29238L0.693448 2.72264C0.57761 2.63708 0.47977 2.52957 0.405515 2.40623C0.33126 2.28289 0.282043 2.14614 0.260675 2.00379C0.217521 1.71631 0.290421 1.42347 0.463337 1.1897C0.636253 0.955928 0.895022 0.800371 1.18272 0.757248C1.47041 0.714126 1.76347 0.786972 1.99741 0.95976L10.2485 7.04224L18.4997 0.95976C18.6155 0.874204 18.7471 0.812285 18.8869 0.777538C19.0266 0.742791 19.1719 0.735896 19.3144 0.757248C19.4568 0.7786 19.5937 0.82778 19.7171 0.901981C19.8405 0.976181 19.9481 1.07395 20.0337 1.1897C20.1194 1.30545 20.1813 1.43692 20.2161 1.57661C20.2509 1.71629 20.2578 1.86145 20.2364 2.00379C20.215 2.14614 20.1658 2.28289 20.0916 2.40623C20.0173 2.52957 19.9195 2.63708 19.8036 2.72264L10.9005 9.29238C10.7117 9.43145 10.4831 9.5063 10.2485 9.50589Z" fill="#7AE229"/>
        <path d="M10.2485 15.2544C10.0139 15.2548 9.7854 15.18 9.59655 15.0409L0.693448 8.47117C0.459502 8.29839 0.30383 8.03981 0.260675 7.75233C0.217521 7.46485 0.290421 7.17201 0.463337 6.93824C0.636253 6.70446 0.895021 6.54891 1.18272 6.50578C1.47041 6.46266 1.76347 6.53551 1.99741 6.7083L10.2485 12.7908L18.4997 6.7083C18.7336 6.53551 19.0267 6.46266 19.3144 6.50578C19.602 6.54891 19.8608 6.70446 20.0337 6.93824C20.2066 7.17201 20.2795 7.46485 20.2364 7.75233C20.1932 8.03981 20.0376 8.29839 19.8036 8.47117L10.9005 15.0409C10.7117 15.18 10.4831 15.2548 10.2485 15.2544Z" fill="#7AE229"/>
        </svg>
    `;
}

function highlight(id) {
    document.getElementById(id).classList.add("contentContainerHover");
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove("contentContainerHover");
}

function openCardModal(id) {
    document.getElementById(id).classList.remove("d-none");
}

function closeCardModal(id) {
    document.getElementById(id).classList.add("d-none");
}
