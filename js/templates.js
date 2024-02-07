function getLogInTemplate() {
    return /*html*/ `            
        <div class="head">
            <h1>Log in</h1>
            <div class="underline"></div>
        </div>

        <div class="input-container">
            <div class="input">
                <input placeholder="E-Mail" type="email">
                <img src="../../img/mail.svg">
            </div>

            <div class="input">
                <input placeholder="Password" type="password">
                <img src="../../img/lock.svg">
            </div>

            <div class="checkbox">
                <div><input type="checkbox" style="cursor: pointer;"></div>
                <span>Remember me</span>
            </div>

            <div class="style-btns">
                <button class="dark-btn w180">Log in</button>
                <button onclick="guestLogIn()" class="light-btn w180">Guest Log in</button>
            </div>
        </div>
    `;
}

function getSignUpTemplate() {
    return /*html*/ `
        <img class="arrow" onclick="backToLogIn()" src="../img/arrow.svg">
        <div class="head">
            <h1>Sign up</h1>
            <div class="underline"></div>
        </div>
        <form class="input-container" onsubmit="signIn()">
            <div class="input">
                <input placeholder="Name" type="text" required>
                <img src="../../img/person.svg">
            </div>
            <div class="input">
                <input id="email" placeholder="E-Mail" type="email" required>
                <img src="../../img/mail.svg">
            </div>
            <div class="input">
                <input id="password" placeholder="Password" type="password" required>
                <img src="../../img/lock.svg">
            </div>
            <div class="input">
                <input placeholder="Confirm password" type="password" required>
                <img src="../../img/lock.svg">
            </div>
            <div class="checkbox">
                <div>
                    <input class="checkbox-input" type="checkbox" type="checkbox" required>
                </div>
                <span>I accept the<span class="blue"> privacy Policy</span></span>
            </div>
            <div class="style-btns">
                <button id="registerBtn" class="dark-btn">Sign in</button>
            </div>
        </form>
   `;
}
