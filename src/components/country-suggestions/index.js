import css from './index.css';
import React, {Component, Fragment} from 'react';
import ObjectContainer from '../../utils/object-container';
import { RippleManager } from '../ripple';
import Spinner from '../spinner';

export default class CountrySuggestions extends Component {

    constructor(props) {
        super(props);

        this.wrap = React.createRef();
        this.content = React.createRef();
        this.state = {
            ignoreAuto: false
        }
    }

    close() {
        if (this.wrap && this.wrap.current) this.wrap.current.style.opacity = "0";
    }

    componentDidMount() {
        RippleManager.setUp();
    }

    componentDidUpdate() {
        RippleManager.setUp();
        if (this.wrap.current) {
            this.wrap.current.onmouseover = () => {
                this.setState({
                    ignoreAuto: true
                });
            }
            this.wrap.current.onmouseout = () => {
                this.setState({
                    ignoreAuto: false
                });
            }
            setTimeout(() => {
                if (this.props.suggestions != null && this.props.suggestions.length != 0 && this.props.suggestions != "loading") {
                    this.content.current.style.opacity = "1";
                }
            }, 50);
        }
    }

    select(i, auto) {
        if (this.state.ignoreAuto && auto) return;
        this.close();
        if (this.props.suggestions) {
            this.props.parent.selectCountry(this.props.suggestions[i]);
        }
    }

    render() {

        if (this.props.suggestions == null || this.props.suggestions.length == 0) return null;

        return (
            <div ref={this.wrap} className={"cs-wrap country-wrap" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                <div className="cs-spinner-wrap country">
                    <Spinner position="relative" size={28} />
                </div>
                {
                    this.props.suggestions != "loading" ? (
                        <div ref={this.content} className={"cs-content-wrap country" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                        {
                            this.props.suggestions.map((s, i) => {
                                return <button onClick={(e) => {this.select(i)}} ripplecolor="gray" key={i}><span>{s.name}</span></button>
                            })
                        }
                        </div>
                    ) : null
                }
            </div>
        )
        
    }

}