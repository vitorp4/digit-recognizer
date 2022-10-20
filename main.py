from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
import numpy as np
from fastapi import Body
from pydantic import BaseModel
from keras.models import load_model
from typing import List

class NeuralNetworkPrediction(BaseModel):
  model: str
  probabilities: List[float]
  digit: float

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")
 
@app.get("/", response_class=HTMLResponse) 
async def simulator_app(request: Request):
  return templates.TemplateResponse("pages/simulator.html", {"request": request}) 

@app.post("/predict", response_model=List[NeuralNetworkPrediction])
async def classifier(matrix = Body()):
  digit = np.array(matrix).flatten()

  digit_mlp = digit.reshape((1, 28*28)).astype('float32') / 255
  digit_convnet = digit.reshape((1, 28, 28, 1)).astype('float32') / 255

  mlp_model = load_model('neural_networks/mlp_model')
  convnet_model = load_model('neural_networks/convnet_model')

  probabilities_mlp = mlp_model.predict(digit_mlp)
  probabilities_convnet = convnet_model.predict(digit_convnet)

  response = [{
    'model': 'mlp',
    'probabilities': probabilities_mlp[0].tolist(),
    'digit': probabilities_mlp[0].argmax()
  },{
    'model': 'convnet',
    'probabilities': probabilities_convnet[0].tolist(),
    'digit': probabilities_convnet[0].argmax()
  }]

  return response