import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import TripPreviewState from '../trip-preview-state';
import OverflowMenu from '../overflow-menu';

export default class TripPreview extends Component {

    constructor(props) {
        super(props); 
    }

    overflow() {
        this.props.container.openDialog(<OverflowMenu key="overflow-menu" container={this.props.container}/>);
    }

    render() {

        return (
            <div className="trip-preview-wrap">
                <div className="trip-preview-left">
                    <TripPreviewState />
                    <div className="trip-preview-text-wrap">
                        <p className="trip-preview-title">Title</p>
                        <p className="trip-preview-purpose">Purpose</p>
                    </div>
                </div>
                <div className="trip-preview-right">
                    <div className="trip-preview-text-wrap margin">
                        <p className="trip-preview-date">18.1.2019</p>
                        <p className="trip-preview-money">700 CZK</p>
                    </div>
                    <button className="trip-preview-button" ripplecolor="gray"><i className="material-icons">local_printshop</i></button>
                    <button className="trip-preview-button" ripplecolor="gray" onClick={() => {this.overflow()}}><i className="material-icons">more_vert</i></button>
                </div>
            </div>
        )

    }

}