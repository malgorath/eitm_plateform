// ~/eitm_platform/frontend/eitm-client/src/App.jsx

import React, { useState } from 'react';
import axios from 'axios'; // For making API calls

function App() {
  // State variables
  const [textToExplain, setTextToExplain] = useState('');
  const [modelToUse, setModelToUse] = useState('phi3:mini-4k-instruct'); // Default model, matches backend
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [originalText, setOriginalText] = useState(''); // To display the text that was explained

  // API endpoint for the backend
  const API_URL = 'http://localhost:5000/api/explain'; // Or your server's IP if backend is remote

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    if (!textToExplain.trim()) {
      setError('Please enter some text to explain.');
      return;
    }

    setIsLoading(true);
    setError('');
    setExplanation('');
    setOriginalText(textToExplain); // Store the text being explained

    try {
      const payload = {
        text_to_explain: textToExplain,
        model_to_use: modelToUse,
      };
      // Make the POST request to the backend
      const response = await axios.post(API_URL, payload);

      // Set the explanation from the API response
      if (response.data && response.data.explanation) {
        setExplanation(response.data.explanation);
      } else {
        setError('Received an unexpected response from the server.');
      }
    } catch (err) {
      // Handle errors from the API call
      if (err.response && err.response.data && err.response.data.error) {
        setError(`Error: ${err.response.data.error}`);
      } else if (err.request) {
        setError('Error: No response received from the server. Is it running?');
      } else {
        setError(`Error: ${err.message}`);
      }
      console.error("API call failed:", err);
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  // Get the current year for the footer
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <header className="w-full max-w-3xl mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-sky-400 mb-2">
          Explain It To Me (EITM)
        </h1>
        <p className="text-slate-400 text-lg">
          Get clear and simple explanations for complex topics using AI.
        </p>
      </header>

      <main className="w-full max-w-3xl bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="textToExplain" className="block text-sm font-medium text-sky-300 mb-1">
              Enter text or topic to explain:
            </label>
            <textarea
              id="textToExplain"
              name="textToExplain"
              rows="5"
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 placeholder-slate-500 text-slate-200 resize-none"
              placeholder="e.g., What is quantum entanglement? or paste a paragraph here..."
              value={textToExplain}
              onChange={(e) => setTextToExplain(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="modelToUse" className="block text-sm font-medium text-sky-300 mb-1">
              Select Model (or leave default):
            </label>
            <select
              id="modelToUse"
              name="modelToUse"
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-slate-200"
              value={modelToUse}
              onChange={(e) => setModelToUse(e.target.value)}
              disabled={isLoading}
            >
              <option value="phi3:mini-4k-instruct">Phi-3 Mini 4K Instruct (Default)</option>
              <option value="llama3:8b-instruct">Llama 3 8B Instruct</option>
              <option value="qwen:1.8b-chat">Qwen 1.8B Chat</option>
              <option value="gemma:2b-instruct">Gemma 2B Instruct</option>
            </select>
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                        ${isLoading ? 'bg-sky-700 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500'}
                        transition-colors duration-150 ease-in-out`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Explaining...
              </div>
            ) : (
              'Explain It!'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-700/30 border border-red-500 text-red-300 rounded-md">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {explanation && !isLoading && (
          <div className="mt-8 pt-6 border-t border-slate-700">
            <h2 className="text-2xl font-semibold text-sky-400 mb-3">Explanation:</h2>
            {originalText && (
              <div className="mb-4 p-4 bg-slate-700/50 rounded-md">
                <p className="text-sm text-slate-400 mb-1">You asked about:</p>
                <p className="text-slate-300 italic">{originalText}</p>
              </div>
            )}
            <div className="prose prose-invert prose-sm sm:prose-base max-w-none bg-slate-700 p-4 rounded-md shadow whitespace-pre-wrap">
              {explanation}
            </div>
            <p className="text-xs text-slate-500 mt-2 text-right">Explained using: {modelToUse}</p>
          </div>
        )}
      </main>

      <footer className="w-full max-w-3xl mt-12 text-center text-slate-500 text-sm">
        <p>&copy; {currentYear} EITM Platform. Built by Scott Sanders.</p>
      </footer>
    </div>
  );
}

export default App;
