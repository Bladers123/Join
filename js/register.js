let users = [];
let contacts = [];

async function initRegister() {
    await loadUsers();
  //  await loadContacts();
    renderOldContacts();
   // renderContacts();
}

async function register() {
    let user = [];
    user.push({
        name: inputName.value,
        email: inputEmail.value,
        password: inputPassword.value,
    });

    await setItem('users', JSON.stringify(user));

}

async function loadUsers() {
    users = JSON.parse(await getItem('users'));
    console.log(users);
}

/*async function contactBook() {
    let contact = [];
    contact.push({
        name: contactName.value,
        email: contactEmail.value,
        tel: contactTel.value,
    });

    await setItem('contacts', JSON.stringify(contact));

    contactName.value = '';
    contactEmail.value = '';
    contactTel.value = ''; 
}

async function loadContacts() {
    contacts = JSON.parse(await getItem('contacts'));

}

 function renderContacts() {

    let singleContact = document.getElementById('single-contacts');
    singleContact.innerHTML = '';

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        let name = contact['name']
        let mail = contact['email']

        console.log(contact['email'])

        singleContact.innerHTML += `
        <div class="initialCircle">AB</div>
        <div class="contactWrapper">
            <div class="fullName">${name}</div>
            <div class="email">${mail}</div>
        </div>`;
    }
}*/