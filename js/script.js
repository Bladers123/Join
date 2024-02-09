
function init() {
    includeHTML();
    welcomeGreeting();
    
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
        let number = oldContact['tel'];
        let initials = name.split(" ").map((n) => n[0]).join("");
        
        singleContact.innerHTML += `
        <div onclick="openContact()" class="name">
        <div class="initialCircle">${initials}</div>
        <div class="contactWrapper">
            <div class="fullName">${name}</div>
            <div class="email">${mail}</div>
        </div>
    </div>`;

        openContact(name, mail, number, initials, i);
    }

}

function openContact(name, mail, number, initials) {
    let contact = document.getElementById('open-contact');
    contact.innerHTML = '';
    contact.innerHTML += generateHTML(name, mail, number, initials);
}


function greetingTime() {
    let actualTime = new Date();
    let time = actualTime.getHours();

    if (time >= 5 && time < 12) {
        return "Guten Morgen";
    } else if (time >= 12 && time < 17) {
        return "Guten Mittag";
    } else if (time >= 17 && time < 24) {
        return "Guten Abend";
    } else {
        return "Gute Nacht";
    }
    
}

function welcomeGreeting() {
    let greet = document.getElementById('greet-time');
    greet.innerHTML = '';
    greet.innerHTML += greetingTime();
   
}

function openPopUp() {
    document.getElementById('pop-up').classList.remove('d-none');
    document.getElementById('pop-up').classList.add('d-flex');
}

function closePopUp() {
    document.getElementById('pop-up').classList.add('d-none');
    document.getElementById('pop-up').classList.remove('d-flex');
}


