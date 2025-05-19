import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className='App-logo'>
          <text x="100" y="35" className="letter">E</text>
          <text x="165" y="100" className="letter">I</text>
          <text x="100" y="165" className="letter">T</text>
          <text x="35" y="100" className="letter">M</text>
        </svg>
      </header>

        <p>
          Welcome to the EITM client!
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const question = e.target.elements.text_to_explain.value;
            const model = e.target.elements.model_to_use.value;
            if (!question) {
              alert('Please enter a question.');
              return;
            }
            try {
              const response = await fetch('http://127.0.0.1:5000/api/explain', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'text_to_explain': question, 'model_to_use': model }),
              });

              const data = await response.json();
              const responseText = data.explanation;

              if (responseText) {
                document.querySelector('.App-output').innerHTML = responseText.replace(/\n/g, '<br>');
              } else {
                alert('No response received.');
              }
            } catch (error) {
              alert('Error: ' + error.message);
            }
          }}
          style={{ marginTop: '2rem' }}
        >
          <label htmlFor="text_to_explain">Ask a question:</label>
          <br />
          <textarea
            id="text_to_explain"
            name="text_to_explain"
            rows="4"
            cols="50"
            required
            style={{ marginTop: '0.5rem', marginBottom: '1rem' }}
          />
          <br />
          <input type="hidden" name="model_to_use" value="llama3.2:3b" />
          <button type="submit">Send</button>
        </form>
        <p style={{ marginTop: '2rem' }} class="App-output">
          
        </p>
    </div>
  );
}

export default App;
