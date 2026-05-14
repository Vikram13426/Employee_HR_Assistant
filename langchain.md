



---
# LANGCHAIN - COMPONENTS - WORKFLOW

## What is LangChain?

**LangChain** is an open-source framework that makes it easier to build applications powered by Large Language Models (LLMs).

It allows developers to connect LLMs with external data, tools, memory, and workflows — turning basic LLMs into powerful, production-ready applications.

Popular Use Cases:
- Chatbots with document knowledge (RAG)
- Intelligent agents that use tools
- Automated workflows
- Question-answering systems

---

## Why LangChain is Needed

Directly using an LLM has major limitations:
- No access to your private documents
- No memory of past conversations
- Cannot call external APIs or tools
- Prone to hallucinations

LangChain solves these problems by providing modular, reusable components.

---

## Core Architecture

```text
User Input
    ↓
Prompt Template
    ↓
Memory / Retriever / Tools
    ↓
LLM
    ↓
Output Parser
    ↓
Final Output
```

---

## Key Concepts

### 1. Prompt Templates
Reusable prompts with dynamic inputs.

```python
from langchain.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template(
    "Answer the question based on context:\n\n{context}\n\nQuestion: {question}"
)
```

### 2. Models (LLMs)
Supports multiple providers:

```python
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatOpenAI(model="gpt-4o-mini")
# llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro")
```

### 3. LCEL (LangChain Expression Language)
Modern way to build chains using the `|` operator.

```python
chain = prompt | llm | output_parser
```

### 4. Runnables
Every component (prompt, llm, retriever, parser) behaves as a **Runnable** with methods like:
- `.invoke()` 
- `.stream()`
- `.batch()`
- `.ainvoke()`

---

## RAG (Retrieval Augmented Generation) — Most Important Pattern

**RAG** = Retrieval + Generation

It allows LLMs to answer questions using **your own data** instead of just trained knowledge.

### RAG Workflow

1. Load documents (PDF, TXT, Web, etc.)
2. Split documents into chunks
3. Convert chunks into embeddings
4. Store embeddings in Vector Database
5. Retrieve relevant chunks for a user query
6. Pass context + question to LLM
7. Generate accurate response

---

## Essential Components

| Component              | Purpose                                   | Common Tools                          |
|------------------------|-------------------------------------------|---------------------------------------|
| Document Loaders       | Load data from files/websites             | PyPDFLoader, WebBaseLoader            |
| Text Splitters         | Break documents into chunks               | RecursiveCharacterTextSplitter        |
| Embeddings             | Convert text to vectors                   | OpenAI, Google Generative AI          |
| Vector Stores          | Store and search vectors                  | Chroma, FAISS, Pinecone               |
| Retrievers             | Fetch relevant chunks                     | vectorstore.as_retriever()            |
| Output Parsers         | Structure LLM output                      | StrOutputParser, JsonOutputParser     |

---

## Simple RAG Chain Example

```python
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

chain = (
    {
        "context": retriever,
        "question": RunnablePassthrough()
    }
    | prompt
    | llm
    | StrOutputParser()
)

response = chain.invoke("What is the company leave policy?")
```

---

## Memory

Used in chat applications to maintain conversation history.

Common types:
- `ConversationBufferMemory` — Stores full history
- `ConversationSummaryMemory` — Summarizes conversation

---

## Agents & Tools

**Agents** go beyond fixed chains. The LLM decides which tools to use and in what order.

Useful when the task is dynamic (e.g., "Search latest news and summarize").

---

## Streaming & Async Support

```python
# Streaming response
for chunk in chain.stream("Your question"):
    print(chunk, end="")

# Async
response = await chain.ainvoke("Your question")
```

---

## Advantages of LangChain

- Clean, modular code structure
- Works with almost all major LLMs
- Excellent RAG and Agent support
- Built-in streaming and async
- Large ecosystem and community
- Production-ready features

---

## Best Practices

- Start with **RAG** projects
- Use **LCEL** (`|` syntax) instead of old chains
- Choose **Chroma** for local vector store when learning
- Keep chunk size between 400–800 tokens
- Always test with different embedding models

---

**LangChain** has become the standard framework for building LLM applications. Once you understand LCEL and RAG, you can build powerful AI solutions efficiently.


```

