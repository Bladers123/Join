let tasks = [
    {
        id: 0,
        title: "Putzen",
        progress: "toDo",
        description: "Kochwelt Page",
    },
    {
        id: 1,
        title: "Kochen",
        progress: "inProgress",
        description: "Join Page",
    },
    {
        id: 2,
        title: "Tristan Daten Sync bauen",
        progress: "toDo",
        description: "Array muss erstellt werden",
    },
];

let currentDraggedElement;

async function initBoard() {
    await loadTasks();
    updateHTML();
}

async function loadTasks() {
    let newTask = JSON.parse(localStorage.getItem("task")) || [];
    console.log('Mein neuer Task aus dem local Storage: ', newTask);

    tasks = tasks.concat(newTask);
    console.log('Meinen neuen Task in Tasks gepusht: ', tasks);
    
    await setItem('tasks', JSON.stringify(tasks));
    console.log("Meine Tasks im Local Storage gespeichert.");

    let loadedTasks = JSON.parse(await getItem('tasks') || '[]');
    tasks = loadedTasks;
    console.log('Die geladenen Tasks in tasks gespeichert.', tasks);
}

function updateHTML() {
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
        let elementHTML = generateTodoHTML(task);
        sections[task.progress].innerHTML += elementHTML;
    });
}

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    let foundIndex = tasks.findIndex(task => task.id === currentDraggedElement);
    if (foundIndex !== -1)
        tasks[foundIndex].progress = category;
    else {
        console.error('Element nicht gefunden in tasks');
        return;
    }
    updateHTML();
}

function generateTodoHTML(element) {
    return `
    <div onclick="openCardModal('cardModal')" draggable="true" ondragstart="startDragging(${element.id})" class="toDoCard">
         <div class="toDoCardContent">
             <div class="badge">
                 <p class="badgeText">${element.progress}</p>
             </div>
             <div class="cardTextWrapper">
                 <p class="cardHeadline">${element.title}</p>
                 <p class="cardDescription">${element.description}</p>
             </div>
             <div class="subTaskWrapper">
                 <progress id="file" value="32" max="100">32%</progress>
                 <div class="subtask">
                     <p>1/2</p>
                     <p>Subtask</p>
                 </div>
             </div>
             <div class="cardFooter">
                 <div class="avatarWrapper">
                     <div class="profileBadge">AM</div>
                     <div class="profileBadge">AM</div>
                     <div class="profileBadge">AM</div>
                 </div>
                 <svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <g clip-path="url(#clip0_5_843)">
                         <path
                             d="M16.5685 7.16664L1.43151 7.16664C1.18446 7.16664 0.947523 7.06779 0.772832 6.89183C0.598141 6.71587 0.5 6.47722 0.5 6.22837C0.5 5.97953 0.598141 5.74087 0.772832 5.56491C0.947523 5.38895 1.18446 5.2901 1.43151 5.2901L16.5685 5.2901C16.8155 5.2901 17.0525 5.38895 17.2272 5.56491C17.4019 5.74087 17.5 5.97953 17.5 6.22837C17.5 6.47722 17.4019 6.71587 17.2272 6.89183C17.0525 7.06779 16.8155 7.16664 16.5685 7.16664Z"
                             fill="#FFA800"
                         />
                         <path
                             d="M16.5685 2.70986L1.43151 2.70986C1.18446 2.70986 0.947523 2.611 0.772832 2.43504C0.598141 2.25908 0.5 2.02043 0.5 1.77158C0.5 1.52274 0.598141 1.28409 0.772832 1.10813C0.947523 0.932166 1.18446 0.833313 1.43151 0.833313L16.5685 0.833313C16.8155 0.833313 17.0525 0.932166 17.2272 1.10813C17.4019 1.28409 17.5 1.52274 17.5 1.77158C17.5 2.02043 17.4019 2.25908 17.2272 2.43504C17.0525 2.611 16.8155 2.70986 16.5685 2.70986Z"
                             fill="#FFA800"
                         />
                     </g>
                     <defs>
                         <clipPath id="clip0_5_843">
                             <rect width="17" height="6.33333" fill="white" transform="translate(0.5 0.833313)" />
                         </clipPath>
                     </defs>
                 </svg>
             </div>
         </div>
       </div>
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
