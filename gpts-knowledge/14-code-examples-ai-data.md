# Code Examples - AI & Data

## LLM Integration

### OpenAI API Usage
```python
# openai_client.py - OpenAI integration with best practices
from openai import OpenAI
import os
from typing import List, Optional
import json

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def chat_completion(
    messages: List[dict],
    model: str = "gpt-4-turbo-preview",
    temperature: float = 0.7,
    max_tokens: int = 1000,
    json_mode: bool = False
) -> str:
    """
    Send chat completion request with error handling
    """
    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            response_format={"type": "json_object"} if json_mode else None
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI API error: {e}")
        raise

def structured_output(prompt: str, schema: dict) -> dict:
    """
    Get structured JSON output using function calling
    """
    response = client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[{"role": "user", "content": prompt}],
        tools=[{
            "type": "function",
            "function": {
                "name": "extract_data",
                "description": "Extract structured data from text",
                "parameters": schema
            }
        }],
        tool_choice={"type": "function", "function": {"name": "extract_data"}}
    )

    tool_call = response.choices[0].message.tool_calls[0]
    return json.loads(tool_call.function.arguments)

# Usage example
schema = {
    "type": "object",
    "properties": {
        "sentiment": {"type": "string", "enum": ["positive", "negative", "neutral"]},
        "confidence": {"type": "number", "minimum": 0, "maximum": 1},
        "key_phrases": {"type": "array", "items": {"type": "string"}}
    },
    "required": ["sentiment", "confidence", "key_phrases"]
}

result = structured_output(
    "The product exceeded my expectations! Great quality and fast shipping.",
    schema
)
# Output: {"sentiment": "positive", "confidence": 0.95, "key_phrases": ["exceeded expectations", "great quality", "fast shipping"]}
```

### Anthropic Claude Integration
```python
# claude_client.py - Claude API with streaming
from anthropic import Anthropic
import os
from typing import Generator

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def chat_with_claude(
    messages: list,
    system: str = None,
    max_tokens: int = 1024
) -> str:
    """
    Simple Claude chat completion
    """
    response = client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=max_tokens,
        system=system or "You are a helpful assistant.",
        messages=messages
    )
    return response.content[0].text

def stream_response(
    messages: list,
    system: str = None
) -> Generator[str, None, None]:
    """
    Stream Claude response for real-time output
    """
    with client.messages.stream(
        model="claude-3-opus-20240229",
        max_tokens=1024,
        system=system or "You are a helpful assistant.",
        messages=messages
    ) as stream:
        for text in stream.text_stream:
            yield text

# Usage with tool use
def analyze_with_tools(query: str) -> dict:
    """
    Use Claude's tool use capability
    """
    tools = [
        {
            "name": "search_database",
            "description": "Search the product database",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"},
                    "limit": {"type": "integer", "default": 10}
                },
                "required": ["query"]
            }
        }
    ]

    response = client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=1024,
        tools=tools,
        messages=[{"role": "user", "content": query}]
    )

    # Handle tool use
    if response.stop_reason == "tool_use":
        tool_use = next(block for block in response.content if block.type == "tool_use")
        # Execute tool and continue conversation
        return {"tool": tool_use.name, "input": tool_use.input}

    return {"response": response.content[0].text}
```

---

## RAG Implementation

### Vector Search with ChromaDB
```python
# rag_pipeline.py - Complete RAG implementation
import chromadb
from chromadb.utils import embedding_functions
from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import List, Dict, Any
import hashlib

class RAGPipeline:
    def __init__(self, collection_name: str = "documents"):
        # Initialize ChromaDB with OpenAI embeddings
        self.client = chromadb.PersistentClient(path="./chroma_db")
        self.embedding_fn = embedding_functions.OpenAIEmbeddingFunction(
            api_key=os.getenv("OPENAI_API_KEY"),
            model_name="text-embedding-3-small"
        )
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            embedding_function=self.embedding_fn
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", ". ", " ", ""]
        )

    def add_documents(self, documents: List[Dict[str, Any]]) -> int:
        """
        Add documents to the vector store
        """
        all_chunks = []
        all_ids = []
        all_metadatas = []

        for doc in documents:
            chunks = self.text_splitter.split_text(doc["content"])
            for i, chunk in enumerate(chunks):
                chunk_id = hashlib.md5(f"{doc['id']}_{i}".encode()).hexdigest()
                all_chunks.append(chunk)
                all_ids.append(chunk_id)
                all_metadatas.append({
                    "source": doc.get("source", "unknown"),
                    "doc_id": doc["id"],
                    "chunk_index": i
                })

        self.collection.add(
            documents=all_chunks,
            ids=all_ids,
            metadatas=all_metadatas
        )
        return len(all_chunks)

    def search(self, query: str, n_results: int = 5, filter: dict = None) -> List[Dict]:
        """
        Search for relevant documents
        """
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results,
            where=filter
        )

        return [
            {
                "content": doc,
                "metadata": meta,
                "distance": dist
            }
            for doc, meta, dist in zip(
                results["documents"][0],
                results["metadatas"][0],
                results["distances"][0]
            )
        ]

    def generate_response(self, query: str, context_docs: List[Dict]) -> str:
        """
        Generate response using retrieved context
        """
        context = "\n\n".join([doc["content"] for doc in context_docs])

        prompt = f"""Based on the following context, answer the question.
If the answer is not in the context, say "I don't have enough information."

Context:
{context}

Question: {query}

Answer:"""

        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        return response.choices[0].message.content

    def query(self, question: str) -> Dict[str, Any]:
        """
        Full RAG pipeline: search + generate
        """
        # Retrieve relevant documents
        docs = self.search(question, n_results=5)

        # Generate response
        answer = self.generate_response(question, docs)

        return {
            "answer": answer,
            "sources": [doc["metadata"]["source"] for doc in docs],
            "context_used": len(docs)
        }
```

---

## Data Processing

### Pandas Data Pipeline
```python
# data_pipeline.py - Data processing with pandas
import pandas as pd
import numpy as np
from typing import List, Dict, Any
from functools import reduce

class DataPipeline:
    def __init__(self, df: pd.DataFrame):
        self.df = df.copy()
        self.transformations = []

    def clean_missing(self, strategy: str = "drop", fill_value: Any = None):
        """Handle missing values"""
        if strategy == "drop":
            self.df = self.df.dropna()
        elif strategy == "fill":
            self.df = self.df.fillna(fill_value)
        elif strategy == "interpolate":
            self.df = self.df.interpolate()
        elif strategy == "mode":
            for col in self.df.columns:
                self.df[col] = self.df[col].fillna(self.df[col].mode()[0])
        return self

    def remove_outliers(self, columns: List[str], method: str = "iqr", threshold: float = 1.5):
        """Remove outliers using IQR or Z-score"""
        for col in columns:
            if method == "iqr":
                Q1 = self.df[col].quantile(0.25)
                Q3 = self.df[col].quantile(0.75)
                IQR = Q3 - Q1
                mask = (self.df[col] >= Q1 - threshold * IQR) & (self.df[col] <= Q3 + threshold * IQR)
            elif method == "zscore":
                z_scores = np.abs((self.df[col] - self.df[col].mean()) / self.df[col].std())
                mask = z_scores < threshold
            self.df = self.df[mask]
        return self

    def normalize(self, columns: List[str], method: str = "minmax"):
        """Normalize numerical columns"""
        for col in columns:
            if method == "minmax":
                min_val = self.df[col].min()
                max_val = self.df[col].max()
                self.df[col] = (self.df[col] - min_val) / (max_val - min_val)
            elif method == "zscore":
                self.df[col] = (self.df[col] - self.df[col].mean()) / self.df[col].std()
        return self

    def encode_categorical(self, columns: List[str], method: str = "onehot"):
        """Encode categorical variables"""
        if method == "onehot":
            self.df = pd.get_dummies(self.df, columns=columns, drop_first=True)
        elif method == "label":
            for col in columns:
                self.df[col] = self.df[col].astype('category').cat.codes
        return self

    def create_features(self, transformations: Dict[str, callable]):
        """Create new features"""
        for name, func in transformations.items():
            self.df[name] = func(self.df)
        return self

    def get_result(self) -> pd.DataFrame:
        return self.df

# Usage example
df = pd.read_csv("data.csv")

pipeline = DataPipeline(df)
result = (pipeline
    .clean_missing(strategy="mode")
    .remove_outliers(["price", "quantity"], method="iqr")
    .normalize(["price"], method="minmax")
    .encode_categorical(["category", "region"])
    .create_features({
        "total": lambda df: df["price"] * df["quantity"],
        "log_price": lambda df: np.log1p(df["price"])
    })
    .get_result()
)
```

---

## Machine Learning

### Scikit-learn Pipeline
```python
# ml_pipeline.py - Complete ML pipeline
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import cross_val_score, GridSearchCV
from sklearn.metrics import classification_report, confusion_matrix
import joblib

def create_preprocessing_pipeline(numeric_features: list, categorical_features: list):
    """Create preprocessing pipeline"""

    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ]
    )

    return preprocessor

def train_model(X_train, y_train, numeric_features, categorical_features):
    """Train and tune model"""

    preprocessor = create_preprocessing_pipeline(numeric_features, categorical_features)

    # Create full pipeline
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', GradientBoostingClassifier())
    ])

    # Hyperparameter tuning
    param_grid = {
        'classifier__n_estimators': [100, 200],
        'classifier__max_depth': [3, 5, 7],
        'classifier__learning_rate': [0.01, 0.1]
    }

    grid_search = GridSearchCV(
        pipeline,
        param_grid,
        cv=5,
        scoring='f1_weighted',
        n_jobs=-1,
        verbose=1
    )

    grid_search.fit(X_train, y_train)

    print(f"Best parameters: {grid_search.best_params_}")
    print(f"Best CV score: {grid_search.best_score_:.4f}")

    return grid_search.best_estimator_

def evaluate_model(model, X_test, y_test):
    """Evaluate model performance"""
    y_pred = model.predict(X_test)

    print("Classification Report:")
    print(classification_report(y_test, y_pred))

    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    return y_pred

def save_model(model, path: str):
    """Save trained model"""
    joblib.dump(model, path)
    print(f"Model saved to {path}")

def load_model(path: str):
    """Load trained model"""
    return joblib.load(path)
```

---

## AI Agents

### LangChain Agent
```python
# agent.py - LangChain ReAct agent
from langchain.agents import AgentExecutor, create_react_agent
from langchain_openai import ChatOpenAI
from langchain.tools import Tool, StructuredTool
from langchain import hub
from pydantic import BaseModel, Field
from typing import Optional

# Define tools
def search_database(query: str) -> str:
    """Search the product database"""
    # Simulated database search
    return f"Found 5 products matching '{query}': Product A, B, C, D, E"

def get_weather(city: str) -> str:
    """Get current weather for a city"""
    # Simulated weather API
    return f"Weather in {city}: 22°C, Sunny"

class CalculatorInput(BaseModel):
    expression: str = Field(description="Mathematical expression to evaluate")

def calculator(expression: str) -> str:
    """Evaluate a mathematical expression"""
    try:
        result = eval(expression)
        return str(result)
    except Exception as e:
        return f"Error: {e}"

# Create tools
tools = [
    Tool(
        name="search_database",
        func=search_database,
        description="Search the product database. Input should be a search query."
    ),
    Tool(
        name="get_weather",
        func=get_weather,
        description="Get current weather for a city. Input should be city name."
    ),
    StructuredTool.from_function(
        func=calculator,
        name="calculator",
        description="Evaluate mathematical expressions",
        args_schema=CalculatorInput
    )
]

def create_agent():
    """Create a ReAct agent"""
    llm = ChatOpenAI(model="gpt-4-turbo-preview", temperature=0)

    # Get the ReAct prompt
    prompt = hub.pull("hwchase17/react")

    # Create agent
    agent = create_react_agent(llm, tools, prompt)

    # Create executor
    agent_executor = AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=True,
        handle_parsing_errors=True,
        max_iterations=5
    )

    return agent_executor

# Usage
agent = create_agent()
result = agent.invoke({"input": "What's the weather in Tokyo and find products related to umbrellas"})
print(result["output"])
```

### Multi-Agent System
```python
# multi_agent.py - Multi-agent collaboration
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, List
import operator

class AgentState(TypedDict):
    messages: Annotated[List[dict], operator.add]
    current_agent: str
    task_complete: bool

def create_researcher_agent():
    """Agent specialized in research"""
    def research(state: AgentState) -> AgentState:
        # Research logic
        messages = state["messages"]
        query = messages[-1]["content"]

        # Simulated research
        result = f"Research findings for: {query}"

        return {
            "messages": [{"role": "researcher", "content": result}],
            "current_agent": "analyst",
            "task_complete": False
        }
    return research

def create_analyst_agent():
    """Agent specialized in analysis"""
    def analyze(state: AgentState) -> AgentState:
        messages = state["messages"]
        research_data = messages[-1]["content"]

        # Simulated analysis
        result = f"Analysis of: {research_data}"

        return {
            "messages": [{"role": "analyst", "content": result}],
            "current_agent": "writer",
            "task_complete": False
        }
    return analyze

def create_writer_agent():
    """Agent specialized in writing"""
    def write(state: AgentState) -> AgentState:
        messages = state["messages"]
        analysis = messages[-1]["content"]

        # Simulated writing
        result = f"Final report based on: {analysis}"

        return {
            "messages": [{"role": "writer", "content": result}],
            "current_agent": "done",
            "task_complete": True
        }
    return write

def create_multi_agent_graph():
    """Create multi-agent workflow"""
    workflow = StateGraph(AgentState)

    # Add nodes
    workflow.add_node("researcher", create_researcher_agent())
    workflow.add_node("analyst", create_analyst_agent())
    workflow.add_node("writer", create_writer_agent())

    # Add edges
    workflow.add_edge("researcher", "analyst")
    workflow.add_edge("analyst", "writer")
    workflow.add_edge("writer", END)

    # Set entry point
    workflow.set_entry_point("researcher")

    return workflow.compile()

# Usage
graph = create_multi_agent_graph()
result = graph.invoke({
    "messages": [{"role": "user", "content": "Research AI trends in 2024"}],
    "current_agent": "researcher",
    "task_complete": False
})
```
