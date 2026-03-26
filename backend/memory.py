from typing import List, Dict

# Simple in-memory chat history
chat_history: Dict[str, List[Dict[str, str]]] = {}

def save_message(user_id: str, role: str, message: str):
    """ Saves a message to the user's chat history. """
    if user_id not in chat_history:
        chat_history[user_id] = []
    chat_history[user_id].append({"role": role, "content": message})

def get_history(user_id: str) -> List[Dict[str, str]]:
    """ Retrieves the chat history for a specific user. """
    return chat_history.get(user_id, [])

def clear_history(user_id: str):
    """ Clears the chat history for a specific user. """
    chat_history[user_id] = []
