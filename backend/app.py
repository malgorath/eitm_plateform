# ~/eitm_platform/backend/app.py

import os
import requests # For making HTTP requests to Ollama
from flask import Flask, request, jsonify
from flask_cors import CORS # For handling Cross-Origin Resource Sharing
from dotenv import load_dotenv # For loading environment variables from .env file

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure CORS
# This allows your React frontend (running on a different port)
# to make requests to this backend.
# For development, allowing all origins is fine.
# For production, you'd restrict this to your frontend's domain.
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Retrieve Ollama API base URL from environment variables
# Default to http://localhost:11434 if not set
OLLAMA_API_BASE = os.getenv("OLLAMA_API_BASE", "http://localhost:11434")
# We can also retrieve the OpenAI API key if we plan to use it later
# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

@app.route('/')
def home():
    """
    Home route to check if the server is running.
    """
    return jsonify({"message": "EITM Backend is running!"}), 200

@app.route('/api/explain', methods=['POST'])
def explain_topic():
    """
    API endpoint to receive a topic/text and return an explanation from an LLM.
    """
    try:
        # Get the data from the POST request
        data = request.get_json()
        if not data or 'text_to_explain' not in data:
            return jsonify({"error": "Missing 'text_to_explain' in request body"}), 400
        if not data or 'model_to_use' not in data:
            return jsonify({"error": "Missing 'model_to_use' in request body"}), 400


        text_to_explain = data['text_to_explain']
        model_to_use = data.get('model_to_use', 'llama3.2:3b') # Default model
        # Optional: Get other parameters like persona, explanation style, etc.
        # persona = data.get('persona', 'a helpful assistant')

        # --- Placeholder for LLM Interaction ---
        # Here we will interact with the Ollama API
        
        ollama_api_url = f"{OLLAMA_API_BASE}/api/generate"
        
        # Construct the prompt for the LLM
        # You can customize this prompt extensively
        prompt = f"Explain the following topic or text in a clear and simple way: \"{text_to_explain}\""

        payload = {
            "model": model_to_use,
            "prompt": prompt,
            "stream": False  # Set to True if you want to stream the response
        }

        headers = {
            "Content-Type": "application/json"
        }

        # Make the request to Ollama
        # It's good practice to add error handling for the request
        response = requests.post(ollama_api_url, json=payload, headers=headers)
        response.raise_for_status() # Raises an HTTPError for bad responses (4XX or 5XX)

        response_data = response.json()
        explanation = response_data.get("response", "Sorry, I couldn't generate an explanation at this time.")
        # ------------------------------------

        return jsonify({
            "original_text": text_to_explain,
            "explanation": explanation,
            "model_used": model_to_use
        }), 200

    except requests.exceptions.RequestException as e:
        # Handle network errors or errors from the Ollama API
        app.logger.error(f"Ollama API request failed: {e}")
        return jsonify({"error": f"Failed to communicate with LLM service: {str(e)}"}), 503 # Service Unavailable
    except Exception as e:
        # Handle any other unexpected errors
        app.logger.error(f"An unexpected error occurred: {e}")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


if __name__ == '__main__':
    # Runs the Flask development server.
    # Debug=True enables auto-reloading when code changes and provides helpful error messages.
    # Host='0.0.0.0' makes the server accessible from any network interface (important for VMs/containers).
    # Port can be changed if 5000 is in use.
    app.run(host='0.0.0.0', port=5000, debug=True)
