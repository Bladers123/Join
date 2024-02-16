let users = [];

async function initRegister() {
    await loadUsers();
}

async function register() {
    let newUser = {
        name: inputName.value,
        email: inputEmail.value,
        password: inputPassword.value,
    };
    users.push(newUser);
    await setItem('users', JSON.stringify(users));
    await loadUsers();
}

async function loadUsers() {
    try {
        let loadedUsers = JSON.parse(await getItem('users'));
        if (Array.isArray(loadedUsers)) {
            users = loadedUsers;
        } else {
            console.log("Keine Benutzer gefunden, Initialisierung mit einem leeren Array.");
            users = [];
        }
    } catch (error) {
        console.error("Fehler beim Laden der Benutzer: ", error);
        users = [];
    }

    console.log("Alle geladenen Benutzer: ", users);
}
