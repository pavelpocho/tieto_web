import css from './index.css';
import React, { Component, Fragment } from 'react';
import ObjectContainer from '../../utils/object-container';
import Overlay from '../overlay';
import DayInput from '../day-input';

export default class DuplicationDateDialog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            someState: true
        }
        //This is necessary here. If it's not here, the DayInput doesn't see the selectDate function...
        
        this.wrap = React.createRef();
        this.overlay = React.createRef();
    }

    cancel() {
        this.wrap.current.style.opacity = "0";
        this.overlay.current.div.current.style.opacity = "0";
        setTimeout(() => {
            this.props.parent.stopDuplicate();
        }, 350);
    }

    componentDidMount() {
        setTimeout(() => {
            this.wrap.current.style.opacity = "1";
            this.overlay.current.div.current.style.opacity = "0.45";
        }, 20);
    }

    selectDate(day, month, year) {
        let d = new Date(year, month, day);
        d.setUTCDate(day);
        d.setUTCMonth(month);
        d.setUTCHours(0);
        this.props.parent.duplicate(d.getTime());
        this.cancel();
    }

    moveStart(e) {
        var t = this.wrap.current.style.transform;
        var subtractX = e.clientX - this.wrap.current.offsetLeft - (t == "" ? 0 : parseInt(t.split("(")[1].split("px")[0]));
        var subtractY = e.clientY - this.wrap.current.offsetTop - (t == "" ? 0 : parseInt(t.split(",")[1].split("px")[0]));
        document.body.onmousemove = (f) => {
            this.wrap.current.style.marginTop = "0px";
            this.wrap.current.style.marginLeft = "0px";
            this.wrap.current.style.top = "0px";
            this.wrap.current.style.left = "0px";
            this.wrap.current.style.transform = "translate(" + (f.clientX - subtractX) + "px" + "," + (f.clientY - subtractY) + "px" + ")";
        }
        document.body.onmouseup = () => {
            document.body.onmousemove = null;
            document.body.onmouseup = null;
        }
    }

    render() {
        return (
            <Fragment>
                <Overlay ref={this.overlay} onClick={() => {this.cancel()}} />
                <div className={"dd-wrap" + (ObjectContainer.isDarkTheme() ? " dark" : "")} ref={this.wrap}>
                    <div className="dd-topbar" onMouseDown={(e) => {this.moveStart(e)}}>
                        <button ripplecolor="gray" className={"dd-cancel" + (ObjectContainer.isDarkTheme() ? " dark" : "")} onClick={() => {this.cancel()}}><i className="material-icons">arrow_back</i>Back</button>
                        <p className={"dd-title" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Duplicate "{this.props.tripName}"</p>
                        <span className="dd-span"></span>
                    </div>
                    <div className={"dd-content" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                        <p>Select the start date of the duplicate. The other dates will be automatically adjusted.</p>
                        <DayInput color={"blue"} parent={this} default={null} highlight={this.props.highlightDate == null || this.props.highlightDate == -1 ? null : new Date(this.props.highlightDate)}/>
                    </div>
                </div>
            </Fragment>
        )
    }

}