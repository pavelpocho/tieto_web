import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import SortWidget from '../sort-widget';
import MainButton from '../main-button';
import { RippleManager } from '../ripple';
import TripList from '../trip-list';
import TripActivity from '../trip-activity';
import TripPreview from '../trip-preview';

export default class MainActivity extends Component {

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
        this.ref.current.style.transform = "translateX(-40px)";
    }

    newTrip() {
        this.close();
        this.props.container.openActivity(<TripActivity container={this.props.container} key="tripActivity" />);
    }

    render() {
        return (
            <div className="activity" id="main-activity" ref={this.ref}>
                <div className="content-wrap">
                    <div className="top-content-wrap">
                        <SortWidget />
                        <MainButton activity={this} text="New Trip"/>
                    </div>
                    <TripList container={this.props.container}>
                        <TripPreview container={this.props.container} />
                        <TripPreview container={this.props.container} />
                        <TripPreview container={this.props.container} />
                    </TripList>
                </div>
            </div>
        )
    }

}