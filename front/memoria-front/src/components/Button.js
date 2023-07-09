import React, { useState } from 'react';
import axios from 'axios';

import { API_URL } from "../constants";

const Button = () => {
  const [response, setResponse] = useState('');

  const handleClick = async () => {
    try {
      const result = await axios.get((API_URL + "create_graph")); // Replace '/api/data' with your API endpoint URL
      setResponse(result); // Update the state with the response data
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="text-center">
      <button onClick={handleClick}>Generate Graph from LDBC dataset</button>
      <p>{response}</p>
      
    </div>
  );
};

export default Button;