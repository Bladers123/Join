function greetingTime() {
    let actualTime = new Date();
    let time = actualTime.getHours();

    if (time >= 5 && time < 12) {
        return "Guten Morgen";
    } else if (time >= 12 && time < 17) {
        return "Guten Mittag";
    } else if (time >= 17 && time < 24) {
        return "Guten Abend";
    } else {
        return "Gute Nacht";
    }
    
}

function welcomeGreeting() {
    let greet = document.getElementById('greet-time');
    greet.innerHTML = '';
    greet.innerHTML += greetingTime();
   
}