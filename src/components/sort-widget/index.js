import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import Overlay from '../overlay';

export default class SortWidget extends Component {

    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        }
    }

    toggleExpansion() {
        this.setState((prevState) => {
            return {
                expanded: !prevState.expanded
            }
        })
    }

    render() {
        return (
            <Fragment>
                <div className="sw-master">
                    <div className="sort-widget-wrap">
                        <p className="sort-widget-title">SORT BY:</p>
                        <p className="sort-widget-selected">DATE</p>
                        <button className="sort-widget-expand" ripplecolor="gray" onClick={() => {this.toggleExpansion()}}><i className={this.state.expanded ? "material-icons arrow rotated" : "material-icons arrow"}>arrow_drop_down</i></button>
                    </div>
                    {
                        this.state.expanded ? (
                            <Overlay onClick={() => {this.toggleExpansion()}}/>
                        ) : null
                    }
                    <div className={this.state.expanded ? "sw-choice-wrap" : "sw-choice-wrap no-height"}>
                        <button className="sw-choice" ripplecolor="gray">STATUS</button>
                        <button className="sw-choice" ripplecolor="gray">MONEY</button>
                    </div>
                </div>
            </Fragment>
        )
    }

}