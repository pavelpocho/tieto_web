import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import TripActivity from '../trip-activity';

export default class MainButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <button className="main-button-wrap" onClick={() => {this.props.onClick()}}>{this.props.text.toUpperCase()}</button>
        )
    }

}