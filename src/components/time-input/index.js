import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';

export default class TimeInput extends Component {

    constructor(props) {
        super(props);

        this.hours = React.createRef();
        this.minutes = React.createRef();
        this.wrap = React.createRef();
    }

    componentDidMount() {
        this.autocorrect(this.hours.current, 0, true);
        this.autocorrect(this.minutes.current, 1, true);
    }

    setFocused() {
        this.wrap.current.style.backgroundColor = "white";
        this.wrap.current.style.borderColor = "#eee";
    }

    setBlured() {
        this.wrap.current.style.backgroundColor = "#f1f1f1";
        this.wrap.current.style.borderColor = "transparent";
    }

    autocorrect(target, f, dontSave) {
        if (target.value.length == 1) {
            target.value = "0" + target.value;
        }
        if (target.value > 23 && f == 0 /*Hour field*/) {
            target.value = 23;
        }
        if (target.value > 59 && f == 1 /*Minute field*/) {
            target.value = 59;
        }

        if (!dontSave) {
            this.attemptSelect();
        }
    }

    attemptSelect() {
        if ((this.hours.current.value.length == 2 && this.minutes.current.value.length == 2) || (this.hours.current.value.length == 0 && this.minutes.current.value.length == 0)) {
            if (parseInt(this.hours.current.value) !== Math.floor((this.props.default == null ? -1 : this.props.default) / 60000 / 60) || parseInt(this.minutes.current.value) !== Math.floor((this.props.default == null ? -1 : this.props.default) / 60000 % 60)) {
                this.props.parent.selectTime(this.hours.current.value, this.minutes.current.value);
            }
        }
    }

    check(target) {
        if (isNaN(target.value)) {
            if (isNaN(target.value[0])) {
                target.value = target.value.substring(1);
            }
            if (isNaN(target.value[1])) {
                target.value = target.value.substring(0, 1);
            }
        }
        if (target.value.length > 2) {
            target.value = target.value.substring(0, 2);
        }
    }

    switchNext(e) {
        if (e.keyCode == 9) {
            return;
        }

        if (e.keyCode == 39 && e.target.selectionStart == e.target.value.length) {
            e.preventDefault();
            this.minutes.current.focus();
        }
        else if (e.keyCode == 46 && (e.target.value.length == 0 || e.target.selectionStart == e.target.value.length)) {
            e.preventDefault();
            this.minutes.current.focus();
        }
        else if (e.target.value.length == 2 && e.keyCode != 8 && e.keyCode != 37 && e.keyCode != 39 && e.keyCode != 46) {
            this.minutes.current.focus();
        }
    }

    switchPrev(e) {
        if (e.keyCode == 9) {
            return;
        }
        if (e.keyCode == 37 && e.target.selectionStart == 0) {
            e.preventDefault();
            this.hours.current.focus();
        }
        else if (e.keyCode == 8 && e.target.value.length == 0) {
            e.preventDefault();
            this.hours.current.focus();
        }
    }

    render() {

        var minutes = "";
        var hours = "";

        if (this.props.default != null && this.props.default != -1) {
            hours = Math.floor(this.props.default / 60000 / 60);
            minutes = Math.floor(this.props.default / 60000 % 60);
        }
        if (hours !== "" && hours < 10) {
            hours = "0" + hours;
        }
        if (minutes !== "" && minutes < 10) {
            minutes = "0" + minutes;
        }

        return (
            <div className="time-input" ref={this.wrap}>
                <input defaultValue={hours} placeholder="--" ref={this.hours} onKeyDown={(e) => {this.switchNext(e)}} onChange={(e) => {this.check(e.target)}} onBlur={(e) => {this.autocorrect(e.target, 0); this.setBlured()}} onFocus={(e) => {this.setFocused()}} type="text" className="ti-field"></input>
                <p ref={this.colon} className="ti-colon">:</p>
                <input defaultValue={minutes} placeholder="--" ref={this.minutes} onKeyDown={(e) => {this.switchPrev(e)}} onChange={(e) => {this.check(e.target)}} onBlur={(e) => {this.autocorrect(e.target, 1); this.setBlured()}} onFocus={(e) => {this.setFocused()}} type="text" className="ti-field"></input>
            </div>
        )
    }

}