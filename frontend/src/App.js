import React, {Component} from 'react';
import styled from 'styled-components';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import StoryTime from './StoryTime';
import Typing from 'react-typing-animation';
import VideoFeed from './VideoFeed';
import WatchVideo from './WatchVideo';
import Particles from 'react-particles-js';

const HomeContainer = styled.div`
    height: 100vh;
`;

const TitleDiv = styled.div`
    height: 50vh;
    background-color: #ffffff;
    position: relative;
    z-index:1000;
`;
const TitleText = styled.div`
    font-family: Saira;
    font-weight: 800;
    font-size: 12em;
    text-align: center;
    padding-top: 7%;
    z-index: 1000;
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
    z-index: 1000;
`;

const ButtonText = styled.h2`
    opacity: 0;
    border: solid 1px;
    border-color: #fff;
    display: inline-block
    padding: 0.4% 3.4% ;
    border-radius: 5%;
    margin: 1%;
    color: #fff;
    font-family: Tajawal;
    font-weight: 800;
    font-size:2em;
    animation: buttonAppear 3.5s ease-in;
    animation:
    buttonAppear 1.5s ease-in;
    animation-delay: 2.35s;
    animation-fill-mode: forwards;
 @keyframes buttonAppear {
     from {opacity: 0}
     to {opacity: 100}
    }
    &:hover {
    background: #fff;
    color: #000;
    }
`;
const DescriptionText = styled.h2`
    margin: 0 auto;
    color: #000000;
    font-family: Tajawal;
    font-weight: 800;
    font-size: 3em;
    text-align: center;
    z-index: 1000;
`;
const ParticleDiv = styled.div`
    position: absolute;
    height: 100%;
    width:100%
    z-index: 50000;
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
                    <ParticleDiv>
                        <Particles
                            params={
                                {
                                    "particles": {
                                        "number": {
                                            "value": 30,
                                            "density": {
                                                "enable": true,
                                                "value_area": 800
                                            }
                                        },
                                        "color": {
                                            "value": "#234569"
                                        },
                                        "shape": {
                                            "type": "circle",
                                            "stroke": {
                                                "width": 3,
                                                "color": "#336b57"
                                            },
                                            "polygon": {
                                                "nb_sides": 5
                                            },
                                            "image": {
                                                "src": "img/github.svg",
                                                "width": 100,
                                                "height": 100
                                            }
                                        },
                                        "opacity": {
                                            "value": 0.5,
                                            "random": false,
                                            "anim": {
                                                "enable": false,
                                                "speed": 1,
                                                "opacity_min": 0.1,
                                                "sync": false
                                            }
                                        },
                                        "size": {
                                            "value": 1.008530152163807,
                                            "random": true,
                                            "anim": {
                                                "enable": false,
                                                "speed": 40,
                                                "size_min": 0.1,
                                                "sync": false
                                            }
                                        },
                                        "line_linked": {
                                            "enable": true,
                                            "distance": 150,
                                            "color": "#234569",
                                            "opacity": 0.4,
                                            "width": 1
                                        },
                                        "move": {
                                            "enable": true,
                                            "speed": 6,
                                            "direction": "none",
                                            "random": false,
                                            "straight": false,
                                            "out_mode": "out",
                                            "bounce": false,
                                            "attract": {
                                                "enable": false,
                                                "rotateX": 600,
                                                "rotateY": 1200
                                            }
                                        }
                                    },
                                    "interactivity": {
                                        "detect_on": "canvas",
                                        "events": {
                                            "onhover": {
                                                "enable": true,
                                                "mode": "grab"
                                            },
                                            "onclick": {
                                                "enable": true,
                                                "mode": "repulse"
                                            },
                                            "resize": true
                                        },
                                        "modes": {
                                            "grab": {
                                                "distance": 400,
                                                "line_linked": {
                                                    "opacity": 1
                                                }
                                            },
                                            "bubble": {
                                                "distance": 400,
                                                "size": 40,
                                                "duration": 2,
                                                "opacity": 8,
                                                "speed": 3
                                            },
                                            "repulse": {
                                                "distance": 200,
                                                "duration": 0.4
                                            },
                                            "push": {
                                                "particles_nb": 4
                                            },
                                            "remove": {
                                                "particles_nb": 2
                                            }
                                        }
                                    },
                                    "retina_detect": true
                                }
                            }
                        />
                    </ParticleDiv>
                    <TitleText>
                        storytime
                    </TitleText>
                </TitleDiv>
                <DescriptionDiv>
                    <DescriptionText>
                        <Typing
                            speed={50}
                        >
                            <span>We bring your stories to life.</span>
                        </Typing>

                    </DescriptionText>
                </DescriptionDiv>
                <ButtonDiv>
                    <Link to={'/StoryTime'}>
                        <ButtonText>
                            Start
                        </ButtonText>
                    </Link>
                    <Link to={'/VideoFeed'}>
                        <ButtonText>
                            Stories
                        </ButtonText>
                    </Link>
                </ButtonDiv>
            </HomeContainer>
        );
        return (
            <Router>
                <div>
                    <Route exact path='' component={Home}/>
                    <Route exact path='/StoryTime' component={StoryTime}/>
                    <Route exact path='/VideoFeed' component={VideoFeed}/>
                    <Route exact path='/Story/:id' component={WatchVideo}/>
                </div>
            </Router>
        );
    }
}
