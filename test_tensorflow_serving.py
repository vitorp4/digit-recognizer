import requests
import numpy as np
from keras.datasets.mnist import load_data

# ------------------------------- MLP --------------------------------------------

(_, _), (x_test, y_test) = load_data()
x_test = x_test.reshape((x_test.shape[0], x_test.shape[1]*x_test.shape[2]))
x_test = x_test.astype('float32') / 255.0

url = 'http://localhost:8501/v1/models/mlp:predict'

def make_prediction(instances):
   data = {"signature_name": "serving_default", "instances": instances.tolist()}
   response = requests.post(url, json=data)
   predictions = response.json()['predictions']
   return predictions

predictions = make_prediction(x_test[0:10])

for i, pred in enumerate(predictions):
   print(f"True Value: {y_test[i]}, Predicted Value: {np.argmax(pred)}")

print()
# ------------------------------- CONVNET --------------------------------------------

(_, _), (x_test, y_test) = load_data()
x_test = x_test.reshape((x_test.shape[0], x_test.shape[1], x_test.shape[2], 1))
x_test = x_test.astype('float32') / 255.0

url = 'http://localhost:8501/v1/models/convnet:predict'

def make_prediction(instances):
   data = {"signature_name": "serving_default", "instances": instances.tolist()}
   response = requests.post(url, json=data)
   predictions = response.json()['predictions']
   return predictions

predictions = make_prediction(x_test[0:10])

for i, pred in enumerate(predictions):
   print(f"True Value: {y_test[i]}, Predicted Value: {np.argmax(pred)}")