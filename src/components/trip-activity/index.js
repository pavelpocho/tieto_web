import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import { RippleManager } from '../ripple';
import SaveIndicator from '../save-indicator';
import TripReceipt from '../trip-receipt';
import PointSelector from '../point-selector';

export default class TripActivity extends Component {

    constructor(props) {
        super(props);

        this.ref = React.createRef();
    }

    componentDidMount() {
        RippleManager.setUp();
        setTimeout(() => {
            this.ref.current.style.transform = "translateX(0px)";
            this.ref.current.style.opacity = "1";
        }, 50);
    }

    close() {
        this.ref.current.style.opacity = "0";
        this.ref.current.style.transform = "translateX(40px)";
        this.props.container.closeLastActivity();
    }

    render() {

        return (
            <div className="activity" id="trip-activity" ref={this.ref}>
                <div className="top-bar">
                    <button ripplecolor="gray" onClick={() => {this.close()}} className="back-button"><i className="material-icons back-icon">arrow_back</i>Trip list</button>
                    <SaveIndicator />
                </div>
                <div className="receipt-content">
                    <TripReceipt />
                </div>
                <div className="middle-content">
                    <PointSelector />
                </div>
            </div>
        )

    }

}