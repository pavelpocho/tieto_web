import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';

export default class Spinner extends Component {

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        this.ref.current.style.height = this.props.size + "px";
        this.ref.current.style.width = this.props.size + "px";
        this.ref.current.style.position = this.props.position;
        if (this.props.position == "fixed" || this.props.position == "absolute") {
            this.ref.current.style.left = "50%";
            this.ref.current.style.top = "50%";
            this.ref.current.style.marginLeft = - this.props.size / 2 + "px";
            this.ref.current.style.marginTop = - this.props.size / 2 + "px";
        }
    }

    render() {
        return (
            <div className="loader" ref={this.ref}>
                <svg className="circular-loader" viewBox="25 25 50 50" >
                    <circle className="loader-path" cx="50" cy="50" r="20" fill="none" stroke="#62B3E4" strokeWidth={this.props.size < 50 ? "6" : "3"} />
                </svg>
            </div>
        )
    }
    
}