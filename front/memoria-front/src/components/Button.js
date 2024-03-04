import React, { useState } from 'react';
import axios from 'axios';

import { API_URL } from "../constants";

const Button = () => {
  const [response, setResponse] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  const handleClick = async () => {
    try {
      const result = await axios.post((API_URL + "create_graph"), {data: selectedValue}); 
      setResponse(result.data);
      console.log(result)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div className="text-center">
       <select value={selectedValue} onChange={handleSelectChange}>
        <option value="" disabled={true}>Select predefined graph</option>
        <option value="connected_components">connected_components</option>
        <option value="eulerian_circuit">eulerian_circuit</option>
        <option value="eulerian_circuit2">eulerian_circuit2</option>
        <option value="mst">mst</option>
        <option value="topological_sorting">topological_sorting</option>
        <option value="max_matching">max_matching</option>
        <option value="max_matching2">max_matching2</option>
        <option value="planarity_testing">planarity_testing</option>
      </select>
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