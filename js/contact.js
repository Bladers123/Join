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
