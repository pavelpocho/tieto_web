import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import Spinner from '../spinner';

export default class SaveIndicator extends Component {

    constructor(props) {
        super(props);
        //state refers to -> 0 = saved, 1 = saving, 2 = failed
        this.state = {
            status: 0,
            reasons: 0
        }

        this.ref = React.createRef();
    }

    addReason() {
        this.setState((prevState) => {

            this.setStatus(1);

            return {
                reason: prevState.reasons + 1
            }
        })
    }

    removeReason() {
        this.setState((prevState) => {

            if (prevState.reasons - 1 == 0) {
                this.setStatus(0);
            }

            return {
                reason: prevState.reasons - 1
            }
        })
    }
    
    failed() {
        this.setState({
            reasons: 0,
            status: 2
        });
    }

    setStatus(i) {
        this.setState({
            status: i
        })
    }

    componentDidUpdate() {
        this.ref.current.style.width = this.ref.current.childNodes[0].getBoundingClientRect().width + "px";
    }

    render() {
        return (
            <div className="save-indicator">
                <p className="si-trip-name">{this.props.name ? this.props.name : <i>Unnamed trip</i>}</p>
                <div className="si-background" ref={this.ref}>
                    <div className="si-background-inner">
                        <p className="si-state">{this.state.status == 0 ? "Saved" : this.state.status == 1 ? "Saving..." : "Save failed!"}</p>
                        {
                            this.state.status == 0 ? (
                                <i className="material-icons si-icon">done</i>
                            ) : this.state.status == 1 ? (
                                <Spinner  size={18} position={"relative"}/>
                            ) : (
                                <Fragment>
                                    <i className="material-icons si-icon" style={{color: "red"}}>clear</i>
                                    <button className="si-retry" ripplecolor="none" onClick={() => {this.props.parent.forceSave(null, () => {})}}>Click to retry</button>
                                </Fragment>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }

}