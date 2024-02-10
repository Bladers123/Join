

function openContact() {
    document.getElementById("contactOverlay").classList.remove("d-none");
}

function closeContact() {
    document.getElementById("contactOverlay").classList.add("d-none");
}


function showContact(i) {
    let selectedName = oldContacts[i];
    let name = selectedName['name'];
    let mail = selectedName['email'];
    let number = selectedName['tel'];
    let initials = name.split(" ").map((n) => n[0]).join("");

    let contact = document.getElementById('open-contact');
    contact.innerHTML = '';
    contact.innerHTML += generateHTML(name, mail, number, initials);
}

function openPopUp() {
    document.getElementById('pop-up').classList.remove('d-none');
    document.getElementById('pop-up').classList.add('d-flex');
}

function closePopUp() {
    document.getElementById('pop-up').classList.add('d-none');
    document.getElementById('pop-up').classList.remove('d-flex');
}

async function createContact() {
    let name = document.getElementById('contact-name');
    let mail = document.getElementById('contact-email');
    let tel = document.getElementById('contact-tel');

    let newContact = {
        "name": name.value,
        "mail": mail.value,
        "tel": tel.value
    };

    oldContacts.push(newContact);
    console.log(oldContacts)
    await setItem('oldContacts', JSON.stringify(newContact));

    renderOldContacts();

    name.value = '';
    mail.value = '';
    tel.value = '';

}

async function loadContacts() {
    oldContacts = JSON.parse(await getItem('oldContacts'));

}
