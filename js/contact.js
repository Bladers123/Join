let oldContacts = [
    {
        name: "Barbara Müller",
        email: "baerbelchen@online.de",
        tel: "01629223027",
        bg: "rgb(255,122,0)",
        selected: false,
    },
    {
        name: "Tristan Gehring",
        email: "tristan@gmail.com",
        tel: "017612312333",
        bg: "rgb(0,190,232)",
        selected: false,
    },
    {
        name: "Julian Fichtl",
        email: "julian@gmail.com",
        tel: "01529483027",
        bg: "rgb(70,47,138)",
        selected: false,
    },
    {
        name: "Bulian Fichtl",
        email: "julian@gmail.com",
        tel: "01529483027",
        bg: "rgb(252,113,255)",
        selected: false,
    },
    {
        name: "Culian Fichtl",
        email: "julian@gmail.com",
        tel: "01529483027",
        bg: "rgb(255,187,43)",
        selected: false,
    },
    {
        name: "Rabia Ürkmez",
        email: "rabia@gmail.com",
        tel: "017612312333",
        bg: "rgb(255,70,70)",
        selected: false,
    },
    {
        name: "Agathe Bauer",
        email: "igotthe@bauer.com",
        tel: "071319991122",
        bg: "rgb(31,215,193)",
        selected: false,
    },
    {
        name: "Bertold Cislewitz",
        email: "familie@galgant.de",
        tel: "017612312333",
        bg: "rgb(110,82,255)",
        selected: false,
    },
    {
        name: "Christine Dorst",
        email: "hab@durst.com",
        tel: "017612312333",
        bg: "rgb(70,47,138)",
        selected: false,
    },
    {
        name: "Dominik Emmerich",
        email: "schimmelich@t-online.de",
        tel: "015112314027",
        bg: "rgb(31,215,193)",
        selected: false,
    },
    {
        name: "Frank Gül",
        email: "francis-gulle@yahoo.de",
        tel: "017612312333",
        bg: "rgb(255,122,0)",
        selected: false,
    },
    {
        name: "Gustav Holm",
        email: "hoelmchen@gmx.de",
        tel: "01744975233",
        bg: "rgb(252,113,255)",
        selected: false,
    },
];

let letters = [];
let selectedName;
let openContact = false;
let selectedContactIndex;

async function initContacts() {
    oldContacts = JSON.parse(await getItem("oldContacts"));
    renderOldContacts();
}

function renderOldContacts() {
    let renderContact = document.getElementById("contactName");
    let currentLetter = null;
    renderContact.innerHTML = "";
    oldContacts.sort((a, b) => a.name.localeCompare(b.name));
    getVariablesToRender(renderContact, currentLetter)
}

function getVariablesToRender(renderContact, currentLetter) {
    for (let i = 0; i < oldContacts.length; i++) {
        const oldContact = oldContacts[i];
        let name = oldContact["name"];
        let mail = oldContact["email"];
        let bg = oldContact["bg"];
        name = name.charAt(0).toUpperCase() + name.slice(1);
        let initials = name.split(" ").map((n) => n[0]).join("");
        let sortedByLetter = name.charAt(0);

        if (sortedByLetter !== currentLetter) {
            currentLetter = sortedByLetter;
            renderContact.innerHTML += generateRegisterHTML(sortedByLetter);
        }
        renderContact.innerHTML += renderContactToRegister(i, bg, initials, name, mail);
    }
}

function showContact(i) {
    document.querySelectorAll('.contact-item').forEach(item => {
        item.classList.remove('setUserproperty');
    });
    document.getElementById('contact' + i).classList.add('setUserproperty');
    document.getElementById("resize-contact").classList.remove("d-none");
    console.log(i);
    selectedName = oldContacts[i];
    let name = selectedName["name"];
    let mail = selectedName["email"];
    let number = selectedName["tel"];
    let bg = selectedName["bg"];
    let initials = name.split(" ").map((n) => n[0]).join("");
    let letter = name.charAt(0);
    letters.push(letter);
    let contact = document.getElementById("open-contact");
    contact.classList.remove("d-none");
    contact.innerHTML = "";
    contact.innerHTML += generateHTMLshowContact(name, mail, number, bg, initials, i);
}


function toggleContact(i) {
    if (openContact && selectedContactIndex === i) {
        document.getElementById("open-contact").classList.add("d-none");
        openContact = false;
    } else {
        showContact(i);
        openContact = true;
        selectedContactIndex = i;
    }
}

async function createContact() {
    let name = document.getElementById("contact-name").value;
    let mail = document.getElementById("contact-email").value;
    let tel = document.getElementById("contact-tel").value;
    let selected = false;
    let x = Math.floor(Math.random() * 255) + 1;
    let y = Math.floor(Math.random() * 255) + 1;
    let z = Math.floor(Math.random() * 255) + 1;

    let newContact = {
        name: name,
        email: mail,
        tel: tel,
        bg: `rgb(${x},${y},${z})`,
        selected,
    };

    oldContacts = oldContacts.concat(newContact);
    sendToBackend();
    renderOldContacts();
    closePopUp();
}


async function sendToBackend() {
    await setItem("oldContacts", JSON.stringify(oldContacts));
}

function saveContact(i) {
    document.getElementById("edit-pop-up").classList.add("d-none");
    document.getElementById("edit-pop-up").classList.remove("d-flex");

    let newName = document.getElementById("old-name").value;
    let newMail = document.getElementById("old-email").value;
    let newTel = document.getElementById("old-tel").value;

    oldContacts[i]["name"] = newName;
    oldContacts[i]["email"] = newMail;
    oldContacts[i]["tel"] = newTel;

    showContact(i);
    renderOldContacts();
    sendToBackend();
}

function editContact(name, mail, number, bg, initials, i) {
    document.getElementById("edit-pop-up").classList.remove("d-none");
    document.getElementById("edit-pop-up").classList.add("d-flex");

    let edit = document.getElementById("edit-pop-up");
    edit.innerHTML = "";
    edit.innerHTML += generateEditContactHTML(bg, initials, name, mail, number, i);
}

function deleteContact(i) {
    oldContacts.splice(i, 1);
    letters.splice(i, 1);
    document.getElementById("open-contact").classList.add("d-none");
    renderOldContacts();
    sendToBackend();
}

function openPopUp() {
    document.getElementById("pop-up").classList.remove("d-none");
    document.getElementById("pop-up").classList.add("d-flex");
}

function closePopUp() {
    document.getElementById("pop-up").classList.add("d-none");
    document.getElementById("pop-up").classList.remove("d-flex");
    document.getElementById("edit-pop-up").classList.add("d-none");
    document.getElementById("edit-pop-up").classList.remove("d-flex");
    document.getElementById("contact-name").value = "";
    document.getElementById("contact-email").value = "";
    document.getElementById("contact-tel").value = "";
}


function openMobileName() {
    document.getElementById("resize-contact").classList.remove("d-none-1300");
}

function closeContact() {
    document.getElementById("resize-contact").classList.add("d-none-1300");
}
