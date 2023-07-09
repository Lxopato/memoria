import React, { Component, Fragment } from "react";
import Header from "./components/Header";
import Button from "./components/Button";
import TextBox from "./components/TextBox";
import NumberInputComponent from "./components/NumberInputComponent";


class App extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <Button />
        <NumberInputComponent />
        <TextBox />
        
      </Fragment>
    );
  }
}

export default App;