let testUsers = [];

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

function backToLogIn() {
    window.location.href = 'log-in.html';
}

function guestLogIn() {
    window.location.href = '../../html/add_task.html';
}

async function loadUsers() {
    try {
        let loadedUsers = JSON.parse(await getItem('users'));
        if (Array.isArray(loadedUsers)) {
            testUsers = loadedUsers;
        } else {
            console.log("Keine Benutzer gefunden, Initialisierung mit einem leeren Array.");
            testUsers = [];
        }
    } catch (error) {
        console.error("Fehler beim Laden der Benutzer: ", error);
        testUsers = [];
    }

    console.log("Alle geladenen Benutzer: ", testUsers);
}
