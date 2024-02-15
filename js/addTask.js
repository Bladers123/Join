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

document.addEventListener('DOMContentLoaded', function () {
    let buttons = document.querySelectorAll('.prioButtons button');
    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            buttons.forEach(function (btn) {
                btn.classList.remove('active');
            });

            this.classList.add('active');
        });
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

function initTask() {
    rotateIcon('nav-image-assigned');
    rotateIcon('nav-image-category');
    document.querySelector('.prio-urgent').classList.add('active');
}

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
        return /*html*/`
            <div class="item assigned-item ${assigned.selected ? 'active' : ''}" onclick="toggleActiveAssignedItem(this)">
                <div class="initialCircle margin-top">${assigned.firstName.charAt(0)}${assigned.lastName.charAt(0)}</div>
                <label>${assigned.firstName} ${assigned.lastName}</label>
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
    let assignedUser = assigneds.find(assigned => `${assigned.firstName} ${assigned.lastName}` === label);
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
    if (checkBoxItems.innerHTML.trim() !== '') {
        checkBoxItems.innerHTML = '';
        rotateIcon('nav-image-assigned');
    }
}

function closeCheckBoxAreaForCategory() {
    let checkBoxItems = document.getElementById('itemsCategory');
    if (checkBoxItems.innerHTML.trim() !== '') {
        checkBoxItems.innerHTML = '';
        rotateIcon('nav-image-category');
    }
}
//#endregion

function createTask() {
    saveTask();
    clearTask();
    window.location.href = '../../html/board.html';
}

function saveTask() {
    let title = document.getElementById('input-title').value;
    let description = document.getElementById('textArea-description').value;
    let dueDate = document.getElementById('input-due-date').value;
    let priority = document.querySelector('.prioButtons button.active').textContent;
    let category = document.getElementById('category-text').textContent;
    let selectedAssigneds = assigneds.filter(assigned => assigned.selected).map(assigned => `${assigned.firstName} ${assigned.lastName}`);
    let progress = "toDo";
    let id = new Date().getTime();

    currentTask = {
        id, 
        title,
        description,
        dueDate,
        priority,
        category,
        assignedTo: selectedAssigneds,
        progress
    };

    localStorage.setItem('task', JSON.stringify(currentTask));
}