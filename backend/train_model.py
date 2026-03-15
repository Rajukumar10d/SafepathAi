import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

# Load and clean the dataset
df = pd.read_csv('data/rajasthan_women_crime.csv')

# Filter for female victims
df_f = df[df['Victim Gender'] == 'F']

# Define crime categories
rape_crimes = ['SEXUAL ASSAULT', 'RAPE']
kidnap_crimes = ['KIDNAPPING']
assault_crimes = ['ASSAULT', 'DOMESTIC VIOLENCE']
insult_crimes = []  # No matching in dataset
cruelty_crimes = ['DOMESTIC VIOLENCE']

# Group by City and count crime descriptions
grouped = df_f.groupby('City')['Crime Description'].value_counts().unstack().fillna(0)

# Create feature columns
grouped['RAPE'] = grouped[[c for c in rape_crimes if c in grouped.columns]].sum(axis=1)
grouped['KIDNAPPING_AND_ABDUCTION'] = grouped[[c for c in kidnap_crimes if c in grouped.columns]].sum(axis=1)
grouped['ASSAULT_ON_WOMEN'] = grouped[[c for c in assault_crimes if c in grouped.columns]].sum(axis=1)
grouped['INSULT_TO_MODESTY'] = grouped[[c for c in insult_crimes if c in grouped.columns]].sum(axis=1) if insult_crimes else 0
grouped['CRUELTY_BY_HUSBAND'] = grouped[[c for c in cruelty_crimes if c in grouped.columns]].sum(axis=1)

# Create risk_score with weighted formula
grouped['risk_score'] = (grouped['RAPE'] * 5 +
                         grouped['KIDNAPPING_AND_ABDUCTION'] * 4 +
                         grouped['ASSAULT_ON_WOMEN'] * 3 +
                         grouped['INSULT_TO_MODESTY'] * 2 +
                         grouped['CRUELTY_BY_HUSBAND'] * 3)

# Features and target
features = ['RAPE', 'KIDNAPPING_AND_ABDUCTION', 'ASSAULT_ON_WOMEN', 'INSULT_TO_MODESTY', 'CRUELTY_BY_HUSBAND']
X = grouped[features]
y = grouped['risk_score']

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train RandomForestRegressor
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f'MAE: {mae:.2f}, R2: {r2:.2f}')

# Save the model
joblib.dump(model, 'risk_model.pkl')
print('Model saved as risk_model.pkl')

# Prediction function
def predict_risk(data):
    input_data = np.array([[data.get(f, 0) for f in features]])
    return model.predict(input_data)[0]

# Example usage
if __name__ == '__main__':
    sample_data = {'RAPE': 10, 'KIDNAPPING_AND_ABDUCTION': 5, 'ASSAULT_ON_WOMEN': 20, 'INSULT_TO_MODESTY': 0, 'CRUELTY_BY_HUSBAND': 15}
    print(f'Sample prediction: {predict_risk(sample_data)}')