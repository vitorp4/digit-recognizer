let numbers = document.querySelector('.numbers-slider')

numbers.addEventListener('click', function() {
  let firstChild = this.querySelector('div:last-child');
  let c = +firstChild.innerHTML;
  newDiv = document.createElement('div');
  newDiv.innerHTML = c + 1;
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
})