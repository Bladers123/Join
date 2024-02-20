function greetingTime() {
    let actualTime = new Date();
    let time = actualTime.getHours();

    if (time >= 5 && time < 11) {
        return "Guten Morgen";
    } else if (time >= 11 && time < 17) {
        return "Guten Mittag";
    } else if (time >= 17 && time < 23) {
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

function concat() {
    let getAllArrays = tasks.concat(currentTask);
}

function showAmounts() {
    for (let t = 0; t < tasks.length; t++) {
        const task = tasks[t];
        progress = task['progress']

        console.log(progress)
    }


    // let toDoAmount = document.getElementById('to-do-amount');
    // toDoAmount.innerHTML = '';
    // toDoAmount.innerHTML += tasks.length

    // console.log(toDoAmount)
    
}