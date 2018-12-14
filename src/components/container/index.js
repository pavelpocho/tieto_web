import css from './index.css';
import React, { Component, Fragment } from 'react';
import ObjectContainer from '../../utils/object-container';
import Background from '../background';

export default class Container extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activityHistory: [],
            transitioningForward: false,
            transitioningBackward: false
        }

    }

    openActivity(activity) {
        this.setState((prevState) => {

            var a = prevState.activityHistory;
            a.push(activity);

            return {
                activityHistory: a
            }

        })
    }

    render() {

        const appName = ObjectContainer.getHttpCommunicator().getAppName();

        return (
            <Fragment>
                <Background />
                {
                    this.state.activityHistory[this.state.activityHistory.length - 1]
                }
            </Fragment>
        )
        
    }

}
