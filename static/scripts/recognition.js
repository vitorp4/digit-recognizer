const buttonPrediction = document.querySelector("#prediction");
const numbersMlp = document.querySelectorAll('#mlp-counter .numbers-slider')
const numbersConvnet = document.querySelectorAll('#convnet-counter .numbers-slider')

buttonPrediction.addEventListener("click", predict);
[...numbersMlp, ...numbersConvnet].forEach(el => el.addEventListener('increment', incrementCounter));

function predict() {
  options = {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(grayScaleMatrix),
  };

  fetch('/predict', options)
    .then(response => response.json())
    .then(data => {
      let mlpIndex = data.findIndex(el => el.model === 'mlp');
      let mlpDigitResult = data[mlpIndex]['digit']
      numbersMlp[mlpDigitResult].dispatchEvent(new Event('increment'));
      
      let convnetIndex = data.findIndex(el => el.model === 'convnet');
      let convnetDigitResult = data[convnetIndex]['digit']
      numbersConvnet[convnetDigitResult].dispatchEvent(new Event('increment'));
    });
}

function incrementCounter() {
  let firstChild = this.querySelector('div:last-child');
  let c = +firstChild.innerHTML;
  
  newDiv = document.createElement('div');
  newDiv.innerHTML = c + 1;
  newDiv.style.color = 'rgba(255,255,255,0.9)';
  this.append(newDiv);
  const animDuration = 500;
  
  const sliding = [
    { transform: 'translateY(-50px)' },
  ];

  const slidingOptions = {
    duration: animDuration,
    iterations: 1
  }

  this.animate(sliding, slidingOptions);
  
  setTimeout(()=> {
    firstChild.remove();
  }, animDuration);  
};
