function addActiveState(path, id) {
    const currentPageUrl = window.location.pathname;

    if (path === currentPageUrl) {
        document.getElementById(id).classList.add("active");
    }

    console.log(currentPageUrl);
}
