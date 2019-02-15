import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import MainButton from '../main-button';

export default class PointSelector extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="point-selector-wrap">
                <div className="point-list">
                    
                </div>
                <div className="export-wrap">
                    <MainButton text="Export"/>
                </div>
            </div>
        )
    }

}