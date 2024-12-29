const gameBoard = document.querySelector('.game-board');
const timerDisplay = document.getElementById('timer');
const resetButton = document.getElementById('resetButton');
const gameMessage = document.getElementById('gameMessage');

const cardImages = [
    '../assets/images/Bromeliaceae - Hohenbergia Catingae.jpg', '../assets/images/nomes/Bromeliaceae - Hohenbergia Catingae.jpg',
    '../assets/images/Bromeliaceae - Tillandsia Recurvata.jpg', '../assets/images/nomes/Bromeliaceae - Tillandsia Recurvata.jpg',
    '../assets/images/Cactaceae - Tacinga Inamoema.jpg', '../assets/images/nomes/Cactaceae - Tacinga Inamoema.jpg',
    '../assets/images/Euphorbiaceae - Jatropha Mollissima.jpg', '../assets/images/nomes/Euphorbiaceae - Jatropha Mollissima.jpg',
    '../assets/images/Fabaceae - Chamaecrista Flexuosa.jpg', '../assets/images/nomes/Fabaceae - Chamaecrista Flexuosa.jpg',
    '../assets/images/Loranthaceae - Struthanthus Marginatus.jpg', '../assets/images/nomes/Loranthaceae - Struthanthus Marginatus.jpg',
    '../assets/images/Malpighiaceae - Byrsonima Gardneriana.jpg', '../assets/images/nomes/Malpighiaceae - Byrsonima Gardneriana.jpg',
    '../assets/images/Metlastomataceae - Pleroma Heteromallum.jpg', '../assets/images/nomes/Metlastomataceae - Pleroma Heteromallum.jpg',
    '../assets/images/Sapindaceae - Serjania Glabrata.jpg', '../assets/images/nomes/Sapindaceae - Serjania Glabrata.jpg'
];

let cards = [];
let flippedCards = [];
let matchedCards = [];
let canFlip = true;
let timer;
let timeRemaining = 60; 
let gameActive = true; 

// Embaralhar cards
function shuffle(array) {
    let currentIndex = array.length, randomIndex, temporaryValue;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function getFileName(path) {
    const segments = path.split('/');
    const fileName = segments[segments.length - 1];
    return fileName.split('.')[0]; 
}

// Criar cards
function createBoard() {
    const shuffledImages = shuffle([...cardImages]); 

    shuffledImages.forEach((image, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;

        const img = document.createElement('img');
        img.src = image; 
        img.alt = `Carta ${index}`;
        img.classList.add('card-image');

        card.appendChild(img);
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function showMessage(message, backgroundColor) {
    gameMessage.textContent = message;
    gameMessage.style.backgroundColor = backgroundColor;
    gameMessage.classList.remove('hidden');
}

function flipCard(event) {
    if (!canFlip || !gameActive) return;

    const card = event.target.closest('.card');

    if (flippedCards.includes(card) || card.classList.contains('matched')) return;

    card.classList.add('flipping');
    setTimeout(() => {
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }, 200);
}

function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    const firstImage = firstCard.querySelector('img').src;
    const secondImage = secondCard.querySelector('img').src;

    const firstName = getFileName(firstImage);
    const secondName = getFileName(secondImage);

    if (firstName === secondName) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matchedCards.push(firstCard, secondCard);
        flippedCards = [];
        checkWin();
    } else {
        canFlip = false;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}

function checkWin() {
    if (matchedCards.length / 2 === cardImages.length / 2) {
        showMessage('Você conseguiu!', '#2ecc71');
        gameActive = false;
        clearInterval(timer);
    }
}

function startTimer() {
    timer = setInterval(() => {
        if (timeRemaining <= 0) {
            endGame('O tempo esgotou!');
        } else {
            let minutes = Math.floor(timeRemaining / 60);
            let seconds = timeRemaining % 60;
            timerDisplay.textContent = `Tempo: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            timeRemaining--;
        }
    }, 1000);
}

function endGame(message) {
    gameActive = false;
    clearInterval(timer);
    showMessage(message, '#e74c3c');
}

function resetGame() {
    clearInterval(timer);
    gameMessage.classList.add('hidden');
    timeRemaining = 60;
    gameActive = true;
    matchedCards = [];
    flippedCards = [];
    gameBoard.innerHTML = '';
    createBoard();
    startTimer();
}

function startGame() {
    createBoard();
    startTimer();
}

resetButton.addEventListener('click', resetGame);

startGame();
