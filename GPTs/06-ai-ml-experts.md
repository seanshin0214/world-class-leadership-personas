# AI & Machine Learning Experts - Deep Knowledge Base

## LLM Engineer (410)

### LLM Architecture Overview

**Transformer Architecture:**
```
Input: "The cat sat on the"
    ↓
[Tokenization] → [1, 345, 678, 234, 567]
    ↓
[Embedding Layer] → Dense vectors (d=4096)
    ↓
[Positional Encoding] → Position-aware embeddings
    ↓
[N Transformer Blocks]
    ├── Multi-Head Self-Attention
    ├── Layer Normalization
    ├── Feed-Forward Network
    └── Residual Connections
    ↓
[Output Layer] → Probability distribution
    ↓
Output: "mat" (highest probability)
```

### RAG (Retrieval-Augmented Generation)

**Architecture:**
```
User Query
    ↓
[Query Embedding] ← Embedding Model (text-embedding-3-large)
    ↓
[Vector Search] ← Vector DB (Pinecone/Chroma/Weaviate)
    ↓
[Context Retrieval] → Top-K relevant chunks
    ↓
[Prompt Assembly]
    │
    ├── System: "You are a helpful assistant..."
    ├── Context: [Retrieved chunks]
    └── User: [Original query]
    ↓
[LLM Generation] ← GPT-4/Claude
    ↓
Response with citations
```

### RAG Implementation

```python
# rag_pipeline.py
from openai import OpenAI
from pinecone import Pinecone
import numpy as np

class RAGPipeline:
    def __init__(self, openai_api_key: str, pinecone_api_key: str):
        self.openai = OpenAI(api_key=openai_api_key)
        self.pc = Pinecone(api_key=pinecone_api_key)
        self.index = self.pc.Index("knowledge-base")
        self.embed_model = "text-embedding-3-large"
        self.chat_model = "gpt-4-turbo-preview"

    def embed(self, text: str) -> list[float]:
        """Create embedding for text."""
        response = self.openai.embeddings.create(
            model=self.embed_model,
            input=text
        )
        return response.data[0].embedding

    def retrieve(self, query: str, top_k: int = 5) -> list[dict]:
        """Retrieve relevant documents."""
        query_embedding = self.embed(query)
        results = self.index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True
        )
        return [
            {
                "text": match.metadata["text"],
                "score": match.score,
                "source": match.metadata.get("source", "unknown")
            }
            for match in results.matches
        ]

    def generate(self, query: str, context: list[dict]) -> str:
        """Generate response using retrieved context."""
        context_text = "\n\n".join([
            f"[Source: {c['source']}]\n{c['text']}"
            for c in context
        ])

        messages = [
            {
                "role": "system",
                "content": """You are a helpful assistant. Answer based on the
                provided context. Cite sources when possible. If the context
                doesn't contain the answer, say so."""
            },
            {
                "role": "user",
                "content": f"""Context:
{context_text}

Question: {query}

Answer:"""
            }
        ]

        response = self.openai.chat.completions.create(
            model=self.chat_model,
            messages=messages,
            temperature=0.1
        )
        return response.choices[0].message.content

    def query(self, question: str) -> dict:
        """Full RAG pipeline."""
        context = self.retrieve(question)
        answer = self.generate(question, context)
        return {
            "question": question,
            "answer": answer,
            "sources": [c["source"] for c in context]
        }
```

### Prompt Engineering Best Practices

**Effective Prompt Structure:**
```
[ROLE]
You are an expert [domain] assistant with [years] experience.

[CONTEXT]
Background information relevant to the task.

[TASK]
Clear, specific instructions on what to do.

[FORMAT]
Expected output format with examples.

[CONSTRAINTS]
Limitations, guardrails, what NOT to do.

[EXAMPLES]
Input: example input
Output: example output
```

**Advanced Techniques:**
1. **Chain of Thought:** "Let's think step by step..."
2. **Few-Shot Learning:** Provide 2-3 examples
3. **Self-Consistency:** Generate multiple responses, take majority
4. **Tree of Thoughts:** Explore multiple reasoning paths

---

## Data Scientist (402)

### ML Project Lifecycle

```
1. Problem Definition
   └── Business metrics → ML metrics mapping

2. Data Collection & Exploration
   ├── Data quality assessment
   ├── Feature discovery
   └── Baseline establishment

3. Feature Engineering
   ├── Domain-specific features
   ├── Automated feature generation
   └── Feature selection

4. Model Development
   ├── Algorithm selection
   ├── Hyperparameter tuning
   └── Cross-validation

5. Evaluation
   ├── Offline metrics
   ├── A/B testing design
   └── Business impact estimation

6. Deployment
   ├── Model serving
   ├── Monitoring
   └── Retraining pipeline
```

### Feature Engineering Example

```python
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.feature_selection import mutual_info_classif

class FeatureEngineer:
    def __init__(self):
        self.scalers = {}
        self.encoders = {}

    def create_time_features(self, df: pd.DataFrame,
                             date_col: str) -> pd.DataFrame:
        """Extract time-based features."""
        df = df.copy()
        df[date_col] = pd.to_datetime(df[date_col])

        df[f'{date_col}_year'] = df[date_col].dt.year
        df[f'{date_col}_month'] = df[date_col].dt.month
        df[f'{date_col}_day'] = df[date_col].dt.day
        df[f'{date_col}_dayofweek'] = df[date_col].dt.dayofweek
        df[f'{date_col}_is_weekend'] = df[date_col].dt.dayofweek >= 5
        df[f'{date_col}_quarter'] = df[date_col].dt.quarter

        # Cyclical encoding
        df[f'{date_col}_month_sin'] = np.sin(2 * np.pi * df[date_col].dt.month / 12)
        df[f'{date_col}_month_cos'] = np.cos(2 * np.pi * df[date_col].dt.month / 12)

        return df

    def create_aggregation_features(self, df: pd.DataFrame,
                                    group_col: str,
                                    agg_col: str) -> pd.DataFrame:
        """Create aggregation features."""
        df = df.copy()

        aggs = df.groupby(group_col)[agg_col].agg(['mean', 'std', 'min', 'max', 'count'])
        aggs.columns = [f'{group_col}_{agg_col}_{stat}' for stat in aggs.columns]

        df = df.merge(aggs, left_on=group_col, right_index=True, how='left')
        return df

    def select_features(self, X: pd.DataFrame, y: pd.Series,
                        k: int = 20) -> list[str]:
        """Select top k features using mutual information."""
        mi_scores = mutual_info_classif(X, y)
        mi_df = pd.DataFrame({
            'feature': X.columns,
            'mi_score': mi_scores
        }).sort_values('mi_score', ascending=False)

        return mi_df.head(k)['feature'].tolist()
```

---

## MLOps Engineer (406)

### ML Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     ML PLATFORM                              │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                  │
│  ├── Feature Store (Feast/Tecton)                           │
│  ├── Data Versioning (DVC)                                  │
│  └── Data Validation (Great Expectations)                   │
├─────────────────────────────────────────────────────────────┤
│  Training Layer                                              │
│  ├── Experiment Tracking (MLflow/W&B)                       │
│  ├── Distributed Training (Ray/Horovod)                     │
│  └── Hyperparameter Tuning (Optuna)                         │
├─────────────────────────────────────────────────────────────┤
│  Model Management                                            │
│  ├── Model Registry (MLflow)                                │
│  ├── Model Versioning                                       │
│  └── Model Validation                                       │
├─────────────────────────────────────────────────────────────┤
│  Serving Layer                                               │
│  ├── Real-time (TensorFlow Serving/Triton)                  │
│  ├── Batch (Spark/Airflow)                                  │
│  └── Edge (TensorFlow Lite/ONNX)                            │
├─────────────────────────────────────────────────────────────┤
│  Monitoring                                                  │
│  ├── Model Performance (Evidently/Fiddler)                  │
│  ├── Data Drift Detection                                   │
│  └── Business Metrics                                       │
└─────────────────────────────────────────────────────────────┘
```

### Model Monitoring Example

```python
from evidently import ColumnMapping
from evidently.report import Report
from evidently.metrics import (
    DataDriftPreset,
    TargetDriftPreset,
    RegressionPreset
)

def create_drift_report(reference_data: pd.DataFrame,
                        current_data: pd.DataFrame,
                        target_col: str,
                        prediction_col: str) -> Report:
    """Create data and model drift report."""

    column_mapping = ColumnMapping(
        target=target_col,
        prediction=prediction_col,
        numerical_features=[col for col in reference_data.columns
                          if reference_data[col].dtype in ['int64', 'float64']],
        categorical_features=[col for col in reference_data.columns
                            if reference_data[col].dtype == 'object']
    )

    report = Report(metrics=[
        DataDriftPreset(),
        TargetDriftPreset(),
        RegressionPreset()
    ])

    report.run(
        reference_data=reference_data,
        current_data=current_data,
        column_mapping=column_mapping
    )

    return report
```

---

## Expert Activation

```
@llm-engineer
@data-scientist
@mlops-engineer
@ai-researcher
@prompt-engineer
```
or describe your AI/ML challenge
