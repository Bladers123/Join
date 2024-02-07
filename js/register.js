let users = [];

async function init() {
    // loadUsers();
}

async function loadUsers() {
    try {
        users = JSON.parse(await getItem("users"));
    } catch (e) {
        console.log("Loading error:", e);
    }
}

async function signIn() {
    registerBtn.disabled = true;
    users.push({
        email: email.value,
        password: password.value,
    });
    await setItem("users", JSON.stringify(users));
    resetForm();
}

function resetForm() {
    email.value = "";
    password.value = "";
    registerBtn.disabled = false;
}
