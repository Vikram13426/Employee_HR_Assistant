# Employee HR Assistant — RAG-Based HR Policy & Offer Letter Explainer

An AI-powered HR Assistant built using Flask, ChromaDB, Gemini API, PyMuPDF, and Sentence Transformers with a complete Retrieval-Augmented Generation (RAG) workflow.

This project allows users to upload HR policy documents and employee offer letters in PDF format and ask questions related to company policies, benefits, leave policies, probation period, salary structure, notice period, and more.

The system retrieves relevant information from uploaded documents using semantic similarity search and generates intelligent answers using Gemini AI.

---

# Project Objective

In many organizations, employees struggle to understand lengthy HR documents and offer letters. Searching manually through PDFs is time-consuming and inefficient.

This project solves that problem by creating an AI assistant capable of:

- Understanding HR documents
- Retrieving relevant information
- Answering employee questions intelligently
- Providing document-based responses instead of generic AI answers

The project demonstrates the practical implementation of:

- Retrieval-Augmented Generation (RAG)
- Vector Databases
- Embeddings
- Semantic Search
- AI Chatbot Development

---

# What is RAG?

RAG stands for:

## Retrieval-Augmented Generation

Instead of directly sending the entire PDF to the AI model, the system:

1. Extracts text from PDFs
2. Splits text into smaller chunks
3. Converts chunks into embeddings
4. Stores embeddings inside a vector database
5. Retrieves relevant chunks during search
6. Sends retrieved context + user question to Gemini AI
7. Gemini generates a final contextual answer

This improves:
- Accuracy
- Context-awareness
- Response relevance
- Hallucination reduction

---

# RAG Workflow

```text
PDF Upload
   ↓
Text Extraction (PyMuPDF)
   ↓
Chunking
   ↓
Embedding Generation
   ↓
Store Embeddings in ChromaDB
   ↓
User Question
   ↓
Convert Question to Embedding
   ↓
Semantic Similarity Search
   ↓
Retrieve Relevant Chunks
   ↓
Send Context + Question to Gemini
   ↓
Generate Final Answer
```

---

# Technologies Used

## Backend
- Flask
- Python

## AI & RAG
- Gemini API
- Sentence Transformers
- ChromaDB

## PDF Processing
- PyMuPDF

---

# Core Components

## 1. PDF Reader

Extracts text from uploaded PDF documents using PyMuPDF.

---

## 2. Chunking

Large text is divided into smaller chunks for efficient retrieval and embedding generation.

---

## 3. Embeddings

Text chunks are converted into numerical vector representations using Sentence Transformers.

These embeddings capture semantic meaning.

---

## 4. ChromaDB Vector Database

Stores embeddings and performs semantic similarity search.

When a user asks a question, ChromaDB retrieves the most relevant chunks.

---

## 5. Gemini AI

Receives:
- User question
- Retrieved document context

Then generates an intelligent HR-related answer.

---

# Project Structure

```bash
hr_policy_explanier/
│
├── app.py
├── requirements.txt
├── .env
├── README.md
│
├── uploads/
├── chroma_db/
│
├── utils/
│   ├── chunk.py
│   ├── gemini_helper.py
│   ├── pdf_reader.py
│   └── vectorstore.py
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── script.js
```

---

# Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/your-username/Employee_HR_Assistant.git
```

```bash
cd Employee_HR_Assistant
```

---

# 2. Create Virtual Environment

## Windows

```bash
python -m venv venv
```

```bash
venv\Scripts\activate
```

## Mac/Linux

```bash
python3 -m venv venv
```

```bash
source venv/bin/activate
```

---

# 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

# 4. Create `.env` File

Create a `.env` file in the root directory.

```env
GEMINI_API_KEY=your_gemini_api_key
```

Get free Gemini API key from:

https://aistudio.google.com/app/apikey

---

# 5. Run the Application

```bash
python app.py
```

---

# 6. Open Browser

```bash
http://127.0.0.1:5000
```

---

# Example Questions

- What is the leave policy?
- Explain probation period.
- What benefits are included?
- Is work from home allowed?
- What is the notice period?
- Explain salary structure.

---

# Learning Outcomes

This project helps in understanding:

- Retrieval-Augmented Generation (RAG)
- Vector Databases
- Embeddings
- Semantic Search
- Flask Backend Development
- AI Chatbot Systems
- PDF Text Extraction
- Prompt Engineering
- Gemini API Integration

---

# Future Improvements

- Multi-document support
- Chat history
- Authentication system
- Better chunking strategy
- Hybrid search
- Streaming AI responses
- Conversation memory

---

# Author

Vicky  
Final Year B.Tech CSE Student

---

# License

This project is open-source and intended for educational purposes.
