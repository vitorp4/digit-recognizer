const canvas = document.querySelector("#pixeled-canvas"),
  buttonClear = document.querySelector("#clear"),
  resizeButton = document.querySelector("#canvas-resizer"),
  ctx = canvas.getContext("2d"),
  numberOfPixels = 28;
  
let grayScaleMatrix = Array.from(Array(28), (_) => Array(28).fill(0)),
  drawMode = false,
  pixelSize = 8;
  
window.addEventListener('load', resizeCanvas(1));
window.addEventListener('load', drawGrid());
resizeButton.addEventListener("click", resizeCanvas);
buttonClear.addEventListener("click", clearCanvas);

canvas.addEventListener("pointerdown", () => (drawMode = true));
canvas.addEventListener("pointerup", () => (drawMode = false));
canvas.addEventListener("pointerout", () => (drawMode = false));
canvas.addEventListener("pointermove", (ev) => drawMode && dispatchPixelize(ev));

function dispatchPixelize(ev) {
  const x = Math.floor(ev.offsetX / pixelSize);
  const y = Math.floor(ev.offsetY / pixelSize);

  pixelize(x, y);
  pixelize(x - 1, y);
  pixelize(x + 1, y);
  pixelize(x, y - 1);
  pixelize(x, y + 1);
}

function pixelize(x, y) {
  if (!(x >= 0 && x < 28 && y >= 0 && y < 28) || grayScaleMatrix[y][x] == 255) {
    return;
  }

  if (grayScaleMatrix[y][x] < 180) {
    grayScaleMatrix[y][x] = 180;
    drawRect(x, y, { display: true, grayLevel: 180 });
  } else if (grayScaleMatrix[y][x] + 15 <= 255) {
    grayScaleMatrix[y][x] += 15;
    drawRect(x, y, { display: true, grayLevel: grayScaleMatrix[y][x] });
  }
}

function drawRect(
  x,
  y,
  fillOptions = { display: true, grayLevel: 0 },
  strokeOptions = { display: false, grayLevel: 32 }
) {
  ctx.strokeStyle = '#' + strokeOptions.grayLevel.toString(16).repeat(3);
  ctx.fillStyle = '#' + fillOptions.grayLevel.toString(16).repeat(3);

  if (strokeOptions.display) {
    ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  }

  if (fillOptions.display) {
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid({ resetMatrix: true, displayStroke: true });
}

function resizeCanvas() {
  let factor = pixelSize == 8 ? 1.25 : 0.8;
  pixelSize = factor * pixelSize;
  let canvasSize = numberOfPixels * pixelSize;

  canvas.setAttribute("height", canvasSize);
  canvas.setAttribute("width", canvasSize);

  resizeButton.classList.toggle("active");
  drawGrid();
}

function drawGrid(options = { resetMatrix: false, displayStroke: true }) {
  if (options.resetMatrix) {
    grayScaleMatrix = Array.from(Array(28), (_) => Array(28).fill(0));
  }

  for (var x = 0; x < numberOfPixels; x++)
    for (var y = 0; y < numberOfPixels; y++) {
      var fillOptions = { display: true, grayLevel: grayScaleMatrix[y][x] };
      var strokeOptions = {
        display: grayScaleMatrix[y][x] == 0 && options.displayStroke,
        grayLevel: 32,
      };

      drawRect(x, y, fillOptions, strokeOptions);
    }
}
