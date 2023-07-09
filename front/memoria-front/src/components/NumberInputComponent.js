import React, { useState } from 'react';
import axios from 'axios';

import { API_URL } from '../constants';

const NumberInputComponent = () => {
  const [response, setResponse] = useState([]);
  const [inputValue, setInputValue] = useState('');
  //setResponse([])
  const handleClick = async () => {
    try {
      const result = await axios.post((API_URL + "create_graph"), {input: inputValue}); // Pass the input value as a query parameter
      setResponse(result.data);
      console.log(result)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="text-center">
        <label>
            Number of vertices in topology:
        </label>
        <input
            value={inputValue}
            onChange={handleInputChange}/>
        <button onClick={handleClick}>Generate random graph</button>
        <br />
        <br />
        {response.length > 1 ? <div style={{ height: '500px', overflow: 'auto'}}>
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
      </div> : <div/> }
      <br />
    </div>
  );
};

export default NumberInputComponent;