# Data Science Workflow 2025: From EDA to Production

**Updated**: 2025-11-23 | **Stack**: Python, Pandas, Scikit-learn, XGBoost

---

## The Real DS Workflow (Not What Bootcamps Teach)

```
❌ MYTH: 80% ML algorithms, 20% data prep
✅ REALITY: 80% data cleaning, 10% EDA, 10% modeling

ACTUAL TIME BREAKDOWN:
- Data collection & cleaning: 50%
- Exploratory analysis: 20%
- Feature engineering: 15%
- Model training: 5%
- Model tuning: 5%
- Deployment & monitoring: 5%
```

---

## Exploratory Data Analysis (EDA)

### First 10 Minutes with New Data

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Load data
df = pd.read_csv('customer_data.csv')

# 1. Basic info
print(df.shape)  # (10000, 25)
print(df.info())  # dtypes, nulls
print(df.describe())  # summary stats

# 2. Missing values
missing = df.isnull().sum()
print(missing[missing > 0].sort_values(ascending=False))

# Output:
# income        1250  (12.5%)
# age            450  (4.5%)
# purchase_date  120  (1.2%)

# 3. Duplicates
print(f"Duplicates: {df.duplicated().sum()}")

# 4. Target distribution
df['churned'].value_counts(normalize=True)
# False    0.75  ← Imbalanced!
# True     0.25

# 5. Correlations
corr = df.select_dtypes(include=[np.number]).corr()
sns.heatmap(corr, annot=True, fmt='.2f')
plt.show()
```

### Advanced EDA Patterns

```python
# Detect outliers (IQR method)
def find_outliers(df, column):
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
    outliers = df[(df[column] < lower_bound) | (df[column] > upper_bound)]
    return outliers

outliers = find_outliers(df, 'income')
print(f"Found {len(outliers)} outliers in income")

# Distribution comparisons by target
fig, axes = plt.subplots(2, 3, figsize=(15, 10))
numeric_cols = ['age', 'income', 'tenure', 'monthly_spend', 'support_tickets']

for ax, col in zip(axes.flatten(), numeric_cols):
    df.boxplot(column=col, by='churned', ax=ax)
    ax.set_title(f'{col} by Churn Status')
    
plt.tight_layout()
plt.show()

# Key insight: Churned customers have >2x support tickets!
```

---

## Data Cleaning & Preprocessing

### Handling Missing Values (The Right Way)

```python
from sklearn.impute import SimpleImputer, KNNImputer

# ❌ BAD: Drop all rows with ANY missing value
df_clean = df.dropna()  # Lost 60% of data!

# ✅ GOOD: Strategic imputation
# 1. Analyze missingness pattern
import missingno as msno
msno.matrix(df)
msno.heatmap(df)

# 2. Different strategies for different columns
# Categorical: mode
df['gender'].fillna(df['gender'].mode()[0], inplace=True)

# Numeric (normally distributed): mean
df['age'].fillna(df['age'].mean(), inplace=True)

# Numeric (skewed): median
df['income'].fillna(df['income'].median(), inplace=True)

# Advanced: KNN imputation (uses similar rows)
imputer = KNNImputer(n_neighbors=5)
df[['age', 'income', 'tenure']] = imputer.fit_transform(
    df[['age', 'income', 'tenure']]
)

# 3. Create missing indicator feature (sometimes missingness is informative!)
df['income_was_missing'] = df['income'].isnull().astype(int)
```

### Feature Engineering That Actually Works

```python
# 1. Domain knowledge features
df['customer_lifetime_months'] = (
    pd.to_datetime('today') - pd.to_datetime(df['signup_date'])
).dt.days / 30

df['avg_monthly_spend'] = df['total_spend'] / df['customer_lifetime_months']

df['support_tickets_per_month'] = df['support_tickets'] / df['customer_lifetime_months']

# 2. Interaction features
df['high_spend_low_satisfaction'] = (
    (df['monthly_spend'] > df['monthly_spend'].quantile(0.75)) &
    (df['satisfaction_score'] < 3)
).astype(int)

# 3. Polynomial features (use sparingly!)
from sklearn.preprocessing import PolynomialFeatures

poly = PolynomialFeatures(degree=2, include_bias=False)
poly_features = poly.fit_transform(df[['age', 'income']])
# Creates: age, income, age², age×income, income²

# 4. Binning continuous variables
df['age_group'] = pd.cut(
    df['age'],
    bins=[0, 25, 35, 50, 65, 100],
    labels=['18-25', '26-35', '36-50', '51-65', '65+']
)

df['income_bracket'] = pd.qcut(
    df['income'],
    q=5,
    labels=['Very Low', 'Low', 'Medium', 'High', 'Very High']
)

# 5. Time-based features
df['signup_month'] = pd.to_datetime(df['signup_date']).dt.month
df['signup_day_of_week'] = pd.to_datetime(df['signup_date']).dt.dayofweek
df['is_weekend_signup'] = df['signup_day_of_week'].isin([5, 6]).astype(int)
```

---

## Model Selection & Training

### The Scikit-learn Workflow

```python
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix

# 1. Prepare data
X = df.drop(['churned', 'customer_id', 'signup_date'], axis=1)
y = df['churned']

# 2. Handle categorical variables
X = pd.get_dummies(X, drop_first=True)

# 3. Train/test split (stratified for imbalanced data)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 4. Scale features (important for logistic regression, SVM, neural nets)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 5. Try multiple models
models = {
    'Logistic Regression': LogisticRegression(max_iter=1000, class_weight='balanced'),
    'Random Forest': RandomForestClassifier(n_estimators=100, class_weight='balanced'),
    'XGBoost': xgb.XGBClassifier(scale_pos_weight=3)  # Handles imbalance
}

results = {}
for name, model in models.items():
    # Cross-validation
    cv_scores = cross_val_score(
        model, X_train_scaled, y_train,
        cv=5, scoring='roc_auc'
    )
    
    # Train on full training set
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_scaled)
    y_proba = model.predict_proba(X_test_scaled)[:, 1]
    
    results[name] = {
        'CV AUC': cv_scores.mean(),
        'Test AUC': roc_auc_score(y_test, y_proba),
        'Model': model
    }
    
    print(f"\n{name}")
    print(f"CV AUC: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")
    print(f"Test AUC: {roc_auc_score(y_test, y_proba):.3f}")
    print(classification_report(y_test, y_pred))

# Output:
# Logistic Regression
# CV AUC: 0.782 ± 0.012
# Test AUC: 0.791

# Random Forest
# CV AUC: 0.856 ± 0.009  ← Best!
# Test AUC: 0.863

# XGBoost
# CV AUC: 0.849 ± 0.011
# Test AUC: 0.857
```

### Hyperparameter Tuning Done Right

```python
from sklearn.model_selection import RandomizedSearchCV

# Define parameter grid
param_grid = {
    'n_estimators': [100, 200, 300, 500],
    'max_depth': [10, 20, 30, None],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
    'max_features': ['sqrt', 'log2', None]
}

# Randomized search (faster than GridSearchCV)
rf = RandomForestClassifier(class_weight='balanced', random_state=42)

random_search = RandomizedSearchCV(
    rf,
    param_distributions=param_grid,
    n_iter=50,  # Try 50 random combinations
    cv=5,
    scoring='roc_auc',
    n_jobs=-1,  # Use all CPU cores
    random_state=42,
    verbose=2
)

random_search.fit(X_train_scaled, y_train)

print("Best parameters:", random_search.best_params_)
print("Best CV AUC:", random_search.best_score_)

# Best model
best_model = random_search.best_estimator_

# Feature importance
feature_importance = pd.DataFrame({
    'feature': X_train.columns,
    'importance': best_model.feature_importances_
}).sort_values('importance', ascending=False)

print(feature_importance.head(10))

# Output:
#                    feature  importance
# support_tickets_per_month      0.234  ← Top predictor!
#             monthly_spend      0.156
#      satisfaction_score         0.142
#                   tenure      0.098
```

---

## Handling Imbalanced Data

### Real-World Imbalance Problem

```python
# Problem: 97% non-fraud, 3% fraud
print(y_train.value_counts(normalize=True))
# 0    0.97
# 1    0.03  ← Severe imbalance!

# ❌ BAD: Ignore imbalance
model.fit(X_train, y_train)
# Result: 97% accuracy by predicting all 0s!

# ✅ GOOD: Multiple strategies

# 1. Class weights (built into most sklearn models)
from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier(class_weight='balanced')

# 2. SMOTE (Synthetic Minority Over-sampling)
from imblearn.over_sampling import SMOTE

smote = SMOTE(random_state=42)
X_train_balanced, y_train_balanced = smote.fit_resample(X_train, y_train)

print(y_train_balanced.value_counts())
# 0    9700
# 1    9700  ← Balanced!

# 3. Undersampling majority class
from imblearn.under_sampling import RandomUnderSampler

rus = RandomUnderSampler(random_state=42)
X_train_under, y_train_under = rus.fit_resample(X_train, y_train)

# 4. Combination (SMOTE + Undersampling)
from imblearn.combine import SMOTEENN

smoteenn = SMOTEENN(random_state=42)
X_train_combined, y_train_combined = smoteenn.fit_resample(X_train, y_train)

# 5. Threshold adjustment (works well for probability-based models)
y_proba = model.predict_proba(X_test)[:, 1]

# Default threshold: 0.5
y_pred_default = (y_proba >= 0.5).astype(int)

# Optimized threshold (maximize F1 score)
from sklearn.metrics import f1_score

best_threshold = 0.5
best_f1 = 0

for threshold in np.arange(0.1, 0.9, 0.05):
    y_pred = (y_proba >= threshold).astype(int)
    f1 = f1_score(y_test, y_pred)
    if f1 > best_f1:
        best_f1 = f1
        best_threshold = threshold

print(f"Best threshold: {best_threshold}")  # e.g., 0.35
print(f"Best F1 score: {best_f1}")
```

---

## Model Evaluation (Beyond Accuracy)

### Confusion Matrix Interpretation

```python
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

y_pred = model.predict(X_test)
cm = confusion_matrix(y_test, y_pred)

print(cm)
#           Predicted
#           0      1
# Actual 0  950    50   ← 50 False Positives
#        1   80   220   ← 80 False Negatives (BAD!)

# Metrics:
# Accuracy: (950+220)/1300 = 0.90  (misleading with imbalance!)
# Precision: 220/(220+50) = 0.81   (of predicted positives, 81% correct)
# Recall: 220/(220+80) = 0.73      (caught 73% of actual positives)
# F1-Score: 2*(0.81*0.73)/(0.81+0.73) = 0.77

# Cost-sensitive evaluation
cost_fp = 10  # False positive costs $10
cost_fn = 100  # False negative costs $100 (fraud missed!)

total_cost = (50 * cost_fp) + (80 * cost_fn)
print(f"Total cost: ${total_cost}")  # $8,500

# With optimized threshold:
# FP: 120, FN: 20
# Cost: (120*10) + (20*100) = $3,200  ← Much better!
```

### ROC Curve & AUC

```python
from sklearn.metrics import roc_curve, auc

y_proba = model.predict_proba(X_test)[:, 1]

fpr, tpr, thresholds = roc_curve(y_test, y_proba)
roc_auc = auc(fpr, tpr)

plt.figure(figsize=(8, 6))
plt.plot(fpr, tpr, label=f'ROC curve (AUC = {roc_auc:.2f})')
plt.plot([0, 1], [0, 1], 'k--', label='Random')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curve')
plt.legend()
plt.show()

# AUC interpretation:
# 0.5: Random guessing
# 0.7-0.8: Fair
# 0.8-0.9: Good
# 0.9-1.0: Excellent
# 1.0: Perfect (suspicious - check for data leakage!)
```

---

## Common Pitfalls & How to Avoid

### Data Leakage (Silent Killer)

```python
# ❌ LEAKAGE EXAMPLE 1: Using future data
# Problem: 'churned' column includes info from after prediction date
df['total_purchases_last_30_days']  # Uses data from FUTURE!

# ✅ FIX: Only use data available at prediction time
df['total_purchases_before_date'] = df.apply(
    lambda row: df[
        (df['customer_id'] == row['customer_id']) &
        (df['purchase_date'] < row['prediction_date'])
    ]['purchase_amount'].sum(),
    axis=1
)

# ❌ LEAKAGE EXAMPLE 2: Scaling before split
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)  # LEAKAGE! Test data influenced scaling
X_train, X_test = train_test_split(X_scaled)

# ✅ FIX: Fit on train, transform on test
X_train, X_test, y_train, y_test = train_test_split(X, y)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)  # Only transform, don't fit!

# ❌ LEAKAGE EXAMPLE 3: Target encoding without cross-validation
df['category_mean_target'] = df.groupby('category')['target'].transform('mean')

# ✅ FIX: Use TargetEncoder with CV
from category_encoders import TargetEncoder

encoder = TargetEncoder()
df['category_encoded'] = encoder.fit_transform(df['category'], df['target'])
```

---

## Model Deployment

### Saving & Loading Models

```python
import joblib

# Save model + preprocessing pipeline
model_artifacts = {
    'model': best_model,
    'scaler': scaler,
    'feature_names': X_train.columns.tolist(),
    'threshold': best_threshold
}

joblib.dump(model_artifacts, 'churn_model_v1.pkl')

# Load in production
artifacts = joblib.load('churn_model_v1.pkl')

def predict_churn(customer_data):
    # Ensure same feature order
    X = customer_data[artifacts['feature_names']]
    
    # Scale
    X_scaled = artifacts['scaler'].transform(X)
    
    # Predict probability
    proba = artifacts['model'].predict_proba(X_scaled)[:, 1]
    
    # Apply optimized threshold
    prediction = (proba >= artifacts['threshold']).astype(int)
    
    return {
        'will_churn': bool(prediction[0]),
        'churn_probability': float(proba[0]),
        'risk_level': 'high' if proba[0] > 0.7 else 'medium' if proba[0] > 0.4 else 'low'
    }
```

---

## Key Takeaways

1. **80% of work is data cleaning** - Get comfortable with messy data
2. **Feature engineering > fancy algorithms** - Domain knowledge wins
3. **Always check for leakage** - Most common reason models fail in production
4. **Imbalanced data requires special handling** - Accuracy is misleading
5. **ROC AUC > Accuracy** - Better metric for most business problems
6. **Cross-validation is mandatory** - Single train/test split is not enough
7. **Interpretability matters** - Stakeholders need to trust your model

---

## References

- "Hands-On Machine Learning" - Aurélien Géron
- "Feature Engineering for Machine Learning" - Alice Zheng
- Scikit-learn Documentation
- Kaggle Competitions (best learning resource)

**Related**: `deep-learning.md`, `feature-engineering.md`, `ml-deployment.md`
