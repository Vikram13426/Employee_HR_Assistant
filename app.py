from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os

from utils.pdf_reader import extract_text_from_pdf
from utils.chunk_text import chunk_text
from utils.vector_store import add_to_chroma, search_chroma
from utils.gemini_helper import ask_gemini

load_dotenv()

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload_pdf():
    file = request.files['pdf']

    if not file:
        return jsonify({'error': 'No file uploaded'})

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    text = extract_text_from_pdf(file_path)
    chunks = chunk_text(text)

    add_to_chroma(chunks)

    return jsonify({'message': 'PDF uploaded and processed successfully'})


@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.json
    question = data['question']

    relevant_chunks = search_chroma(question)

    context = "\n".join(relevant_chunks)

    answer = ask_gemini(question, context)

    return jsonify({'answer': answer})


if __name__ == '__main__':
    app.run(debug=True)