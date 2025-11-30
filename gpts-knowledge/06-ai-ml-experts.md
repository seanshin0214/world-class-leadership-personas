# AI & Machine Learning Experts - Deep Knowledge Base

## LLM Engineer (410)

### LLM Architecture Overview

**Transformer Architecture**
```
Input: "The cat sat on the"

Tokenization → Embedding → Positional Encoding
                    ↓
┌─────────────────────────────────────┐
│         Transformer Block           │
│  ┌─────────────────────────────┐   │
│  │   Multi-Head Attention      │   │
│  └─────────────────────────────┘   │
│              ↓                      │
│  ┌─────────────────────────────┐   │
│  │   Feed-Forward Network      │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
            ↓ (× N layers)
         Output: "mat" (prediction)
```

### Prompt Engineering Techniques

**Basic Patterns**
```
1. ZERO-SHOT
"Classify the sentiment: 'Great product!' → "

2. FEW-SHOT
"Classify the sentiment:
'Great product!' → Positive
'Terrible experience' → Negative
'It was okay' → Neutral
'Best purchase ever!' → "

3. CHAIN-OF-THOUGHT
"Solve step by step:
If John has 5 apples and gives 2 to Mary, then buys 3 more,
how many does he have?

Step 1: John starts with 5 apples
Step 2: John gives 2 to Mary: 5 - 2 = 3
Step 3: John buys 3 more: 3 + 3 = 6
Answer: 6 apples"

4. ROLE-BASED
"You are an expert data scientist. Analyze this dataset and
provide insights on customer churn patterns..."
```

**Advanced Patterns**
```python
# ReAct (Reasoning + Acting)
prompt = """
Question: What is the capital of the country where the Eiffel Tower is located?

Thought 1: I need to find where the Eiffel Tower is located.
Action 1: Search[Eiffel Tower location]
Observation 1: The Eiffel Tower is in Paris, France.

Thought 2: Now I need to find the capital of France.
Action 2: Search[capital of France]
Observation 2: The capital of France is Paris.

Thought 3: I have the answer.
Answer: Paris
"""

# Self-Consistency
# Generate multiple reasoning paths, take majority vote
responses = [model.generate(prompt) for _ in range(5)]
final_answer = majority_vote(responses)
```

### RAG Implementation

**Basic RAG Pipeline**
```python
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA

# 1. Document Processing
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    separators=["\n\n", "\n", " ", ""]
)
chunks = text_splitter.split_documents(documents)

# 2. Embedding & Indexing
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

# 3. Retrieval
retriever = vectorstore.as_retriever(
    search_type="mmr",  # Maximum Marginal Relevance
    search_kwargs={"k": 5, "fetch_k": 20}
)

# 4. Generation
qa_chain = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(model="gpt-4"),
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True
)

# Query
result = qa_chain({"query": "What is the refund policy?"})
```

**Advanced RAG Techniques**
```python
# Hybrid Search (Dense + Sparse)
from langchain.retrievers import EnsembleRetriever
from langchain.retrievers import BM25Retriever

bm25_retriever = BM25Retriever.from_documents(documents)
dense_retriever = vectorstore.as_retriever()

ensemble_retriever = EnsembleRetriever(
    retrievers=[bm25_retriever, dense_retriever],
    weights=[0.3, 0.7]  # Adjust based on use case
)

# Contextual Compression
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

compressor = LLMChainExtractor.from_llm(llm)
compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=retriever
)

# Re-ranking with Cohere
from langchain.retrievers import CohereRerankRetriever

rerank_retriever = CohereRerankRetriever(
    base_retriever=retriever,
    top_n=5
)
```

### Fine-Tuning Guide

**When to Fine-Tune**
```
USE FINE-TUNING FOR:
✓ Consistent style/format
✓ Domain-specific terminology
✓ Specific output structure
✓ Reducing prompt length

DON'T FINE-TUNE FOR:
✗ Adding new knowledge (use RAG)
✗ One-off tasks
✗ When prompting works
✗ Rapidly changing information
```

**Fine-Tuning Process**
```python
# 1. Prepare Training Data (JSONL format)
{"messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Summarize this article..."},
    {"role": "assistant", "content": "Here's the summary..."}
]}

# 2. Upload to OpenAI
from openai import OpenAI
client = OpenAI()

file = client.files.create(
    file=open("training_data.jsonl", "rb"),
    purpose="fine-tune"
)

# 3. Create Fine-Tuning Job
job = client.fine_tuning.jobs.create(
    training_file=file.id,
    model="gpt-3.5-turbo",
    hyperparameters={
        "n_epochs": 3,
        "batch_size": 4,
        "learning_rate_multiplier": 0.1
    }
)

# 4. Use Fine-Tuned Model
response = client.chat.completions.create(
    model="ft:gpt-3.5-turbo:my-org::abc123",
    messages=[{"role": "user", "content": "..."}]
)
```

---

## AI Agent Developer (411)

### Agent Architecture

**ReAct Agent Pattern**
```python
from langchain.agents import create_react_agent
from langchain.tools import Tool

# Define Tools
tools = [
    Tool(
        name="Search",
        func=search_function,
        description="Search the web for information"
    ),
    Tool(
        name="Calculator",
        func=calculator,
        description="Perform mathematical calculations"
    ),
    Tool(
        name="Database",
        func=query_db,
        description="Query the database for records"
    )
]

# Create Agent
agent = create_react_agent(
    llm=ChatOpenAI(model="gpt-4"),
    tools=tools,
    prompt=react_prompt
)

# Run Agent
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
result = agent_executor.invoke({"input": "What is the population of Tokyo?"})
```

**Multi-Agent System**
```python
# Supervisor Agent Pattern
from langgraph.graph import StateGraph

def create_agent(llm, tools, system_prompt):
    """Create a specialized agent"""
    return create_react_agent(llm, tools, system_prompt)

# Define specialized agents
researcher = create_agent(llm, [search_tool], "You are a researcher...")
coder = create_agent(llm, [code_tool], "You are a coder...")
reviewer = create_agent(llm, [review_tool], "You are a reviewer...")

# Create supervisor
supervisor_chain = create_supervisor_chain(
    agents=["researcher", "coder", "reviewer"],
    llm=llm
)

# Build graph
workflow = StateGraph(AgentState)
workflow.add_node("supervisor", supervisor_chain)
workflow.add_node("researcher", researcher)
workflow.add_node("coder", coder)
workflow.add_node("reviewer", reviewer)

# Define edges
workflow.add_conditional_edges(
    "supervisor",
    route_to_agent,
    {"researcher": "researcher", "coder": "coder", "reviewer": "reviewer", "FINISH": END}
)
```

### Tool Design Best Practices

```python
# Well-Designed Tool
class SearchTool:
    """
    Tool for searching the web.

    Input: Search query as a string
    Output: List of relevant results with titles and snippets

    Use this when you need to find current information,
    verify facts, or research topics.
    """

    name = "web_search"
    description = """Search the web for current information.
    Input should be a clear search query.
    Returns top 5 relevant results."""

    def __init__(self, api_key: str):
        self.client = SearchClient(api_key)

    def run(self, query: str) -> str:
        try:
            results = self.client.search(query, num_results=5)
            return self._format_results(results)
        except Exception as e:
            return f"Search failed: {str(e)}"

    def _format_results(self, results):
        formatted = []
        for r in results:
            formatted.append(f"- {r['title']}: {r['snippet']}")
        return "\n".join(formatted)
```

---

## Data Scientist Expert (401)

### ML Pipeline

**End-to-End ML Workflow**
```python
# 1. Data Loading & Exploration
import pandas as pd
import numpy as np

df = pd.read_csv("data.csv")
print(df.info())
print(df.describe())
print(df.isnull().sum())

# 2. Data Preprocessing
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split

# Handle missing values
df['age'].fillna(df['age'].median(), inplace=True)

# Encode categoricals
le = LabelEncoder()
df['category_encoded'] = le.fit_transform(df['category'])

# Scale numericals
scaler = StandardScaler()
df[['age', 'income']] = scaler.fit_transform(df[['age', 'income']])

# Split data
X = df.drop('target', axis=1)
y = df['target']
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 3. Model Training
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix

model = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_split=5,
    random_state=42
)
model.fit(X_train, y_train)

# 4. Evaluation
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))
print(confusion_matrix(y_test, y_pred))

# 5. Hyperparameter Tuning
from sklearn.model_selection import GridSearchCV

param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [5, 10, 15, None],
    'min_samples_split': [2, 5, 10]
}

grid_search = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid,
    cv=5,
    scoring='f1_weighted',
    n_jobs=-1
)
grid_search.fit(X_train, y_train)
print(f"Best params: {grid_search.best_params_}")
```

### Model Selection Guide

```
PROBLEM TYPE → ALGORITHM SELECTION

Binary Classification:
├── Small data (<10K) → Logistic Regression, SVM
├── Medium data → Random Forest, XGBoost
├── Large data → Neural Networks, LightGBM
└── Imbalanced → SMOTE + XGBoost, Focal Loss

Multi-class Classification:
├── Few classes → Random Forest, XGBoost
├── Many classes → Neural Networks
└── Hierarchical → Hierarchical classifiers

Regression:
├── Linear relationship → Linear/Ridge/Lasso Regression
├── Non-linear → Random Forest, XGBoost, Neural Networks
├── Time series → ARIMA, Prophet, LSTM
└── High cardinality → LightGBM

Clustering:
├── Known K → K-Means, K-Medoids
├── Unknown K → DBSCAN, HDBSCAN
├── Hierarchical → Agglomerative Clustering
└── High-dimensional → PCA + K-Means

Dimensionality Reduction:
├── Linear → PCA, LDA
├── Non-linear → t-SNE, UMAP
└── Feature selection → Recursive Feature Elimination
```

### Feature Engineering Techniques

```python
# Numerical Features
df['log_income'] = np.log1p(df['income'])
df['income_squared'] = df['income'] ** 2
df['income_binned'] = pd.cut(df['income'], bins=5, labels=False)

# Categorical Features
df = pd.get_dummies(df, columns=['category'], drop_first=True)

# Date Features
df['day_of_week'] = df['date'].dt.dayofweek
df['month'] = df['date'].dt.month
df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)

# Text Features
from sklearn.feature_extraction.text import TfidfVectorizer
tfidf = TfidfVectorizer(max_features=1000)
text_features = tfidf.fit_transform(df['text'])

# Interaction Features
df['age_income'] = df['age'] * df['income']

# Aggregation Features
df['category_mean_income'] = df.groupby('category')['income'].transform('mean')
```

---

## AI Ethics & Governance (404)

### AI Ethics Framework

**Responsible AI Principles**
```
1. FAIRNESS
   - No discrimination based on protected attributes
   - Equal treatment across demographics
   - Bias testing and mitigation

2. TRANSPARENCY
   - Explainable decisions
   - Clear documentation
   - Stakeholder communication

3. PRIVACY
   - Data minimization
   - Consent and control
   - Secure handling

4. ACCOUNTABILITY
   - Clear ownership
   - Audit trails
   - Incident response

5. SAFETY
   - Robustness testing
   - Failure modes identified
   - Human oversight
```

### Bias Detection & Mitigation

```python
from fairlearn.metrics import demographic_parity_difference
from fairlearn.reductions import ExponentiatedGradient, DemographicParity

# Measure Bias
dpd = demographic_parity_difference(
    y_true=y_test,
    y_pred=y_pred,
    sensitive_features=sensitive_test
)
print(f"Demographic Parity Difference: {dpd}")

# Mitigate Bias
mitigator = ExponentiatedGradient(
    estimator=LogisticRegression(),
    constraints=DemographicParity()
)
mitigator.fit(X_train, y_train, sensitive_features=sensitive_train)
y_pred_fair = mitigator.predict(X_test)

# Re-measure
dpd_after = demographic_parity_difference(
    y_true=y_test,
    y_pred=y_pred_fair,
    sensitive_features=sensitive_test
)
print(f"DPD after mitigation: {dpd_after}")
```

### Model Explainability

```python
import shap

# SHAP Explainability
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# Global feature importance
shap.summary_plot(shap_values, X_test)

# Local explanation (single prediction)
shap.force_plot(
    explainer.expected_value,
    shap_values[0],
    X_test.iloc[0]
)

# LIME for local explanations
from lime.lime_tabular import LimeTabularExplainer

explainer = LimeTabularExplainer(
    X_train.values,
    feature_names=X_train.columns,
    class_names=['0', '1'],
    mode='classification'
)

exp = explainer.explain_instance(
    X_test.iloc[0].values,
    model.predict_proba,
    num_features=10
)
exp.show_in_notebook()
```

### AI Governance Checklist

```markdown
## Pre-Development
- [ ] Problem statement reviewed for ethical implications
- [ ] Stakeholder impact assessment completed
- [ ] Data sourcing ethics verified
- [ ] Privacy impact assessment done

## Development
- [ ] Training data bias audit performed
- [ ] Model cards documented
- [ ] Fairness metrics defined and measured
- [ ] Explainability methods implemented

## Deployment
- [ ] Human oversight mechanisms in place
- [ ] Monitoring for drift and bias
- [ ] Incident response plan ready
- [ ] User communication clear

## Ongoing
- [ ] Regular bias audits scheduled
- [ ] Performance monitoring active
- [ ] Feedback loops established
- [ ] Governance review cadence set
```
