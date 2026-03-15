# SafePath AI - Women Safety Risk Prediction ML Module

This module provides a machine learning model to predict risky areas for women based on crime data.

## Folder Structure

```
backend/
├── data/
│   └── rajasthan_women_crime.csv  # Crime dataset
├── train_model.py                 # Training script
├── api_server.py                 # Flask API server
├── requirements.txt               # Python dependencies
└── risk_model.pkl                 # Trained model (generated)
```

## Setup Instructions

1. Ensure you have Python 3.11 installed (Python 3.13 has compatibility issues with scikit-learn).

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Running the Module

1. Train the model:
   ```
   python train_model.py
   ```
   This will load the dataset, train the Random Forest model, evaluate it, and save `risk_model.pkl`.

2. Start the API server:
   ```
   python api_server.py
   ```
   The server will run on http://localhost:5000

## API Usage

Send a POST request to `/predict-risk` with JSON data containing the crime counts:

```json
{
  "RAPE": 10,
  "KIDNAPPING_AND_ABDUCTION": 5,
  "ASSAULT_ON_WOMEN": 20,
  "INSULT_TO_MODESTY": 0,
  "CRUELTY_BY_HUSBAND": 15
}
```

Response:
```json
{
  "risk_score": 123.45
}
```

## Model Details

- Algorithm: RandomForestRegressor
- Features: Crime counts (RAPE, KIDNAPPING_AND_ABDUCTION, ASSAULT_ON_WOMEN, INSULT_TO_MODESTY, CRUELTY_BY_HUSBAND)
- Target: Weighted risk score based on crime severity
- Evaluation: MAE and R2 score printed during training