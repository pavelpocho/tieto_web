import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';

export default class TripList extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var displayEmpty = true;
        for (var i = 0; i < this.props.children.length; i++) {
            if (this.props.children[i] != null) {
                displayEmpty = false;
                break;
            }
        }
        return (
            <div className="trip-list" style={this.props.noEmpty ? {marginBottom: "0px"} : {}}>
                {
                    (displayEmpty && !this.props.noEmpty) ? (
                        <Fragment>
                            <p className="no-trips-text">You don't have any trips yet :[</p>
                        </Fragment>
                    ) : (displayEmpty) ? (
                        null
                    ) : (this.props.noEmpty) ? (
                        <Fragment>
                        <p className={"trip-list-title" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Some Trips Need Your Attention</p>
                        {
                            this.props.children
                        }
                        <p className={"trip-list-title" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>You Other Trips</p>
                        </Fragment>
                    ) : (
                        this.props.children
                    )
                }
            </div>
        )
    }

}