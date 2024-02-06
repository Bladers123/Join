function getSignUpTemplate() {
    return /*html*/`
    <div>
        <img onclick="backToLogIn()" src="./img/arrow.svg">
        <div class="head">
            <h1>Sign up</h1>
            <div class="underline"></div>
        </div>
        <div class="input-container">
            <div class="input">
                <input placeholder="Name" type="email">
                <img src="./img/person.svg">
            </div>
            <div class="input">
                <input placeholder="E-Mail" type="email">
                <img src="./img/mail.svg">
            </div>
            <div class="input">
                <input placeholder="Password" type="password">
                <img src="./img/lock.svg">
            </div>
            <div class="input">
                <input placeholder="Confirm password" type="password">
                <img src="./img/lock.svg">
            </div>
            <div class="checkbox">
                <div><input type="checkbox" style="cursor: pointer;"></div>
                <span>I accept the<span class="blue"> privacy Policy</span></span>
            </div>
            <div class="style-btns">
                <button class="dark-btn">Sign in</button>
            </div>
        </div>
    </div> 
   `;
}