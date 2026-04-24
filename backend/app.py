from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import pickle
from pathlib import Path


app = FastAPI()


origins = ["*"]


BASE_DIR = Path(__file__).resolve().parent

model = pickle.load(open(BASE_DIR / 'model.pkl', 'rb'))
feature_names = pickle.load(open(BASE_DIR / 'feature_names.pkl', 'rb'))


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ParkinsonModel(BaseModel):
    jitter_abs: float
    jitter_ddp: float
    jitter_local: float
    jitter_ppq5: float
    jitter_rap: float
    shimmer_apq3: float
    shimmer_apq5: float
    shimmer_db: float
    shimmer_dda: float
    shimmer_local: float


@app.get('/')
def welcome():
    return {
        'success': True,
        'message': 'server of parkinson disease detection is up and running successfully'
    }


@app.post('/pred-parkinson-disease')
async def park_disease(parkDiseaseParameter: ParkinsonModel):
    feature_values = {
        'jitter_abs': parkDiseaseParameter.jitter_abs,
        'jitter_ddp': parkDiseaseParameter.jitter_ddp,
        'jitter_local': parkDiseaseParameter.jitter_local,
        'jitter_ppq5': parkDiseaseParameter.jitter_ppq5,
        'jitter_rap': parkDiseaseParameter.jitter_rap,
        'shimmer_apq3': parkDiseaseParameter.shimmer_apq3,
        'shimmer_apq5': parkDiseaseParameter.shimmer_apq5,
        'shimmer_db': parkDiseaseParameter.shimmer_db,
        'shimmer_dda': parkDiseaseParameter.shimmer_dda,
        'shimmer_local': parkDiseaseParameter.shimmer_local,
    }

    pred_data = np.asarray([feature_values[name] for name in feature_names], dtype=float).reshape(1, -1)

    prediction = model.predict(pred_data)

    prediction_msg = ''

    if prediction[0] == 0:
        prediction_msg = 'the person does not have parkinson disease'
    elif prediction[0] == 1:
        prediction_msg = 'the person is having parkinson disease'

    return {
        'success': True,
        'pred_value': float(prediction[0]),
        'pred_msg': prediction_msg
    }
