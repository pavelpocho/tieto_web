import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';

export default class SaveIndicator extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="save-indicator">
                <p className="si-trip-name">Trip name</p>
                <div className="si-background">
                    <p className="si-state">Saved</p>
                    <i className="material-icons si-icon">done</i>
                </div>
            </div>
        )
    }

}