const buttonPrediction = document.querySelector("#prediction");
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
[...numbersMlp, ...numbersConvnet].forEach((el) =>
  el.addEventListener("increment", incrementCounter)
);
[...probabilitiesMlp, ...probabilitiesConvnet].forEach((el) =>
  el.addEventListener("highlight", highlightProbability)
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
    .then((data) => {
      let mlpResult = data.find((el) => el.model === "mlp");
      updateProbabilities(probabilitiesMlp, mlpResult.probabilities);
      let mlpDigitResult = mlpResult.digit;
      
      probabilitiesMlp[mlpDigitResult].dispatchEvent(new Event("highlight"));

      setTimeout(
        () => numbersMlp[mlpDigitResult].dispatchEvent(new Event("increment")),
        1000
      );

      let convnetResult = data.find((el) => el.model === "convnet");
      updateProbabilities(probabilitiesConvnet, convnetResult.probabilities);
      let convnetDigitResult = convnetResult.digit;
      probabilitiesConvnet[convnetDigitResult].dispatchEvent(new Event("highlight"));

      setTimeout(
        () =>
          numbersConvnet[convnetDigitResult].dispatchEvent(new Event("increment")),
        1000
      );
    });
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

function highlightProbability(ev) {
  setTimeout(() => ev.target.classList.add("highlight"), 10);
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
    el.classList.remove("highlight");
    el.querySelector(".probability-result").innerHTML = "";
  });
}
