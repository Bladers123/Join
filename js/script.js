const STORAGE_TOKEN = "HEBY7BJY7CQ0IQVYI4ONXU7EY6B8UWVM7BGO8RTP";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";


function loadHomepage() {
        setTimeout(function () {
            let loading = document.getElementById('loading');
        }, 7000); 
    
}

function logIn() {
    let container = document.getElementById('container');
    container.innerHTML = getLogInTemplate();
    document.getElementById('sign-header').classList.remove('d-none');
    document.getElementById('container').classList.remove('sign-height');
}

function signUp() {
    let container = document.getElementById("container");
    container.innerHTML = getSignUpTemplate();
    document.getElementById('sign-header').classList.add('d-none');
    document.getElementById('container').classList.add('sign-height');
}

function backToLogIn() {
    logIn();
}

function guestLogIn() {
    window.location.href = '../html/add_task.html';
}

async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: "POST", body: JSON.stringify(payload) }).then((res) => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url)
        .then((res) => res.json())
        .then((res) => {
            if (res.data) {
                return res.data.value;
            }
            throw `Could not find data with key "${key}".`;
        });
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
