//temporary funtion for testing cards
function flipCard(event) {
    console.log(event.target.parentElement.classList)
    if (event.target.parentElement.classList.contains("flip")) {
        event.target.parentElement.classList.remove("flip")
    } else {
        event.target.parentElement.classList.add("flip")
    }
}

function show(id) {
    document.getElementById(id).classList.remove("hidden");
}

function hide(id) {
    document.getElementById(id).classList.add("hidden"); 
}

function newGame() {
    hide("menu-container");
    for (let i = 0; i<20; i++) {
        document.getElementById("game-container").innerHTML+=`<div class="card" onclick="flipCard(event)">
        <div class="card-inner">
            <div class="card-front">
                <p>card front</p>
            </div>
            <div class="card-back">
                <p>card back</p>
            </div>
        </div>
    </div>`
    }
    show("game-container");
}

function selectTheme() {
    hide("menu-buttons");
    show("theme-buttons");
}

