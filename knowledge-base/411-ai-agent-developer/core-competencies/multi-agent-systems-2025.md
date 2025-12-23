# Multi-Agent Systems 2025: Autonomous AI Development

**Updated**: 2025-11-23 | **Stack**: LangGraph, AutoGen, CrewAI, ADK

---

## Framework Landscape 2025

**Top 9 Frameworks**:
1. **LangGraph** - Production-grade, state management
2. **AutoGen** - Microsoft, multi-agent conversations
3. **CrewAI** - Role-based teams
4. **ADK (Agent Development Kit)** - Google, multi-agent orchestration
5. **Atomic Agents** - Modular, enterprise-ready
6. **AgentOps** - Monitoring & observability
7. **Haystack** - RAG + agents
8. **Semantic Kernel** - Microsoft .NET
9. **BabyAGI** - Research, task decomposition

---

## LangGraph Architecture

### State Management

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict

class AgentState(TypedDict):
    messages: list[str]
    current_task: str
    completed_tasks: list[str]
    context: dict

# Define workflow
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("planner", plan_agent)
workflow.add_node("executor", execute_agent)
workflow.add_node("critic", critique_agent)

# Add edges
workflow.add_edge("planner", "executor")
workflow.add_edge("executor", "critic")
workflow.add_conditional_edges(
    "critic",
    should_continue,
    {
        "continue": "executor",
        "end": END
    }
)

workflow.set_entry_point("planner")
app = workflow.compile()

# Execute
result = await app.ainvoke({
    "messages": [],
    "current_task": "Build a web scraper",
    "completed_tasks": [],
    "context": {}
})
```

---

## AutoGen Patterns

### Multi-Agent Conversation

```python
from autogen import AssistantAgent, UserProxyAgent, GroupChat, GroupChatManager

# Define agents
planner = AssistantAgent(
    name="planner",
    system_message="You are a strategic planner.",
    llm_config={"model": "gpt-4"}
)

engineer = AssistantAgent(
    name="engineer",
    system_message="You are a software engineer.",
    llm_config={"model": "gpt-4"}
)

critic = AssistantAgent(
    name="critic",
    system_message="You review plans critically.",
    llm_config={"model": "gpt-4"}
)

user_proxy = UserProxyAgent(
    name="user",
    human_input_mode="NEVER",
    code_execution_config={"work_dir": "workspace"}
)

# Group chat
groupchat = GroupChat(
    agents=[planner, engineer, critic, user_proxy],
    messages=[],
    max_round=10
)

manager = GroupChatManager(groupchat=groupchat)

# Start conversation
user_proxy.initiate_chat(
    manager,
    message="Build a weather app"
)
```

---

## CrewAI: Role-Based Teams

```python
from crewai import Agent, Task, Crew

# Define agents
researcher = Agent(
    role='Researcher',
    goal='Find latest AI trends',
    backstory='Expert in AI research',
    verbose=True
)

writer = Agent(
    role='Writer',
    goal='Write engaging articles',
    backstory='Experienced tech writer',
    verbose=True
)

# Define tasks
research_task = Task(
    description='Research AI trends in 2025',
    agent=researcher
)

write_task = Task(
    description='Write article based on research',
    agent=writer
)

# Create crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    verbose=2
)

result = crew.kickoff()
```

---

## Google ADK (Agent Development Kit)

```python
# Multi-agent application
from agent_development_kit import Agent, Task, Workflow

# Define agents
agent1 = Agent(
    name="data_analyzer",
    tools=["query_database", "generate_chart"],
    model="gemini-2.0"
)

agent2 = Agent(
    name="report_generator",
    tools=["create_document", "format_text"],
    model="gemini-2.0"
)

# Define workflow
workflow = Workflow()
workflow.add_agent(agent1)
workflow.add_agent(agent2)
workflow.connect(agent1, agent2)

# Execute
result = await workflow.run({
    "task": "Analyze Q4 sales data",
    "output_format": "PDF report"
})
```

---

## Agent Design Patterns

### 1. Hierarchical Pattern (Manager-Worker)

```
Manager Agent
    ├── Research Agent
    ├── Analysis Agent
    └── Report Agent
```

**Use case**: Complex tasks with subtasks

### 2. Peer-to-Peer Pattern

```
Agent A ←→ Agent B ←→ Agent C
```

**Use case**: Collaborative problem-solving

### 3. Pipeline Pattern

```
Agent A → Agent B → Agent C → Output
```

**Use case**: Sequential processing

### 4. Committee Pattern

```
Multiple Agents → Vote → Consensus
```

**Use case**: Decision-making, validation

---

## Tool Integration

```python
from langchain.tools import tool

@tool
def search_web(query: str) -> str:
    """Search the web for information"""
    # Implementation
    return results

@tool
def analyze_data(data: dict) -> dict:
    """Analyze structured data"""
    # Implementation
    return analysis

# Attach to agent
agent = Agent(
    tools=[search_web, analyze_data],
    llm=ChatOpenAI(model="gpt-4")
)
```

---

## Memory Systems

### Short-term Memory

```python
from langgraph.checkpoint import MemorySaver

memory = MemorySaver()
app = workflow.compile(checkpointer=memory)

# Maintains conversation history
config = {"configurable": {"thread_id": "user-123"}}
result1 = await app.ainvoke(input1, config)
result2 = await app.ainvoke(input2, config)  # Remembers result1
```

### Long-term Memory (Vector Store)

```python
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings

vectorstore = Chroma(
    embedding_function=OpenAIEmbeddings()
)

# Store agent experiences
vectorstore.add_texts([
    "Task: Build API. Outcome: Success. Lessons: Use FastAPI",
    "Task: Deploy. Outcome: Failed. Lessons: Check env vars"
])

# Retrieve relevant experiences
relevant = vectorstore.similarity_search("How to build API?")
```

---

## Error Handling & Recovery

```python
from tenacity import retry, stop_after_attempt, wait_exponential

class RobustAgent:
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(min=1, max=10)
    )
    async def execute_task(self, task: str):
        try:
            result = await self.llm.ainvoke(task)
            return result
        except Exception as e:
            # Log error
            logger.error(f"Task failed: {e}")
            
            # Fallback strategy
            if "rate_limit" in str(e):
                await asyncio.sleep(60)
            
            raise  # Retry
    
    async def run(self, task: str):
        try:
            return await self.execute_task(task)
        except Exception:
            # Ultimate fallback
            return "Task could not be completed. Please try again later."
```

---

## Monitoring & Observability

```python
from agentops import AgentOps

ops = AgentOps(api_key="...")

# Track agent execution
with ops.start_session() as session:
    result = agent.run(task)
    
    session.log({
        "agent": "research_agent",
        "task": task,
        "result": result,
        "tokens_used": 1523,
        "latency_ms": 2340,
        "success": True
    })
```

**Metrics to Track**:
- Task completion rate
- Average tokens per task
- Latency (p50, p95, p99)
- Cost per task
- Error rate

---

## Best Practices

1. **Start Simple**: Single agent before multi-agent
2. **Clear Roles**: Each agent has specific responsibility
3. **State Management**: Use LangGraph for complex workflows
4. **Error Handling**: Retry logic, fallback strategies
5. **Monitoring**: Track performance and costs
6. **Human-in-Loop**: Critical decisions need approval
7. **Testing**: Unit tests for each agent
8. **Security**: Sandbox code execution

---

## Common Use Cases

### Customer Support Bot
```python
workflow = StateGraph(SupportState)
workflow.add_node("classifier", classify_intent)
workflow.add_node("faq_agent", answer_faq)
workflow.add_node("technical_agent", handle_technical)
workflow.add_node("escalation_agent", escalate_to_human)
```

### Research Assistant
```python
crew = Crew(agents=[
    researcher_agent,
    synthesizer_agent,
    fact_checker_agent,
    writer_agent
])
```

### Code Generation System
```python
agents = {
    "planner": plan_architecture,
    "backend_dev": write_backend,
    "frontend_dev": write_frontend,
    "tester": write_tests,
    "reviewer": review_code
}
```

---

## References

- LangGraph Documentation
- AutoGen GitHub (Microsoft)
- CrewAI Documentation
- Google ADK Launch (2025)
- "Multi-Agent Systems" - arXiv 2024

**Related**: `llm-engineering.md`, `prompt-engineering.md`, `langchain-advanced.md`
