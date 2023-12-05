import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';
import Form from './Form';

import CodeEditor from '@uiw/react-textarea-code-editor';

const TextBox = () => {
  const [response, setResponse] = useState('');
  const [inputValue, setInputValue] = useState('');

  const [f, setf] = useState('');
  const [T, setT] = useState('');
  const [Ti, setTi] = useState('');
  const [T0, setT0] = useState('');
  const [ALL, setALL] = useState('');
  const [A0, setA0] = useState('');
  const [Ar, setAr] = useState('');
  const [AAgg, setAAgg] = useState('');

  const formattedString = `
    WITH RECURSIVE ${f}(${T}, ${Ti}, ${T0}) AS (
      
      ${A0}
      
      UNION ${ALL}
      
      ${Ar}
      )
    ${AAgg}
  `;


  const handleClick = async () => {
    try {
      const result = await axios.post((API_URL + "execute_query"), { input: inputValue }); // Pass the input value as a query parameter
      setResponse(result.data);
      console.log(result.data)
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="text-center">
      <div>
        <Form
          f={f}
          setf={setf}
          T={T}
          setT={setT}
          Ti={Ti}
          setTi={setTi}
          T0={T0}
          setT0={setT0}
          ALL={ALL}
          setALL={setALL}
          A0={A0}
          setA0={setA0}
          Ar={Ar}
          setAr={setAr}
          AAgg={AAgg}
          setAAgg={setAAgg}
        />
      </div>
      <h2>Query execution</h2>
      <CodeEditor
        value={formattedString}
        language="sql"
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
      {response.query != null ? <div> {response.query.length > 1 ?
        <div>
          <h3>Query Result</h3>
          <div style={{ height: '500px', overflow: 'auto' }}>
            <table style={{ width: '80%', tableLayout: 'fixed', border: 'solid', marginLeft: 'auto', marginRight: 'auto' }}>
              <thead style={{ border: 'solid' }}>
                <tr style={{ border: 'solid' }}>
                  {response.colnames.map((column) => (<td style={{ border: 'solid' }}><div style={{ overflow: 'scroll', height: '40px' }}>{String(column)}</div></td>))}
                </tr>
              </thead>
              <tbody>
                {response.query.map((row, index) => (
                  <tr key={index} style={{ border: 'solid' }}>
                    {row.map((column) => (<td style={{ border: 'solid' }}><div style={{ overflow: 'scroll', height: '40px' }}>{String(column)}</div></td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <br />
          <br />
          <br />
          <div style={{ height: '500px', overflow: 'auto' }}>
            <h3>Query Analysis</h3>
              <textarea rows="30" cols="200">{response.analyze.join("\r\n")}</textarea>
          </div>
        </div> :
        <div />
      } </div> : <div />
      }
      <br />
      <br />
      <br />
    </div>

  );
};

export default TextBox;