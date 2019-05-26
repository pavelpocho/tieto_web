import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import TripActivity from '../trip-activity';
import Spinner from '../spinner';

export default class MainButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <button disabled={this.props.disabled} className={"main-button-wrap" + (ObjectContainer.isDarkTheme() ? " dark" : "")} onClick={() => {this.props.onClick()}}>
                {this.props.spinner ? <Spinner color="white" size={24} position={"absolute"}/> : this.props.text.toUpperCase()}
            </button>
        )
    }

}