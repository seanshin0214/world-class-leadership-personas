# NLP & LLM Engineering 2025: From Research to Production

**Updated**: 2025-11-23 | **Stack**: Transformers, LangChain, OpenAI, Anthropic

---

## The NLP Landscape Has Changed Forever

```
2020: "NLP is hard"
- BERT for classification
- RNNs for sequence modeling
- Custom models for each task
- Months to train
- Expensive infrastructure

2025: "NLP is commoditized" (sort of)
- GPT-4, Claude 3 Opus handle 90% of tasks
- Fine-tuning for specialized domains
- Few-shot learning > training from scratch
- API calls > custom models
- BUT: Production NLP still requires deep expertise
```

**The New Reality**:
- Foundation models (GPT, Claude, Gemini) are the base
- Your value: Fine-tuning, RAG, prompt engineering, evaluation
- Focus shifted: Training → Deployment & Optimization

---

## Foundation Models Deep Dive

### Model Comparison 2025

| Model | Context | Strengths | Cost (1M tokens) | Best For |
|-------|---------|-----------|------------------|----------|
| **GPT-4 Turbo** | 128K | General, reasoning | $10/$30 | Complex tasks |
| **Claude 3 Opus** | 200K | Long docs, instruction following | $15/$75 | Analysis, writing |
| **Claude 3 Sonnet** | 200K | Fast, balanced | $3/$15 | Production apps |
| **GPT-4o mini** | 128K | Fast, cheap | $0.15/$0.60 | High-volume |
| **Gemini 1.5 Pro** | 1M | Multimodal, huge context | $7/$21 | Video, code |
| **Llama 3.1 405B** | 128K | Open-source, self-hosted | Compute only | Privacy-critical |

**Selection Framework**:
```python
def select_model(use_case):
    if use_case.requires_privacy:
        return "Llama 3.1" # Self-hosted
    
    if use_case.context_length > 200_000:
        return "Gemini 1.5 Pro"  # 1M context
    
    if use_case.volume > 10_000_000 / day:
        return "GPT-4o mini"  # Cheapest
    
    if use_case.requires_reasoning:
        return "GPT-4 Turbo"  # Best reasoning
    
    if use_case.requires_instruction_following:
        return "Claude 3 Opus"  # Best at following complex instructions
    
    # Default: Best bang for buck
    return "Claude 3 Sonnet"
```

---

## Advanced Prompt Engineering

### Chain-of-Thought (CoT) Prompting

```python
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

# Basic prompt (often fails on complex reasoning)
basic_prompt = """
Question: A company has 100 employees. 30% work remotely. 
Of remote workers, 60% have home office stipends. 
How many employees have stipends?

Answer:
"""

# Chain-of-Thought prompt (much better)
cot_prompt = """
Question: {question}

Let's solve this step-by-step:
1. First, identify what we know
2. Then, break down the calculation
3. Finally, compute the answer

Step-by-step solution:
"""

llm = ChatOpenAI(model="gpt-4-turbo", temperature=0)

# With CoT
response = llm.invoke(cot_prompt.format(question="..."))
print(response.content)

# Output:
# Step 1: We know:
# - Total employees: 100
# - Remote workers: 30% of 100 = 30 employees
# - Remote workers with stipends: 60% of remote workers
# 
# Step 2: Calculate stipends:
# - 60% of 30 = 0.60 × 30 = 18 employees
#
# Step 3: Answer: 18 employees have home office stipends

# Accuracy improvement: 65% → 92% on GSM8K math benchmark
```

### Self-Consistency CoT

```python
def self_consistency_cot(question, num_samples=5):
    """
    Generate multiple reasoning paths and take majority vote
    Improves accuracy by 10-20% on complex reasoning
    """
    prompt = f"""
    Question: {question}
    
    Let's think step-by-step to find the answer:
    """
    
    answers = []
    for _ in range(num_samples):
        response = llm.invoke(prompt, temperature=0.7)  # Higher temp for diversity
        
        # Extract final answer (you'd use regex or LLM extraction in production)
        answer = extract_answer(response.content)
        answers.append(answer)
    
    # Majority vote
    from collections import Counter
    most_common = Counter(answers).most_common(1)[0][0]
    
    return most_common

# Example usage
question = "If 3 people can paint 3 fences in 3 hours, how many hours would it take 9 people to paint 9 fences?"

answer = self_consistency_cot(question, num_samples=5)
print(f"Consensus answer: {answer}")  # "3 hours" (correct!)

# Without self-consistency: Often gets "9 hours" (wrong)
# With self-consistency: 85% accuracy → 94% accuracy
```

### ReAct (Reasoning + Acting)

```python
from langchain.agents import initialize_agent, Tool
from langchain.tools import DuckDuckGoSearchRun

# Define tools
search = DuckDuckGoSearchRun()
calculator = Tool(
    name="Calculator",
    func=lambda x: eval(x),  # In production, use safe_eval
    description="Useful for math calculations"
)

tools = [
    Tool(
        name="Search",
        func=search.run,
        description="Search for current information"
    ),
    calculator
]

# Initialize ReAct agent
agent = initialize_agent(
    tools,
    llm,
    agent="react-docstore",
    verbose=True
)

# Complex query requiring reasoning + tool use
question = """
What is the GDP per capita of the country that won the 2022 FIFA World Cup?
"""

response = agent.run(question)

# Agent's thought process (visible with verbose=True):
# Thought: I need to find which country won the 2022 FIFA World Cup
# Action: Search["2022 FIFA World Cup winner"]
# Observation: Argentina won the 2022 FIFA World Cup
# 
# Thought: Now I need Argentina's GDP per capita
# Action: Search["Argentina GDP per capita 2022"]
# Observation: Argentina's GDP per capita is approximately $13,650
# 
# Thought: I have the answer
# Final Answer: The GDP per capita of Argentina (2022 FIFA World Cup winner) 
# is approximately $13,650
```

---

## Retrieval-Augmented Generation (RAG)

### Basic RAG Pipeline

```python
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.document_loaders import DirectoryLoader

# 1. Load documents
loader = DirectoryLoader('./docs', glob="**/*.md")
documents = loader.load()

# 2. Split into chunks (critical for quality!)
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,  # Characters per chunk
    chunk_overlap=200,  # Overlap to preserve context
    separators=["\n\n", "\n", " ", ""]  # Split priority
)
texts = text_splitter.split_documents(documents)

# 3. Create embeddings & vector store
embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
vectorstore = Chroma.from_documents(
    documents=texts,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

# 4. Create retrieval chain
qa_chain = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(model="gpt-4-turbo", temperature=0),
    chain_type="stuff",  # "stuff", "map_reduce", "refine", "map_rerank"
    retriever=vectorstore.as_retriever(
        search_type="mmr",  # Maximum Marginal Relevance
        search_kwargs={"k": 5}  # Top 5 chunks
    ),
    return_source_documents=True
)

# 5. Query
query = "What are the key features of our product?"
result = qa_chain({"query": query})

print("Answer:", result['result'])
print("\nSources:")
for doc in result['source_documents']:
    print(f"- {doc.metadata['source']}")
```

### Advanced RAG: Hybrid Search

```python
from langchain.retrievers import BM25Retriever, EnsembleRetriever

# Semantic search (embeddings)
semantic_retriever = vectorstore.as_retriever(search_kwargs={"k": 10})

# Keyword search (BM25)
bm25_retriever = BM25Retriever.from_documents(texts)
bm25_retriever.k = 10

# Hybrid: Combine both (50-50 weight)
ensemble_retriever = EnsembleRetriever(
    retrievers=[semantic_retriever, bm25_retriever],
    weights=[0.5, 0.5]
)

# Usage
docs = ensemble_retriever.get_relevant_documents(query)

# Improvement: 15-20% better recall than semantic-only
```

### RAG with Reranking

```python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CohereRerank

# Initial retrieval (cast wide net)
base_retriever = vectorstore.as_retriever(search_kwargs={"k": 20})

# Rerank with Cohere (much more accurate)
compressor = CohereRerank(model="rerank-english-v2.0", top_n=5)

compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=base_retriever
)

# Now only top 5 *most relevant* chunks are used
docs = compression_retriever.get_relevant_documents(query)

# Metrics:
# Without reranking: 72% precision
# With reranking: 89% precision
# Cost: +$0.001 per query (worth it!)
```

---

## Fine-Tuning for Specialized Tasks

### When to Fine-Tune

```
✅ FINE-TUNE WHEN:
- Very specific domain (medical, legal, scientific)
- Unique output format (structured JSON, specific style)
- High volume (fine-tuned model cheaper at scale)
- Privacy requirements (self-hosted fine-tuned model)
- Latency critical (smaller fine-tuned model faster)

❌ DON'T FINE-TUNE WHEN:
- Few-shot prompting works well enough
- Data quality is poor (<1000 examples)
- Task frequently changes
- Budget constrained (fine-tuning is expensive upfront)
```

### OpenAI Fine-Tuning (GPT-3.5 / GPT-4)

```python
import openai
import json

# 1. Prepare training data (JSONL format)
training_data = [
    {
        "messages": [
            {"role": "system", "content": "You are a customer support bot for TechCorp."},
            {"role": "user", "content": "How do I reset my password?"},
            {"role": "assistant", "content": "To reset your password:\n1. Go to login page\n2. Click 'Forgot Password'\n3. Enter your email\n4. Check email for reset link\n5. Create new password\n\nNeed help? Contact support@techcorp.com"}
        ]
    },
    # ... 100-1000 more examples
]

with open("training_data.jsonl", "w") as f:
    for item in training_data:
        f.write(json.dumps(item) + "\n")

# 2. Upload training file
file_response = openai.File.create(
    file=open("training_data.jsonl", "rb"),
    purpose="fine-tune"
)

# 3. Create fine-tuning job
job = openai.FineTuningJob.create(
    training_file=file_response.id,
    model="gpt-3.5-turbo-1106",  # Base model
    hyperparameters={
        "n_epochs": 3,  # Training epochs
        "batch_size": 1,
        "learning_rate_multiplier": 0.1
    }
)

# 4. Monitor training
status = openai.FineTuningJob.retrieve(job.id)
print(f"Status: {status.status}")

# 5. Use fine-tuned model
response = openai.ChatCompletion.create(
    model=job.fine_tuned_model,  # e.g., "ft:gpt-3.5-turbo:techcorp:123"
    messages=[
        {"role": "user", "content": "How do I update my billing info?"}
    ]
)

# Results:
# Before fine-tuning: Generic answers, 60% accuracy
# After fine-tuning: Company-specific, 92% accuracy
# Cost: ~$8 for 100K tokens training + $0.012 per 1K tokens inference
```

### LoRA Fine-Tuning (Llama 3.1)

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from datasets import load_dataset
import torch

# 1. Load base model (4-bit quantized to save memory)
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Meta-Llama-3.1-8B",
    load_in_4bit=True,
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Meta-Llama-3.1-8B")

# 2. Prepare for LoRA
model = prepare_model_for_kbit_training(model)

# 3. LoRA configuration
lora_config = LoraConfig(
    r=16,  # Rank (higher = more capacity, slower)
    lora_alpha=32,
    lora_dropout=0.05,
    target_modules=["q_proj", "v_proj"],  # Which layers to adapt
    bias="none",
    task_type="CAUSAL_LM"
)

model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# Output: trainable params: 6.7M || all params: 8B || trainable%: 0.08%

# 4. Load & prepare dataset
dataset = load_dataset("json", data_files="training_data.json")

def tokenize_function(examples):
    return tokenizer(
        examples["text"],
        truncation=True,
        max_length=512,
        padding="max_length"
    )

tokenized_dataset = dataset.map(tokenize_function, batched=True)

# 5. Train
from transformers import Trainer, TrainingArguments

training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    fp16=True,  # Mixed precision
    logging_steps=10,
    save_strategy="epoch"
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset["train"]
)

trainer.train()

# 6. Save LoRA adapters (only 6.7M params!)
model.save_pretrained("./lora_adapters")

# Benefits:
# - Train only 0.08% of parameters (fast!)
# - Minimal memory (can train on single GPU)
# - Multiple adapters for different tasks
# - Preserve base model quality
```

---

## Evaluation & Benchmarking

### Automated Evaluation Metrics

```python
from rouge_score import rouge_scorer
from bert_score import score as bert_score
from nltk.translate.bleu_score import sentence_bleu

# 1. ROUGE (summarization)
scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)

reference = "The cat sat on the mat"
generated = "The cat was sitting on the mat"

scores = scorer.score(reference, generated)
print(f"ROUGE-L: {scores['rougeL'].fmeasure:.3f}")

# 2. BLEU (translation)
reference_tokens = [['the', 'cat', 'sat', 'on', 'the', 'mat']]
generated_tokens = ['the', 'cat', 'was', 'sitting', 'on', 'the', 'mat']

bleu = sentence_bleu(reference_tokens, generated_tokens)
print(f"BLEU: {bleu:.3f}")

# 3. BERTScore (semantic similarity)
references = [reference]
candidates = [generated]

P, R, F1 = bert_score(candidates, references, lang="en")
print(f"BERTScore F1: {F1.mean():.3f}")

# 4. Custom metric: Factual accuracy
def check_factual_accuracy(generated, facts):
    """
    Use LLM to verify factual correctness
    """
    prompt = f"""
    Generated text: {generated}
    
    Known facts: {facts}
    
    Are all facts in the generated text correct? Answer Yes or No, then explain.
    """
    
    response = llm.invoke(prompt)
    is_correct = "yes" in response.content.lower()[:50]
    
    return is_correct

# Usage
facts = ["TechCorp was founded in 2015", "We have 500 employees"]
generated = "TechCorp, founded in 2015, now has over 500 employees."

accuracy = check_factual_accuracy(generated, facts)
print(f"Factually accurate: {accuracy}")
```

### Human Evaluation at Scale

```python
# Use LLM as judge (GPT-4 correlates 85% with human judgment)

def llm_evaluate(prompt, response_a, response_b):
    """
    Pairwise comparison using GPT-4 as judge
    """
    judge_prompt = f"""
    You are an expert evaluator. Compare these two responses to the user prompt.
    
    User Prompt: {prompt}
    
    Response A: {response_a}
    
    Response B: {response_b}
    
    Evaluate on:
    1. Accuracy (factually correct?)
    2. Helpfulness (answers the question?)
    3. Clarity (easy to understand?)
    4. Safety (no harmful content?)
    
    Which response is better? Respond with "A", "B", or "Tie", followed by brief reasoning.
    """
    
    judgment = llm.invoke(judge_prompt, model="gpt-4-turbo", temperature=0)
    
    if "Response A" in judgment.content or judgment.content.strip().startswith("A"):
        return "A"
    elif "Response B" in judgment.content or judgment.content.strip().startswith("B"):
        return "B"
    else:
        return "Tie"

# Run on test set
test_cases = load_test_cases()  # 1000 examples

wins_a = 0
wins_b = 0
ties = 0

for case in test_cases:
    winner = llm_evaluate(case['prompt'], case['response_a'], case['response_b'])
    if winner == "A":
        wins_a += 1
    elif winner == "B":
        wins_b += 1
    else:
        ties += 1

print(f"Model A wins: {wins_a/len(test_cases)*100:.1f}%")
print(f"Model B wins: {wins_b/len(test_cases)*100:.1f}%")
print(f"Ties: {ties/len(test_cases)*100:.1f}%")

# Cost: ~$10 for 1000 evaluations (much cheaper than human eval)
```

---

## Production Deployment

### Caching Strategy

```python
import hashlib
import redis

class LLMCache:
    def __init__(self):
        self.redis_client = redis.Redis(host='localhost', port=6379, db=0)
        self.ttl = 86400  # 24 hours
    
    def _generate_key(self, prompt, model, temperature):
        """
        Generate cache key from prompt + parameters
        """
        key_str = f"{prompt}:{model}:{temperature}"
        return hashlib.sha256(key_str.encode()).hexdigest()
    
    def get(self, prompt, model, temperature=0):
        """
        Try cache first, fallback to API
        """
        cache_key = self._generate_key(prompt, model, temperature)
        
        # Check cache
        cached_response = self.redis_client.get(cache_key)
        if cached_response:
            print("✅ Cache hit!")
            return cached_response.decode('utf-8')
        
        # Cache miss - call API
        print("❌ Cache miss - calling API")
        response = openai.ChatCompletion.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=temperature
        )
        
        result = response.choices[0].message.content
        
        # Store in cache
        self.redis_client.setex(cache_key, self.ttl, result)
        
        return result

# Usage
cache = LLMCache()

# First call - API (2 seconds, $0.01)
response1 = cache.get("What is the capital of France?", "gpt-4-turbo")

# Second call - Cache (10ms, $0)
response2 = cache.get("What is the capital of France?", "gpt-4-turbo")

# Metrics (after 1 month in production):
# - Cache hit rate: 67%
# - Cost savings: $12,000/month
# - Latency improvement: 2000ms → 15ms (99% faster)
```

### Rate Limiting & Error Handling

```python
from tenacity import retry, stop_after_attempt, wait_exponential
import time

class RobustLLMClient:
    def __init__(self):
        self.request_count = 0
        self.last_request_time = time.time()
        self.max_requests_per_minute = 100
    
    def _check_rate_limit(self):
        """
        Implement token bucket rate limiting
        """
        now = time.time()
        time_since_last = now - self.last_request_time
        
        if time_since_last < 60:  # Within same minute
            if self.request_count >= self.max_requests_per_minute:
                sleep_time = 60 - time_since_last
                print(f"Rate limit reached. Sleeping {sleep_time:.1f}s")
                time.sleep(sleep_time)
                self.request_count = 0
                self.last_request_time = time.time()
        else:
            # Reset counter
            self.request_count = 0
            self.last_request_time = now
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10)
    )
    def call_llm(self, prompt, model="gpt-4-turbo"):
        """
        Robust LLM call with retries and error handling
        """
        self._check_rate_limit()
        
        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                timeout=30  # 30 second timeout
            )
            
            self.request_count += 1
            return response.choices[0].message.content
            
        except openai.error.RateLimitError as e:
            print(f"Rate limit error: {e}")
            time.sleep(60)  # Wait 1 minute
            raise  # Retry via tenacity
            
        except openai.error.APIError as e:
            print(f"API error: {e}")
            raise  # Retry
            
        except openai.error.Timeout as e:
            print(f"Timeout error: {e}")
            raise  # Retry
            
        except Exception as e:
            print(f"Unexpected error: {e}")
            # Don't retry on unexpected errors
            return f"Error: {str(e)}"

# Usage
client = RobustLLMClient()

# Handles rate limits, retries, timeouts automatically
result = client.call_llm("Explain quantum computing")
```

---

## Monitoring & Observability

```python
import prometheus_client as prom
from datetime import datetime

# Define metrics
llm_requests_total = prom.Counter(
    'llm_requests_total',
    'Total LLM requests',
    ['model', 'status']
)

llm_request_duration = prom.Histogram(
    'llm_request_duration_seconds',
    'LLM request duration',
    ['model']
)

llm_token_usage = prom.Counter(
    'llm_tokens_total',
    'Total tokens used',
    ['model', 'type']  # type: input or output
)

llm_cost = prom.Counter(
    'llm_cost_dollars',
    'Total cost in dollars',
    ['model']
)

class MonitoredLLMClient:
    def __init__(self):
        self.client = openai.Client()
    
    def call(self, prompt, model="gpt-4-turbo"):
        start_time = datetime.now()
        
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}]
            )
            
            # Record metrics
            duration = (datetime.now() - start_time).total_seconds()
            llm_request_duration.labels(model=model).observe(duration)
            
            # Token usage
            input_tokens = response.usage.prompt_tokens
            output_tokens = response.usage.completion_tokens
            llm_token_usage.labels(model=model, type='input').inc(input_tokens)
            llm_token_usage.labels(model=model, type='output').inc(output_tokens)
            
            # Cost calculation
            cost = self._calculate_cost(model, input_tokens, output_tokens)
            llm_cost.labels(model=model).inc(cost)
            
            # Success counter
            llm_requests_total.labels(model=model, status='success').inc()
            
            return response.choices[0].message.content
            
        except Exception as e:
            llm_requests_total.labels(model=model, status='error').inc()
            raise
    
    def _calculate_cost(self, model, input_tokens, output_tokens):
        """
        Calculate cost based on model pricing (2025)
        """
        pricing = {
            'gpt-4-turbo': {'input': 0.01, 'output': 0.03},  # per 1K tokens
            'gpt-3.5-turbo': {'input': 0.0015, 'output': 0.002},
            'claude-3-opus': {'input': 0.015, 'output': 0.075},
            'claude-3-sonnet': {'input': 0.003, 'output': 0.015},
        }
        
        rates = pricing.get(model, {'input': 0.01, 'output': 0.03})
        cost = (input_tokens / 1000 * rates['input']) + \
               (output_tokens / 1000 * rates['output'])
        
        return cost

# Grafana dashboard queries:
"""
# Average latency by model
rate(llm_request_duration_seconds_sum[5m]) / rate(llm_request_duration_seconds_count[5m])

# Total daily cost
increase(llm_cost_dollars[1d])

# Error rate
rate(llm_requests_total{status="error"}[5m]) / rate(llm_requests_total[5m])

# Tokens per request
rate(llm_tokens_total[5m]) / rate(llm_requests_total[5m])
"""
```

---

## Key Takeaways

1. **Foundation models are commodities** - Your value is in application
2. **RAG > Fine-tuning** - For most use cases (cheaper, faster to iterate)
3. **Evaluate rigorously** - Metrics + human eval
4. **Cache aggressively** - 60%+ hit rate = massive savings
5. **Monitor everything** - Cost, latency, quality
6. **Prompt engineering is still critical** - CoT, ReAct improve accuracy 20-30%

---

## References

- "Natural Language Processing with Transformers" - Tunstall et al.
- OpenAI Cookbook
- LangChain Documentation
- Anthropic Prompt Engineering Guide
- Papers: "Chain-of-Thought Prompting", "ReAct", "Self-Consistency"

**Related**: `llm-engineering.md`, `prompt-engineering.md`, `ml-deployment.md`
