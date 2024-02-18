let users = [];

async function initRegister() {
    await loadUsers();
}

async function register() {
    if (isPasswordConfirmed()) {
        let newUser = {
            name: inputName.value,
            email: inputEmail.value,
            password: inputPassword.value,
        };
        let userExists = users.find(user => user.email === newUser.email && user.name === newUser.name);
        if (userExists) {
            console.log("Benutzer existiert bereits:", userExists.name);
            let failureText = document.getElementById('failureText');
            failureText.innerHTML = 'User already exists';
        } else {
            console.log("Kein Benutzer mit diesen Daten gefunden.\nNeuer Nutzer wird angelegt: ", newUser.name);
            users.push(newUser);
            await setItem('users', JSON.stringify(users));
            document.getElementById('popup-container').innerHTML = getPopUpTemplate();
            setTimeout(function () {
                window.location.href = '../../html/user-login/log-in.html';
            }, 1000);
        }
        await loadUsers();
    }
}

function backToLogIn() {
    window.location.href = 'log-in.html';
}

// zum testen drinne
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

function getPopUpTemplate() {
    return /*html*/`
    <div class="overlay">
       <div id="popup" class="popup">
           <div class="popup-content">
              <span>Your Signed Up successfully</span>
           </div>
       </div>
   </div> 
`;
}

function isPasswordConfirmed() {
    let password = document.getElementById("inputPassword");
    let confirmPassword = document.getElementById("inputConfirmPassword");
    let confirmPasswordContainer = document.getElementById('confirm-password-container');
    if (password.value === confirmPassword.value) {
        confirmPasswordContainer.style.border = "";
        return true;
    }
    else {
        let failureText = document.getElementById('failureText');
        failureText.innerHTML = 'Ups! your password dont match';
        confirmPasswordContainer.style.border = "2px solid #FF4057"
        return false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('confirm-password-container').addEventListener('click', function() {
        this.style.border = "";
        document.getElementById('failureText').innerHTML = "";
    });
});




