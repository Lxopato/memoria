import React, { useState } from 'react';
import axios from 'axios';

import { API_URL } from "../constants";

const Button = () => {
  const [response, setResponse] = useState('');

  const handleClick = async () => {
    try {
      const result = await axios.get((API_URL + "create_graph")); // Replace '/api/data' with your API endpoint URL
      setResponse(result.data); // Update the state with the response data
      console.log(result)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="text-center">
      <button onClick={handleClick}>Generate predefined graph</button>
      <p>{response.length > 1 ? <div style={{ height: '500px', overflow: 'auto'}}>
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
      </div> : <div/> }</p>
      
    </div>
  );
};

export default Button;