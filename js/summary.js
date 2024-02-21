let tasks = [];

async function initSummary() {
    tasks = JSON.parse(await getItem('tasks') || '[]');
    showAmounts();
}

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
    let getAllArrays = tasks.concat(task);

    console.log(getAllArrays)
}

function showAmounts() {
    let toDos = [];
    let feedbacks = [];
    let dones = [];
    let inProgresses = [];
    let prioUrgent = [];

    for (let t = 0; t < tasks.length; t++) {
        const task = tasks[t];

        if (task.priority === 'Urgent') {
            prioUrgent.push(task.priority);
        }

        switch (task.progress) {
            case 'toDo':
                toDos.push(task.progress);
                break;
            case 'feedback':
                feedbacks.push(task.progress);
                break;
            case 'done':
                dones.push(task.progress);
                break;
            case 'inProgress':
                inProgresses.push(task.progress);
                break;
            default:
                break;

        }
    }

    document.getElementById('to-do-amount').innerHTML = toDos.length;
    document.getElementById('done-amount').innerHTML = dones.length;
    document.getElementById('feedback-amount').innerHTML = feedbacks.length;
    document.getElementById('progress-amount').innerHTML = inProgresses.length;
    document.getElementById('tasks-amount').innerHTML = tasks.length;
    document.getElementById('font-urgent-number').innerHTML = prioUrgent.length;
}

