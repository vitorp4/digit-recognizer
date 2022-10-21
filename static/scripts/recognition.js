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
    body: JSON.stringify(grayMatrix),
  };

  eraseProbabilities([...probabilitiesMlp, ...probabilitiesConvnet]);
  buttonPrediction.disabled = true;

  fetch("/predict", options)
    .then((response) => response.json())
    .then((data) => setTimeout(() => {
      updateApplication(data);
      buttonPrediction.disabled = false;
    }, 900));
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
  let lastChild = this.querySelector("div:last-child");
  let newValue = parseInt(lastChild.innerHTML) + 1;

  newDiv = document.createElement("div");
  newDiv.innerHTML = newValue;
  newDiv.style.color = "rgba(255,255,255,0.9)";
  this.append(newDiv);

  const sliding = [
    { transform: `translateY(-${(this.children.length - 1) * (+lastChild.offsetHeight)}px)` },
  ];

  const slidingOptions = {
    duration: 500,
    iterations: 1,
    fill: "forwards",
  };

  let anim = this.animate(sliding, slidingOptions);
  anim.commitStyles();
}

function updateProbabilities(elements, probabilities) {
  elements.forEach((el, i) => {
    let expNotation = probabilities[i].toExponential(2);
    let decimal = parseFloat(expNotation.slice(0, 4));
    let exponent = parseInt(expNotation.slice(5));

    if (exponent === 0) {
      decimal = 9.99;
      exponent = -1;
    }

    el.querySelector(
      ".probability-result"
    ).innerHTML = `${decimal}x10<sup>${exponent}</sup>`;

    let alpha = 0.9 + (exponent + 1) * 0.08;
    el.style.color = `rgba(255,255,255,${alpha < 0.3 ? 0.3 : alpha}`;
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
  [...numbersMlp, ...numbersConvnet].forEach((el) => {
    let lastChild = el.querySelector("div:last-child");

    if (+lastChild.innerHTML !== 0) {
      newDiv = document.createElement("div");
      newDiv.innerHTML = 0;
      newDiv.style.color = "rgba(255,255,255,0.3)";
      el.append(newDiv);
      const animDuration = 500;

      const sliding = [
        { transform: `translateY(-${(el.children.length - 1) * (+lastChild.offsetHeight)}px)` },
      ];

      const slidingOptions = {
        duration: animDuration,
        iterations: 1,
        fill: "forwards",
      };

      let anim = el.animate(sliding, slidingOptions);
      anim.commitStyles();
    }
  });
}
