import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Webcam from 'react-webcam';
import axios from 'axios';
import styled from 'styled-components';

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
                <NavBar>
                    <Link to=''>
                        <TitleDiv>
                            <TitleText>
                                storify
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
