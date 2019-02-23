import React, {Component} from 'react';
import styled from 'styled-components';
import {BrowserRouter as Router, Route,} from 'react-router-dom';
import StoryTime from './StoryTime';
import Typing from 'react-typing-animation';

const HomeContainer = styled.div`
    height: 100vh;
`;

const TitleDiv = styled.div`
    height: 50vh;
    background-color: #ffffff;
    position: relative;
`;
const TitleText = styled.div`
    font-family: Saira;
    font-weight: 800;
    font-size: 12em;
    text-align: center;
    padding-top: 7%;
    
`;

const DescriptionDiv = styled.div`
    height: 20vh;
    background-color: #fff;
    margin: 0;
    padding-top: 1%;
    text-align: center;
    position: relative;
`;

const ButtonDiv = styled.div`
    
    height: 25vh;
    background-color: #234569;
    text-align:center;
    padding-top: 3.5%;
    position: relative;

    
`;
const ButtonText = styled.h2`
    opacity: 0;
    color: #fff;
    animation: buttonAppear 3.5s ease-in;
    animation: 
    buttonAppear 1.5s ease-in;
    animation-delay: 2.35s;
    animation-fill-mode: forwards;
 @keyframes buttonAppear {
     from {opacity: 0}
     to {opacity: 100}
    }    
`;
const DescriptionText = styled.h2`
    margin: 0 auto;
    color: #000000;
    font-family: Tajawal;
    font-weight: 800;
    font-size: 3em;
    text-align: center;
   
    

    
`;

export default class App extends Component {

    constructor(props) {
        super(props);
    };

    render() {
        const Home = () => (
            <HomeContainer>
                <TitleDiv>
                    <TitleText>
                        storify
                    </TitleText>
                </TitleDiv>
                <DescriptionDiv>
                    <DescriptionText>
                        <Typing
                            startDelay='50ms'
                        >
                            <span>We bring your stories to life.</span>
                        </Typing>

                    </DescriptionText>
                </DescriptionDiv>
                <ButtonDiv>
                    <ButtonText>
                        Click me
                    </ButtonText>
                </ButtonDiv>
            </HomeContainer>
        );
        return (
            <Router>
                <div>
                    <Route exact path='' component={Home}/>
                    <Route exact path='/StoryTime' component={StoryTime}/>
                </div>
            </Router>
        );
    }
}


