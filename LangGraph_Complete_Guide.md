# LangGraph Complete Guide

This document consolidates the LangGraph concepts discussed throughout the tutorial.

## Contents

1. Introduction
2. Why LangGraph
3. State
4. TypedDict
5. Nodes
6. Edges
7. START and END
8. StateGraph and Compilation
9. Messages and MessagesState
10. Reducers
11. Chat Models
12. Tool Calling
13. ToolNode
14. ReAct Pattern
15. Agents
16. Conditional Edges
17. tools_condition
18. Command Pattern
19. Multi-Agent Systems
20. Send API
21. Parallel Execution
22. Fan-Out and Fan-In
23. Map Reduce
24. Async Execution
25. Batch Processing
26. Streaming
27. Memory
28. Checkpointing
29. Persistence
30. Thread IDs
31. Durable Execution
32. Human-in-the-Loop
33. Interrupts
34. Input and Output Schemas
35. Structured Outputs
36. Graph Visualization
37. Error Handling
38. LangSmith
39. Supervisor Pattern
40. Swarm Pattern
41. Production Best Practices
42. Final Mental Model

---

# Introduction

LangGraph is a framework for building stateful AI applications using graph-based workflows.

Traditional LLM applications often follow:

User → Prompt → LLM → Response

This works for simple tasks but becomes difficult when applications need:

- Tool usage
- Memory
- Multi-agent collaboration
- Human approval
- Long-running execution
- Recovery from failures

LangGraph solves these problems using graph-based execution.

# Why LangGraph

Traditional chains are usually linear.

Prompt → LLM → Output

Real systems are not.

Agent → Tool → Agent → Tool → Agent

Graphs naturally support loops, branching, routing, persistence, and state management.

# State

State is the shared information used by all nodes.

Example:

```python
class State(TypedDict):
    query: str
    answer: str
```

Every node reads state and updates state.

State acts as the central memory of the workflow.

Why it exists:

Without state, information would need to be manually passed between every function.

# TypedDict

TypedDict provides structure to state.

Example:

```python
from typing import TypedDict

class State(TypedDict):
    query: str
    answer: str
```

Benefits:

- Type safety
- Better autocomplete
- Easier maintenance
- Fewer bugs

# Nodes

A node is a unit of work.

Most commonly a Python function.

```python
def assistant(state):
    ...
```

A node:

1. Receives state
2. Performs work
3. Returns updates

# Edges

Edges determine execution order.

```python
builder.add_edge(
    "node_a",
    "node_b"
)
```

Meaning:

After node_a finishes, execute node_b.

# START and END

Every graph has an entry and exit point.

```python
from langgraph.graph import START, END
```

Example:

```python
builder.add_edge(START, "assistant")
builder.add_edge("assistant", END)
```

# StateGraph and Compilation

Graphs are built using StateGraph.

```python
builder = StateGraph(State)
```

Add nodes.

```python
builder.add_node(
    "assistant",
    assistant
)
```

Compile.

```python
graph = builder.compile()
```

Compilation validates and prepares the graph for execution.

# Messages and MessagesState

Most AI applications involve conversations.

Messages maintain chat history.

Example:

```python
[
    HumanMessage(content="Hello"),
    AIMessage(content="Hi")
]
```

LangGraph provides:

```python
MessagesState
```

Instead of manually defining:

```python
class State(TypedDict):
    messages: list
```

MessagesState automatically manages message accumulation.

# Reducers

Reducers define how updates are merged.

Example:

```python
from typing import Annotated
import operator

class State(TypedDict):
    results: Annotated[list, operator.add]
```

If two nodes return:

```python
["Python"]
```

and

```python
["SQL"]
```

Final result becomes:

```python
["Python", "SQL"]
```

Why reducers exist:

To prevent information loss during parallel execution.

# Chat Models

LangGraph orchestrates workflows.

Chat models generate responses.

Example:

```python
llm = ChatOpenAI(
    model="gpt-4"
)
```

```python
response = llm.invoke(messages)
```

Common parameters:

- model
- temperature
- timeout
- max_retries

# Tool Calling

LLMs cannot always access real-time information.

Tools solve this problem.

Example:

```python
@tool
def get_weather(city: str):
    return "28°C"
```

The model can decide when to call the tool.

# ToolNode

ToolNode executes tools.

```python
from langchain.agents import ToolNode

tool_node = ToolNode(tools)
```

Responsibilities:

- Detect tool calls
- Execute tools
- Return results

# ReAct Pattern

ReAct means:

Reason + Act

Workflow:

User → Agent → Tool → Agent → Response

The model alternates between reasoning and action until completion.

# Agents

An agent combines:

- LLM
- State
- Tools
- Decision-making

Example:

```python
def agent(state):

    response = (
        llm
        .bind_tools(tools)
        .invoke(state["messages"])
    )

    return {
        "messages": [response]
    }
```

Agents observe, think, act, and continue until a goal is achieved.

# Conditional Edges

Conditional edges create dynamic routing.

Example:

```python
def route(state):

    if state["paid"]:
        return "ship"

    return "cancel"
```

```python
builder.add_conditional_edges(
    "payment",
    route
)
```

# tools_condition

A built-in routing helper.

If the agent generates a tool call:

Agent → ToolNode

Otherwise:

Agent → END

# Command Pattern

Command enables:

1. State updates
2. Routing

at the same time.

Example:

```python
Command(
    goto="hotel_agent",
    update={"messages": [msg]}
)
```

Why it exists:

To allow LLM-driven routing.

# Multi-Agent Systems

Instead of one giant agent:

```text
Resume Agent
Roadmap Agent
Interview Agent
```

Each specializes in a specific responsibility.

Benefits:

- Separation of concerns
- Easier maintenance
- Better scalability

# Send API

Send creates dynamic executions.

Example:

```python
from langgraph.types import Send

return [
    Send(
        "analyze_skill",
        {"skill": skill}
    )
    for skill in skills
]
```

Useful when the number of tasks is unknown beforehand.

# Parallel Execution

Independent tasks can execute simultaneously.

Example:

Resume Analysis
Job Market Analysis
Skill Gap Analysis

instead of sequential execution.

Benefits:

- Faster execution
- Better resource usage

# Fan-Out and Fan-In

Fan-Out:

One input becomes many executions.

Fan-In:

Many executions merge into one result.

Common pattern:

Input → Parallel Processing → Merge

# Map Reduce

Map:

Process items independently.

Reduce:

Combine results.

Example:

100 resumes → Analyze individually → Aggregate rankings

# Async Execution

Async execution improves throughput.

Synchronous:

```python
graph.invoke(state)
```

Asynchronous:

```python
await graph.ainvoke(state)
```

Useful for:

- APIs
- Web servers
- High-concurrency systems

# Batch Processing

Process multiple inputs together.

```python
graph.batch(inputs)
```

Async version:

```python
await graph.abatch(inputs)
```

Benefits:

- Higher throughput
- Cleaner code

# Streaming

Instead of waiting for completion:

```python
graph.stream(state)
```

Streaming provides updates as execution progresses.

Modes:

- values
- updates
- messages

# Memory

Memory means retaining information across executions.

Two types:

- Short-term memory
- Long-term memory

Short-term memory usually lives in state.

Long-term memory requires persistence.

# Checkpointing

Checkpointing saves workflow progress.

Example:

```python
checkpointer = MemorySaver()

graph = builder.compile(
    checkpointer=checkpointer
)
```

Benefits:

- Recovery
- State inspection
- Long-running workflows

# Persistence

Persistence stores state beyond application lifetime.

Options:

- MemorySaver
- SQLite
- PostgreSQL

SQLite:

```python
SqliteSaver.from_conn_string(
    "sqlite:///checkpoints.db"
)
```

PostgreSQL:

```python
PostgresSaver.from_conn_string(
    DATABASE_URL
)
```

# Thread IDs

Thread IDs isolate conversations.

Example:

```python
config = {
    "configurable": {
        "thread_id": "user-123"
    }
}
```

Without thread IDs, user state can collide.

# Durable Execution

Durable execution means workflows can resume after failure.

Instead of:

Start Over

Use:

Resume From Checkpoint

# Human-in-the-Loop

Humans can review and modify workflows.

Useful for:

- Approvals
- Compliance
- Risky decisions

Example:

Agent → Human Review → Continue

# Interrupts

Interrupts pause execution.

```python
from langgraph.graph import interrupt
```

```python
interrupt(
    "Review before continuing"
)
```

Execution resumes later from the same state.

# Input and Output Schemas

Schemas define expected inputs and outputs.

Input:

```python
class InputSchema(TypedDict):
    query: str
```

Output:

```python
class OutputSchema(TypedDict):
    answer: str
    confidence: float
```

Benefits:

- Validation
- Consistency
- Better APIs

# Structured Outputs

Avoid parsing raw text.

Example:

```python
class Evaluation(BaseModel):
    score: int
    summary: str
```

```python
llm.with_structured_output(
    Evaluation
)
```

Returns validated objects.

# Graph Visualization

Large graphs become difficult to understand.

Visualization helps reveal:

- Nodes
- Routes
- Parallel paths
- Loops

Example:

```python
graph.get_graph()
```

# Error Handling

Production systems require resilience.

Example:

```python
try:
    result = perform_work()
except Exception as e:
    return {
        "error": str(e)
    }
```

Use fallbacks whenever possible.

# LangSmith

LangSmith provides observability.

Tracks:

- Execution traces
- Tool calls
- Token usage
- Latency
- Errors

Useful for debugging and evaluation.

# Supervisor Pattern

A supervisor coordinates specialists.

Example:

Supervisor
→ Resume Agent
→ Interview Agent
→ Roadmap Agent

Supervisor collects and combines results.

# Swarm Pattern

No central controller.

Agents communicate directly.

Example:

Travel Agent ↔ Hotel Agent ↔ Budget Agent

Benefits:

- Flexible
- Decentralized

Drawbacks:

- Harder to debug
- More complex routing

# Production Best Practices

Keep nodes focused.

Use TypedDict.

Use structured outputs.

Enable checkpointing.

Monitor costs and latency.

Prefer async execution for I/O-bound workloads.

Validate inputs before execution.

Use thread IDs correctly.

# Final Mental Model

Everything in LangGraph ultimately revolves around:

State
+
Nodes
+
Edges

Then build upward:

State
→ Memory
→ Agents
→ Tools
→ Routing
→ Multi-Agent Systems
→ Persistence
→ Production Workflows
