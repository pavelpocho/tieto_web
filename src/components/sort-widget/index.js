import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import Overlay from '../overlay';
import { RippleManager } from '../ripple';

export default class SortWidget extends Component {

    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        }
    }

    componentDidUpdate() {
        RippleManager.setUp();
    }

    toggleExpansion() {
        this.setState((prevState) => {
            return {
                expanded: !prevState.expanded
            }
        })
    }

    setSortBy(t) {
        this.props.parent.setSortBy(t);
        this.toggleExpansion();
    }

    render() {
        return (
            <Fragment>
                <div className="sw-master">
                    <div className="sort-widget-wrap">
                        <button className={"sort-widget-expand" + (ObjectContainer.isDarkTheme() ? " dark" : "")} ripplecolor="gray" onClick={() => {this.toggleExpansion()}}>
                            <p className={"sort-widget-title" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Sort by:</p>
                            <p className={"sort-widget-selected" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>{this.props.position == 0 ? "Date" : this.props.position == 1 ? "Money" : "Status"}</p>
                            <i className={this.state.expanded ? "material-icons arrow rotated" : "material-icons arrow"}>arrow_drop_down</i>
                        </button>
                    </div>
                    {
                        this.state.expanded ? (
                            <Overlay onClick={() => {this.toggleExpansion()}}/>
                        ) : null
                    }
                    <div className={(this.state.expanded ? "sw-choice-wrap" : "sw-choice-wrap no-height") + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                        <button className={"sw-choice" + (ObjectContainer.isDarkTheme() ? " dark" : "")} ripplecolor="gray" onClick={() => {this.setSortBy(2)}}>Status</button>
                        <button className={"sw-choice" + (ObjectContainer.isDarkTheme() ? " dark" : "")} ripplecolor="gray" onClick={() => {this.setSortBy(1)}}>Money</button>
                        <button className={"sw-choice" + (ObjectContainer.isDarkTheme() ? " dark" : "")} ripplecolor="gray" onClick={() => {this.setSortBy(0)}}>Date</button>
                    </div>
                </div>
            </Fragment>
        )
    }

}