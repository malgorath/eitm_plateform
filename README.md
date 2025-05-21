# EITM Platform Project

This project is a full-stack application that provides explanations for topics or text using a Large Language Model (LLM) backend (Ollama) and a React-based frontend.

## Backend

- **Framework:** Flask (Python)
- **Main file:** [`backend/app.py`](backend/app.py)
- **Features:**  
  - `/api/explain` endpoint accepts POST requests with a topic/text and returns an explanation from an LLM (Ollama).
  - CORS enabled for frontend-backend communication.
- **Setup:**
  1. Create a virtual environment and activate it.
  2. Install dependencies:
     ```sh
     pip install -r backend/requirements.txt
     ```
  3. Set up a `.env` file in [backend](http://_vscodecontentref_/5) (optional, for custom Ollama API base URL).
  4. Run the backend:
     ```sh
     python backend/app.py
     ```
  5. The backend runs on `http://127.0.0.1:5000/` by default.

## Frontend

- **Framework:** React (Create React App)
- **Location:** [eitm-client](http://_vscodecontentref_/6)
- **Features:**  
  - Simple UI to submit a question/topic and display the LLM's explanation.
  - Communicates with the backend at `/api/explain`.
- **Setup:**
  1. Install dependencies:
     ```sh
     cd frontend/eitm-client
     npm install
     ```
  2. Start the development server:
     ```sh
     npm start
     ```
  3. The frontend runs on `http://localhost:3000/` by default.

## Usage

1. Start the backend server.
2. Start the frontend development server.
3. Open [http://localhost:3000](http://localhost:3000) in your browser.
4. Enter a topic or question and submit to receive an explanation from the LLM.

## Environment Variables

- **OLLAMA_API_BASE**: (optional) Set in [.env](http://_vscodecontentref_/7) to specify a custom Ollama API base URL. Defaults to `http://localhost:11434`.

## Development

- **Backend:** Modify [app.py](http://_vscodecontentref_/8) for API logic.
- **Frontend:** Modify files in [src](http://_vscodecontentref_/9) for UI changes.

## License

This project is for educational and demonstration purposes.