import React, {Component} from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import styled from 'styled-components';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    }
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();

    axios.get('http://localhost:5000/getImage', {
      params: {image: imageSrc, text: this.state.text}
    }).then((response) => {
      console.log(response);
    });
  }

  render() {
    return (
        <div>
            <Webcam height={350} width={400} screenshotFormat="image/jpeg" ref={this.setRef}/>
        </div>
    );
  }
}
