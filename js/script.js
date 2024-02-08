
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




