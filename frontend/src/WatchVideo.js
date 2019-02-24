import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styled from "styled-components";

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
export default class WatchVideo extends Component {

    render() {
        return (
            <NavBar>
                <Link to=''>
                    <TitleDiv>
                        <TitleText>
                            storytime WV
                        </TitleText>
                    </TitleDiv>
                </Link>
            </NavBar>
        )
    }

}