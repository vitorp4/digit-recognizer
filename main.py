from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from keras.models import load_model
import numpy as np
from fastapi import Body
from pydantic import BaseModel
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
  mlp = load_model("neural_networks/mlp_model")
  convnet = load_model("neural_networks/convnet_model")
  digit = np.array(matrix).flatten()

  digit_mlp = digit.reshape((1, 28*28)).astype('float32') / 255
  digit_convnet = digit.reshape((1, 28, 28, 1)).astype('float32') / 255

  mlp_preditcion = mlp.predict(digit_mlp)
  convnet_prediction = convnet.predict(digit_convnet)

  response = [{
    'model': 'mlp',
    'probabilities': mlp_preditcion[0].tolist(),
    'digit': mlp_preditcion[0].argmax()
  },
  { 
    'model': 'convnet',
    'probabilities': convnet_prediction[0].tolist(),
    'digit': convnet_prediction[0].argmax()
  }]

  return response