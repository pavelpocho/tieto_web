import css from './index.css';
import React, { Component, Fragment } from 'react';
import ObjectContainer from '../../utils/object-container';

export default class Container extends Component {

    constructor(props) {
        super(props);


    }

    render() {

        const appName = ObjectContainer.getHttpCommunicator().getAppName();

        return (
            <p>Hello world, my name is {appName}</p>
        )
        
    }

}
