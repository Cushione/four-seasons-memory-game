// Variables
let cardValues = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10]
let openCardIndex = -1
let cardsToClose = []
let selectedSeason = ''
let time = 0
let timer
let moves = 0
let matches = 0
let highScoreList = JSON.parse(localStorage.getItem("highScore")) || [];

// Ids of the menu elements
const MENU = {
    MAIN: "menu-buttons",
    THEME: "theme-buttons",
    HIGHSCORE: "high-score-menu",
    RESULT: "game-result",
    HOWTOPLAY: "how-to-play"
}

// Gameplay functions

// Add click event listener to the game board
document.getElementById('game-board').addEventListener('click', handleCardClick);

// Handle click on a card in the game
function handleCardClick(event) {

    // Prevent click if two cards are still open
    if (cardsToClose.length) {
        return
    }

    // Find all the cards on the board
    let cards = Array.from(this.children);
    // Find clicked card
    let clickedCard = event.target.parentElement.parentElement;

    // Ignore clicks outside of a card or on an already matched card
    if (!clickedCard.classList.contains("card") || clickedCard.classList.contains("matched")) {
        return
    }

    // Find the index of the clicked card
    let index = cards.indexOf(clickedCard);

    // Ignore clicks on an already opened card
    if (openCardIndex !== -1 && openCardIndex === index) {
        console.log("same card")
        return
    }

    // Get the value of the clicked card
    let clickedCardValue = cardValues[index];
    // Flip over the clicked card
    flipCard(clickedCard, clickedCardValue)

    // If the clicked card is the first card of a move, store its index, otherwise check for match
    if (openCardIndex === -1) {
        openCardIndex = index
    } else {
        // Check for a match and increment move counter
        checkForMatch(cards, clickedCard, clickedCardValue)
        document.getElementById("game-moves").innerHTML = `${++moves}`
        // Remove index of the previously opened card
        openCardIndex = -1

        // If all the cards are matched, end the game
        if (matches === 10) {
            endGame()
        }
    }
}

/** End the current game and display the result */
function endGame() {
    // Set the final time and number of moves on the game result screen
    document.getElementById("final-moves").innerHTML = moves
    document.getElementById("final-time").innerHTML = time
    // Stop the timer
    clearInterval(timer)
    // Check if a new high score was achieved
    checkForHighScore()
    // Set the menu screen to the game result
    changeMenu(MENU.RESULT)

    // Show final board for 2 seconds, then display the game result
    setTimeout(function () {
        show("menu-container")
        hide("game-container")
        // Remove played season class from the game container
        document.getElementById("game-container").classList.remove(selectedSeason)
    }, 2000)
}

/** Compare a card to a previously opened card. */
function checkForMatch(cards, clickedCard, clickedCardValue) {
    // Find the value and html element of the already opened card
    let openCardValue = cardValues[openCardIndex]
    let openCard = cards[openCardIndex]

    // Compare card with the previously opened card
    if (openCardValue === clickedCardValue) {
        // If cards match, leave them open and increment match counter
        openCard.classList.add("matched")
        clickedCard.classList.add("matched")
        matches++
    } else {
        // If cards do not match, set them to close after 1.3 seconds 
        cardsToClose = [clickedCard, openCard]
        setTimeout(function () {
            closeOpenCards()
        }, 1300)

    }
}

/** Close two open, non matching cards */
function closeOpenCards() {
    for (let card of cardsToClose) {
        flipCard(card)
    }
    cardsToClose = []
}

/** Flip a card and add image corresponding to the value if it is being opened */
function flipCard(card, value) {
    if (card.classList.contains("flipped")) {
        // Close the card and remove the image afterwards if it is not already opened again
        card.classList.remove("flipped")
        setTimeout(function () {
            if (!card.classList.contains("flipped")) {
                card.children[0].children[1].style.setProperty('background-image', 'none')
            }
        }, 1000)
    } else {
        // Add image to the card back and then open it
        card.children[0].children[1].style.setProperty('background-image', `url(assets/images/themes/${selectedSeason}/${value}.png)`)
        card.classList.add("flipped")
    }
}

// High score functions

/** Check if the player achieved a new high score */
function checkForHighScore() {
    // Check if the player beat a previous high score
    for (let i = 0; i < highScoreList.length; i++) {
        if (highScoreList[i].time > time) {
            addToHighScore(i)
            return
        } else if (highScoreList[i].time === time) {
            if (highScoreList[i].moves > moves) {
                addToHighScore(i)
                return
            }
        }
    }
    // Add score to the end if high score list is empty or previous scores were not beat
    addToHighScore(highScoreList.length)
}

/** Add score to the high score list at given index */
function addToHighScore(index) {
    // Add score to the list
    highScoreList.splice(index, 0, {
        time: time,
        moves: moves,
        season: selectedSeason
    })
    // Reduce the list to five scores
    highScoreList = highScoreList.slice(0, 5)
    // Save the high score list to local storage
    localStorage.setItem('highScore', JSON.stringify(highScoreList));
}

// Game initialisation functions

/** Start a new game with the given season */
function newGame(season) {
    selectedSeason = season
    // Reset the game
    resetGame()
    // Add the selected season class to the game container
    document.getElementById('game-container').classList.add(season)
    // Show the game
    hide("menu-container");
    show("game-container");
}

/** Reset all game elements to their initial value */
function resetGame() {
    // Shuffle cards and reset values
    shuffleCards()
    moves = 0
    time = 0
    matches = 0
    openCardIndex = -1
    document.getElementById("game-moves").innerHTML = moves
    document.getElementById("game-timer").innerHTML = time
    // Start new timer
    timer = setInterval(() => {
        document.getElementById("game-timer").innerHTML = ++time
    }, 1000);
    // Clear the game board and create new cards
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
}

/** Shuffe the card values with the Durstenfeld algorithm
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
function shuffleCards() {
    for (let i = cardValues.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = cardValues[i];
        cardValues[i] = cardValues[j];
        cardValues[j] = temp;
    }
}

// Navigation functions

/** Change menu to the screen with the given id */
function changeMenu(menuId) {
    // Find all menu elements
    let menuElements = document.getElementById("menu-container").children
    for (let element of menuElements) {
        if (element.id === "game-name") {
            // Always display the game name
            continue
        } else if (element.id === menuId) {
            // Show selected menu screen
            element.classList.remove("hidden")
        } else {
            // Hide other screens
            element.classList.add("hidden")
        }
    }
}

/** Show an html element by id */
function show(id) {
    document.getElementById(id).classList.remove("hidden");
}

/** Hide an html by id */
function hide(id) {
    document.getElementById(id).classList.add("hidden");
}

/** Show main menu screen */
function showMainMenu() {
    changeMenu(MENU.MAIN)
}

/** Show the theme select screen */
function selectTheme() {
    changeMenu(MENU.THEME);
}

/** Show the how to play screen */
function showHowToPlay() {
    changeMenu(MENU.HOWTOPLAY)
}

/** Generate the high score list and show high score screen */
function showHighScoreList() {
    // Generate high score list
    let list = document.getElementById("high-score-list")
    list.innerHTML = ""
    for (let score of highScoreList) {
        list.innerHTML += `<li class="${score.season}">
        <div>
        <p>Time: ${score.time} seconds</p>
        <p>${score.moves} moves</p>
        </div>
        </li>`

    }
    // Show empty high score list notification if applicable
    if (highScoreList.length === 0) {
        show("empty-high-score")
    } else {
        hide("empty-high-score")
    }
    // Show high score screen
    changeMenu(MENU.HIGHSCORE)
}

/** Show the confirm quit dialog */
function confirmQuit() {
    show("quit-confirm")
}

/** Quit current game */
function quitGame() {
    // Hide the dialog and stop the timer
    hide("quit-confirm")
    clearInterval(timer)
    // Remove played season class from the game container
    document.getElementById("game-container").classList.remove(selectedSeason)
    // Show the main menu screen
    changeMenu(MENU.MAIN)
    hide("game-container")
    show("menu-container")
}