const buttonPrediction = document.querySelector("#prediction");
const buttonReset = document.querySelector("#reset");
const numbersMlp = document.querySelectorAll("#mlp-counter .numbers-slider");
const numbersConvnet = document.querySelectorAll(
  "#convnet-counter .numbers-slider"
);
const probabilitiesMlp = document.querySelectorAll(
  "#mlp-probabilities .probability-wrapper"
);
const probabilitiesConvnet = document.querySelectorAll(
  "#convnet-probabilities .probability-wrapper"
);

buttonPrediction.addEventListener("click", predict);
buttonReset.addEventListener("click", resetCounters);
[...numbersMlp, ...numbersConvnet].forEach((el) =>
  el.addEventListener("increment", incrementCounter)
);

function predict() {
  options = {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(grayScaleMatrix),
  };

  eraseProbabilities([...probabilitiesMlp, ...probabilitiesConvnet]);

  fetch("/predict", options)
    .then((response) => response.json())
    .then((data) => updateApplication(data));
}

function updateApplication(data) {
  let mlpResult = data.find((el) => el.model === "mlp");
  updateProbabilities(probabilitiesMlp, mlpResult.probabilities);
  let mlpDigitResult = mlpResult.digit;
  addHighlight(probabilitiesMlp[mlpDigitResult]);

  setTimeout(
    () => numbersMlp[mlpDigitResult].dispatchEvent(new Event("increment")),
    1000
  );

  let convnetResult = data.find((el) => el.model === "convnet");
  updateProbabilities(probabilitiesConvnet, convnetResult.probabilities);
  let convnetDigitResult = convnetResult.digit;
  addHighlight(probabilitiesConvnet[convnetDigitResult]);

  setTimeout(
    () =>
      numbersConvnet[convnetDigitResult].dispatchEvent(new Event("increment")),
    1000
  );
}

function incrementCounter() {
  let firstChild = this.querySelector("div:last-child");
  let c = +firstChild.innerHTML;

  newDiv = document.createElement("div");
  newDiv.innerHTML = c + 1;
  newDiv.style.color = "rgba(255,255,255,0.9)";
  this.append(newDiv);
  const animDuration = 500;

  const sliding = [{ transform: "translateY(-50px)" }];

  const slidingOptions = {
    duration: animDuration,
    iterations: 1,
  };

  this.animate(sliding, slidingOptions);

  setTimeout(() => {
    firstChild.remove();
  }, animDuration);
}

function updateProbabilities(elements, probabilities) {
  elements.forEach((el, i) => {
    let expNotation = probabilities[i].toExponential(2);
    let decimal = parseFloat(expNotation.slice(0, 4));
    let exponent = parseInt(expNotation.slice(5));
    el.querySelector(
      ".probability-result"
    ).innerHTML = `${decimal}x10<sup>${exponent}</sup>`;
  });
}

function eraseProbabilities(elements) {
  elements.forEach((el) => {
    removeHighlight(el);
    el.querySelector(".probability-result").innerHTML = "";
  });
}

function addHighlight(el) {
  el.classList.add("highlight");
}

function removeHighlight(el) {
  el.classList.remove("highlight");
}

function resetCounters() {
  [...numbersMlp, ...numbersConvnet].forEach(el => {
    let firstChild = el.querySelector("div:last-child");
  
    newDiv = document.createElement("div");
    newDiv.innerHTML = 0;
    newDiv.style.color = "rgba(255,255,255,0.3)";
    el.append(newDiv);
    const animDuration = 500;
  
    const sliding = [{ transform: "translateY(-50px)" }];
  
    const slidingOptions = {
      duration: animDuration,
      iterations: 1,
    };
  
    el.animate(sliding, slidingOptions);
  
    setTimeout(() => {
      firstChild.remove();
    }, animDuration);
  })
}