// Definindo constantes
const gridWidth = 10 // Largura do Grid
const shapeFreezeAudio = new Audio("forma-congela.mp3") // Áudio para quando a forma congela
const completedLineAudio = new Audio("linha-completa.mp3") // Áudio para quando uma linha é completada
const gameOverAudio = new Audio("game-over.mp3") // Áudio para o fim do jogo

const colors = ["blue", "yellow", "red", "orange", "pink"] // Array de cores para as formas
let currentColor = Math.floor(Math.random() * colors.length) // Seleciona aleatoriamente uma cor para a forma atual
let nextColor = Math.floor(Math.random() * colors.length) // Seleciona aleatoriamente uma cor para a próxima forma

// Shapes
const lShape = [
  [1, 2, gridWidth + 1, gridWidth*2 + 1],
  [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth*2 + 2],
  [1, gridWidth + 1, gridWidth*2, gridWidth*2 + 1],
  [gridWidth, gridWidth*2, gridWidth*2 + 1, gridWidth*2 + 2]
]

const zShape = [
  [gridWidth + 1, gridWidth + 2, gridWidth*2, gridWidth*2 + 1],
  [0, gridWidth, gridWidth + 1, gridWidth*2 + 1],
  [gridWidth + 1, gridWidth + 2, gridWidth*2, gridWidth*2 + 1],
  [0, gridWidth, gridWidth + 1, gridWidth*2 + 1]
]

const tShape = [
  [1, gridWidth, gridWidth + 1, gridWidth + 2],
  [1, gridWidth + 1, gridWidth + 2, gridWidth*2 + 1],
  [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth*2 + 1],
  [1, gridWidth, gridWidth + 1, gridWidth*2 + 1]
]

const oShape = [
  [0, 1, gridWidth, gridWidth + 1],
  [0, 1, gridWidth, gridWidth + 1],
  [0, 1, gridWidth, gridWidth + 1],
  [0, 1, gridWidth, gridWidth + 1]
]

const iShape = [
  [1, gridWidth + 1, gridWidth*2 + 1, gridWidth*3 + 1],
  [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3],
  [1, gridWidth + 1, gridWidth*2 + 1, gridWidth*3 + 1],
  [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3]
]

const allShapes = [lShape, zShape, tShape, oShape, iShape] // Array que contém todas as formas possíveis

let currentPosition = 3 // Posição atual da forma do grid
let currentRotation = 0 // Rotação atual da forma
let randomShape = Math.floor(Math.random() * allShapes.length) // Seleciona aleatoriamente uma forma
let currentShape = allShapes[randomShape][currentRotation] // Define a forma atual com base na forma selecionada
let $gridSquares = Array.from(document.querySelectorAll(".grid div")) // Seleciona todos os elementos div do grid

function draw() {
  currentShape.forEach(squareIndex => {
    $gridSquares[squareIndex + currentPosition].classList.add("shapePainted", `${colors[currentColor]}`) // Adiciona as classes para pintar a forma no grid
  })
}
draw()

function undraw() {
  currentShape.forEach(squareIndex => {
    $gridSquares[squareIndex + currentPosition].classList.remove("shapePainted", `${colors[currentColor]}`) // Remove as classes de pintura da forma na grade
  })
}

const $miniGridSquares = document.querySelectorAll(".mini-grid div")
let miniGridWidth = 6
let nextPosition = 2
const possibleNextShapes = [
  [1, 2, miniGridWidth + 1, miniGridWidth*2 + 1],
  [miniGridWidth + 1, miniGridWidth + 2, miniGridWidth*2, miniGridWidth*2 + 1],
  [1, miniGridWidth, miniGridWidth + 1, miniGridWidth + 2],
  [0, 1, miniGridWidth, miniGridWidth + 1],
  [1, miniGridWidth + 1, miniGridWidth*2 + 1, miniGridWidth*3 + 1]
]

let nextRandomShape = Math.floor(Math.random() * possibleNextShapes.length)
function displayNextShape() {
  $miniGridSquares.forEach(square => square.classList.remove("shapePainted", `${colors[nextColor]}`))
  nextRandomShape = Math.floor(Math.random() * possibleNextShapes.length)
  nextColor = Math.floor(Math.random() * colors.length)
  const nextShape = possibleNextShapes[nextRandomShape]
  nextShape.forEach(squareIndex => 
    $miniGridSquares[squareIndex + nextPosition + miniGridWidth].classList.add("shapePainted", `${colors[nextColor]}`)  
  )
}
displayNextShape()


// setInterval(moveDown, 700)
let timeMoveDown = 700
let timerId = null
const $startStopButton = document.getElementById("start-button")
$startStopButton.addEventListener("click", () => {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  } else {
    timerId = setInterval(moveDown, timeMoveDown)
  }
})

const $restartButton = document.getElementById("restart-button")
$restartButton.addEventListener("click", () => {
  window.location.reload()
})

function moveDown() {
  freeze()

  undraw()
  currentPosition += 10
  draw()
}

const $score = document.querySelector(".score")
let score = 0
function updateScore(updateValue) {
  score += updateValue
  $score.textContent = score

  clearInterval(timerId)
  if (score <= 450) {
    timeMoveDown = 500
  }
  else if (450 < score && score <= 1000) {
    timeMoveDown = 400
  } else if (1000 < score && score <= 1700) {
    timeMoveDown = 300
  } else if (1700 < score && score <= 2700) {
    timeMoveDown = 200
  } else if (2700 < score && score <= 3850) {
    timeMoveDown = 150
  } else {
    timeMoveDown = 110
  }
  timerId = setInterval(moveDown, timeMoveDown)
}

let $grid = document.querySelector(".grid")
function checkIfRowIsFilled() {
  for (var row = 0; row < $gridSquares.length; row += gridWidth) {
    let currentRow = []

    for (var square = row; square < row + gridWidth; square++) {
      currentRow.push(square)
    }

    const isRowPainted = currentRow.every(square => 
      $gridSquares[square].classList.contains("shapePainted")  
    )

    if (isRowPainted) {
      const squaresRemoved = $gridSquares.splice(row, gridWidth)
      squaresRemoved.forEach(square => 
        // square.classList.remove("shapePainted", "filled")
        square.removeAttribute("class")
      )
      $gridSquares = squaresRemoved.concat($gridSquares)
      $gridSquares.forEach(square => $grid.appendChild(square))

      updateScore(97)
      completedLineAudio.play()
    }
  }
}

function gameOver() {
  if (currentShape.some(squareIndex => 
    $gridSquares[squareIndex + currentPosition].classList.contains("filled")  
  )) {
    updateScore(-13)
    clearInterval(timerId)
    timerId = null
    $startStopButton.disabled = true
    gameOverAudio.play()
    $score.innerHTML += "<br /><br /><br />" + "GAME OVER"
  }
}

function freeze() {
  if (currentShape.some(squareIndex => 
    $gridSquares[squareIndex + currentPosition + gridWidth].classList.contains("filled")
  )) {
    currentShape.forEach(squareIndex => $gridSquares[squareIndex + currentPosition].classList.add("filled"))

    // Criar um novo shape
    currentPosition = 3
    currentRotation = 0
    randomShape = nextRandomShape
    currentShape = allShapes[randomShape][currentRotation]
    currentColor = nextColor
    draw()

    checkIfRowIsFilled()

    updateScore(13)
    shapeFreezeAudio.play()

    displayNextShape()
    gameOver()
  }
}

function moveLeft() {
  const isEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === 0)
  if (isEdgeLimit) return

  const isFilled = currentShape.some(squareIndex => 
    $gridSquares[squareIndex + currentPosition - 1].classList.contains("filled")
  )
  if (isFilled) return

  undraw()
  currentPosition -= 1
  draw()
}

function moveRight() {
  const isEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === gridWidth - 1)
  if (isEdgeLimit) return

  const isFilled = currentShape.some(squareIndex => 
    $gridSquares[squareIndex + currentPosition + 1].classList.contains("filled")
  )
  if (isFilled) return

  undraw()
  currentPosition += 1
  draw()
}

function previousRotation() {
  if (currentRotation ===  0) {
    currentRotation = currentShape.length - 1
  } else {
    currentRotation--
  }
  currentShape = allShapes[randomShape][currentRotation]
}

function rotate() {
  undraw()
  
  if (currentRotation === currentShape.length - 1) {
    currentRotation = 0
  } else {
    currentRotation += 1
  }

  currentShape = allShapes[randomShape][currentRotation]

  const isLeftEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === 0)
  const isRightEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === 9)
  if (isLeftEdgeLimit && isRightEdgeLimit) {
    previousRotation()
  }

  const isFilled = currentShape.some(squareIndex => 
    $gridSquares[squareIndex + currentPosition].classList.contains("filled")  
  )
  if (isFilled) {
    previousRotation()
  }

  draw()
}

document.addEventListener("keydown", controlKeyboard)

function controlKeyboard(event) {
  if (timerId) {
    if (event.key === "ArrowLeft") {
      moveLeft()
    } else if (event.key === "ArrowRight") {
      moveRight()
    } else if (event.key === "ArrowDown") {
      moveDown()
    } else if (event.key === "ArrowUp") {
      rotate()
    }
  }
}

const isMobile = window.matchMedia('(max-width: 990px)').matches
if (isMobile) {
  const mobileButtons = document.querySelectorAll(".mobile-buttons-container button")
  mobileButtons.forEach(button => button.addEventListener("click", () => {
    if (timerId) {
      if (button.classList[0] === "left-button") {
        moveLeft()
      } else if (button.classList[0] === "right-button") {
        moveRight()
      } else if (button.classList[0] === "down-button") {
        moveDown()
      } else if (button.classList[0] === "rotate-button") {
        rotate()
      }
    }
  }))
}