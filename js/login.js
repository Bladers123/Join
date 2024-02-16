
let users = [];


async function initLogIn(){
    await loadUsers();
}

function navToSignIn() {
    window.location.href = '../../html/user-login/sign-in.html';
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
