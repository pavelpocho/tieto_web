import css from './index.css';
import React, { Component } from 'react';
import logo from '../../../assets/images/trippi_logo_540p.png';
import logoDark from '../../../assets/images/trippi_logo_dark_540p.png';
import ObjectContainer from '../../utils/object-container';

export default class Logo extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <img id="logo-main" src={ObjectContainer.isDarkTheme() ? logoDark : logo} height="56" width="99" />
        )
        
    }

}