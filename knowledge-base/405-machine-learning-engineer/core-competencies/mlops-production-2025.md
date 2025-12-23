# MLOps & Production ML 2025

**Updated**: 2025-11-23 | **Stack**: MLflow, Kubeflow, Weights & Biases

---

## ML Lifecycle

```
1. DATA COLLECTION
   ↓
2. DATA PREPARATION
   ↓
3. MODEL TRAINING
   ↓
4. MODEL EVALUATION
   ↓
5. MODEL DEPLOYMENT
   ↓
6. MONITORING & RETRAINING
   ↓ (Loop back to 1)
```

---

## Experiment Tracking (MLflow)

```python
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier

# Start experiment
mlflow.set_experiment("customer_churn")

with mlflow.start_run():
    # Log parameters
    params = {"n_estimators": 100, "max_depth": 10}
    mlflow.log_params(params)
    
    # Train model
    model = RandomForestClassifier(**params)
    model.fit(X_train, y_train)
    
    # Log metrics
    accuracy = model.score(X_test, y_test)
    mlflow.log_metric("accuracy", accuracy)
    
    # Log model
    mlflow.sklearn.log_model(model, "model")
    
    # Log artifacts
    mlflow.log_artifact("feature_importance.png")
```

---

## Model Versioning

```python
from mlflow.tracking import MlflowClient

client = MlflowClient()

# Register model
model_uri = "runs:/abc123/model"
model_details = mlflow.register_model(model_uri, "churn_predictor")

# Transition to production
client.transition_model_version_stage(
    name="churn_predictor",
    version=3,
    stage="Production"
)

# Load production model
model = mlflow.pyfunc.load_model("models:/churn_predictor/Production")
```

---

## Feature Engineering Pipeline

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer

# Define transformers
numeric_features = ['age', 'income', 'tenure']
categorical_features = ['gender', 'plan_type']

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric_features),
        ('cat', OneHotEncoder(), categorical_features)
    ])

# Full pipeline
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier())
])

# Train
pipeline.fit(X_train, y_train)

# Save
joblib.dump(pipeline, 'model_pipeline.pkl')
```

---

## Model Deployment

### REST API (FastAPI)

```python
from fastapi import FastAPI
import mlflow.pyfunc

app = FastAPI()

# Load model on startup
model = mlflow.pyfunc.load_model("models:/churn_predictor/Production")

@app.post("/predict")
async def predict(features: dict):
    # Convert to DataFrame
    import pandas as pd
    df = pd.DataFrame([features])
    
    # Predict
    prediction = model.predict(df)
    probability = model.predict_proba(df)
    
    return {
        "prediction": int(prediction[0]),
        "probability": float(probability[0][1])
    }

# Run: uvicorn main:app --reload
```

### Batch Prediction

```python
import pandas as pd

# Load large dataset
df = pd.read_parquet("s3://data/customers.parquet")

# Batch predict (efficient)
predictions = model.predict(df)
probabilities = model.predict_proba(df)

# Save results
results = pd.DataFrame({
    'customer_id': df['id'],
    'churn_prediction': predictions,
    'churn_probability': probabilities[:, 1]
})
results.to_parquet("s3://predictions/churn_2025_01.parquet")
```

---

## Model Monitoring

### Drift Detection

```python
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset

# Create drift report
report = Report(metrics=[DataDriftPreset()])

report.run(
    reference_data=train_data,  # Training data
    current_data=production_data  # Last week's production data
)

report.save_html("drift_report.html")

# Check if drift detected
if report.as_dict()['metrics'][0]['result']['dataset_drift']:
    print("⚠️ Data drift detected! Consider retraining.")
```

### Performance Monitoring

```python
import prometheus_client as prom

# Define metrics
prediction_counter = prom.Counter('predictions_total', 'Total predictions made')
prediction_latency = prom.Histogram('prediction_latency_seconds', 'Prediction latency')
prediction_accuracy = prom.Gauge('prediction_accuracy', 'Model accuracy')

@prediction_latency.time()
def predict(features):
    prediction_counter.inc()
    result = model.predict(features)
    return result

# Update accuracy daily
def update_accuracy():
    # Compare predictions to actuals
    accuracy = calculate_accuracy(predictions, actuals)
    prediction_accuracy.set(accuracy)
```

---

## A/B Testing Models

```python
import random

def get_model_version(user_id):
    # 90% get production model, 10% get challenger
    if hash(user_id) % 10 == 0:
        return "challenger_v2"
    else:
        return "production_v1"

def predict(user_id, features):
    model_version = get_model_version(user_id)
    model = load_model(model_version)
    
    prediction = model.predict(features)
    
    # Log for analysis
    log_prediction(user_id, model_version, prediction, features)
    
    return prediction
```

---

## CI/CD for ML

```yaml
# .github/workflows/ml-pipeline.yml
name: ML Pipeline

on:
  push:
    branches: [main]

jobs:
  train:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: pip install -r requirements.txt
      
      - name: Run training
        run: python train.py
      
      - name: Evaluate model
        run: python evaluate.py
      
      - name: Check accuracy threshold
        run: |
          accuracy=$(cat metrics.json | jq '.accuracy')
          if (( $(echo "$accuracy < 0.85" | bc -l) )); then
            echo "Accuracy too low: $accuracy"
            exit 1
          fi
      
      - name: Deploy to staging
        if: success()
        run: python deploy.py --env staging
```

---

## Feature Store

```python
from feast import FeatureStore

store = FeatureStore(repo_path=".")

# Define feature view
@feature_view(
    entities=[customer],
    ttl=timedelta(days=1),
    tags={"team": "ml"},
    online=True,
    offline=True,
    schema=[
        Field(name="total_purchases", dtype=Int64),
        Field(name="avg_purchase_value", dtype=Float32),
        Field(name="days_since_last_purchase", dtype=Int64),
    ],
)
def customer_features(customer_id: Entity):
    return get_customer_data(customer_id)

# Fetch features for training
entity_df = pd.DataFrame({
    "customer_id": [1, 2, 3],
    "event_timestamp": [datetime.now()] * 3
})

training_df = store.get_historical_features(
    entity_df=entity_df,
    features=["customer_features:*"]
).to_df()

# Fetch features for online prediction
online_features = store.get_online_features(
    features=["customer_features:*"],
    entity_rows=[{"customer_id": 1}]
).to_dict()
```

---

## Model Optimization

### Quantization

```python
import tensorflow as tf

# Convert to TFLite with quantization
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]

tflite_model = converter.convert()

# Save quantized model (4x smaller, minimal accuracy loss)
with open('model_quantized.tflite', 'wb') as f:
    f.write(tflite_model)
```

### ONNX for Cross-Platform

```python
import torch
import torch.onnx

# Export PyTorch model to ONNX
dummy_input = torch.randn(1, 3, 224, 224)
torch.onnx.export(
    model,
    dummy_input,
    "model.onnx",
    input_names=['input'],
    output_names=['output']
)

# Load in different framework (e.g., ONNX Runtime)
import onnxruntime as ort
session = ort.InferenceSession("model.onnx")
outputs = session.run(None, {"input": input_data})
```

---

## Key Takeaways

1. **Track everything**: Experiments, datasets, models, metrics
2. **Version models**: Like code, models need versioning
3. **Monitor in production**: Drift detection, performance metrics
4. **Automate retraining**: Set up triggers for model updates
5. **A/B test models**: Gradual rollout, not big bang

---

## Tools Stack

**Experiment Tracking**: MLflow, Weights & Biases, Neptune
**Model Serving**: BentoML, Seldon, KServe
**Feature Store**: Feast, Tecton
**Monitoring**: Evidently, WhyLabs
**Orchestration**: Kubeflow, Airflow, Prefect

---

## References

- "Machine Learning Engineering" - Andriy Burkov
- Google MLOps Best Practices
- MLflow Documentation

**Related**: `deep-learning.md`, `model-optimization.md`, `data-pipelines.md`
