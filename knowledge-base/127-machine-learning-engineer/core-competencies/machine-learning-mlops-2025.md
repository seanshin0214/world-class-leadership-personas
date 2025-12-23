# Machine Learning & MLOps 2025

**Updated**: 2025-11-23 | **Stack**: Python, TensorFlow, PyTorch, MLflow, Kubeflow

---

## ML Fundamentals

```python
# Supervised Learning (Classification)
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# Load data
X, y = load_data()  # Features, labels

# Split data (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)

# Evaluate
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.2%}")

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

---

# Regression
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Train
model = LinearRegression()
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)

# Evaluate
mse = mean_squared_error(y_test, y_pred)
rmse = mse ** 0.5
r2 = r2_score(y_test, y_pred)

print(f"RMSE: {rmse:.2f}")
print(f"R²: {r2:.2%}")

---

# Feature Engineering
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder

# Numerical features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Categorical features
le = LabelEncoder()
y_train_encoded = le.fit_transform(y_train)
y_test_encoded = le.transform(y_test)

# Create new features
df['age_squared'] = df['age'] ** 2
df['income_per_person'] = df['income'] / df['household_size']
df['is_weekend'] = df['day_of_week'].isin(['Saturday', 'Sunday'])

# Handle missing values
df['age'].fillna(df['age'].median(), inplace=True)  # Numerical
df['category'].fillna('Unknown', inplace=True)  # Categorical
```

---

## Deep Learning

```python
# TensorFlow/Keras (Neural Network)
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Build model
model = keras.Sequential([
    layers.Dense(128, activation='relu', input_shape=(input_dim,)),
    layers.Dropout(0.3),
    layers.Dense(64, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(num_classes, activation='softmax')
])

# Compile
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# Train
history = model.fit(
    X_train, y_train,
    batch_size=32,
    epochs=50,
    validation_split=0.2,
    callbacks=[
        keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=5,
            restore_best_weights=True
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3
        )
    ]
)

# Evaluate
test_loss, test_acc = model.evaluate(X_test, y_test)
print(f"Test accuracy: {test_acc:.2%}")

# Save model
model.save('model.h5')

---

# PyTorch (CNN for Images)
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset

# Define model
class CNN(nn.Module):
    def __init__(self):
        super(CNN, self).__init__()
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)
        self.fc1 = nn.Linear(64 * 8 * 8, 128)
        self.fc2 = nn.Linear(128, 10)
        self.dropout = nn.Dropout(0.5)
        
    def forward(self, x):
        x = self.pool(torch.relu(self.conv1(x)))
        x = self.pool(torch.relu(self.conv2(x)))
        x = x.view(-1, 64 * 8 * 8)
        x = torch.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return x

# Initialize
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = CNN().to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Training loop
num_epochs = 50
for epoch in range(num_epochs):
    model.train()
    running_loss = 0.0
    
    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)
        
        # Forward pass
        outputs = model(images)
        loss = criterion(outputs, labels)
        
        # Backward pass
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item()
    
    # Validation
    model.eval()
    val_loss = 0.0
    correct = 0
    total = 0
    
    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)
            val_loss += loss.item()
            
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
    
    val_acc = 100 * correct / total
    print(f'Epoch [{epoch+1}/{num_epochs}], '
          f'Train Loss: {running_loss/len(train_loader):.4f}, '
          f'Val Loss: {val_loss/len(val_loader):.4f}, '
          f'Val Acc: {val_acc:.2f}%')

# Save model
torch.save(model.state_dict(), 'model.pth')
```

---

## Model Evaluation & Tuning

```python
# Cross-Validation
from sklearn.model_selection import cross_val_score

scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
print(f"CV Accuracy: {scores.mean():.2%} (+/- {scores.std() * 2:.2%})")

---

# Hyperparameter Tuning (Grid Search)
from sklearn.model_selection import GridSearchCV

param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [10, 20, 30, None],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

grid_search = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid,
    cv=5,
    scoring='accuracy',
    n_jobs=-1,
    verbose=2
)

grid_search.fit(X_train, y_train)

print(f"Best params: {grid_search.best_params_}")
print(f"Best score: {grid_search.best_score_:.2%}")

best_model = grid_search.best_estimator_

---

# Feature Importance
import matplotlib.pyplot as plt

importances = best_model.feature_importances_
indices = np.argsort(importances)[::-1]

plt.figure(figsize=(10, 6))
plt.title("Feature Importances")
plt.bar(range(X.shape[1]), importances[indices])
plt.xticks(range(X.shape[1]), [feature_names[i] for i in indices], rotation=90)
plt.tight_layout()
plt.show()

---

# Learning Curves
from sklearn.model_selection import learning_curve

train_sizes, train_scores, val_scores = learning_curve(
    model, X, y, cv=5, n_jobs=-1,
    train_sizes=np.linspace(0.1, 1.0, 10),
    scoring='accuracy'
)

plt.plot(train_sizes, train_scores.mean(axis=1), label='Training score')
plt.plot(train_sizes, val_scores.mean(axis=1), label='Validation score')
plt.xlabel('Training set size')
plt.ylabel('Accuracy')
plt.legend()
plt.show()
```

---

## MLOps & Model Deployment

```python
# MLflow (Experiment Tracking)
import mlflow
import mlflow.sklearn

# Start run
with mlflow.start_run():
    # Log parameters
    mlflow.log_param("n_estimators", 100)
    mlflow.log_param("max_depth", 20)
    
    # Train model
    model = RandomForestClassifier(n_estimators=100, max_depth=20)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    # Log metrics
    mlflow.log_metric("accuracy", accuracy)
    mlflow.log_metric("f1_score", f1_score(y_test, y_pred, average='weighted'))
    
    # Log model
    mlflow.sklearn.log_model(model, "model")
    
    print(f"Run ID: {mlflow.active_run().info.run_id}")

# Load model
loaded_model = mlflow.sklearn.load_model(f"runs:/{run_id}/model")

# Start MLflow UI: mlflow ui --port 5000

---

# FastAPI (Model Serving)
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

# Load model
model = joblib.load('model.pkl')

class PredictionRequest(BaseModel):
    features: list[float]

class PredictionResponse(BaseModel):
    prediction: int
    probability: float

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    # Prepare input
    X = np.array([request.features])
    
    # Predict
    prediction = model.predict(X)[0]
    probability = model.predict_proba(X)[0].max()
    
    return PredictionResponse(
        prediction=int(prediction),
        probability=float(probability)
    )

@app.get("/health")
def health():
    return {"status": "healthy"}

# Run: uvicorn main:app --reload

---

# Docker (Containerize Model)
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy model and code
COPY model.pkl .
COPY main.py .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# Build: docker build -t ml-api .
# Run: docker run -p 8000:8000 ml-api

---

# Kubernetes (Deploy Model)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ml-model
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ml-model
  template:
    metadata:
      labels:
        app: ml-model
    spec:
      containers:
      - name: ml-model
        image: myrepo/ml-api:1.0
        ports:
        - containerPort: 8000
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: ml-model-service
spec:
  selector:
    app: ml-model
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: LoadBalancer
```

---

## Model Monitoring

```python
# Data Drift Detection
from evidently.pipeline.column_mapping import ColumnMapping
from evidently.dashboard import Dashboard
from evidently.dashboard.tabs import DataDriftTab

# Compare reference (training) vs current (production) data
column_mapping = ColumnMapping()
column_mapping.target = 'target'
column_mapping.numerical_features = ['age', 'income']
column_mapping.categorical_features = ['gender', 'category']

dashboard = Dashboard(tabs=[DataDriftTab()])
dashboard.calculate(reference_data, current_data, column_mapping=column_mapping)
dashboard.save("data_drift_report.html")

---

# Model Performance Monitoring
import prometheus_client as prom

# Metrics
prediction_counter = prom.Counter(
    'model_predictions_total',
    'Total number of predictions',
    ['model_version']
)

prediction_latency = prom.Histogram(
    'model_prediction_latency_seconds',
    'Prediction latency in seconds',
    ['model_version']
)

prediction_confidence = prom.Histogram(
    'model_prediction_confidence',
    'Prediction confidence scores',
    ['model_version'],
    buckets=[0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 0.99, 1.0]
)

# Track metrics
import time

@app.post("/predict")
def predict(request: PredictionRequest):
    start_time = time.time()
    
    # Predict
    prediction = model.predict(X)[0]
    probability = model.predict_proba(X)[0].max()
    
    # Log metrics
    prediction_counter.labels(model_version='v1.0').inc()
    prediction_latency.labels(model_version='v1.0').observe(time.time() - start_time)
    prediction_confidence.labels(model_version='v1.0').observe(probability)
    
    return {"prediction": int(prediction), "probability": float(probability)}

@app.get("/metrics")
def metrics():
    return prom.generate_latest()

---

# Retraining Pipeline (Airflow)
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'ml-team',
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}

dag = DAG(
    'model_retraining',
    default_args=default_args,
    description='Retrain model weekly',
    schedule_interval='0 0 * * 0',  # Every Sunday
    start_date=datetime(2025, 1, 1),
    catchup=False
)

def extract_data():
    # Fetch new data from database
    pass

def train_model():
    # Retrain model on new data
    pass

def evaluate_model():
    # Evaluate on holdout set
    # If accuracy < threshold, alert & don't deploy
    pass

def deploy_model():
    # Push to production
    pass

task1 = PythonOperator(task_id='extract_data', python_callable=extract_data, dag=dag)
task2 = PythonOperator(task_id='train_model', python_callable=train_model, dag=dag)
task3 = PythonOperator(task_id='evaluate_model', python_callable=evaluate_model, dag=dag)
task4 = PythonOperator(task_id='deploy_model', python_callable=deploy_model, dag=dag)

task1 >> task2 >> task3 >> task4
```

---

## Key Takeaways

1. **Data quality** - Garbage in, garbage out (spend time on data cleaning)
2. **Simple baselines** - Start simple (logistic regression), then complex (deep learning)
3. **Cross-validation** - Don't trust single train/test split
4. **Monitoring** - Models degrade over time (data drift, concept drift)
5. **Reproducibility** - Version code, data, models (random seeds, MLflow)

---

## References

- "Hands-On Machine Learning" - Aurélien Géron
- "Deep Learning" - Ian Goodfellow
- fast.ai courses

**Related**: `deep-learning-advanced.md`, `mlops-best-practices.md`, `model-monitoring.md`
