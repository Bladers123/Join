let oldContacts = [
    {
        name: "Barbara Müller",
        email: "baerbelchen@online.de",
        tel: "01629223027",
    },
    {
        name: "Tristan Gehrig",
        email: "tristan@gmail.com",
        tel: "017612312333",
    },
    {
        name: "Julian Fichtl",
        email: "julian@gmail.com",
        tel: "01529483027",
    },
    {
        name: "Bulian Fichtl",
        email: "julian@gmail.com",
        tel: "01529483027",
    },
    {
        name: "Culian Fichtl",
        email: "julian@gmail.com",
        tel: "01529483027",
    },
    {
        name: "Rabia Ürkmez",
        email: "rabia@gmail.com",
        tel: "017612312333",
    },
    {
        name: "Agathe Bauer",
        email: "igotthe@bauer.com",
        tel: "071319991122",
    },
    {
        name: "Bertold Cislewitz",
        email: "familie@galgant.de",
        tel: "017612312333",
    },
    {
        name: "Christine Dorst",
        email: "hab@durst.com",
        tel: "017612312333",
    },
    {
        name: "Dominik Emmerich",
        email: "schimmelich@t-online.de",
        tel: "015112314027",
    },
    {
        name: "Erol Fleischer",
        email: "fleischi@gmail.com",
        tel: "017112954562",
    },
    {
        name: "Frank Gül",
        email: "francis-gulle@yahoo.de",
        tel: "017612312333",
    },
    {
        name: "Gustav Holm",
        email: "hoelmchen@gmx.de",
        tel: "01744975233",
    },
];
let letters = [];

function openContact() {
    document.getElementById("contactOverlay").classList.remove("d-none");
}

function closeContact() {
    document.getElementById("contactOverlay").classList.add("d-none");
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
                <div class="initialCircle">${initials}</div>
                    <div class="contactWrapper">
                        <div class="fullName">${name}</div>
                    <div class="email">${mail}</div>
                </div>
            </div>`;

        showContact(i);
    }
}

function showContact(i) {
    let selectedName = oldContacts[i];
    let name = selectedName["name"];
    let mail = selectedName["email"];
    let number = selectedName["tel"];
    let initials = name
        .split(" ")
        .map((n) => n[0])
        .join("");
    let letter = name.charAt(0);

    letters.push(letter);

    let contact = document.getElementById("open-contact");
    contact.innerHTML = "";
    contact.innerHTML += generateHTML(name, mail, number, initials);
}

async function createContact() {
    let name = document.getElementById("contact-name");
    let mail = document.getElementById("contact-email");
    let tel = document.getElementById("contact-tel");

    let newContact = {
        name: name.value,
        mail: mail.value,
        tel: tel.value,
    };

    oldContacts.push(newContact);

    //   await setItem('oldContacts', JSON.stringify(newContact));

    renderOldContacts();

    name.value = "";
    mail.value = "";
    tel.value = "";
}

function deleteContact(i) {
    oldContacts.splice(i, 1);
    letters.splice(i, 1);

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
}
