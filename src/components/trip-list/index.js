import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';

export default class TripList extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="trip-list">
                {
                    !this.props.children ? (
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