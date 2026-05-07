import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=api_key)

model = genai.GenerativeModel('gemini-2.5-flash')



def ask_gemini(question, context):
    prompt = f"""
    You are an HR assistant.

    Use the provided context to answer the employee question.

    Context:
    {context}

    Question:
    {question}
    """

    response = model.generate_content(prompt)

    return response.text