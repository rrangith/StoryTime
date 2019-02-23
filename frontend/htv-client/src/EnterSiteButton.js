import React, {Component} from 'react';
import styled from 'styled-components';

export default class EnterSiteButton extends Component {

    getInitialState : function () {
        return({hidden : "hidden"});
    },
    componentWillMount : function () {
        var that = this;
        setTimeout(function() {
            that.show();
        }, that.props.wait);
    },
    show : function () {
        this.setState({hidden : ""});
    },
    render : function () {
        return (
            <div className={this.state.hidden}>
                <p>Child</p>
            </div>
        )
    }
    render() {
        return (
            <div>
                HI
            </div>
        );
    }
}