const numberOfSquares = 28,
  minLevel = 0,
  maxLevel = 255,
  canvas = document.querySelector("#pixeled-canvas"),
  buttonClear = document.querySelector("#clear"),
  buttonResize = document.querySelector("#resize"),
  pre = document.getElementById("matrix-result"),
  ctx = canvas.getContext("2d");

let grayMatrix = newMatrix(),
  isDrawActive = false,
  squareSize = 8;

canvas.addEventListener("pointerdown", () => (isDrawActive = true));
canvas.addEventListener("pointerup", () => (isDrawActive = false));
canvas.addEventListener("pointerout", () => (isDrawActive = false));
canvas.addEventListener(
  "pointermove",
  (event) => isDrawActive && dispatchPixelize(event)
);
buttonClear.addEventListener("click", resetCanvas);
buttonResize.addEventListener("click", resizeCanvas);
window.addEventListener("load", () => {
  let canvasSize = squareSize * numberOfSquares;

  canvas.setAttribute("height", canvasSize);
  canvas.setAttribute("width", canvasSize);

  drawGrid();
});

function newMatrix() {
  return Array.from(Array(numberOfSquares), (_) =>
    Array(numberOfSquares).fill(minLevel)
  );
}

function dispatchPixelize(event) {
  const row = Math.floor(event.offsetY / squareSize);
  const column = Math.floor(event.offsetX / squareSize);

  pixelize(row, column, 220);
  pixelize(row - 1, column);
  pixelize(row + 1, column);
  pixelize(row, column - 1);
  pixelize(row, column + 1);
}

function pixelize(row, column, baseLevel = 170) {
  const increment = 20;

  if (
    !(
      row >= 0 &&
      row < numberOfSquares &&
      column >= 0 &&
      column < numberOfSquares
    ) ||
    grayMatrix[row][column] === maxLevel
  )
    return;

  if (grayMatrix[row][column] === minLevel) {
    grayMatrix[row][column] = baseLevel;
  } else if (grayMatrix[row][column] + increment <= maxLevel) {
    grayMatrix[row][column] += increment;
  } else {
    grayMatrix[row][column] = maxLevel;
  }
  paintRect(row, column, grayMatrix[row][column]);
}

function paintRect(row, column, grayLevel) {
  ctx.fillStyle = "#" + grayLevel.toString(16).repeat(3);
  ctx.fillRect(column * squareSize, row * squareSize, squareSize, squareSize);
}

function resetCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  grayMatrix = newMatrix();
  drawGrid();
}

function resizeCanvas() {
  squareSize = squareSize == 8 ? 10 : 8;
  let canvasSize = squareSize * numberOfSquares;

  canvas.setAttribute("height", canvasSize);
  canvas.setAttribute("width", canvasSize);

  buttonResize.classList.toggle("active");
  drawGrid();
  drawMatrix();
}

function drawMatrix() {
  for (let row = 0; row < numberOfSquares; row++)
    for (let column = 0; column < numberOfSquares; column++) 
      if (grayMatrix[row][column] > 0)
        paintRect(row, column, grayMatrix[row][column]);
}

function drawGrid() {
  ctx.strokeStyle = "#151515";
  ctx.beginPath();

  for (let row = 1; row < numberOfSquares; row++) {
    ctx.moveTo(row * squareSize, 0);
    ctx.lineTo(row * squareSize, numberOfSquares * squareSize);
    ctx.moveTo(0, row * squareSize);
    ctx.lineTo(numberOfSquares * squareSize, row * squareSize);
  }

  ctx.stroke();
}
