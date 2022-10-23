let cardValues = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10]
let openCardValue = 0

document.getElementById('game-container').addEventListener('click', handleClick);

function handleClick(event) {
    
    let cards = Array.from(this.children);
    let clickedCard = event.target.parentElement.parentElement;
    let index = cards.indexOf(clickedCard);
    console.log(index, cardValues[index]);
    let currentCardValue = cardValues[index];


    if (openCardValue === 0) {
        openCardValue = currentCardValue
    } else {
        if (openCardValue === currentCardValue) {
            console.log("Match found! YAY")
        } else {
            console.log("No match! :(")
        }
        openCardValue = 0

    }
}

//temporary funtion for testing cards
function flipCard(event) {
    console.log(event.target.parentElement.classList)
    if (event.target.parentElement.classList.contains("flip")) {
        event.target.parentElement.classList.remove("flip")
    } else {
        event.target.parentElement.classList.add("flip")
    }
}

function shuffleCards() {
    for (let i = cardValues.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = cardValues[i];
        cardValues[i] = cardValues[j];
        cardValues[j] = temp;
    }
}

function show(id) {
    document.getElementById(id).classList.remove("hidden");
}

function hide(id) {
    document.getElementById(id).classList.add("hidden"); 
}

function newGame() {
    shuffleCards() 
    console.log(cardValues);
    hide("menu-container");
    for (let i = 0; i<20; i++) {
        document.getElementById("game-container").innerHTML+=`<div class="card">
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

