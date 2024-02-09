let items = [
    { name: "Mike", imgUrl: "../img/person.svg" },
    { name: "Sabine", imgUrl: "../img/person.svg" },
    { name: "Felix", imgUrl: "../img/person.svg" },
    { name: "Lars", imgUrl: "../img/person.svg" },
    { name: "Charly", imgUrl: "../img/person.svg" },
    { name: "Ari", imgUrl: "../img/person.svg" },
    { name: "James", imgUrl: "../img/person.svg" },
    { name: "Sibi", imgUrl: "../img/person.svg" },
    { name: "Mia", imgUrl: "../img/person.svg" },
];


function initTask() {
    rotateIcon();
}

function openCheckBoxArea() {
    let checkBoxItems = document.getElementById('checkBoxItems');
    rotateIcon();
    if (checkBoxItems.innerHTML.trim() !== '')
        checkBoxItems.innerHTML = '';
    else
        checkBoxItems.innerHTML = getCeckBoxAreaTemplate();
}

function getCeckBoxAreaTemplate() {
    return items.map(item => {
        return /*html*/`
            <div class="item">
                <img src="${item.imgUrl}" alt="Picture of ${item.name}">
                <label>${item.name}</label>
                <input class="checkbox" type="checkbox">
            </div>
        `;
    }).join('');
}

function rotateIcon() {
    let icon = document.getElementById('navigation');
    if (icon.style.transform === 'rotate(180deg)')
        icon.style.transform = '';
    else
        icon.style.transform = 'rotate(180deg)';
}

