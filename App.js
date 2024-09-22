
import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import Multiselect from 'multiselect-react-dropdown';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [error, setError] = useState('');

  const options = ['Alphabets', 'Numbers', 'Highest lowercase alphabet'];

  // Handle input field change
  const handleInputChange = (e) => setJsonInput(e.target.value);

  // Handle form submit (call the backend)
  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);

      // Send POST request to the backend
      const response = await axios.post('http://localhost:5000/bfhl', {
        data: parsedData.data,
        file_b64: parsedData.file_b64 // Pass Base64 string if available
      });
      

      // Store the response
      setResponseData(response.data);
      setError('');
    } catch (err) {
      setError('Invalid JSON format or API error');
    }
  };

  // Handle dropdown selection
  const handleSelect = (selectedList) => setSelectedFilters(selectedList);

  // Filter the response based on dropdown selection
  const filterResponse = () => {
    if (!responseData) return null;

    let filteredData = {};
    if (selectedFilters.includes('Alphabets')) {
      filteredData['Alphabets'] = responseData.alphabets;
    }
    if (selectedFilters.includes('Numbers')) {
      filteredData['Numbers'] = responseData.numbers;
    }
    if (selectedFilters.includes('Highest lowercase alphabet')) {
      filteredData['Highest lowercase alphabet'] = responseData.highest_lowercase_alphabet;
    }

    return filteredData;
  };

  return (
    <div>
      <h1>Enter Data</h1>
      
      <textarea
        value={jsonInput}
        onChange={handleInputChange}
        placeholder="Enter valid JSON"
      />
      <button onClick={handleSubmit}>Submit</button>
      
      {error && <p>{error}</p>}
      
      {responseData && (
        <>
          <Multiselect
            options={options}
            selectedValues={selectedFilters}
            onSelect={handleSelect}
            onRemove={handleSelect}
            isObject={false}
          />
          <div>
            <h3>Filtered Response</h3>
            <pre>{JSON.stringify(filterResponse(), null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
