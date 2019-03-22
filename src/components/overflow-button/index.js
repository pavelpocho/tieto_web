import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';

export default class OverflowButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <button className="overflow-button" ripplecolor="gray" onClick={() => {this.props.onClick(); this.props.menu.close()}}>
                <i className="material-icons">{this.props.icon}</i>
                {this.props.text}
            </button>
        )
    }

}