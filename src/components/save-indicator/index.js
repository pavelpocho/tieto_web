import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import Spinner from '../spinner';

export default class SaveIndicator extends Component {

    constructor(props) {
        super(props);
        //state refers to -> 0 = saved, 1 = saving, 2 = failed
        this.state = {
            status: this.props.defaultStatus,
            lastSaveDate: null
        }

        this.ref = React.createRef();
    }

    setStatus(i) {
        this.setState((prevState) => {
            return {
                lastSaveDate: i == 0 ? new Date() : prevState.lastSaveDate,
                status: i
            }
        })
    }

    componentDidUpdate() {
        this.ref.current.style.width = this.ref.current.childNodes[0].getBoundingClientRect().width + "px";
    }

    render() {

        this.hours = "";
        this.minutes = "";
        if (this.state.lastSaveDate != null) {
            this.hours = this.state.lastSaveDate.getHours();
            this.minutes = this.state.lastSaveDate.getMinutes();
        }
        if (this.hours !== "" && this.hours < 10) {
            this.hours = "0" + this.hours;
        }
        if (this.minutes !== "" && this.minutes < 10) {
            this.minutes = "0" + this.minutes;
        }

        var saveTimeText = this.hours != "" && this.minutes != "" ? (
            " at " + this.hours + ":" + this.minutes
        ) : "";

        return (
            <div className="save-indicator">
                <p className="si-trip-name">{this.props.name ? this.props.name : <i>Unnamed trip</i>}</p>
                <div className="si-background" ref={this.ref}>
                    <div className="si-background-inner">
                        <p className="si-state">{this.state.status == 0 ? "Saved" + saveTimeText : this.state.status == 1 ? "Saving..." : this.state.status == 2 ? "Save failed!" : "Nothing to save"}</p>
                        {
                            this.state.status == 0 || this.state.status == 3 ? (
                                <i className="material-icons si-icon">done</i>
                            ) : this.state.status == 1 ? (
                                <Spinner  size={18} position={"relative"}/>
                            ) : (
                                <Fragment>
                                    <i className="material-icons si-icon" style={{color: "red"}}>clear</i>
                                    {
                                        this.props.admin ? null : (
                                            <button className="si-retry" ripplecolor="none" onClick={() => {this.props.parent.forceSave(() => {})}}>Click to retry</button>
                                        )
                                    }
                                </Fragment>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }

}