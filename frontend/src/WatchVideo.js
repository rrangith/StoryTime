import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styled from "styled-components";
import axios from "axios";

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
const CaptionText = styled.h3`
    text-align: center;
    font-family: Tajawal;
    font-weight: 400;
    padding-right: 3%;
`;

const ImageDiv = styled.div`
    margin: 1%;
`;
const StoryPic = styled.img`
height: 270px
max-width: none;
min-width: 270px;
margin:3%

`;

export default class WatchVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pictures: [],
            storyID:'',

        }
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        console.log(id);
        axios.get(`/api/story/${id}`).then((response) => {
            this.setState({
                pictures: response.data.data,
                storyID: id,
            })
        })

    }

    render() {
        let pics = this.state.pictures;
        let audURL = "https://storytime.tech/api/audio"+ this.state.storyID;
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
                </NavBar>
                <PictureContainer>
                    {pics.map((row, index) => {
                            return (
                                <PictureRow key={index}>
                                    {pics[index].map((imgObj, index) => {
                                        return (
                                            <ImageDiv>
                                                <StoryPic src={imgObj.image} key={index} height="300" width="250"/>
                                                <CaptionText>{imgObj.text}</CaptionText>
                                                <audio
                                                    src={audURL}
                                                    type="audio/webm"
                                                    controls>
                                                </audio>
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
        )
    }

}
