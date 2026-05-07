# HR AI Assistant — Employee Offer Letter & HR Policy Explainer

A modern AI-powered HR assistant web application built using Flask, ChromaDB, Gemini API, and PyMuPDF.

This project allows users to upload HR policy documents and offer letters in PDF format, store them using vector embeddings, and ask intelligent HR-related questions using a Retrieval-Augmented Generation (RAG) workflow.

---

# Features

- Upload HR policy and offer letter PDFs
- Extract text from PDFs using PyMuPDF
- Store vector embeddings in ChromaDB
- AI-powered HR chatbot using Gemini API
- Retrieval-Augmented Generation (RAG)
- Modern futuristic SaaS-style UI
- Glassmorphism dark theme
- Drag-and-drop PDF upload
- Typing animations and toast notifications
- Responsive desktop and mobile UI
- Beginner-friendly clean project structure

---

# Tech Stack

## Backend
- Flask
- Python
- ChromaDB
- PyMuPDF
- Gemini API

## Frontend
- HTML
- CSS
- JavaScript

## AI & Vector Search
- Gemini AI
- Sentence Transformers
- ChromaDB

---

# Project Structure

```bash
hr-ai-assistant/
│
├── app.py
├── requirements.txt
├── .env
│
├── chroma_db/
├── uploads/
│
├── utils/
│   ├── pdf_reader.py
│   ├── chunk_text.py
│   ├── vector_store.py
│   └── gemini_helper.py
│
├── static/
│   ├── style.css
│   └── script.js
│
├── templates/
│   └── index.html
│
└── README.md
```

---

# How the RAG Workflow Works

## Step 1
User uploads HR PDFs.

## Step 2
PyMuPDF extracts text from the uploaded PDF.

## Step 3
The extracted text is split into smaller chunks.

## Step 4
Embeddings are generated using Sentence Transformers.

## Step 5
Embeddings are stored in ChromaDB.

## Step 6
User asks an HR-related question.

## Step 7
Relevant chunks are retrieved from ChromaDB.

## Step 8
Retrieved context + user question are sent to Gemini AI.

## Step 9
Gemini generates an intelligent HR response.

---

# Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/your-username/hr-ai-assistant.git
```

```bash
cd hr-ai-assistant
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

Create a `.env` file in the root folder.

```env
GEMINI_API_KEY=your_gemini_api_key
```

Get your free Gemini API key from:

https://aistudio.google.com/app/apikey

---

# 5. Run the Application

```bash
python app.py
```

---

# 6. Open in Browser

```bash
http://127.0.0.1:5000
```

---

# Sample Questions

- What is the leave policy?
- Explain the probation period.
- What benefits are included?
- What is the notice period?
- Is work from home allowed?
- What are the working hours?

---

# Requirements

```txt
flask
python-dotenv
google-generativeai
chromadb
pymupdf
sentence-transformers
```

---

# UI Features

- Dark futuristic dashboard
- Glassmorphism UI
- Blue-purple gradients
- Responsive design
- Drag-and-drop upload
- Real-time chat interface
- AI typing animation
- Floating toast notifications
- Smooth hover effects

---

# Future Improvements

- Multiple PDF upload
- Authentication system
- Chat history
- Voice assistant
- Download chat as PDF
- Admin dashboard
- Better chunking strategy
- PDF preview support

---

# Learning Concepts Covered

This project helps beginners learn:

- Flask backend development
- REST APIs
- Vector databases
- Retrieval-Augmented Generation (RAG)
- Embeddings
- PDF text extraction
- Gemini API integration
- AI chatbot workflows
- Frontend UI development
- ChromaDB integration

---

# Screenshots

Add your project screenshots here after pushing to GitHub.

---

# Author

Vicky

Final Year B.Tech CSE Student

---

# License

This project is open-source and free to use for learning purposes.

