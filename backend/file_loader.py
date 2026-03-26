from langchain_community.document_loaders import PyPDFLoader
from typing import List

def load_pdf(file_path: str):
    """ Loads and splits a PDF file into pages. """
    try:
        loader = PyPDFLoader(file_path)
        pages = loader.load_and_split()
        print(f"Loaded {len(pages)} pages from {file_path}")
        return pages
    except Exception as e:
        print(f"Error loading PDF {file_path}: {e}")
        return []
