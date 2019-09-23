import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';

export default class Overlay extends Component {

    constructor(props) {
        super(props);
        
        this.div = React.createRef();

    }

    render() {

        return (
            <div ref={this.div} className="overlay" style={this.props.opacity ? {opacity: "0.4"} : {}} onClick={() => {this.props.onClick()}}></div>
        )

    }
    
}