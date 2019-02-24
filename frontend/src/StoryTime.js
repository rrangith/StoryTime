import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Webcam from 'react-webcam';
import axios from 'axios';
import styled from 'styled-components';
import SpeechRecognition from 'react-speech-recognition'
import Button from '@material-ui/core/Button';
import KeyboardVoiceIcon from "@material-ui/icons/KeyboardVoice";
import {ReactMic} from 'react-mic';

const NavBar = styled.div`
    height: 8vh;
    background-color: #234569;
    position: relative;
`;

const TitleDiv = styled.div`
    display: inline-block;
    flex-direction: row;
`;

const TitleText = styled.div`
    font-family: Saira;
    font-weight: 800;
    font-size: 2em;
    color: #fff;
    padding-left:5%;
    display: inline-block;
`;
const VideoFeedText = styled.div`
    font-family: Saira;
    font-weight: 800;
    font-size: 2em;
    color: #fff;
    display: inline-block;
    margin-right: 2%;
`;
const Invisible = styled.div`
  opacity:1;
  display: flex;
  justify-content: center;
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
margin:3%

`;

const MicDiv = styled.div`
    display: flex;
    justify-content: center;
`;

const ButtonDiv = styled.div`
    height: 25vh;
    text-align:center;
    position: relative;
`;

const CamMicScriptContainer = styled.div`
    margin-top: 0;
    display: flex;
    flex-direction: row;
    margin-left:3%;
    margin-top: 3%;
`;
const CamMicDiv = styled.div`
    display: flex;
    flex-direction: column;
    float:left;
    margin-right: 3%;
`;
const TranscriptText = styled.h1`
    font-family:Tajawal;
    font-weight: 400;
    padding-right: 3%;
`;
const CaptionText = styled.h4`
    font-family:Tajawal;
    font-weight: 400;
    padding-right: 3%;
`;

const ImageDiv = styled.div`
    margin: 1%;
`;

const VideoFeed = styled.div`
    float: right;
`;

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
        axios.post('/api/getImage', {
            image: imageSrc, text: this.state.text
        }).then((response) => {
            let storypic = {
                image: response.data,
                text: this.state.text,
            };
            if (storypic.image === "Image not found") {
                this.props.resetTranscript();
                this.setState({text: ''});
            } else {
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
            }
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
      this.props.stopListening();
      this.setState({
          record: false
      });

    };

  onStop = (recordedBlob) => {
      let formData = new FormData();
      formData.append("data", JSON.stringify(this.state.images));
      formData.append("audio", recordedBlob.blob);
      axios.post('/api/save', formData, {
          headers: {'Content-Type': 'multipart/form-data'}
      }).then((response) => {
          console.log(response);
      });
      console.log('recordedBlob is: ', recordedBlob);
    };

    componentDidMount() {
      setInterval(this.compareLastTranscript, 500);
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
                                storytime
                            </TitleText>
                        </TitleDiv>
                    </Link>
                    <VideoFeed>
                        <Link to='/VideoFeed'>
                            <VideoFeedText>
                                videos
                            </VideoFeedText>
                        </Link>
                    </VideoFeed>
                </NavBar>
                <CamMicScriptContainer>
                    <CamMicDiv>
                        <Invisible>
                            <Webcam
                                height={320}
                                screenshotFormat="image/jpeg"
                                ref={this.setRef}
                            />
                        </Invisible>
                        <MicDiv>
                            <ReactMic
                                record={this.state.record}
                                className="sound-wave"
                                onStop={this.onStop}/>
                        </MicDiv>
                        <ButtonDiv>
                            <Button onClick={this.stopRecording} type="button" variant="contained" color="secondary">
                                <KeyboardVoiceIcon/>
                                stop
                            </Button>
                        </ButtonDiv>
                    </CamMicDiv>
                    <TranscriptText> {transcript} </TranscriptText>
                </CamMicScriptContainer>
                <PictureContainer>
                    {pics.map((row, index) => {
                            return (
                                <PictureRow key={index}>
                                    {pics[index].map((imgObj, index) => {
                                        return (
                                            <ImageDiv>
                                                <StoryPic src={imgObj.image} key={index} height="300" width="250"/>
                                                <CaptionText>{imgObj.text}</CaptionText>
                                            </ImageDiv>
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

export default SpeechRecognition(App);
