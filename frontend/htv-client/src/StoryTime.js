import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom';
import Webcam from 'react-webcam';
import axios from 'axios';
import styled from 'styled-components';
import SpeechRecognition from 'react-speech-recognition'

const NavBar = styled.div`
    height: 8vh;
    background-color: #234569;
    position: relative;

`;
const TitleDiv = styled.div`
    display: inline-block;
`;
const TitleText = styled.div`
    font-family: Saira;
    font-weight: 800;
    font-size: 2em;
    color: #fff;
    display: inline-block;
    padding-left:15%;

`;

const Invisible = styled.div`
  opacity:1;
`;

const propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool
};

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
          text: '',
          canSendRequest: true
      };
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
      this.props.resetTranscript();
      this.setState({text: ''});
  }

  compareLastTranscript = () => {
    if (this.state.text === this.props.transcript) {
      if (this.state.canSendRequest) {
        this.capture();
        this.setState({canSendRequest: false})
      }
    } else {
      this.setState({text: this.props.transcript, canSendRequest: true});
    }
  }

  componentDidMount() {
    setInterval(this.compareLastTranscript, 750);
  }

  render() {
    const { transcript, resetTranscript, browserSupportsSpeechRecognition } = this.props;
    if (!browserSupportsSpeechRecognition) {
      return null;
    }
    return (
        <div>
            <NavBar>
                <Link to=''>
                    <TitleDiv>
                        <TitleText>
                            {transcript}
                        </TitleText>
                    </TitleDiv>
                </Link>
            </NavBar>
            <Invisible>
                <Webcam
                    height={350}
                    width={400}
                    screenshotFormat="image/jpeg"
                    ref={this.setRef}
                />
            </Invisible>
        </div>
    );
  }
}

App.propTypes = propTypes;

export default SpeechRecognition(App)
