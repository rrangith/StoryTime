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

const ButtonDiv = styled.div`
    height: 15vh;
    background-color: #fff;
    margin: 0;
    padding-top: 1%;
    padding-bottom: 5%;
    text-align: center;
        position: relative;
`;

const DescriptionDiv = styled.div`
    height: 35vh;
    background-color: #234569;
    text-align:center;
    color: #ffffff;
    padding-top: 5%;
        position: relative;
    
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

    constructor(props){
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
                <ButtonDiv>
                    <DescriptionText>
                        <Typing
                            startDelay='50ms'
                        >
                            <span>We bring your stories to life.</span>
                        </Typing>

                    </DescriptionText>
                </ButtonDiv>
                <DescriptionDiv>
                    Click me
                </DescriptionDiv>
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


