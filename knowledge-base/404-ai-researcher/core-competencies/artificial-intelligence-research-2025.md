# Artificial Intelligence Research 2025

**Updated**: 2025-11-24 | **Focus**: Deep Learning, LLMs, Computer Vision, Reinforcement Learning, Research Methodology

---

## Research Fundamentals

```markdown
RESEARCH PROCESS:

1. PROBLEM IDENTIFICATION:
   - What's unsolved? (survey literature, find gaps)
   - Why important? (impact, applications)
   - Tractable? (can make progress with current resources)

2. LITERATURE REVIEW:
   - arXiv (preprints, latest research)
   - Google Scholar, Semantic Scholar (search papers)
   - Read: Abstracts (100+), intros (20+), full papers (5-10)
   - Identify: State-of-the-art (SOTA), limitations, open questions

3. HYPOTHESIS:
   - What do you believe will work? (educated guess based on literature, intuition)
   - Example: "Self-attention mechanisms can improve time-series forecasting accuracy"

4. EXPERIMENTATION:
   - Design experiments (test hypothesis)
   - Baseline (reproduce existing work, ensure fair comparison)
   - Ablation studies (remove components, measure impact)

5. ANALYSIS:
   - Metrics (accuracy, F1, BLEU, perplexity, etc.)
   - Statistical significance (t-tests, confidence intervals)
   - Qualitative analysis (examples, failure cases)

6. PUBLICATION:
   - Write paper (Intro, Related Work, Method, Experiments, Conclusion)
   - Submit to conference (NeurIPS, ICML, ICLR, CVPR, ACL, EMNLP)
   - Peer review (3-4 reviewers, accept/reject, ~20-30% acceptance rate top venues)

7. ITERATION:
   - If rejected: Address reviews, improve, resubmit
   - If accepted: Present, get feedback, next research direction

---

RESEARCH SKILLS:

CRITICAL READING:
- Don't believe everything (verify claims, check experiments)
- Questions to ask:
  * Is the baseline fair? (compare to strong baselines, not weak)
  * Is the improvement significant? (or within noise)
  * Does it generalize? (or overfit to specific dataset)
  * Reproducible? (code released, details sufficient)

EXPERIMENTATION:
- Version control (Git, track experiments)
- Logging (Weights & Biases, MLflow, TensorBoard - track metrics, hyperparameters)
- Reproducibility: Random seeds, save configs, document environment

COMMUNICATION:
- Write clearly (avoid jargon, explain intuitively)
- Visualizations (plots, diagrams better than tables)
- Present well (conferences, lab meetings, practice)

COLLABORATION:
- Advisors, peers (discuss ideas, get feedback)
- Open source (contribute, learn from others' code)
- Twitter/X, Mastodon (follow researchers, share work)
```

---

## Large Language Models (LLMs)

```python
# TRANSFORMER ARCHITECTURE (Foundation of LLMs)

import torch
import torch.nn as nn

class SelfAttention(nn.Module):
    """
    Self-attention mechanism (core of Transformers)
    Allows model to weigh importance of different words in sequence
    """
    def __init__(self, embed_dim, num_heads):
        super().__init__()
        self.embed_dim = embed_dim
        self.num_heads = num_heads
        self.head_dim = embed_dim // num_heads
        
        assert embed_dim % num_heads == 0, "embed_dim must be divisible by num_heads"
        
        # Query, Key, Value projections
        self.q_proj = nn.Linear(embed_dim, embed_dim)
        self.k_proj = nn.Linear(embed_dim, embed_dim)
        self.v_proj = nn.Linear(embed_dim, embed_dim)
        self.out_proj = nn.Linear(embed_dim, embed_dim)
        
    def forward(self, x):
        batch_size, seq_len, embed_dim = x.shape
        
        # Project to Q, K, V
        Q = self.q_proj(x)  # (batch, seq_len, embed_dim)
        K = self.k_proj(x)
        V = self.v_proj(x)
        
        # Reshape for multi-head attention
        Q = Q.view(batch_size, seq_len, self.num_heads, self.head_dim).transpose(1, 2)
        K = K.view(batch_size, seq_len, self.num_heads, self.head_dim).transpose(1, 2)
        V = V.view(batch_size, seq_len, self.num_heads, self.head_dim).transpose(1, 2)
        # Now: (batch, num_heads, seq_len, head_dim)
        
        # Scaled dot-product attention
        scores = torch.matmul(Q, K.transpose(-2, -1)) / (self.head_dim ** 0.5)
        # scores: (batch, num_heads, seq_len, seq_len)
        
        attn_weights = torch.softmax(scores, dim=-1)
        
        attn_output = torch.matmul(attn_weights, V)
        # (batch, num_heads, seq_len, head_dim)
        
        # Concatenate heads
        attn_output = attn_output.transpose(1, 2).contiguous().view(batch_size, seq_len, embed_dim)
        
        # Final projection
        output = self.out_proj(attn_output)
        
        return output

class TransformerBlock(nn.Module):
    """
    One Transformer block (self-attention + feedforward)
    Stack many of these to create deep models (GPT, BERT, etc.)
    """
    def __init__(self, embed_dim, num_heads, ff_dim, dropout=0.1):
        super().__init__()
        self.attn = SelfAttention(embed_dim, num_heads)
        self.norm1 = nn.LayerNorm(embed_dim)
        self.norm2 = nn.LayerNorm(embed_dim)
        
        # Feedforward network
        self.ff = nn.Sequential(
            nn.Linear(embed_dim, ff_dim),
            nn.GELU(),
            nn.Linear(ff_dim, embed_dim)
        )
        
        self.dropout = nn.Dropout(dropout)
        
    def forward(self, x):
        # Self-attention with residual connection
        attn_out = self.attn(x)
        x = self.norm1(x + self.dropout(attn_out))
        
        # Feedforward with residual connection
        ff_out = self.ff(x)
        x = self.norm2(x + self.dropout(ff_out))
        
        return x

---

# TRAINING LLMs (Simplified, actual training requires massive compute)

from transformers import GPT2LMHeadModel, GPT2Tokenizer, Trainer, TrainingArguments
from datasets import load_dataset

# Load pretrained model and tokenizer
model = GPT2LMHeadModel.from_pretrained('gpt2')
tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
tokenizer.pad_token = tokenizer.eos_token

# Load dataset (example: WikiText)
dataset = load_dataset('wikitext', 'wikitext-2-raw-v1')

# Tokenize
def tokenize_function(examples):
    return tokenizer(examples['text'], truncation=True, max_length=512, padding='max_length')

tokenized_dataset = dataset.map(tokenize_function, batched=True, remove_columns=['text'])
tokenized_dataset.set_format('torch')

# Training arguments
training_args = TrainingArguments(
    output_dir='./results',
    num_train_epochs=3,
    per_device_train_batch_size=4,
    save_steps=1000,
    save_total_limit=2,
    learning_rate=5e-5,
    logging_dir='./logs',
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset['train'],
    eval_dataset=tokenized_dataset['validation'],
)

# Train
trainer.train()

---

# FINE-TUNING (Adapt pretrained model to specific task)

from transformers import AutoModelForSequenceClassification, AutoTokenizer, Trainer, TrainingArguments
from datasets import load_dataset

# Load pretrained model (BERT for classification)
model = AutoModelForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=2)
tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')

# Load dataset (sentiment analysis)
dataset = load_dataset('imdb')

# Tokenize
def tokenize(examples):
    return tokenizer(examples['text'], truncation=True, padding='max_length', max_length=512)

tokenized = dataset.map(tokenize, batched=True)

# Training
training_args = TrainingArguments(
    output_dir='./sentiment-model',
    num_train_epochs=3,
    per_device_train_batch_size=8,
    evaluation_strategy='epoch',
    save_strategy='epoch',
    learning_rate=2e-5,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized['train'],
    eval_dataset=tokenized['test'],
)

trainer.train()

---

# PROMPT ENGINEERING (Get better outputs from LLMs)

import openai

openai.api_key = "your-api-key"

# Zero-shot (no examples)
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Classify this sentiment: 'I love this product!'"}
    ]
)
print(response.choices[0].message.content)

# Few-shot (provide examples)
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a sentiment classifier."},
        {"role": "user", "content": "Review: 'Great movie!'\nSentiment: Positive"},
        {"role": "user", "content": "Review: 'Terrible experience.'\nSentiment: Negative"},
        {"role": "user", "content": "Review: 'I love this product!'\nSentiment:"}
    ]
)
print(response.choices[0].message.content)

# Chain-of-thought (ask model to reason step-by-step)
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "Solve this math problem step-by-step: If John has 5 apples and gives 2 to Mary, then buys 3 more, how many does he have?"}
    ]
)
print(response.choices[0].message.content)
# Model will show reasoning: "Start: 5, Give away 2: 5-2=3, Buy 3 more: 3+3=6. Answer: 6 apples."

---

# RETRIEVAL-AUGMENTED GENERATION (RAG, combine LLM + external knowledge)

from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI

# Load documents (e.g., company knowledge base)
documents = [
    "Our return policy allows returns within 30 days.",
    "We offer free shipping on orders over $50.",
    "Customer support is available 24/7 via chat or email."
]

# Split into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=100, chunk_overlap=20)
texts = text_splitter.create_documents(documents)

# Create embeddings and vector store
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(texts, embeddings)

# Create QA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=OpenAI(temperature=0),
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

# Query
question = "What is your return policy?"
answer = qa_chain.run(question)
print(answer)
# Output: "Our return policy allows returns within 30 days."

# HOW IT WORKS:
# 1. Embed question
# 2. Retrieve most relevant documents (vector similarity)
# 3. Pass documents + question to LLM
# 4. LLM generates answer based on retrieved context
```

---

## Computer Vision

```python
# CONVOLUTIONAL NEURAL NETWORKS (CNNs, Image classification)

import torch
import torch.nn as nn
import torchvision
import torchvision.transforms as transforms
from torch.utils.data import DataLoader

# Define CNN
class CNN(nn.Module):
    def __init__(self, num_classes=10):
        super(CNN, self).__init__()
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)
        self.fc1 = nn.Linear(64 * 8 * 8, 128)
        self.fc2 = nn.Linear(128, num_classes)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.5)
        
    def forward(self, x):
        x = self.pool(self.relu(self.conv1(x)))  # (32, 32, 32) -> (32, 16, 16)
        x = self.pool(self.relu(self.conv2(x)))  # (64, 16, 16) -> (64, 8, 8)
        x = x.view(-1, 64 * 8 * 8)  # Flatten
        x = self.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return x

# Load CIFAR-10 dataset
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])

train_dataset = torchvision.datasets.CIFAR10(root='./data', train=True, download=True, transform=transform)
train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)

# Training
model = CNN(num_classes=10)
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

for epoch in range(10):
    for images, labels in train_loader:
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
    print(f'Epoch {epoch+1}, Loss: {loss.item():.4f}')

---

# OBJECT DETECTION (YOLO - You Only Look Once)

from ultralytics import YOLO

# Load pretrained YOLO model
model = YOLO('yolov8n.pt')  # Nano model (smallest, fastest)

# Inference on image
results = model('image.jpg')

# Process results
for r in results:
    boxes = r.boxes  # Bounding boxes
    for box in boxes:
        x1, y1, x2, y2 = box.xyxy[0]  # Coordinates
        conf = box.conf[0]  # Confidence
        cls = box.cls[0]  # Class
        print(f'Class: {model.names[int(cls)]}, Conf: {conf:.2f}, Box: ({x1}, {y1}, {x2}, {y2})')

# Train custom detector
model = YOLO('yolov8n.yaml')  # From scratch
model.train(data='custom_dataset.yaml', epochs=100, imgsz=640)

---

# IMAGE SEGMENTATION (Semantic segmentation, pixel-wise classification)

from transformers import SegformerForSemanticSegmentation, SegformerFeatureExtractor
from PIL import Image
import torch

# Load model
model = SegformerForSemanticSegmentation.from_pretrained('nvidia/segformer-b0-finetuned-ade-512-512')
feature_extractor = SegformerFeatureExtractor.from_pretrained('nvidia/segformer-b0-finetuned-ade-512-512')

# Load image
image = Image.open('street.jpg')

# Preprocess
inputs = feature_extractor(images=image, return_tensors="pt")

# Inference
outputs = model(**inputs)
logits = outputs.logits  # (batch, num_classes, height, width)

# Argmax to get class per pixel
segmentation = torch.argmax(logits, dim=1).squeeze().cpu().numpy()

# segmentation is 2D array, each value is class ID (0=sky, 1=building, etc.)

---

# VISION TRANSFORMERS (ViT, Transformers for images)

from transformers import ViTForImageClassification, ViTFeatureExtractor
import torch
from PIL import Image

# Load model
model = ViTForImageClassification.from_pretrained('google/vit-base-patch16-224')
feature_extractor = ViTFeatureExtractor.from_pretrained('google/vit-base-patch16-224')

# Load image
image = Image.open('cat.jpg')

# Preprocess
inputs = feature_extractor(images=image, return_tensors="pt")

# Inference
outputs = model(**inputs)
logits = outputs.logits

# Predicted class
predicted_class_idx = logits.argmax(-1).item()
print(f'Predicted class: {model.config.id2label[predicted_class_idx]}')
```

---

## Reinforcement Learning

```python
# Q-LEARNING (Simple RL algorithm)

import numpy as np
import gym

# Create environment (CartPole: balance pole on cart)
env = gym.make('CartPole-v1')

# Discretize state space (continuous → discrete bins)
state_bins = [
    np.linspace(-4.8, 4.8, 10),  # Cart position
    np.linspace(-4, 4, 10),       # Cart velocity
    np.linspace(-0.418, 0.418, 10),  # Pole angle
    np.linspace(-4, 4, 10)        # Pole angular velocity
]

def discretize_state(state):
    discrete = []
    for i, val in enumerate(state):
        discrete.append(np.digitize(val, state_bins[i]) - 1)
    return tuple(discrete)

# Q-table (state-action values)
q_table = np.zeros([10, 10, 10, 10, env.action_space.n])

# Hyperparameters
learning_rate = 0.1
discount_factor = 0.99
epsilon = 1.0  # Exploration rate
epsilon_decay = 0.995
min_epsilon = 0.01

# Training
episodes = 1000
for episode in range(episodes):
    state = discretize_state(env.reset()[0])
    done = False
    total_reward = 0
    
    while not done:
        # Epsilon-greedy action selection
        if np.random.random() < epsilon:
            action = env.action_space.sample()  # Explore
        else:
            action = np.argmax(q_table[state])  # Exploit
        
        # Take action
        next_state, reward, done, truncated, info = env.step(action)
        next_state = discretize_state(next_state)
        
        # Q-learning update
        best_next_action = np.argmax(q_table[next_state])
        td_target = reward + discount_factor * q_table[next_state][best_next_action]
        td_error = td_target - q_table[state][action]
        q_table[state][action] += learning_rate * td_error
        
        state = next_state
        total_reward += reward
    
    # Decay epsilon
    epsilon = max(min_epsilon, epsilon * epsilon_decay)
    
    if episode % 100 == 0:
        print(f'Episode {episode}, Total Reward: {total_reward}, Epsilon: {epsilon:.2f}')

---

# DEEP Q-NETWORK (DQN, Neural network for Q-values)

import torch
import torch.nn as nn
import torch.optim as optim
import random
from collections import deque

class DQN(nn.Module):
    def __init__(self, state_dim, action_dim):
        super(DQN, self).__init__()
        self.fc1 = nn.Linear(state_dim, 128)
        self.fc2 = nn.Linear(128, 128)
        self.fc3 = nn.Linear(128, action_dim)
        
    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        return self.fc3(x)

# Replay buffer (store experiences, sample batches)
class ReplayBuffer:
    def __init__(self, capacity=10000):
        self.buffer = deque(maxlen=capacity)
    
    def push(self, state, action, reward, next_state, done):
        self.buffer.append((state, action, reward, next_state, done))
    
    def sample(self, batch_size):
        return random.sample(self.buffer, batch_size)
    
    def __len__(self):
        return len(self.buffer)

# Environment
env = gym.make('CartPole-v1')
state_dim = env.observation_space.shape[0]
action_dim = env.action_space.n

# Model, optimizer, replay buffer
policy_net = DQN(state_dim, action_dim)
target_net = DQN(state_dim, action_dim)
target_net.load_state_dict(policy_net.state_dict())
optimizer = optim.Adam(policy_net.parameters(), lr=0.001)
replay_buffer = ReplayBuffer()

# Training loop (simplified)
batch_size = 64
for episode in range(500):
    state = torch.FloatTensor(env.reset()[0])
    done = False
    total_reward = 0
    
    while not done:
        # Epsilon-greedy
        if random.random() < 0.1:  # Epsilon
            action = env.action_space.sample()
        else:
            with torch.no_grad():
                action = policy_net(state).argmax().item()
        
        # Step
        next_state, reward, done, truncated, _ = env.step(action)
        next_state = torch.FloatTensor(next_state)
        
        # Store in buffer
        replay_buffer.push(state, action, reward, next_state, done)
        
        state = next_state
        total_reward += reward
        
        # Train if enough samples
        if len(replay_buffer) > batch_size:
            batch = replay_buffer.sample(batch_size)
            states, actions, rewards, next_states, dones = zip(*batch)
            
            states = torch.stack(states)
            actions = torch.LongTensor(actions)
            rewards = torch.FloatTensor(rewards)
            next_states = torch.stack(next_states)
            dones = torch.FloatTensor(dones)
            
            # Q-values
            q_values = policy_net(states).gather(1, actions.unsqueeze(1)).squeeze()
            
            # Target Q-values
            with torch.no_grad():
                next_q_values = target_net(next_states).max(1)[0]
                target_q_values = rewards + 0.99 * next_q_values * (1 - dones)
            
            # Loss
            loss = nn.MSELoss()(q_values, target_q_values)
            
            # Optimize
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
    
    # Update target network (every few episodes)
    if episode % 10 == 0:
        target_net.load_state_dict(policy_net.state_dict())
    
    if episode % 50 == 0:
        print(f'Episode {episode}, Total Reward: {total_reward}')
```

---

## Key Takeaways

1. **Read papers daily** - Stay current (arXiv, Twitter/X, conferences)
2. **Reproduce first** - Implement baseline (understand before innovating)
3. **Ablations matter** - Isolate contributions (what actually helps?)
4. **Open source code** - Share work (reproducibility, impact, community)
5. **Collaborate** - Research is social (discuss, co-author, attend conferences)

---

## References

- "Deep Learning" - Ian Goodfellow, Yoshua Bengio, Aaron Courville
- "Attention Is All You Need" - Vaswani et al. (Transformer paper)
- arXiv.org, Papers with Code, Hugging Face

**Related**: `transformer-architecture-deep-dive.md`, `llm-fine-tuning-best-practices.md`, `reinforcement-learning-algorithms.md`
