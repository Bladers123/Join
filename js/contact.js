let oldContacts = [
    {
        name: "Barbara Müller",
        email: "baerbelchen@online.de",
        tel: "01629223027",
        bg: "rgb(255,122,0)"
    },
    {
        name: "Tristan Gehring",
        email: "tristan@gmail.com",
        tel: "017612312333",
        bg: "rgb(0,190,232)"
    },
    {
        name: "Julian Fichtl",
        email: "julian@gmail.com",
        tel: "01529483027",
        bg: "rgb(70,47,138)"
    },
    {
        name: "Bulian Fichtl",
        email: "julian@gmail.com",
        tel: "01529483027",
        bg: "rgb(252,113,255)"
    },
    {
        name: "Culian Fichtl",
        email: "julian@gmail.com",
        tel: "01529483027",
        bg: "rgb(255,187,43)"
    },
    {
        name: "Rabia Ürkmez",
        email: "rabia@gmail.com",
        tel: "017612312333",
        bg: "rgb(255,70,70)"
    },
    {
        name: "Agathe Bauer",
        email: "igotthe@bauer.com",
        tel: "071319991122",
        bg: "rgb(31,215,193)"
    },
    {
        name: "Bertold Cislewitz",
        email: "familie@galgant.de",
        tel: "017612312333",
        bg: "rgb(110,82,255)"
    },
    {
        name: "Christine Dorst",
        email: "hab@durst.com",
        tel: "017612312333",
        bg: "rgb(70,47,138)"
    },
    {
        name: "Dominik Emmerich",
        email: "schimmelich@t-online.de",
        tel: "015112314027",
        bg: "rgb(31,215,193)"
    },
    {
        name: "Frank Gül",
        email: "francis-gulle@yahoo.de",
        tel: "017612312333",
        bg: "rgb(255,122,0)"
    },
    {
        name: "Gustav Holm",
        email: "hoelmchen@gmx.de",
        tel: "01744975233",
        bg: "rgb(252,113,255)",
    },
];
let letters = [];
let selectedName;

function initContacts() {
    renderOldContacts();
}


function renderOldContacts() {
    let renderContact = document.getElementById("contactName");
    let currentLetter = null;
    renderContact.innerHTML = "";

    oldContacts.sort((a, b) => a.name.localeCompare(b.name)); // sortiert das Array erst einmal alphabetisch

    for (let i = 0; i < oldContacts.length; i++) {
        const oldContact = oldContacts[i];
        let name = oldContact["name"];
        let mail = oldContact["email"];
        let bg = oldContact["bg"];
        let initials = name
            .split(" ")
            .map((n) => n[0])
            .join("");
        let sortedByLetter = name.charAt(0);

        if (sortedByLetter !== currentLetter) {
            currentLetter = sortedByLetter;
            renderContact.innerHTML += `
            <div class="letterWrapper">
                <div class="Buchstabe">${sortedByLetter}</div>
                <div class="divider"></div>
            </div>
            `;
        } else {
            console.log("versuchs nochmal");
        }

        renderContact.innerHTML += `    
            <div onclick="showContact(${i})" class="name">
                <div class="initialCircle" style="background-color: ${bg};">${initials}</div>
                    <div class="contactWrapper">
                        <div class="fullName">${name}</div>
                    <div class="email">${mail}</div>
                </div>
            </div>`;

        //showContact(i);
    }
}

function showContact(i) {
    document.getElementById("resize-contact").classList.remove("d-none");
    selectedName = oldContacts[i];
    let name = selectedName["name"];
    let mail = selectedName["email"];
    let number = selectedName["tel"];
    let bg = selectedName["bg"];
    let initials = name
        .split(" ")
        .map((n) => n[0])
        .join("");
    let letter = name.charAt(0);

    letters.push(letter);

    let contact = document.getElementById("open-contact");
    contact.classList.remove("d-none");
    contact.innerHTML = "";
    contact.innerHTML += generateHTML(name, mail, number, bg, initials, i);
}

async function createContact() {
    let name = document.getElementById("contact-name");
    let mail = document.getElementById("contact-email");
    let tel = document.getElementById("contact-tel");
    let x = Math.floor(Math.random() * 255) + 1;
    let y = Math.floor(Math.random() * 255) + 1;
    let z = Math.floor(Math.random() * 255) + 1;

    let newContact = {
        name: name.value,
        email: mail.value,
        tel: tel.value,
        bg: `rgb(${x},${y},${z})`,
    };

    oldContacts.push(newContact);

    //   await setItem('oldContacts', JSON.stringify(newContact));

    renderOldContacts();

    name.value = "";
    mail.value = "";
    tel.value = "";
}

function saveContact(i) {
    document.getElementById("edit-pop-up").classList.add("d-none");
    document.getElementById("edit-pop-up").classList.remove("d-flex");

    let newName = document.getElementById('old-name').value;
    let newMail = document.getElementById('old-email').value;
    let newTel = document.getElementById('old-tel').value;

    oldContacts[i]["name"] = newName
    oldContacts[i]["email"] = newMail
    oldContacts[i]["tel"] = newTel


    showContact(i);
    renderOldContacts();

}

function editContact(name, mail, number, bg, initials, i) {
    document.getElementById("edit-pop-up").classList.remove("d-none");
    document.getElementById("edit-pop-up").classList.add("d-flex");

    let edit = document.getElementById("edit-pop-up");
    edit.innerHTML = '';
    edit.innerHTML += generateEditContactHTML(bg, initials, name, mail, number, i);
}

function deleteContact(i) {
    oldContacts.splice(i, 1);
    letters.splice(i, 1);

    document.getElementById('open-contact').classList.add("d-none");


    renderOldContacts();
}

/*async function loadContacts() {
    oldContacts = JSON.parse(await getItem('oldContacts'));

}*/

function openPopUp() {
    document.getElementById("pop-up").classList.remove("d-none");
    document.getElementById("pop-up").classList.add("d-flex");
}

function closePopUp() {
    document.getElementById("pop-up").classList.add("d-none");
    document.getElementById("pop-up").classList.remove("d-flex");
    document.getElementById("edit-pop-up").classList.add("d-none");
    document.getElementById("edit-pop-up").classList.remove("d-flex");
}


function openContactonResize() {

    if (window.innerWidth >= 1300) {
        console.log('Viel Spaß beim Resizen ;-)');
        document.getElementById("resize-contact").classList.add("contentRightOverlay");
    } else {
        document.getElementById("resize-contact").classList.remove("d-none");
    }
}


function closeContact() {
    document.getElementById("resize-contact").classList.add("d-none");
}

window.onresize = openContactonResize;