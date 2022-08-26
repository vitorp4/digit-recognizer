var canvas = document.querySelector("#pixeled-canvas");
var ctx = canvas.getContext("2d");
var numberOfPixels = 28;
var pixelSize = 8;
var grayScaleMatrix = Array.from(Array(28), (_) => Array(28).fill(0));
var drawMode = false;

window.addEventListener('load', resizeCanvas(1));
window.addEventListener('load', drawGrid());

canvas.addEventListener("pointerdown", () => (drawMode = true));
canvas.addEventListener("pointerup", () => (drawMode = false));
canvas.addEventListener("pointerout", () => (drawMode = false));

canvas.addEventListener("pointermove", (ev) => {
  if (drawMode) {
    var x = Math.floor(ev.offsetX / pixelSize);
    var y = Math.floor(ev.offsetY / pixelSize);

    pixelize(x, y);
    pixelize(x - 1, y);
    pixelize(x + 1, y);
    pixelize(x, y - 1);
    pixelize(x, y + 1);
  }
});

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
  ctx.strokeStyle = `rgb(${Array(3).fill(strokeOptions.grayLevel).join(",")})`;
  ctx.fillStyle = `rgb(${Array(3).fill(fillOptions.grayLevel).join(",")})`;

  if (strokeOptions.display) {
    ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  }

  if (fillOptions.display) {
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
  }
}

var buttonClear = document.querySelector("#clear");
buttonClear.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid({ resetMatrix: true, displayStroke: true });
});

var buttonPrediction = document.querySelector("#prediction");
buttonPrediction.addEventListener("click", () => {
  console.log(grayScaleMatrix);
});

var resizeButton = document.querySelector("#resize-canvas");
resizeButton.addEventListener("click", () => {
  resizeCanvas(pixelSize == 8 ? 1.25 : 0.8);
  drawGrid();
  resizeButton.classList.toggle("active");
});

function resizeCanvas(factor) {
  pixelSize = factor * pixelSize;
  canvasSize = numberOfPixels * pixelSize;
  console.log("canvasSize", canvasSize);
  canvas.setAttribute("height", canvasSize);
  canvas.setAttribute("width", canvasSize);
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
