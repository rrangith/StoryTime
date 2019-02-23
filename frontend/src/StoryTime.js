import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom';
import Webcam from 'react-webcam';
import axios from 'axios';
import styled from 'styled-components';
import SpeechRecognition from 'react-speech-recognition'
import {ReactMic} from 'react-mic';

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
const PictureContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 15%;
`;
const PictureRow = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 3%; 
`;
const StoryPic = styled.img`
    height: 270px
    max-width: none;
    min-width: 270px;
    margin:3%;
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
            canSendRequest: true,
            record: true,
            imageNum: 0,
            imageRow: 0,
            images: []
        };
    }

    setRef = webcam => {
        this.webcam = webcam;
    };

    capture = () => {
        const imageSrc = this.webcam.getScreenshot();
        axios.post('http://localhost:5000/getImage', {
            image: imageSrc, text: this.state.text
        }).then((response) => {
            let storypic = {
                image: response.data,
                text: this.state.text,
            };
            let tmp = this.state.images;
            let newRow = this.state.imageRow;
            if (this.state.imageNum % 3 === 0) {
                tmp.push([]);
            } else if (this.state.imageNum % 3 === 2) {
                newRow += 1;
            }
            tmp[this.state.imageRow].push(storypic);
            console.log(response);
            console.log(this.state.images);
            this.props.resetTranscript();
            this.setState({
                text: '',
                images: tmp,
                imageRow: newRow,
                imageNum: this.state.imageNum + 1,
            });
        });

    };

    compareLastTranscript = () => {
        if (this.state.text === this.props.transcript) {
            if (this.state.canSendRequest) {
                this.capture();
                this.setState({canSendRequest: false})
            }
        } else {
            this.setState({text: this.props.transcript, canSendRequest: true});
        }
    };

    stopRecording = () => {
        this.setState({
            record: false
        });
    };

    onStop(recordedBlob) {
        let formData = new FormData();
        formData.append("data", "[]");
        formData.append("audio", recordedBlob.blob);
        axios.post('http://localhost:5000/save', formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        }).then((response) => {
            console.log(response);
        });
        console.log('recordedBlob is: ', recordedBlob);
    };

    componentDidMount() {
        setInterval(this.compareLastTranscript, 750);
    }

    render() {
        const {transcript, resetTranscript, browserSupportsSpeechRecognition} = this.props;
        if (!browserSupportsSpeechRecognition) {
            return null;
        }
        let pics = this.state.images;
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
                <ReactMic
                    record={this.state.record}
                    className="sound-wave"
                    onStop={this.onStop}/>
                <button onClick={this.stopRecording} type="button">Stop</button>
                <br/>
                <PictureContainer>
                    {pics.map((row, index) => {
                            return (
                                <PictureRow key={index}>
                                    {pics[index].map((imgObj, index) => {
                                        return (
                                            <StoryPic src={imgObj.image} key={index} height="300" width="250"/>
                                        );
                                    })
                                    }

                                </PictureRow>
                            )
                        }
                    )
                    }
                </PictureContainer>
            </div>
        );
    }
}

App.propTypes = propTypes;

export default SpeechRecognition(App)
