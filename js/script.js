
async function init() {
    await setup();
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

async function setup() {
    await includeHTML();
    let button = document.getElementById('user-button-initials');
    if (button){
        let user = JSON.parse(await getItem('user'));
        button.innerHTML =  user.name.split(' ').map(part => part[0].toUpperCase()).join('');
    }  
    else
        console.log('Button nicht gefunden');
}


