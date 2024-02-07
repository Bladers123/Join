let users = [];

async function initRegister() {
    await loadUsers();
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

async function loadUsers(){
    users = JSON.parse(await getItem('users'));
    console.log(users);
}

