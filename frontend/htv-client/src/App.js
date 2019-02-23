import React, {Component} from 'react';
import styled from 'styled-components';
import {BrowserRouter as Router, Route,} from 'react-router-dom';
import StoryTime from './StoryTime';

const HomeContainer = styled.div`
  background-color: #123456;
  height: 100%;
  width: 100%;
  display: block;
`;


export default class App extends Component {
    render() {
        const Home = () => (
            <div>
                <h1>
                    kakashi senpai
                </h1>
            </div>
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


