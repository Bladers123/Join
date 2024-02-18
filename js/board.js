let todo = [
    {
        id: 0,
        title: "Putzen",
        progress: "toDo",
        description: "Kochwelt Page",
    },
    {
        id: 1,
        title: "Kochen",
        progress: "toDo",
        description: "Join Page",
    },
    {
        id: 2,
        title: "Tristan Daten Sync bauen",
        progress: "toDo",
        description: "Array muss erstellt werden",
    },
];

let tasks = [];
let newTask = [];

async function initBoard() {
    await loadTasks();
    updateHTML();
}

async function loadTasks() {
    newTask = JSON.parse(localStorage.getItem("task")) || [];
    console.log('Mein neuer Task aus dem local Storage: ', newTask);
    if (newTask.length !== 0) {
        tasks.push(newTask);
        console.log('Meinen neuen Task in Tasks gepusht: ', tasks);

        await setItem('tasks', JSON.stringify(tasks));
        console.log("Meine Tasks auf dem Server gespeichert.");

        loadedTasks = JSON.parse(await getItem('tasks'));
        console.log('Meine Tasks vom Server geladen.', loadedTasks);

        tasks = loadedTasks;
        console.log('Die geladenen Tasks in tasks gespeichert.');
        
        console.log(tasks[0]);
    }
}

function updateHTML() {
    let toDo = todo.filter((t) => t["progress"] == "toDo");

    document.getElementById("toDo").innerHTML = "";

    for (let index = 0; index < toDo.length; index++) {
        const element = toDo[index];
        document.getElementById("toDo").innerHTML += generateTodoHTML(element);
    }

    let inprogress = todo.filter((t) => t["progress"] == "inProgress");

    document.getElementById("inProgress").innerHTML = "";

    for (let index = 0; index < inprogress.length; index++) {
        const element = inprogress[index];
        document.getElementById("inProgress").innerHTML += generateTodoHTML(element);
    }

    let feedback = todo.filter((t) => t["progress"] == "feedback");

    document.getElementById("feedback").innerHTML = "";

    for (let index = 0; index < feedback.length; index++) {
        const element = feedback[index];
        document.getElementById("feedback").innerHTML += generateTodoHTML(element);
    }

    let done = todo.filter((t) => t["progress"] == "done");

    document.getElementById("done").innerHTML = "";

    for (let index = 0; index < done.length; index++) {
        const element = done[index];
        document.getElementById("done").innerHTML += generateTodoHTML(element);
    }
    save();
}

let currentDraggedElement;

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    todo[currentDraggedElement]["progress"] = category;
    updateHTML();
}

function generateTodoHTML(element) {
    return `
    <div onclick="openCardModal('cardModal')" draggable="true" ondragstart="startDragging(${element["id"]})" class="toDoCard">
         <div class="toDoCardContent">
             <div class="badge">
                 <p class="badgeText">${element["progress"]}</p>
             </div>
             <div class="cardTextWrapper">
                 <p class="cardHeadline">${element["title"]}</p>
                 <p class="cardDescription">${element["description"]}</p>
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

function save() {
    localStorage.setItem("localTasks", JSON.stringify(tasks));
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
