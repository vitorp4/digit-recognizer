from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
import numpy as np
from fastapi import Body
from pydantic import BaseModel
import requests
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

  requests = [
    ('mlp', 'http://localhost:8501/v1/models/mlp:predict', digit_mlp),
    ('convnet', 'http://localhost:8501/v1/models/convnet:predict', digit_convnet)
  ]

  response = []

  for model_name, url, body in requests:
    probabilities = make_prediction(url, body)
    response.append(NeuralNetworkPrediction(
      model = model_name,
      probabilities = probabilities,
      digit = np.array(probabilities).argmax()
    ))

  return response

def make_prediction(url, instances):
   data = {"signature_name": "serving_default", "instances": instances.tolist()}
   response = requests.post(url, json=data)
   predictions = response.json()['predictions']
   return predictions[0]

  # Jinja2, fastapi, uvicorn[standard], tensorflow, requests