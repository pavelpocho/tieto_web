import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import TripActivity from '../trip-activity';

export default class MainButton extends Component {

    constructor(props) {
        super(props);
    }

    newTrip() {
        this.props.activity.newTrip();
    }

    render() {
        return (
            <button className="main-button-wrap" onClick={() => {this.newTrip()}}>{this.props.text.toUpperCase()}</button>
        )
    }

}