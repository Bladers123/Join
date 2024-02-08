function initTask(){
    loadComboBox();
}

function loadComboBox(){
    let checkList = document.getElementById('list1');
    if(checkList) {
        let anchor = checkList.getElementsByClassName('anchor')[0];
        if(anchor) {
            anchor.onclick = function(evt) {
              if (checkList.classList.contains('visible'))
                checkList.classList.remove('visible');
              else
                checkList.classList.add('visible');
            }
        }
    }
}