import css from './index.css';
import React, {Component, Fragment} from 'react';
import { RippleManager } from '../ripple';

export default class CitySuggestions extends Component {

    constructor(props) {
        super(props);

        this.wrap = React.createRef();
    }

    close() {
        this.wrap.current.style.opacity = "0";
    }

    componentDidMount() {
        RippleManager.setUp();
    }

    componentDidUpdate() {
        RippleManager.setUp();
    }

    select(i) {
        this.close();
        if (this.props.suggestions.length <= i) {
            console.log("No city suggestions, won't set anything");
        }
        this.props.parent.selectCity(this.props.suggestions[i]);
    }

    render() {

        if (this.props.suggestions == null || this.props.suggestions.length == 0) return null;

        return (
            <div ref={this.wrap} className="cs-wrap">
                {
                    this.props.suggestions.map((s, i) => {
                        return <button onClick={(e) => {this.select(i)}} ripplecolor="gray" key={i}><span>{s.name}</span><span className="country">{s.country.name}</span></button>
                    })
                }
            </div>
        )
        
    }

}