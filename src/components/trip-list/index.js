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
            <div className="trip-list">
                {
                    (displayEmpty) ? (
                        <Fragment>
                            <p className="no-trips-text">No trips in your list right now</p>
                        </Fragment>
                    ) : (
                        this.props.children
                    )
                }
            </div>
        )
    }

}