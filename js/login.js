
let users = [];

async function initLogIn() {
    await loadUsers();
}

function navToSignIn() {
    window.location.href = '../../html/user-login/sign-in.html';
}

function guestLogIn() {
    window.location.href = '../../html/add_task.html';
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

function logIn() {
    let email = document.getElementById('emailInput').value;
    let password = document.getElementById('passwordInput').value;
    let user = users.find(user => user.email === email && user.password === password);

    if (user) {
        console.log("Login erfolgreich für: ", user.name);
        window.location.href = '../../html/summary.html';
    } else
        console.log("Falsche E-Mail oder Passwort.");
}
