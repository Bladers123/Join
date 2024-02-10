
async function init() {
    includeHTML();
 //   await loadContacts();
    renderOldContacts();
}

function navToSignIn() {
    window.location.href = 'sign-in.html';
}

function backToLogIn() {
    window.location.href = 'log-in.html';
}

function guestLogIn() {
    window.location.href = '../../html/add_task.html';
}

async function includeHTML() {
    let includeElements = document.querySelectorAll("[w3-include-html]");
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = "Page not found";
        }
    }
}

function renderOldContacts() {
    let singleContact = document.getElementById('contactName');
    singleContact.innerHTML = '';

    for (let i = 0; i < oldContacts.length; i++) {
        const oldContact = oldContacts[i];
        let name = oldContact['name'];
        let mail = oldContact['email'];
        let initials = name.split(" ").map((n) => n[0]).join("");

        singleContact.innerHTML += `
        <div onclick="showContact(${i})" class="name">
        <div class="initialCircle">${initials}</div>
        <div class="contactWrapper">
            <div class="fullName">${name}</div>
            <div class="email">${mail}</div>
        </div>
    </div>`;


        showContact(i);
    }

}








