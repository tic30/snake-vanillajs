const SNAKE = "s", FOOD = "f", STARTINDEX = 214, ROWS=20, COLS=30, CELLSIZE=30,
      KEYS = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 }
let snake, board, growth, paused, gameOver, direction, nextDirection

function init() {
    snake = []
    board = new Array(ROWS * COLS).fill(null)
    for (let i = 0; i < 3; i++) {
        board[STARTINDEX - i] = SNAKE
        snake[i] = STARTINDEX - i
    }
    growth = 0
    paused = true
    gameOver = false
    direction = KEYS.RIGHT
    nextDirection = null
    document.querySelector(".reset-btn").style.display = "none"
    document.querySelector(".game-title").innerHTML = "Press any Arrow key to start"
    renderBoard()
}

function renderBoard() {
    let gameboard = document.querySelector(".game-board")
    gameboard.innerHTML = ""
    for (let i = 0; i < ROWS * COLS; i++) {
        let cell = document.createElement("div")
        if(board[i] == SNAKE && gameOver)
            cell.classList.add("s-cell-gg")
        if(board[i] == SNAKE)
            cell.classList.add("s-cell")
        else if (board[i] == FOOD)
            cell.classList.add("f-cell")
        else
            cell.classList.add("null-cell")
        gameboard.appendChild(cell)
    }
    gameboard.focus()
}

function resetGame() {
    init()
    placeFood()
}

function resumeGame() {
    if (gameOver || !paused) return
    paused = false
    timeTick()
    document.querySelector(".game-board").focus()
    document.querySelector(".game-title").innerHTML = "Use Arrow keys to play"
}

function endGame() {        
    gameOver = true
    renderBoard()
    document.querySelector(".reset-btn").style.display = "block"
    document.querySelector(".game-title").innerHTML = "Game Over"
}

function placeFood() {
    let index
    do {
        index = Math.floor(Math.random() * COLS * ROWS)
    } while (board[index] === SNAKE)
    board[index] = FOOD
    renderBoard()
}

function timeTick() {
    if (paused) return

    let head = getNextHeadPos(snake[0])
    if (snake.indexOf(head) !== -1 || snake[0] / COLS <= 0 || snake[0] / COLS >= ROWS - 1
        || snake[0] % COLS <= 0 || snake[0] % COLS >= COLS - 1) {
        endGame()
        return
    }

    let needsFood = board[head] === FOOD
    if (needsFood || paused) {
        placeFood()
        growth += 2
    } else if (growth) {
        growth -= 1
    } else {
        board[snake.pop()] = null
    }

    snake.unshift(head)
    board[head] = SNAKE

    if (nextDirection) {
        direction = nextDirection
        nextDirection = null
    }
    renderBoard()

    setTimeout(timeTick, 80)
}

function handleKeyPress(e) {    
    if (Object.values(KEYS).includes(e.keyCode) && paused) {
        resumeGame()
        return
    }
    let difference = Math.abs(direction - e.keyCode)
    // ignore invalid key
    if (Object.values(KEYS).includes(e.keyCode) && difference !== 0 && difference !== 2) {
        nextDirection = e.keyCode
    }
}

function getNextHeadPos(head) {
    let x = head % COLS,
        y = Math.floor(head / COLS)

    switch (direction) {
        case KEYS.UP:
            return (COLS * (y - 1)) + x
        case KEYS.DOWN:
            return (COLS * (y + 1)) + x
        case KEYS.LEFT:
            return (COLS * y) + x - 1
        case KEYS.RIGHT:
            return (COLS * y) + x + 1
        default:
            return null
    }
}

document.addEventListener("DOMContentLoaded", function() {
    resetGame()
    document.querySelector(".game-board").onkeydown = handleKeyPress
})