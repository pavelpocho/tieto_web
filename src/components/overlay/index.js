import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';

export default class Overlay extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="overlay" onClick={() => {this.props.onClick()}}></div>
        )

    }
    
}