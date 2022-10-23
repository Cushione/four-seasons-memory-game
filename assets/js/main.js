function show(id) {
    document.getElementById(id).classList.remove("hidden");
}

function hide(id) {
    document.getElementById(id).classList.add("hidden"); 
}

function newGame() {
    hide("menu-container");
    show("game-container");
}

function selectTheme() {
    hide("menu-buttons");
    show("theme-buttons");
}

