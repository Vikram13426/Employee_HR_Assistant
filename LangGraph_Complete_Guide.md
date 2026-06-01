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

In reality, state is the foundation.

A useful way to think about state is:

State = Shared Information

Every node can read from it.

Every node can update it.

## Consider a food delivery application.

The system needs to track:

Order ID
Customer Name
Restaurant
Payment Status
Delivery Status

These values must remain accessible throughout the workflow.

A state may look like:

{
    "order_id": "101",
    "restaurant": "Pizza Hut",
    "payment_status": "Paid",
    "delivery_status": "Preparing"
}

Whenever a node executes, it receives this state.

The node may return updates.

Example:

{
    "delivery_status": "Out for Delivery"
}

LangGraph merges the update into the current state.

Example:

```python
class State(TypedDict):
    query: str
    answer: str
```

Every node reads state and updates state.

State acts as the central memory of the workflow.

## Why State Exists

Without state, each node would need to pass information manually.

Example:

result1 = node1(data)

result2 = node2(
    result1,
    other_information
)

result3 = node3(
    result2,
    additional_data
)

As workflows grow, this becomes difficult to manage.

State provides a central storage mechanism.

Instead of passing dozens of variables between functions, everything lives in one shared structure.

# TypedDict

TypedDict provides structure to state.

LangGraph commonly uses TypedDict for state definitions.

Example:

```python
from typing import TypedDict

class State(TypedDict):
    query: str
    answer: str
```

Why not use a normal dictionary?

Because TypedDict provides structure.

Without it:

state["answr"]

This typo may go unnoticed.

With TypedDict, editors and type checkers can detect mistakes.

Large projects become easier to maintain.



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
   
## Node Lifecycle

Every node follows the same pattern.

#### Step 1:

Receive current state.

state

#### Step 2:

Read required information.

query = state["query"]

#### Step 3:

Perform computation.

answer = llm.invoke(query)

#### Step 4:

Return updates.

return {
    "answer": answer
}

LangGraph then merges the update into state.

## Types of Nodes

Although LangGraph treats everything as a node, different nodes usually serve different purposes.

#### Processing Nodes

Transform data.

Example:
```python
def clean_text(state):
    ...
```    
#### LLM Nodes

Call language models.

Example:
```python
def assistant(state):
    response = llm.invoke(
        state["messages"]
    )

    return {
        "messages": [response]
    }
```   

#### Tool Nodes

Execute tools.

Example:

search_tool()
calculator_tool()
database_tool()

#### Routing Nodes

Decide where execution should continue.

Example:

```python
def route(state):
    ...
```    

#### Human Review Nodes

Pause execution for approval.

Example:
```python
interrupt(
    "Review before continuing"
)
```

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

Most LangGraph applications involve conversations.

When building chatbots, agents, copilots, customer support systems, or AI assistants, we need to continuously maintain conversation history.

Consider this interaction:

User: What is Python?

Assistant: Python is a programming language.

User: Who created it?

The second question depends on the first conversation.

The AI must understand that:

it = Python

To achieve this, previous messages must be stored somewhere.

This is where messages become important.

Message Structure

In LangGraph, a conversation is represented as a collection of messages.

Conceptually:

[
    {
        "role": "user",
        "content": "What is Python?"
    },
    {
        "role": "assistant",
        "content": "Python is a programming language."
    }
]

Every message contains information about:

->Who sent it
->What was sent
->Additional metadata

Why Messages Matter

Most modern chat models do not maintain memory themselves.

The model only knows what we provide during the current request.

If we send:

llm.invoke(
    "Who created it?"
)

the model has no idea what "it" means.

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
The Problem Reducers Solve

Suppose we have:

class State(TypedDict):
    results: list

Now imagine two nodes execute simultaneously.

Node A returns:

{
    "results": ["Python"]
}

Node B returns:

{
    "results": ["LangGraph"]
}

Question:

Which value should survive?

Possibilities:

["Python"]

or

["LangGraph"]

Both are problematic because one result disappears.

We need a mechanism for combining updates.

This mechanism is called a reducer.

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



LangGraph itself does not generate text.

Language models do.

LangGraph simply orchestrates execution.

Think of it like:

LangGraph = Workflow Engine

LLM = Intelligence
What is a Chat Model?

A chat model is an interface to an LLM.

Example:

from langchain_openai import ChatOpenAI
llm = ChatOpenAI(
    model="gpt-4"
)

Now:

response = llm.invoke(
    messages
)

sends messages to the model.

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

Eventually every serious AI application needs external information.

A model may know:

What Python is

but not:

Current weather
Latest stock price
Your database contents
Today's news

External information requires tools.
What is a Tool?

A tool is simply a function.

Example:

@tool
def get_weather(
    city: str
):
    return "28°C"

Nothing magical.

Just a function with metadata.

# Tool Binding

Tools are attached to models.

Example:

llm_with_tools =
    llm.bind_tools(
        tools
    )

Now the model knows:

Available Tools:
- get_weather
- calculator
- search

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
Example

User asks:

What's the weather in Bangalore?

Agent thinks:

I need weather information.

Agent acts:

Call weather tool

Tool returns:

28°C

Agent thinks again:

Now I can answer.

Final response:

The current temperature is 28°C.

# Agents

Many beginners assume an agent is some special AI object.

In reality, an agent is simply a workflow that can:

Observe information
Make decisions
Use tools
Update state
Continue execution until a goal is achieved

An agent is not a separate type of model.

An agent is usually a combination of:

LLM
+
State
+
Tools
+
Decision Logic

working together.

An agent combines:

- LLM
- State
- Tools
- Decision-making


## Anatomy of an Agent

An agent usually consists of:

User Input
      ↓
State
      ↓
LLM
      ↓
Decision
      ↓
Tool Calls
      ↓
State Update
      ↓
Next Decision

The process repeats until the task is complete.

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
Now the model can decide:

Answer directly

or

Call a tool

This is where agents become powerful

Agents observe, think, act, and continue until a goal is achieved.

# Conditional Edges

## What is a Conditional Edge?

A conditional edge decides:

Where should execution go next?

based on state.

Instead of:

builder.add_edge(
    "agent",
    "tool"
)

we use:

builder.add_conditional_edges(...)

The next node is determined dynamically.

Conditional edges create dynamic routing.
## Example

Imagine:

Payment Success?

If payment succeeds:

Ship Product

If payment fails:

Cancel Order

Workflow:

Check Payment
       ↓
    Decision
    /      \
   /        \
Ship      Cancel

This is a conditional route.
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

## Limitation of Conditional Edges

Conditional edges work well when:

Rules are known beforehand

Example:

if query_contains_billing:
    goto_billing

But what if routing requires understanding natural language?

Example:

I need somewhere affordable to stay
while visiting Paris.

Should this go to:

Travel Agent?
Hotel Agent?
Budget Advisor?

Keyword matching becomes unreliable.

This leads us to the Command Pattern.

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

## Why Multi-Agent Systems Exist

Consider building a Career Guidance Platform.

One agent handling everything may need knowledge about:

Resume Analysis
Job Market
Skill Gap Analysis
Interview Preparation
Learning Roadmaps

This becomes difficult.

Instead:

Resume Agent

Roadmap Agent

Interview Agent

Market Research Agent

Each specializes in one task.


Benefits:

- Separation of concerns
- Easier maintenance
- Better scalability

## State Sharing Between Agents

An important question:

How do agents communicate?

The answer:

Shared State

Every agent can read:

state

and update:

state

Example:

{
    "resume_analysis": "...",
    "skill_gaps": "...",
    "roadmap": "..."
}

Agent A may fill one field.

Agent B may fill another.

Eventually all information contributes to the final response.



# Parallel Execution

One of LangGraph's biggest advantages is parallel execution.

Imagine a Career Guidance Agent.

To generate recommendations it may need:

Resume Analysis
Job Market Analysis
Skill Gap Analysis

Sequential execution:

Resume
 ↓
Market
 ↓
Skill Gap

Total time:

3 Tasks = 3 Units

Parallel execution:

        Resume
       /
Start
       \
        Market

       \
        Skill Gap

Total time:
≈ 1 Unit

because tasks run simultaneously.



Benefits:

- Faster execution
- Better resource usage

# Fan-Out and Fan-In

Fan-Out:

Fan-Out means:

One Input
     ↓
Multiple Executions

Example:

Resume
 ↓
Extract Skills
 ↓
Analyze Each Skill

Graph:

            Python
           /
Input -----
           \
            SQL

           \
            Java

One state becomes multiple branches.

One input becomes many executions.

Fan-In:

After parallel execution we usually need to combine results.

This process is called Fan-In.

      Python Analysis
            \
             \
              Merge
             /
      SQL Analysis

All branches converge into one node.


Many executions merge into one result.

Common pattern:

Input → Parallel Processing → Merge

## Fan-Out + Fan-In Together

This pattern appears everywhere.

          Input
            ↓

     ┌──────┼──────┐

     ↓      ↓      ↓

     A      B      C

     └──────┼──────┘

            ↓

         Merge

This is one of the most common LangGraph architectures.



# Async Execution

Most LangGraph workloads are I/O bound.

Examples:

LLM Calls
API Calls
Database Queries
File Reads

These operations spend most of their time waiting.

Async execution allows other work to continue during this waiting period.

Async execution improves throughput.

Synchronous:

```python
graph.invoke(state)
```
Execution blocks until completion.

Asynchronous:

```python
await graph.ainvoke(state)
```
Execution does not block.

Other requests can be processed simultaneously.

Async Nodes

Nodes can also be asynchronous.

Example:

async def assistant(state):

    response = await llm.ainvoke(
        state["messages"]
    )

    return {
        "messages": [response]
    }

LangGraph automatically handles async execution.

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
Instead of waiting for the entire workflow:

Step 1
Step 2
Step 3
Step 4

results are emitted as execution progresses.

Step 1 Complete

Step 2 Complete

Step 3 Complete

Users receive feedback immediately.

Streaming provides updates as execution progresses.

Modes:

- values
- updates
- messages

# Choosing Between invoke(), batch(), and abatch()

Use:

invoke()

when processing one input.

Use:

batch()

when processing multiple inputs synchronously.

Use:

abatch()

when processing many inputs concurrently.

# Memory

Memory means retaining information across executions.

Two types:

- Short-term memory
- Long-term memory

Short-term memory usually lives in state.

Long-term memory requires persistence.

# Checkpointing



Checkpointing is the mechanism used to save graph state.

Think of it like saving progress in a game.

Example:

Level 1 Complete
 ↓
Checkpoint Saved
 ↓
Level 2 Complete
 ↓
Checkpoint Saved

If the game crashes:

Resume From Last Checkpoint

not from the beginning.

LangGraph works similarly.

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

## Why Persistence Exists

Imagine a workflow running for:

20 Minutes

After 18 minutes:

Server Crash

Without persistence:

Start From Beginning

All progress is lost.

With persistence:

Resume From Last Checkpoint

Most work is preserved.

This capability is called:

Durable Execution

and is one of LangGraph's biggest strengths.

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

Once memory is introduced, another problem appears.

Suppose three users interact simultaneously.

User A

User B

User C

How does LangGraph know which memory belongs to whom?

The answer is:

Thread ID

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

Not every decision should be made automatically.

Examples:

Refund Approval

Medical Recommendation

Legal Review

Financial Decision

Sometimes a human must review results before execution continues.

This concept is called:

Human-in-the-Loop

Useful for:

- Approvals
- Compliance
- Risky decisions

Example:

Agent → Human Review → Continue

# Interrupts

Interrupts pause execution.
Interrupts

LangGraph provides:

interrupt()

to pause execution.

Example:

```python
from langgraph.graph import interrupt
```

```python
def review_node(state):

    interrupt(
        "Review before continuing"
    )

    return state
```

Execution stops at this point.

Execution resumes later from the same state.

## Resuming Execution

After review:

Approve

or

Modify State

Execution can continue from the exact pause point.

This is possible because checkpointing preserved the workflow.

## Human Modification of State

Humans are not limited to approval.

They can modify state.

Example:

Before review:

{
    "refund_amount": 50000
}

Reviewer changes:

{
    "refund_amount": 10000
}

Execution resumes using the updated value.

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

Once applications become larger, developers need visibility.

Questions arise:

 Why did the agent call this tool?

 Why did routing go here?

 How many tokens were used?

 Where did the failure occur?

LangSmith helps answer these questions.

## What is LangSmith?

LangSmith is the observability platform for LangChain and LangGraph applications.

Think of it as:

Monitoring Dashboard
+
Debugger
+
Evaluation Platform

for AI systems.

Useful for debugging and evaluation.

## LangSmith Tracks

Execution Traces

State Changes

Tool Usage

Token Consumption

Latency

Failures

This visibility is critical for production systems.

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
