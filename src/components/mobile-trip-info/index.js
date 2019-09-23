import css from './index.css';
import React, { Component, Fragment } from 'react';
import ObjectContainer from '../../utils/object-container';

export default class MobileTripInfo extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="mobile-info-wrap">
                <div className="mobile-info-section">
                    <p className={"mobile-info-section-title" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Trip Name:</p>
                    <p className={"mobile-info-section-text" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>{(this.props.tripName == "" || this.props.tripName == undefined) ? <i>Unnamed Trip</i> : this.props.tripName}</p>
                </div>
                <div className="mobile-info-section">
                    <p className={"mobile-info-section-title" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Purpose:</p>
                    <p className={"mobile-info-section-text" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>{(this.props.purpose == "" || this.props.purpose == undefined) ? <i>No Purpose</i> : this.props.purpose}</p>
                </div>
                <div className="mobile-info-section">
                    <p className={"mobile-info-section-title" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Project {"&"} Task:</p>
                    <p className={"mobile-info-section-text" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>{(!this.props.project || !this.props.task) ? <i>Incomplete Info</i> : (this.props.project + "|" + this.props.task)}</p>
                </div>
                <button className={"mobile-info-button" + (ObjectContainer.isDarkTheme() ? " dark" : "")} ripplecolor="gray" onClick={() => {this.props.onClick()}}><i className="material-icons">edit</i>Edit</button>
            </div>
        )
    }

}