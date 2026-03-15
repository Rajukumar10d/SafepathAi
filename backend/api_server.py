from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the trained model
model = joblib.load('risk_model.pkl')

# Features used in training
features = ['RAPE', 'KIDNAPPING_AND_ABDUCTION', 'ASSAULT_ON_WOMEN', 'INSULT_TO_MODESTY', 'CRUELTY_BY_HUSBAND']

@app.route('/predict-risk', methods=['POST'])
def predict_risk():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Extract features
        input_data = np.array([[data.get(f, 0) for f in features]])

        # Predict
        prediction = model.predict(input_data)[0]

        return jsonify({'risk_score': float(prediction)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)