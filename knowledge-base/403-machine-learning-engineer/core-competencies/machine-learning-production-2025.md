# Machine Learning in Production 2025

**Updated**: 2025-11-24 | **Focus**: MLOps, Model Training, Deployment, Monitoring

---

## ML Project Workflow

```python
# END-TO-END ML PIPELINE

# 1. DATA COLLECTION & EXPLORATION
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Load data
df = pd.read_csv('data.csv')

# Exploratory Data Analysis (EDA)
df.info()  # Data types, missing values
df.describe()  # Statistics (mean, std, min, max)
df.isnull().sum()  # Count missing values
df['target'].value_counts()  # Class distribution (classification)

# Visualizations
sns.histplot(df['feature1'])  # Distribution
sns.boxplot(x='target', y='feature1', data=df)  # Compare groups
sns.heatmap(df.corr(), annot=True)  # Feature correlations

---

# 2. DATA PREPROCESSING

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.impute import SimpleImputer

# Handle missing values
imputer = SimpleImputer(strategy='median')  # or 'mean', 'most_frequent'
df[['feature1', 'feature2']] = imputer.fit_transform(df[['feature1', 'feature2']])

# Encode categorical variables
le = LabelEncoder()
df['category'] = le.fit_transform(df['category'])

# Or one-hot encoding (for non-ordinal categories)
df = pd.get_dummies(df, columns=['category'], drop_first=True)

# Feature engineering
df['feature_ratio'] = df['feature1'] / df['feature2']
df['feature_interaction'] = df['feature1'] * df['feature2']

# Split data
X = df.drop('target', axis=1)
y = df['target']
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y  # Balanced split
)

# Scale features (important for distance-based models: SVM, KNN, neural networks)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)  # Use same scaler (no data leakage!)

---

# 3. MODEL TRAINING

from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# Train multiple models
models = {
    'Logistic Regression': LogisticRegression(max_iter=1000),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'SVM': SVC(kernel='rbf', random_state=42)
}

results = {}
for name, model in models.items():
    model.fit(X_train_scaled, y_train)
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    results[name] = accuracy
    print(f"{name}: {accuracy:.4f}")

# Best model
best_model_name = max(results, key=results.get)
best_model = models[best_model_name]
print(f"\nBest model: {best_model_name} ({results[best_model_name]:.4f})")

---

# 4. HYPERPARAMETER TUNING

from sklearn.model_selection import GridSearchCV

# Define parameter grid
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [10, 20, 30, None],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

# Grid search with cross-validation
rf = RandomForestClassifier(random_state=42)
grid_search = GridSearchCV(
    rf, param_grid, cv=5, scoring='accuracy', n_jobs=-1, verbose=1
)
grid_search.fit(X_train_scaled, y_train)

# Best parameters
print(f"Best params: {grid_search.best_params_}")
print(f"Best CV score: {grid_search.best_score_:.4f}")

# Test set performance
best_rf = grid_search.best_estimator_
y_pred = best_rf.predict(X_test_scaled)
print(f"Test accuracy: {accuracy_score(y_test, y_pred):.4f}")

---

# 5. MODEL EVALUATION

from sklearn.metrics import (
    classification_report, confusion_matrix, roc_auc_score, roc_curve
)

# Classification report
print(classification_report(y_test, y_pred))
# Output:
#               precision    recall  f1-score   support
#
#            0       0.95      0.93      0.94       100
#            1       0.94      0.96      0.95       120
#
#     accuracy                           0.95       220

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.ylabel('Actual')
plt.xlabel('Predicted')
plt.title('Confusion Matrix')
plt.show()

# ROC-AUC (binary classification)
y_proba = best_rf.predict_proba(X_test_scaled)[:, 1]
auc = roc_auc_score(y_test, y_proba)
print(f"ROC-AUC: {auc:.4f}")

fpr, tpr, thresholds = roc_curve(y_test, y_proba)
plt.plot(fpr, tpr, label=f'AUC = {auc:.4f}')
plt.plot([0, 1], [0, 1], 'k--')  # Random classifier
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curve')
plt.legend()
plt.show()

---

# 6. SAVE MODEL

import joblib

# Save model and scaler
joblib.dump(best_rf, 'model.pkl')
joblib.dump(scaler, 'scaler.pkl')

# Load later
loaded_model = joblib.load('model.pkl')
loaded_scaler = joblib.load('scaler.pkl')

# Predict on new data
new_data = pd.DataFrame([[1.2, 3.4, 5.6]], columns=['feature1', 'feature2', 'feature3'])
new_data_scaled = loaded_scaler.transform(new_data)
prediction = loaded_model.predict(new_data_scaled)
print(f"Prediction: {prediction[0]}")
```

---

## Deep Learning (PyTorch)

```python
# NEURAL NETWORK FOR CLASSIFICATION

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset

# Convert to PyTorch tensors
X_train_tensor = torch.FloatTensor(X_train_scaled)
y_train_tensor = torch.LongTensor(y_train.values)
X_test_tensor = torch.FloatTensor(X_test_scaled)
y_test_tensor = torch.LongTensor(y_test.values)

# Create DataLoader
train_dataset = TensorDataset(X_train_tensor, y_train_tensor)
train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)

---

# DEFINE MODEL

class NeuralNetwork(nn.Module):
    def __init__(self, input_size, hidden_size, num_classes):
        super(NeuralNetwork, self).__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.2)  # Regularization
        self.fc2 = nn.Linear(hidden_size, hidden_size)
        self.fc3 = nn.Linear(hidden_size, num_classes)
    
    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.dropout(x)
        x = self.fc2(x)
        x = self.relu(x)
        x = self.dropout(x)
        x = self.fc3(x)
        return x

# Initialize model
input_size = X_train_scaled.shape[1]
hidden_size = 64
num_classes = len(y_train.unique())

model = NeuralNetwork(input_size, hidden_size, num_classes)

# Loss and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

---

# TRAINING LOOP

num_epochs = 50
train_losses = []
test_accuracies = []

for epoch in range(num_epochs):
    model.train()
    epoch_loss = 0
    
    for batch_X, batch_y in train_loader:
        # Forward pass
        outputs = model(batch_X)
        loss = criterion(outputs, batch_y)
        
        # Backward pass and optimization
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        epoch_loss += loss.item()
    
    # Evaluation
    model.eval()
    with torch.no_grad():
        outputs = model(X_test_tensor)
        _, predicted = torch.max(outputs, 1)
        accuracy = (predicted == y_test_tensor).sum().item() / len(y_test_tensor)
    
    train_losses.append(epoch_loss / len(train_loader))
    test_accuracies.append(accuracy)
    
    if (epoch + 1) % 10 == 0:
        print(f"Epoch [{epoch+1}/{num_epochs}], Loss: {epoch_loss/len(train_loader):.4f}, Test Acc: {accuracy:.4f}")

# Plot training curves
plt.figure(figsize=(12, 4))
plt.subplot(1, 2, 1)
plt.plot(train_losses)
plt.title('Training Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')

plt.subplot(1, 2, 2)
plt.plot(test_accuracies)
plt.title('Test Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.show()

---

# SAVE PYTORCH MODEL

torch.save(model.state_dict(), 'model.pth')

# Load
loaded_model = NeuralNetwork(input_size, hidden_size, num_classes)
loaded_model.load_state_dict(torch.load('model.pth'))
loaded_model.eval()

# Predict
with torch.no_grad():
    outputs = loaded_model(X_test_tensor)
    _, predicted = torch.max(outputs, 1)
    accuracy = (predicted == y_test_tensor).sum().item() / len(y_test_tensor)
    print(f"Loaded model accuracy: {accuracy:.4f}")
```

---

## MLOps & Model Deployment

```python
# FASTAPI (Serve ML model as REST API)

from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

# Load model at startup
model = joblib.load('model.pkl')
scaler = joblib.load('scaler.pkl')

# Define request schema
class PredictionInput(BaseModel):
    feature1: float
    feature2: float
    feature3: float

# Define response schema
class PredictionOutput(BaseModel):
    prediction: int
    probability: float

@app.post("/predict", response_model=PredictionOutput)
async def predict(input_data: PredictionInput):
    # Convert to array
    features = np.array([[input_data.feature1, input_data.feature2, input_data.feature3]])
    
    # Scale
    features_scaled = scaler.transform(features)
    
    # Predict
    prediction = model.predict(features_scaled)[0]
    probability = model.predict_proba(features_scaled)[0].max()
    
    return PredictionOutput(prediction=int(prediction), probability=float(probability))

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Run: uvicorn main:app --reload
# API docs: http://localhost:8000/docs

---

# CLIENT (Call API)

import requests

response = requests.post(
    "http://localhost:8000/predict",
    json={"feature1": 1.2, "feature2": 3.4, "feature3": 5.6}
)

result = response.json()
print(f"Prediction: {result['prediction']}, Probability: {result['probability']:.4f}")

---

# DOCKER (Containerize model)

# Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# requirements.txt
fastapi==0.104.1
uvicorn==0.24.0
scikit-learn==1.3.2
joblib==1.3.2
numpy==1.26.2
pydantic==2.5.0

# Build and run
docker build -t ml-api .
docker run -p 8000:8000 ml-api

---

# MLFLOW (Experiment tracking)

import mlflow
import mlflow.sklearn

# Start experiment
mlflow.set_experiment("random_forest_tuning")

with mlflow.start_run():
    # Log parameters
    mlflow.log_param("n_estimators", 100)
    mlflow.log_param("max_depth", 20)
    
    # Train model
    rf = RandomForestClassifier(n_estimators=100, max_depth=20, random_state=42)
    rf.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred = rf.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    
    # Log metrics
    mlflow.log_metric("accuracy", accuracy)
    mlflow.log_metric("auc", roc_auc_score(y_test, rf.predict_proba(X_test_scaled)[:, 1]))
    
    # Log model
    mlflow.sklearn.log_model(rf, "model")
    
    print(f"Run ID: {mlflow.active_run().info.run_id}")

# View experiments: mlflow ui
# Browse to http://localhost:5000
```

---

## Model Monitoring

```python
# DATA DRIFT DETECTION (Distribution shifts)

from scipy.stats import ks_2samp

def detect_drift(reference_data, new_data, threshold=0.05):
    """Kolmogorov-Smirnov test for distribution drift"""
    statistic, p_value = ks_2samp(reference_data, new_data)
    
    if p_value < threshold:
        print(f"⚠️ DRIFT DETECTED! (p-value: {p_value:.4f})")
        return True
    else:
        print(f"✅ No drift (p-value: {p_value:.4f})")
        return False

# Example: Check if new data differs from training data
drift_detected = detect_drift(X_train['feature1'], new_production_data['feature1'])

---

# MODEL PERFORMANCE MONITORING

import time

class ModelMonitor:
    def __init__(self):
        self.predictions = []
        self.actuals = []
        self.latencies = []
    
    def log_prediction(self, prediction, actual=None, latency=None):
        self.predictions.append(prediction)
        if actual is not None:
            self.actuals.append(actual)
        if latency is not None:
            self.latencies.append(latency)
    
    def calculate_metrics(self):
        if not self.actuals:
            return None
        
        accuracy = accuracy_score(self.actuals, self.predictions)
        avg_latency = np.mean(self.latencies) if self.latencies else None
        
        return {
            "accuracy": accuracy,
            "num_predictions": len(self.predictions),
            "avg_latency_ms": avg_latency
        }

# Usage
monitor = ModelMonitor()

# In prediction endpoint
start_time = time.time()
prediction = model.predict(features_scaled)[0]
latency = (time.time() - start_time) * 1000  # ms

monitor.log_prediction(prediction, latency=latency)

# Later, when actual label is available
monitor.log_prediction(prediction, actual=true_label, latency=latency)

# Daily report
metrics = monitor.calculate_metrics()
print(f"Daily metrics: {metrics}")

# Alert if accuracy drops
if metrics['accuracy'] < 0.85:
    send_alert("Model accuracy dropped below 85%!")

---

# A/B TESTING (Gradual rollout)

import random

def predict_with_ab_test(features, model_a, model_b, traffic_split=0.1):
    """
    Route traffic to model B with `traffic_split` probability
    (e.g., 0.1 = 10% to B, 90% to A)
    """
    if random.random() < traffic_split:
        # Model B (new model)
        prediction = model_b.predict(features)
        model_version = 'B'
    else:
        # Model A (current model)
        prediction = model_a.predict(features)
        model_version = 'A'
    
    # Log for analysis
    log_prediction(features, prediction, model_version)
    
    return prediction

# Analyze results after 1 week
# If model B accuracy >= model A + 2%: Promote B to 100%
# If model B accuracy < model A: Rollback to A
```

---

## Feature Engineering

```python
# ADVANCED FEATURE ENGINEERING

# 1. POLYNOMIAL FEATURES (Interactions)
from sklearn.preprocessing import PolynomialFeatures

poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly.fit_transform(X[['feature1', 'feature2']])
# Creates: feature1, feature2, feature1^2, feature1*feature2, feature2^2

---

# 2. BINNING (Discretization)
df['age_group'] = pd.cut(df['age'], bins=[0, 18, 35, 50, 100], labels=['Young', 'Adult', 'Middle', 'Senior'])

---

# 3. TARGET ENCODING (For high-cardinality categoricals)
from category_encoders import TargetEncoder

# Encode category based on mean of target
te = TargetEncoder(cols=['city'])
df['city_encoded'] = te.fit_transform(df['city'], df['target'])

---

# 4. TIME FEATURES (From datetime)
df['date'] = pd.to_datetime(df['date'])
df['year'] = df['date'].dt.year
df['month'] = df['date'].dt.month
df['day_of_week'] = df['date'].dt.dayofweek  # 0=Monday, 6=Sunday
df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
df['hour'] = df['date'].dt.hour

---

# 5. AGGREGATIONS (Group statistics)
# Average purchase amount per customer
customer_stats = df.groupby('customer_id')['amount'].agg(['mean', 'sum', 'count'])
df = df.merge(customer_stats, on='customer_id', suffixes=('', '_customer_avg'))

---

# 6. LAG FEATURES (Time series)
df['sales_lag_1'] = df['sales'].shift(1)  # Previous day
df['sales_lag_7'] = df['sales'].shift(7)  # 1 week ago
df['sales_rolling_7'] = df['sales'].rolling(window=7).mean()  # 7-day moving average
```

---

## Key Takeaways

1. **Data quality > Model complexity** - Clean data with simple model beats dirty data with complex model
2. **Start simple** - Logistic regression baseline before deep learning (interpretability, debugging)
3. **Cross-validation** - Always use CV (avoid overfitting to test set)
4. **Monitor in production** - Accuracy degrades over time (data drift, concept drift)
5. **Iterate fast** - Ship v1 quickly, improve based on real feedback (not perfection upfront)

---

## References

- "Hands-On Machine Learning" - Aurélien Géron
- "Designing Machine Learning Systems" - Chip Huyen
- Scikit-learn, PyTorch, MLflow documentation

**Related**: `feature-engineering-guide.md`, `mlops-best-practices.md`, `model-monitoring.md`
