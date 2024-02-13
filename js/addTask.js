let assigneds = [
    { firstName: "Mike", lastName: "Spung" },
    { firstName: "Sabine", lastName: "Rabs" },
    { firstName: "Felix", lastName: "Goring" },
    { firstName: "Lars", lastName: "Jabel" },
    { firstName: "Charly", lastName: "Bauer" },
    { firstName: "Ari", lastName: "Nasu" },
    { firstName: "James", lastName: "Jamen" },
    { firstName: "Sibi", lastName: "Oxin" },
    { firstName: "Mia", lastName: "Jogo" },
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


function initTask() {
    rotateIcon('nav-image-assigned');
    rotateIcon('nav-image-category');
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
            <div class="item assigned-item" onclick="toggleActiveAssignedItem(this)">
                <div class="initialCircle">${assigned.firstName.charAt(0)}${assigned.lastName.charAt(0)}</div>
                <label>${assigned.firstName} ${assigned.lastName}</label>
                <input class="checkbox" type="checkbox">
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
    element.classList.toggle('active');
    let checkbox = element.querySelector('.checkbox');
    if (checkbox)
        checkbox.checked = !checkbox.checked;
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

function createTask(){
    window.location.href = '../../html/board.html';
}

