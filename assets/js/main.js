let cardValues = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10]
let openCardIndex = -1
let cardsToClose = []

document.getElementById('game-container').addEventListener('click', handleClick);

function handleClick(event) {
    
    if(cardsToClose.length) {
        closeOpenCards()
    }

    let cards = Array.from(this.children);
    let clickedCard = event.target.parentElement.parentElement;

    if (!clickedCard.classList.contains("card") || clickedCard.classList.contains("matched")) {
        console.log("not a card or already matched")
        return
    }

    let index = cards.indexOf(clickedCard);
    console.log(index, cardValues[index]);

    if (openCardIndex !== -1 && openCardIndex === index) {
        console.log("same card")
        return
    }

    let currentCardValue = cardValues[index];
    flipCard(clickedCard, currentCardValue)


    if (openCardIndex === -1) {
        openCardIndex = index
    } else {
        let openCardValue = cardValues[openCardIndex]
        let openCard = cards[openCardIndex]
        if (openCardValue === currentCardValue) {
            console.log("Match found! YAY")
            openCard.classList.add("matched")
            clickedCard.classList.add("matched")
        } else {
            console.log("No match! :(") 
            cardsToClose = [clickedCard, openCard] 
            setTimeout(function () {
                closeOpenCards()
            }, 2000)

        }
        openCardIndex = -1

    }
}

function closeOpenCards() {
    for (let card of cardsToClose) {
        flipCard(card)
    }
    cardsToClose = []
}

function flipCard(card, value) {
    if (card.classList.contains("flipped")) {
        card.classList.remove("flipped")
        card.children[0].children[1].innerHTML = ""
    } else {
        card.children[0].children[1].innerHTML = value
        card.classList.add("flipped")
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
    for (let i = 0; i < 20; i++) {
        document.getElementById("game-container").innerHTML += `<div class="card">
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