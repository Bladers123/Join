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
    let userExists = users.find(user => user.email === newUser.email && user.name === newUser.name);
    if (userExists) {
        console.log("Benutzer existiert bereits:", userExists.name);
    } else {
        console.log("Kein Benutzer mit diesen Daten gefunden.\nNeuer Nutzer wird angelegt: ", newUser.name);
        users.push(newUser);
        await setItem('users', JSON.stringify(users));
    }
    await loadUsers();
}

function backToLogIn() {
    window.location.href = 'log-in.html';
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
