import chromadb
from sentence_transformers import SentenceTransformer

client = chromadb.PersistentClient(path='chroma_db')
collection = client.get_or_create_collection(name='hr_docs')

model = SentenceTransformer('all-MiniLM-L6-v2')


def add_to_chroma(chunks):
    for i, chunk in enumerate(chunks):
        embedding = model.encode(chunk).tolist()

        collection.add(
            ids=[str(i)],
            embeddings=[embedding],
            documents=[chunk]
        )



def search_chroma(query):
    query_embedding = model.encode(query).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=3
    )

    return results['documents'][0]