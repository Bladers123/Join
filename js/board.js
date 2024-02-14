let task = [];

function initBoard() {
    task = JSON.parse(localStorage.getItem('task')) || [];
    this.task = task;
    console.log(task);
}
