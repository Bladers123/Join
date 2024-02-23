let assigneds = [
    { firstName: "Mike", lastName: "Spung", selected: false },
    { firstName: "Sabine", lastName: "Rabs", selected: false },
    { firstName: "Felix", lastName: "Goring", selected: false },
    { firstName: "Lars", lastName: "Jabel", selected: false },
    { firstName: "Charly", lastName: "Bauer", selected: false },
    { firstName: "Ari", lastName: "Nasu", selected: false },
    { firstName: "James", lastName: "Jamen", selected: false },
    { firstName: "Sibi", lastName: "Oxin", selected: false },
    { firstName: "Mia", lastName: "Jogo", selected: false },
];

let categories = [
    { label: "Technical Task" },
    { label: "User Story" }
];

let subtaskId = 0;

let progress;

async function initTask(progress = "toDo") {
    this.progress = progress;
    rotateIcon('nav-image-assigned');
    rotateIcon('nav-image-category');
    let urgentButton = document.getElementById('urgent-button-id');;
    if (urgentButton) {
        urgentButton.classList.add('active');
    }
    assigneds = JSON.parse(await getItem('oldContacts') || '[]');
}

document.addEventListener('DOMContentLoaded', function () {
    document.body.addEventListener('click', function (event) {
        if (event.target.closest('.prioButtons button')) {
            let button = event.target.closest('.prioButtons button');
            document.querySelectorAll('.prioButtons button').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        }
    });
});

document.addEventListener('click', function (event) {
    let withinAssignedCheckboxArea = event.target.closest('.combobox') !== null ||
        event.target.closest('#checkBoxItemsAssigned') !== null ||
        event.target.id === 'assigned-text';
    let withinCategoryCheckboxArea = event.target.closest('.combobox') !== null ||
        event.target.closest('#itemsCategory') !== null ||
        event.target.id === 'category-text';
    if (!withinAssignedCheckboxArea)
        closeCheckBoxAreaForAssigned();
    if (!withinCategoryCheckboxArea)
        closeCheckBoxAreaForCategory();
});

function openOrCloseCheckBoxAreaForAssigned() {
    let checkBoxItems = document.getElementById('checkBoxItemsAssigned');
    rotateIcon('nav-image-assigned');
    if (checkBoxItems.innerHTML.trim() !== '')
        checkBoxItems.innerHTML = '';
    else
        checkBoxItems.innerHTML = getCeckBoxAreaTemplateForAssigned();
}

function openOrCloseCheckBoxAreaForCategory() {
    let checkBoxItems = document.getElementById('itemsCategory');
    rotateIcon('nav-image-category');
    if (checkBoxItems.innerHTML.trim() !== '')
        checkBoxItems.innerHTML = '';
    else
        checkBoxItems.innerHTML = getCeckBoxAreaTemplateForCategory();
}

function getCeckBoxAreaTemplateForAssigned() {
    return assigneds.map(assigned => {
        let parts = assigned.name.split(" ");
        let firstName = parts[0];
        let lastName = parts.length > 1 ? parts[1] : '';
        return /*html*/`
            <div class="item assigned-item ${assigned.selected ? 'active' : ''}" onclick="toggleActiveAssignedItem(this)">
                <div class="initialCircle margin-top">${firstName.charAt(0)}${lastName.charAt(0)}</div>
                <label>${firstName} ${lastName}</label>
                <input class="checkbox" type="checkbox" ${assigned.selected ? 'checked' : ''}>
            </div>
        `;
    }).join('');
}

function getCeckBoxAreaTemplateForCategory() {
    return categories.map(category => {
        return /*html*/`
            <div class="item category-item" onclick="selectedCategoryItem(this)">
                <label>${category.label}</label>
            </div>
        `;
    }).join('');
}

function toggleActiveAssignedItem(element) {
    let checkbox = element.querySelector('.checkbox');
    let label = element.querySelector('label').textContent;
    let assignedUser = assigneds.find(assigned => `${assigned.name}` === label);
    if (assignedUser) {
        assignedUser.selected = !assignedUser.selected;
        checkbox.checked = assignedUser.selected;
    }
    element.classList.toggle('active', assignedUser.selected);
    updateActiveInitialCircles();
}

function updateActiveInitialCircles() {
    let activeAssignedItems = document.querySelectorAll('.assigned-item.active');
    let targetContainer = document.getElementById('selectedUserCircle');
    targetContainer.innerHTML = '';
    activeAssignedItems.forEach(item => {
        let initialCircleClone = item.querySelector('.initialCircle').cloneNode(true);
        targetContainer.appendChild(initialCircleClone);
    });
}

function selectedCategoryItem(element) {
    let selectedCategoryItem = element.querySelector('label');
    let comboboxTextField = document.getElementById('category-text');
    comboboxTextField.innerHTML = selectedCategoryItem.textContent;
    openOrCloseCheckBoxAreaForCategory();
}

function isCategoryValidated(category) {
    if (category === 'Technical Task' || category === 'User Story')
        return true;
    else {
        document.getElementById('failureCategory').innerHTML = 'Bitte Category auswählen';
        return false;
    }
}

function rotateIcon(id) {
    let icon = document.getElementById(id);
    if (icon.style.transform === 'rotate(180deg)')
        icon.style.transform = '';
    else
        icon.style.transform = 'rotate(180deg)';
}

function clearTask() {
    let inputs = document.getElementsByClassName('inputs');
    let textAreas = document.getElementsByClassName('textarea');
    let mediumPriorityButton = document.querySelector('.prio-medium');
    let priorityButtons = document.querySelectorAll('.prioButtons button');
    for (let i = 0; i < inputs.length; i++)
        inputs[i].value = '';
    for (let i = 0; i < textAreas.length; i++)
        textAreas[i].value = '';
    document.getElementById('category-text').innerHTML = 'Select task category';
    priorityButtons.forEach(button => button.classList.remove('active'));
    mediumPriorityButton.classList.add('active');
    document.getElementById('selectedUserCircle').innerHTML = '';
    assigneds.forEach(assigned => assigned.selected = false);
}

//#region Nur für das Click-Event
function closeCheckBoxAreaForAssigned() {
    let checkBoxItems = document.getElementById('checkBoxItemsAssigned');
    if (checkBoxItems && checkBoxItems.innerHTML.trim() !== '') {
        checkBoxItems.innerHTML = '';
        rotateIcon('nav-image-assigned');
    }
}

function closeCheckBoxAreaForCategory() {
    let checkBoxItems = document.getElementById('itemsCategory');
    if (checkBoxItems && checkBoxItems.innerHTML.trim() !== '') {
        checkBoxItems.innerHTML = '';
        rotateIcon('nav-image-category');
    }
}
//#endregion

document.addEventListener('DOMContentLoaded', function () {
    let comboboxCategory = document.getElementById('combobox-category');
    if (comboboxCategory) {
        comboboxCategory.addEventListener('click', function () {
            document.getElementById('failureCategory').innerHTML = "";
        });
    }
});

async function createTask() {
    let currentTask = getTaskData();
    let validate = isCategoryValidated(currentTask.category);
    if (validate) {
        let tasks = JSON.parse(await getItem('tasks') || '[]');
        tasks = tasks.concat(currentTask);
        await setItem('tasks', JSON.stringify(tasks));
        document.getElementById('popup-container').innerHTML = getPopUpTemplate();
        clearTask();
        setTimeout(function () {
            window.location.href = '../../html/board.html';
        }, 1000);
    }
}

function getTaskData() {
    let title = document.getElementById('input-title').value;
    let description = document.getElementById('textArea-description').value;
    let dueDate = document.getElementById('input-due-date').value;
    let priority = document.querySelector('.prioButtons button.active').innerText.trim();
    let category = document.getElementById('category-text').textContent;
    let selectedAssigneds = assigneds.filter(assigned => assigned.selected).map(assigned => `${assigned.firstName} ${assigned.lastName}`);
    let progress = this.progress;
    let id = new Date().getTime();
    let subtasksElements = Array.from(document.querySelectorAll('.new-subtask-text'));
    let subtasks = subtasksElements.map(subtaskElement => ({
        title: subtaskElement.innerText || subtaskElement.textContent,
        completed: false,
        id: Math.random()
    }));

    let currentTask = {
        id,
        title,
        description,
        dueDate,
        priority,
        category,
        assignedTo: selectedAssigneds,
        progress,
        subtasks
    };

    return currentTask;
}

function getPopUpTemplate() {
    return /*html*/`
    <div class="overlay">
       <div id="popup" class="popup">
           <div class="popup-content">
              <span>Task added to board</span>
           </div>
       </div>
   </div> 
`;
}

function addSubtask() {
    let newSubtask = document.getElementById('newSubtask');
    let displayedSubtasks = document.getElementById('subtasks');
    let subtaskCount = displayedSubtasks.getElementsByClassName('new-sub-task-container').length;

    if (subtaskCount >= 2) {
        document.getElementById('subtasks-error-message').innerHTML = "Sie können maximal 2 Subtasks erstellen";
        return;
    }

    let uniqueId = `subtask-${subtaskId++}`;

    if (newSubtask.value.length > 0) {
        displayedSubtasks.innerHTML += `
        <div onclick="editSubTask('${uniqueId}')" class="new-sub-task-container" id="${uniqueId}">
            <li class="new-subtask-text">${newSubtask.value}</li>
            <div class="new-subtask-image-container">
                <img onclick="editSubTask('${uniqueId}')" src="../img/edit.png" alt="edit">
                <img onclick="deleteSubTask('${uniqueId}')" src="../img/trash.png" alt="delete">
            </div>
        </div>      
        `;
        newSubtask.value = "";
    }
}


function editSubTask(id) {
    let subtaskContainer = document.getElementById(id);
    let subtaskTextElement = subtaskContainer.querySelector('.new-subtask-text');
    let currentText = subtaskTextElement.innerText;
    subtaskTextElement.innerHTML = `<input class="subtask-edit-field" type="text" value="${currentText}" onblur="saveEditedSubTask('${id}', this.value)">`;
    subtaskTextElement.querySelector('input').focus();
}

function saveEditedSubTask(id, newText) {
    let subtaskTextElement = document.getElementById(id).querySelector('.new-subtask-text');
    subtaskTextElement.innerHTML = newText;
}

function deleteSubTask(id) {
    let subtaskToRemove = document.getElementById(id);
    subtaskToRemove.remove();
}
