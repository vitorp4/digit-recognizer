const buttonPrediction = document.querySelector("#prediction");

buttonPrediction.addEventListener("click", predict);

function predict() {
  options = {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(grayScaleMatrix),
  };

  fetch('/predict', options)
    .then(response => response.json())
    .then(data => {
      for(d of data) {
        console.log(d)
      } 
    });
}
