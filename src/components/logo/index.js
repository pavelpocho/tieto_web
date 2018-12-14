import css from './index.css';
import React, { Component } from 'react';
import logo from '../../../assets/images/trippi_logo_540p.png';

export default class Logo extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <img id="logo-main" src={logo} height="62" width="110" />
        )
        
    }

}