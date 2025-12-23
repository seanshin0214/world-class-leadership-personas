# Machine Learning Production Systems 2025

**Updated**: 2025-11-24 | **Focus**: MLOps, Model Training, Deployment, Monitoring, Feature Engineering

---

## Machine Learning Pipeline

```python
# END-TO-END ML PIPELINE (Scikit-learn + MLflow)

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import mlflow
import mlflow.sklearn

# 1. DATA LOADING & EXPLORATION
df = pd.read_csv('data.csv')

print(f"Shape: {df.shape}")
print(f"Missing values:\n{df.isnull().sum()}")
print(f"Target distribution:\n{df['target'].value_counts()}")

# 2. FEATURE ENGINEERING
# Handle missing values
df['age'].fillna(df['age'].median(), inplace=True)
df['income'].fillna(df['income'].median(), inplace=True)

# Encode categorical variables
df = pd.get_dummies(df, columns=['category', 'region'], drop_first=True)

# Create new features
df['age_income_ratio'] = df['age'] / (df['income'] + 1)

# 3. TRAIN-TEST SPLIT
X = df.drop('target', axis=1)
y = df['target']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 4. FEATURE SCALING
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 5. MODEL TRAINING (with MLflow tracking)
mlflow.set_experiment("customer_churn_prediction")

with mlflow.start_run():
    # Log parameters
    params = {
        'n_estimators': 100,
        'max_depth': 10,
        'min_samples_split': 5,
        'random_state': 42
    }
    mlflow.log_params(params)
    
    # Train model
    model = RandomForestClassifier(**params)
    model.fit(X_train_scaled, y_train)
    
    # Predictions
    y_pred = model.predict(X_test_scaled)
    
    # Metrics
    accuracy = accuracy_score(y_test, y_pred)
    mlflow.log_metric("accuracy", accuracy)
    mlflow.log_metric("train_samples", len(X_train))
    mlflow.log_metric("test_samples", len(X_test))
    
    # Log model
    mlflow.sklearn.log_model(model, "model")
    
    # Log artifacts
    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    pd.DataFrame(cm).to_csv('confusion_matrix.csv', index=False)
    mlflow.log_artifact('confusion_matrix.csv')
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    feature_importance.to_csv('feature_importance.csv', index=False)
    mlflow.log_artifact('feature_importance.csv')
    
    print(f"Accuracy: {accuracy:.4f}")
    print(f"\nClassification Report:\n{classification_report(y_test, y_pred)}")
    print(f"\nTop 10 features:\n{feature_importance.head(10)}")

# 6. MODEL SAVING
import joblib
joblib.dump(model, 'model.pkl')
joblib.dump(scaler, 'scaler.pkl')
```

---

## Deep Learning (PyTorch)

```python
# NEURAL NETWORK FOR TABULAR DATA

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader

# Custom Dataset
class TabularDataset(Dataset):
    def __init__(self, X, y):
        self.X = torch.FloatTensor(X)
        self.y = torch.LongTensor(y)
    
    def __len__(self):
        return len(self.X)
    
    def __getitem__(self, idx):
        return self.X[idx], self.y[idx]

# Neural Network Architecture
class TabularNN(nn.Module):
    def __init__(self, input_dim, hidden_dims=[64, 32], output_dim=2, dropout=0.3):
        super(TabularNN, self).__init__()
        
        layers = []
        prev_dim = input_dim
        
        # Hidden layers
        for hidden_dim in hidden_dims:
            layers.append(nn.Linear(prev_dim, hidden_dim))
            layers.append(nn.BatchNorm1d(hidden_dim))
            layers.append(nn.ReLU())
            layers.append(nn.Dropout(dropout))
            prev_dim = hidden_dim
        
        # Output layer
        layers.append(nn.Linear(prev_dim, output_dim))
        
        self.network = nn.Sequential(*layers)
    
    def forward(self, x):
        return self.network(x)

# Training function
def train_model(model, train_loader, val_loader, epochs=50, lr=0.001):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = model.to(device)
    
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=lr)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', patience=5, factor=0.5)
    
    best_val_loss = float('inf')
    
    for epoch in range(epochs):
        # Training
        model.train()
        train_loss = 0
        for X_batch, y_batch in train_loader:
            X_batch, y_batch = X_batch.to(device), y_batch.to(device)
            
            optimizer.zero_grad()
            outputs = model(X_batch)
            loss = criterion(outputs, y_batch)
            loss.backward()
            optimizer.step()
            
            train_loss += loss.item()
        
        # Validation
        model.eval()
        val_loss = 0
        correct = 0
        total = 0
        
        with torch.no_grad():
            for X_batch, y_batch in val_loader:
                X_batch, y_batch = X_batch.to(device), y_batch.to(device)
                
                outputs = model(X_batch)
                loss = criterion(outputs, y_batch)
                val_loss += loss.item()
                
                _, predicted = torch.max(outputs, 1)
                total += y_batch.size(0)
                correct += (predicted == y_batch).sum().item()
        
        train_loss /= len(train_loader)
        val_loss /= len(val_loader)
        val_acc = correct / total
        
        scheduler.step(val_loss)
        
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), 'best_model.pth')
        
        if (epoch + 1) % 10 == 0:
            print(f"Epoch {epoch+1}/{epochs}, Train Loss: {train_loss:.4f}, Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.4f}")
    
    return model

# Usage
train_dataset = TabularDataset(X_train_scaled, y_train.values)
val_dataset = TabularDataset(X_test_scaled, y_test.values)

train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False)

model = TabularNN(input_dim=X_train_scaled.shape[1], hidden_dims=[64, 32], output_dim=2)
model = train_model(model, train_loader, val_loader, epochs=50)
```

---

## Feature Engineering

```python
# ADVANCED FEATURE ENGINEERING TECHNIQUES

import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, TargetEncoder

# 1. TIME-BASED FEATURES (from datetime)
df['date'] = pd.to_datetime(df['date'])

df['year'] = df['date'].dt.year
df['month'] = df['date'].dt.month
df['day'] = df['date'].dt.day
df['dayofweek'] = df['date'].dt.dayofweek  # 0=Monday, 6=Sunday
df['quarter'] = df['date'].dt.quarter
df['is_weekend'] = df['dayofweek'].isin([5, 6]).astype(int)
df['is_month_end'] = df['date'].dt.is_month_end.astype(int)

# Cyclical encoding (preserve circular nature of time)
df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)

# 2. AGGREGATION FEATURES (group-by statistics)
# Customer-level aggregations
customer_agg = df.groupby('customer_id').agg({
    'purchase_amount': ['mean', 'sum', 'std', 'count'],
    'days_since_last_purchase': ['mean', 'min', 'max']
}).reset_index()

customer_agg.columns = ['customer_id', 'avg_purchase', 'total_purchase', 'std_purchase', 'num_purchases',
                        'avg_days_since', 'min_days_since', 'max_days_since']

df = df.merge(customer_agg, on='customer_id', how='left')

# 3. INTERACTION FEATURES (combine features)
df['age_income'] = df['age'] * df['income']
df['credit_utilization'] = df['credit_used'] / (df['credit_limit'] + 1)  # +1 to avoid division by zero

# 4. BINNING (discretize continuous variables)
df['age_group'] = pd.cut(df['age'], bins=[0, 18, 30, 50, 100], labels=['<18', '18-30', '30-50', '50+'])

# 5. TARGET ENCODING (for high-cardinality categorical variables)
# Encode with mean of target (smoothing to prevent overfitting)
from category_encoders import TargetEncoder

encoder = TargetEncoder(cols=['city', 'occupation'])
X_train_encoded = encoder.fit_transform(X_train, y_train)
X_test_encoded = encoder.transform(X_test)

# 6. POLYNOMIAL FEATURES (higher-order interactions)
from sklearn.preprocessing import PolynomialFeatures

poly = PolynomialFeatures(degree=2, include_bias=False, interaction_only=True)
X_poly = poly.fit_transform(X[['age', 'income', 'credit_score']])

# 7. FEATURE SELECTION (remove low-importance features)
from sklearn.feature_selection import SelectKBest, f_classif

selector = SelectKBest(f_classif, k=20)  # Select top 20 features
X_selected = selector.fit_transform(X_train, y_train)

# Get selected feature names
selected_features = X_train.columns[selector.get_support()]
print(f"Selected features: {selected_features.tolist()}")

# 8. HANDLING IMBALANCED DATA
from imblearn.over_sampling import SMOTE
from imblearn.under_sampling import RandomUnderSampler
from imblearn.pipeline import Pipeline

# Combine over-sampling and under-sampling
over = SMOTE(sampling_strategy=0.5, random_state=42)
under = RandomUnderSampler(sampling_strategy=0.8, random_state=42)

pipeline = Pipeline([('over', over), ('under', under)])
X_resampled, y_resampled = pipeline.fit_resample(X_train, y_train)

print(f"Original class distribution: {y_train.value_counts()}")
print(f"Resampled class distribution: {pd.Series(y_resampled).value_counts()}")
```

---

## Model Deployment (FastAPI)

```python
# SERVE MODEL WITH FASTAPI

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd

# Load model and scaler
model = joblib.load('model.pkl')
scaler = joblib.load('scaler.pkl')

app = FastAPI(title="ML Model API", version="1.0")

# Request schema
class PredictionRequest(BaseModel):
    age: float
    income: float
    credit_score: float
    # Add all feature fields

# Response schema
class PredictionResponse(BaseModel):
    prediction: int
    probability: float

@app.get("/")
def read_root():
    return {"message": "ML Model API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    try:
        # Convert request to dataframe
        input_data = pd.DataFrame([request.dict()])
        
        # Feature engineering (same as training)
        input_data['age_income_ratio'] = input_data['age'] / (input_data['income'] + 1)
        
        # Scale features
        input_scaled = scaler.transform(input_data)
        
        # Predict
        prediction = model.predict(input_scaled)[0]
        probability = model.predict_proba(input_scaled)[0][1]  # Probability of positive class
        
        return PredictionResponse(
            prediction=int(prediction),
            probability=float(probability)
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict_batch")
def predict_batch(requests: list[PredictionRequest]):
    try:
        # Convert list of requests to dataframe
        input_data = pd.DataFrame([req.dict() for req in requests])
        
        # Feature engineering
        input_data['age_income_ratio'] = input_data['age'] / (input_data['income'] + 1)
        
        # Scale and predict
        input_scaled = scaler.transform(input_data)
        predictions = model.predict(input_scaled)
        probabilities = model.predict_proba(input_scaled)[:, 1]
        
        results = [
            {"prediction": int(pred), "probability": float(prob)}
            for pred, prob in zip(predictions, probabilities)
        ]
        
        return results
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run with: uvicorn app:app --host 0.0.0.0 --port 8000
```

```dockerfile
# DOCKERFILE FOR ML API

FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy model files
COPY model.pkl scaler.pkl ./
COPY app.py .

# Expose port
EXPOSE 8000

# Run app
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

```yaml
# KUBERNETES DEPLOYMENT

apiVersion: apps/v1
kind: Deployment
metadata:
  name: ml-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ml-api
  template:
    metadata:
      labels:
        app: ml-api
    spec:
      containers:
      - name: ml-api
        image: myregistry/ml-api:v1.0.0
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
  name: ml-api-service
spec:
  selector:
    app: ml-api
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
```

---

## Model Monitoring

```python
# MODEL PERFORMANCE MONITORING (Data Drift, Model Drift)

import pandas as pd
from scipy.stats import ks_2samp
import numpy as np

# 1. DATA DRIFT DETECTION (Kolmogorov-Smirnov test)
def detect_data_drift(train_data, prod_data, feature, threshold=0.05):
    """
    Detect if distribution of feature has changed significantly
    """
    statistic, p_value = ks_2samp(train_data[feature], prod_data[feature])
    
    is_drift = p_value < threshold
    
    return {
        'feature': feature,
        'ks_statistic': statistic,
        'p_value': p_value,
        'is_drift': is_drift
    }

# Check all features
train_df = pd.read_csv('train_data.csv')
prod_df = pd.read_csv('production_data.csv')

drift_results = []
for feature in train_df.columns:
    if feature != 'target':
        result = detect_data_drift(train_df, prod_df, feature)
        drift_results.append(result)

drift_df = pd.DataFrame(drift_results)
print(f"Features with drift:\n{drift_df[drift_df['is_drift']]}")

# 2. PREDICTION DRIFT (Monitor prediction distribution)
def monitor_predictions(predictions, threshold_mean=0.5, threshold_std=0.1):
    """
    Monitor if prediction distribution is unusual
    """
    mean_pred = np.mean(predictions)
    std_pred = np.std(predictions)
    
    alert = False
    if mean_pred < threshold_mean - 0.1 or mean_pred > threshold_mean + 0.1:
        alert = True
        print(f"ALERT: Mean prediction {mean_pred:.3f} outside expected range")
    
    if std_pred > threshold_std + 0.05:
        alert = True
        print(f"ALERT: Prediction variance {std_pred:.3f} higher than expected")
    
    return {'mean': mean_pred, 'std': std_pred, 'alert': alert}

# 3. MODEL PERFORMANCE MONITORING (Online metrics)
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

def log_model_metrics(y_true, y_pred, timestamp):
    """
    Log model performance metrics to monitoring system
    """
    metrics = {
        'timestamp': timestamp,
        'accuracy': accuracy_score(y_true, y_pred),
        'precision': precision_score(y_true, y_pred, zero_division=0),
        'recall': recall_score(y_true, y_pred, zero_division=0),
        'f1': f1_score(y_true, y_pred, zero_division=0),
        'num_samples': len(y_true)
    }
    
    # Log to monitoring system (e.g., Prometheus, CloudWatch)
    # For demo, save to database
    pd.DataFrame([metrics]).to_csv('metrics_log.csv', mode='a', header=False, index=False)
    
    return metrics

# 4. ALERTING (Trigger alert if performance drops)
def check_performance_alert(current_metrics, baseline_metrics, threshold=0.05):
    """
    Alert if performance drops below threshold
    """
    for metric in ['accuracy', 'precision', 'recall', 'f1']:
        current = current_metrics[metric]
        baseline = baseline_metrics[metric]
        
        if current < baseline - threshold:
            print(f"ALERT: {metric} dropped from {baseline:.3f} to {current:.3f}")
            # Send alert (email, Slack, PagerDuty)
            return True
    
    return False

# 5. AUTOMATED RETRAINING TRIGGER
def check_retrain_trigger(drift_count, performance_drop):
    """
    Decide if model should be retrained
    """
    if drift_count > 3 or performance_drop:
        print("TRIGGER: Initiating model retraining pipeline")
        # Trigger retraining job (Airflow, Kubeflow, AWS SageMaker)
        return True
    
    return False
```

---

## Hyperparameter Tuning

```python
# OPTUNA (Hyperparameter optimization, better than GridSearch)

import optuna
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

def objective(trial):
    """
    Objective function for Optuna to minimize
    """
    params = {
        'n_estimators': trial.suggest_int('n_estimators', 50, 300),
        'max_depth': trial.suggest_int('max_depth', 5, 30),
        'min_samples_split': trial.suggest_int('min_samples_split', 2, 20),
        'min_samples_leaf': trial.suggest_int('min_samples_leaf', 1, 10),
        'max_features': trial.suggest_categorical('max_features', ['sqrt', 'log2', None]),
        'random_state': 42
    }
    
    model = RandomForestClassifier(**params)
    
    # Use cross-validation to evaluate
    scores = cross_val_score(model, X_train, y_train, cv=5, scoring='f1')
    
    return scores.mean()

# Run optimization
study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=100, show_progress_bar=True)

print(f"Best parameters: {study.best_params}")
print(f"Best F1 score: {study.best_value:.4f}")

# Train final model with best parameters
best_model = RandomForestClassifier(**study.best_params)
best_model.fit(X_train, y_train)
```

---

## Key Takeaways

1. **Feature engineering > model choice** - Good features with simple model often beat complex model with raw features
2. **Monitor in production** - Data drift, prediction drift, performance degradation (models decay over time)
3. **Automate retraining** - Detect drift → trigger retraining pipeline (MLOps)
4. **Version everything** - Data, code, models, features (reproducibility)
5. **Start simple** - Logistic regression, random forest baseline (beat before trying deep learning)

---

## References

- "Machine Learning Engineering" - Andriy Burkov
- "Designing Machine Learning Systems" - Chip Huyen
- MLflow Docs: https://mlflow.org

**Related**: `mlops-best-practices.md`, `feature-engineering-advanced.md`, `model-monitoring-production.md`
