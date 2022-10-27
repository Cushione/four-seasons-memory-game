let cardValues = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10]
let openCardIndex = -1
let cardsToClose = []
let selectedSeason = ''
let time = 0
let timer
let moves = 0
let matches = 0

const MENU = {
    MAIN: "menu-buttons",
    THEME: "theme-buttons",
    RESULT: "game-result"
}

document.getElementById('game-board').addEventListener('click', handleClick);

function handleClick(event) {
    if (cardsToClose.length) {
        return
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
        document.getElementById("game-moves").innerHTML = `${++moves}`

        if (openCardValue === currentCardValue) {
            console.log("Match found! YAY")
            openCard.classList.add("matched")
            clickedCard.classList.add("matched")
            if (++matches === 10) {
                document.getElementById("final-moves").innerHTML = moves
                document.getElementById("final-time").innerHTML = time
                clearInterval(timer)
                changeMenu(MENU.RESULT)
                setTimeout(function () {
                    show("menu-container")
                    hide("game-container")
                    document.getElementById("game-container").classList.remove(selectedSeason)
                }, 2000)
            }
        } else {
            console.log("No match! :(")
            cardsToClose = [clickedCard, openCard]
            setTimeout(function () {
                closeOpenCards()
            }, 1300)

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
        setTimeout(function () {
            if (!card.classList.contains("flipped")) {
                card.children[0].children[1].style.setProperty('background-image', 'none')
            }
        }, 1000)
    } else {
        card.children[0].children[1].style.setProperty('background-image', `url(assets/images/themes/${selectedSeason}/${value}.png)`)
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

function newGame(season) {
    selectedSeason = season
    resetGame()
    document.getElementById('game-container').classList.add(season)
    hide("menu-container");
    let gameboard = document.getElementById("game-board")
    gameboard.innerHTML = ""
    for (let i = 0; i < 20; i++) {
        gameboard.innerHTML += `<div class="card">
        <div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back"></div>
        </div>
    </div>`
    }
    show("game-container");
}

function resetGame() {
    shuffleCards()
    moves = 0
    time = 0
    matches = 0
    document.getElementById("game-moves").innerHTML = moves
    document.getElementById("game-timer").innerHTML = time
    timer = setInterval(() => {
        document.getElementById("game-timer").innerHTML = ++time
    }, 1000);
}

function selectTheme() {
    changeMenu(MENU.THEME);
}

function showMainMenu() {
    changeMenu(MENU.MAIN)
}

function changeMenu(menuId) {
    let menuElements = document.getElementById("menu-container").children
    for (let element of menuElements) {
        if (element.id === "game-name") {
            continue
        } else if (element.id === menuId) {
            element.classList.remove("hidden")
        } else {
            element.classList.add("hidden")
        }
    }
}