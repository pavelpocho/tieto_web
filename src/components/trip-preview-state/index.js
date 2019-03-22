import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';

export default class TripPreviewState extends Component {

    constructor(props) {
        super(props);

        this.ref = React.createRef();
    }

    componentDidMount() {
        this.ref.current.style.backgroundColor = this.props.status == 0 ? "#FAA519" : this.props.status == 1 ? "#338200" : "#FF4E0B";
    }

    componentDidUpdate() {
        this.ref.current.style.backgroundColor = this.props.status == 0 ? "#FAA519" : this.props.status == 1 ? "#338200" : "#FF4E0B";
    }

    render() {
        return (
            <div className="state-wrap" ref={this.ref}>
                <svg className="state-svg">
                    {
                        this.props.status == 0 ? (
                            <Fragment>
                                <line x1="22" y1="11" x2="22" y2="25" strokeWidth="3" stroke="white" strokeLinecap="round"></line>
                                <line x1="22" y1="25" x2="32" y2="25" strokeWidth="3" stroke="white" strokeLinecap="round"></line>
                            </Fragment>
                        ) : this.props.status == 1 ? (
                            <Fragment>
                                <line x1="14" y1="24" x2="20" y2="30" strokeWidth="3" stroke="white" strokeLinecap="round"></line>
                                <line x1="20" y1="30" x2="32" y2="18" strokeWidth="3" stroke="white" strokeLinecap="round"></line>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <line x1="23" y1="12" x2="23" y2="25" strokeWidth="3" stroke="white" strokeLinecap="round"></line>
                                <line x1="23" y1="32" x2="23" y2="32" strokeWidth="4" stroke="white" strokeLinecap="round"></line>
                            </Fragment>
                        )
                    }
                </svg>
            </div>
        )
    }

}