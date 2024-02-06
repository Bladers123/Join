function getSignUpTemplate() {
    return /*html*/`
        <img onclick="backToLogIn()" src="./img/arrow.svg">
        <div class="head">
            <h1>Sign up</h1>
            <div class="underline"></div>
        </div>
        <form class="input-container" onsubmit="signIn(event)">
            <div class="input">
                <input placeholder="Name" type="text" required name="name">
                <img src="./img/person.svg">
            </div>
            <div class="input">
                <input placeholder="E-Mail" type="email" required>
                <img src="./img/mail.svg">
            </div>
            <div class="input">
                <input placeholder="Password" type="password" required>
                <img src="./img/lock.svg">
            </div>
            <div class="input">
                <input placeholder="Confirm password" type="password" required>
                <img src="./img/lock.svg">
            </div>
            <div class="checkbox">
                <div><input type="checkbox" style="cursor: pointer;"></div>
                <span>I accept the<span class="blue"> privacy Policy</span></span>
            </div>
            <div class="style-btns">
                <button class="dark-btn">Sign in</button>
            </div>
        </form>
   `;
}