import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';

import CodeEditor from '@uiw/react-textarea-code-editor';

const TextBox = () => {
  const [response, setResponse] = useState('');
  const [inputValue, setInputValue] = useState('');

  const handleClick = async () => {
    try {
      const result = await axios.post((API_URL + "execute_query"), {input: inputValue}); // Pass the input value as a query parameter
      setResponse(result.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="text-center">  
      <h2>Query execution</h2>
      <CodeEditor
        value={inputValue}
        language="sql"
        placeholder="Please enter SQL query."
        onChange={handleInputChange}
        padding={15}
        minHeight={500}
        style={{
          fontSize: 18,
          //backgroundColor: "#f5f5f5",
          fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        }}
      />
      <br />
      <button onClick={handleClick}>Send query</button>
      <br />
      <br />
      <br />
      {response.length > 1 ? 
      <div>
        <h3>Result</h3>
        <div style={{ height: '500px', overflow: 'auto'}}>
        <table style={{ width: '80%', tableLayout: 'fixed', border: 'solid', marginLeft: 'auto', marginRight: 'auto'}}>
          <thead style={{border: 'solid'}}>
            <tr style={{border: 'solid'}}>
              <th style={{border: 'solid'}}>input</th>
              <th style={{border: 'solid'}}>output</th>
            </tr>
          </thead>
          <tbody>
            {response.map(([column1, column2], index) => (
              <tr key={index} style={{border: 'solid'}}>
                <td style={{border: 'solid'}}>{column1}</td>
                <td style={{border: 'solid'}}>{column2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div></div> : <div/> }
    </div>
    
  );
};

export default TextBox;