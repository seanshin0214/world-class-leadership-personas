# Data Science & Analytics 2025

**Updated**: 2025-11-24 | **Focus**: Statistical Analysis, Machine Learning, Data Visualization

---

## Data Analysis Workflow

```python
# 1. IMPORT & EXPLORE

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Load data
df = pd.read_csv('data.csv')

# Quick overview
df.head()          # First 5 rows
df.info()          # Data types, non-null counts
df.describe()      # Summary statistics (mean, std, min, max)
df.shape           # (rows, columns)

# Check for missing values
df.isnull().sum()

# Check data types
df.dtypes

---

# 2. DATA CLEANING

# Handle missing values
df['age'].fillna(df['age'].median(), inplace=True)  # Numerical: median/mean
df['category'].fillna('Unknown', inplace=True)      # Categorical: mode or placeholder

# Drop rows with missing values (if few)
df.dropna(inplace=True)

# Remove duplicates
df.drop_duplicates(inplace=True)

# Fix data types
df['date'] = pd.to_datetime(df['date'])
df['price'] = df['price'].astype(float)

# Handle outliers (IQR method)
Q1 = df['price'].quantile(0.25)
Q3 = df['price'].quantile(0.75)
IQR = Q3 - Q1

lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

df = df[(df['price'] >= lower_bound) & (df['price'] <= upper_bound)]

# Or cap outliers
df['price'] = df['price'].clip(lower=lower_bound, upper=upper_bound)

---

# 3. FEATURE ENGINEERING

# Create new features
df['age_group'] = pd.cut(df['age'], bins=[0, 18, 35, 50, 100], 
                         labels=['Child', 'Young Adult', 'Adult', 'Senior'])

df['is_weekend'] = df['date'].dt.dayofweek.isin([5, 6]).astype(int)

df['price_per_unit'] = df['total_price'] / df['quantity']

# Extract from datetime
df['year'] = df['date'].dt.year
df['month'] = df['date'].dt.month
df['day_of_week'] = df['date'].dt.dayofweek

# Encode categorical variables
# One-hot encoding (creates dummy variables)
df_encoded = pd.get_dummies(df, columns=['category'], drop_first=True)

# Label encoding (ordinal)
from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()
df['category_encoded'] = le.fit_transform(df['category'])

---

# 4. EXPLORATORY DATA ANALYSIS (EDA)

# Univariate analysis
df['age'].hist(bins=30)
plt.xlabel('Age')
plt.ylabel('Frequency')
plt.title('Age Distribution')
plt.show()

# Box plot (identify outliers)
df.boxplot(column='price')
plt.show()

# Bivariate analysis
df.plot(x='age', y='income', kind='scatter')
plt.show()

# Correlation heatmap
correlation_matrix = df.corr()
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm')
plt.show()

# Group by & aggregate
df.groupby('category')['price'].agg(['mean', 'median', 'count'])

---

# 5. STATISTICAL TESTING

from scipy import stats

# T-test (compare means of two groups)
group1 = df[df['group'] == 'A']['score']
group2 = df[df['group'] == 'B']['score']

t_stat, p_value = stats.ttest_ind(group1, group2)

print(f"T-statistic: {t_stat:.4f}")
print(f"P-value: {p_value:.4f}")

if p_value < 0.05:
    print("Significant difference between groups")
else:
    print("No significant difference")

# Chi-square test (categorical variables)
contingency_table = pd.crosstab(df['category'], df['outcome'])
chi2, p_value, dof, expected = stats.chi2_contingency(contingency_table)

print(f"Chi-square: {chi2:.4f}")
print(f"P-value: {p_value:.4f}")

# ANOVA (compare means of 3+ groups)
groups = [df[df['category'] == cat]['value'] for cat in df['category'].unique()]
f_stat, p_value = stats.f_oneway(*groups)
```

---

## Machine Learning

```python
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.metrics import mean_squared_error, r2_score

# TRAIN-TEST SPLIT

X = df[['feature1', 'feature2', 'feature3']]
y = df['target']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
# 80% train, 20% test

---

# FEATURE SCALING (Important for many algorithms)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Note: fit on train, transform on test (avoid data leakage)

---

# REGRESSION (Predict continuous values)

# Linear Regression
model = LinearRegression()
model.fit(X_train_scaled, y_train)

y_pred = model.predict(X_test_scaled)

# Evaluate
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print(f"RMSE: {rmse:.2f}")
print(f"R² Score: {r2:.4f}")  # 0-1, higher is better

# Coefficients (feature importance)
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'coefficient': model.coef_
}).sort_values('coefficient', ascending=False)

---

# CLASSIFICATION (Predict categories)

# Logistic Regression (binary classification)
model = LogisticRegression(max_iter=1000)
model.fit(X_train_scaled, y_train)

y_pred = model.predict(X_test_scaled)

# Evaluate
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

print(f"Accuracy: {accuracy:.4f}")
print(f"Precision: {precision:.4f}")  # True Positives / (TP + FP)
print(f"Recall: {recall:.4f}")        # True Positives / (TP + FN)
print(f"F1 Score: {f1:.4f}")          # Harmonic mean of precision & recall

# Confusion Matrix
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

cm = confusion_matrix(y_test, y_pred)
disp = ConfusionMatrixDisplay(cm, display_labels=['Class 0', 'Class 1'])
disp.plot()
plt.show()

#             Predicted
#             0     1
# Actual  0   TN    FP
#         1   FN    TP

---

# Random Forest (more powerful, handles non-linearity)

model = RandomForestClassifier(
    n_estimators=100,      # Number of trees
    max_depth=10,          # Max depth of each tree
    random_state=42
)
model.fit(X_train, y_train)  # No scaling needed for tree-based models

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.4f}")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print(feature_importance)

---

# CROSS-VALIDATION (More robust evaluation)

from sklearn.model_selection import cross_val_score

model = RandomForestClassifier(n_estimators=100, random_state=42)

scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
# cv=5: 5-fold cross-validation (split data 5 ways, train on 4, test on 1)

print(f"Cross-validation scores: {scores}")
print(f"Mean accuracy: {scores.mean():.4f} (+/- {scores.std() * 2:.4f})")

---

# HYPERPARAMETER TUNING

from sklearn.model_selection import GridSearchCV

param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [5, 10, 15, None],
    'min_samples_split': [2, 5, 10]
}

model = RandomForestClassifier(random_state=42)

grid_search = GridSearchCV(
    model, param_grid, cv=5, scoring='accuracy', n_jobs=-1
)
grid_search.fit(X_train, y_train)

print("Best parameters:", grid_search.best_params_)
print("Best score:", grid_search.best_score_)

# Use best model
best_model = grid_search.best_estimator_
```

---

## Data Visualization

```python
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px

# MATPLOTLIB (Basic, customizable)

# Line plot
plt.figure(figsize=(10, 6))
plt.plot(df['date'], df['value'], marker='o')
plt.xlabel('Date')
plt.ylabel('Value')
plt.title('Value Over Time')
plt.grid(True)
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# Bar chart
df.groupby('category')['sales'].sum().plot(kind='bar')
plt.xlabel('Category')
plt.ylabel('Total Sales')
plt.title('Sales by Category')
plt.show()

# Scatter plot with regression line
plt.scatter(df['age'], df['income'], alpha=0.5)

# Add trend line
z = np.polyfit(df['age'], df['income'], 1)
p = np.poly1d(z)
plt.plot(df['age'], p(df['age']), "r--", linewidth=2)

plt.xlabel('Age')
plt.ylabel('Income')
plt.title('Age vs Income')
plt.show()

---

# SEABORN (Statistical visualizations)

# Distribution plot
sns.histplot(df['age'], bins=30, kde=True)
plt.title('Age Distribution')
plt.show()

# Box plot (by category)
sns.boxplot(x='category', y='price', data=df)
plt.title('Price Distribution by Category')
plt.show()

# Violin plot (combines box plot + distribution)
sns.violinplot(x='category', y='price', data=df)
plt.show()

# Pair plot (scatter matrix, see all relationships)
sns.pairplot(df[['age', 'income', 'score', 'category']], hue='category')
plt.show()

# Heatmap (correlation matrix)
correlation = df.corr()
sns.heatmap(correlation, annot=True, cmap='coolwarm', center=0)
plt.title('Correlation Matrix')
plt.show()

---

# PLOTLY (Interactive)

# Line chart
fig = px.line(df, x='date', y='value', title='Interactive Line Chart')
fig.show()  # Opens in browser, hover for values, zoom, pan

# Scatter plot with color
fig = px.scatter(df, x='age', y='income', color='category', size='score',
                 hover_data=['name'], title='Age vs Income by Category')
fig.show()

# Bar chart
fig = px.bar(df, x='category', y='sales', color='region',
             title='Sales by Category and Region')
fig.show()

# Choropleth map (geographic data)
fig = px.choropleth(df, locations='country_code', color='value',
                    hover_name='country', title='Values by Country')
fig.show()

---

# DASHBOARD (Streamlit example)

# streamlit_app.py
import streamlit as st

st.title('Sales Dashboard')

# File uploader
uploaded_file = st.file_uploader("Upload CSV", type="csv")

if uploaded_file:
    df = pd.read_csv(uploaded_file)
    
    # Display data
    st.subheader('Data Preview')
    st.dataframe(df.head())
    
    # Summary statistics
    st.subheader('Summary Statistics')
    st.write(df.describe())
    
    # Interactive filter
    category = st.selectbox('Select Category', df['category'].unique())
    filtered_df = df[df['category'] == category]
    
    # Plot
    st.subheader(f'Sales for {category}')
    st.line_chart(filtered_df.set_index('date')['sales'])
    
    # Metrics
    col1, col2, col3 = st.columns(3)
    col1.metric("Total Sales", f"${filtered_df['sales'].sum():,.0f}")
    col2.metric("Avg Sales", f"${filtered_df['sales'].mean():,.0f}")
    col3.metric("Count", f"{len(filtered_df)}")

# Run: streamlit run streamlit_app.py
```

---

## SQL for Data Analysis

```sql
-- BASIC QUERIES

-- Select with conditions
SELECT 
    customer_id,
    name,
    email,
    total_purchases
FROM customers
WHERE total_purchases > 1000
  AND status = 'active'
ORDER BY total_purchases DESC
LIMIT 10;

-- Aggregate functions
SELECT 
    category,
    COUNT(*) as product_count,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price,
    SUM(quantity) as total_quantity
FROM products
GROUP BY category
HAVING COUNT(*) > 10  -- Filter groups
ORDER BY total_quantity DESC;

---

-- JOINS

-- Inner join (only matching rows)
SELECT 
    o.order_id,
    o.order_date,
    c.customer_name,
    p.product_name,
    p.price
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
INNER JOIN products p ON o.product_id = p.product_id
WHERE o.order_date >= '2025-01-01';

-- Left join (all from left table)
SELECT 
    c.customer_name,
    COUNT(o.order_id) as order_count,
    COALESCE(SUM(o.total), 0) as total_spent
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_name;

---

-- WINDOW FUNCTIONS

-- Running total
SELECT 
    order_date,
    daily_sales,
    SUM(daily_sales) OVER (ORDER BY order_date) as running_total
FROM daily_sales;

-- Rank (handle ties)
SELECT 
    product_name,
    sales,
    RANK() OVER (ORDER BY sales DESC) as rank,
    DENSE_RANK() OVER (ORDER BY sales DESC) as dense_rank,
    ROW_NUMBER() OVER (ORDER BY sales DESC) as row_num
FROM products;

-- Rank within groups
SELECT 
    category,
    product_name,
    sales,
    RANK() OVER (PARTITION BY category ORDER BY sales DESC) as rank_in_category
FROM products;

---

-- COMMON TABLE EXPRESSIONS (CTE)

WITH monthly_sales AS (
    SELECT 
        DATE_TRUNC('month', order_date) as month,
        SUM(total) as total_sales
    FROM orders
    GROUP BY DATE_TRUNC('month', order_date)
),
growth AS (
    SELECT 
        month,
        total_sales,
        LAG(total_sales) OVER (ORDER BY month) as prev_month_sales,
        (total_sales - LAG(total_sales) OVER (ORDER BY month)) / 
            LAG(total_sales) OVER (ORDER BY month) * 100 as growth_pct
    FROM monthly_sales
)
SELECT * FROM growth ORDER BY month;

---

-- SUBQUERIES

-- Customers with above-average purchases
SELECT customer_name, total_purchases
FROM customers
WHERE total_purchases > (
    SELECT AVG(total_purchases) FROM customers
);

-- Top 3 products per category
SELECT * FROM (
    SELECT 
        category,
        product_name,
        sales,
        ROW_NUMBER() OVER (PARTITION BY category ORDER BY sales DESC) as rn
    FROM products
) ranked
WHERE rn <= 3;
```

---

## A/B Testing

```python
# HYPOTHESIS TESTING

from scipy import stats

# Scenario: Test if new website design (B) increases conversion rate vs control (A)

# Data
conversions_A = 250  # Conversions in group A
visitors_A = 10000   # Total visitors in group A

conversions_B = 280  # Conversions in group B
visitors_B = 10000   # Total visitors in group B

# Conversion rates
rate_A = conversions_A / visitors_A  # 0.025 (2.5%)
rate_B = conversions_B / visitors_B  # 0.028 (2.8%)

print(f"Conversion Rate A: {rate_A:.4f} ({rate_A*100:.2f}%)")
print(f"Conversion Rate B: {rate_B:.4f} ({rate_B*100:.2f}%)")

# Z-test for proportions
from statsmodels.stats.proportion import proportions_ztest

counts = np.array([conversions_B, conversions_A])
nobs = np.array([visitors_B, visitors_A])

z_stat, p_value = proportions_ztest(counts, nobs)

print(f"Z-statistic: {z_stat:.4f}")
print(f"P-value: {p_value:.4f}")

alpha = 0.05  # Significance level (5%)

if p_value < alpha:
    print(f"✅ Significant! Version B is better (p = {p_value:.4f})")
else:
    print(f"❌ Not significant. No clear winner (p = {p_value:.4f})")

---

# SAMPLE SIZE CALCULATION

from statsmodels.stats.power import zt_ind_solve_power

# How many samples needed to detect 10% lift?
baseline_rate = 0.025
mde = 0.10  # Minimum Detectable Effect (10% relative lift)
target_rate = baseline_rate * (1 + mde)  # 0.0275

effect_size = (target_rate - baseline_rate) / np.sqrt(baseline_rate * (1 - baseline_rate))

n = zt_ind_solve_power(
    effect_size=effect_size,
    alpha=0.05,
    power=0.8,  # 80% chance of detecting effect if it exists
    ratio=1     # Equal sample sizes for A and B
)

print(f"Sample size needed per group: {int(n):,}")

---

# METRICS

# Primary metric: Conversion rate
# Secondary metrics:
# - Average order value (AOV)
# - Revenue per visitor (RPV)
# - Time on site
# - Bounce rate

# Guardrail metrics (shouldn't decrease):
# - Load time
# - Error rate
# - User complaints

# Statistical significance: p < 0.05
# Practical significance: Lift >= 5% (business requirement)

# Run duration: 1-4 weeks (account for weekly patterns, holidays)
```

---

## Key Takeaways

1. **Clean data first** - 80% of data science is data cleaning (boring but critical)
2. **Visualize early** - Plot before modeling (understand patterns, outliers)
3. **Start simple** - Linear regression before deep learning (interpret, debug)
4. **Cross-validate** - Single train/test split misleading (use k-fold CV)
5. **Business context** - 90% accuracy meaningless without business impact

---

## References

- "Python for Data Analysis" - Wes McKinney
- "The Data Science Handbook" - Field Cady
- Kaggle (practice datasets, competitions)

**Related**: `machine-learning.md`, `statistical-modeling.md`, `data-visualization.md`
