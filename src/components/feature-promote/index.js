import css from './index.css';
import React, { Component, Fragment } from 'react';
import ObjectContainer from '../../utils/object-container';
import Spinner from '../spinner';
import Overlay from '../overlay';
import { RippleManager } from '../ripple';
import TripPreviewState from '../trip-preview-state';
import Scrollbar from '../scrollbar';

export default class FeaturePromote extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="feature-promote-wrap">
                <i className="material-icons feature-promote-icon">{this.props.icon}</i>
                <p className="feature-promote-title">{this.props.title}</p>
                <button onClick={() => {this.props.onClick()}}ripplecolor="gray" className={"feature-promote-button" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>{this.props.buttonText}</button>
            </div>
        )
        
    }

}