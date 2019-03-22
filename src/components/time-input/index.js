import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';

export default class TimeInput extends Component {

    constructor(props) {
        super(props);

        this.hours = React.createRef();
        this.minutes = React.createRef();
    }

    componentDidMount() {
        this.autocorrect(this.hours.current, 0, true);
        this.autocorrect(this.minutes.current, 1, true);
    }

    autocorrect(target, f, dontSave) {
        if (target.value.length == 1) {
            target.value = "0" + target.value;
        }
        if (target.value > 24 && f == 0 /*Hour field*/) {
            target.value = 24;
        }
        if (target.value > 60 && f == 1 /*Minute field*/) {
            target.value = 60;
        }

        if (!dontSave) {
            this.attemptSelect();
        }
    }

    attemptSelect() {
        if ((this.hours.current.value.length == 2 && this.minutes.current.value.length == 2) || (this.hours.current.value.length == 0 && this.minutes.current.value.length == 0)) {
            this.props.parent.selectTime(this.hours.current.value, this.minutes.current.value);
        }
    }

    check(target) {
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

    //ALL DateTime Time objects will seem to be in Utc, but in reality will just be whatever the user entered!

    render() {

        var minutes = "";
        var hours = "";
        
        if (this.props.default != null) {
            hours = Math.floor(this.props.default / 60000 / 60);
            minutes = Math.floor(this.props.default / 60000 % 60);
        }

        return (
            <div className="time-input">
                <input defaultValue={hours} placeholder="--" ref={this.hours} onKeyDown={(e) => {this.switchNext(e)}} onChange={(e) => {this.check(e.target)}} onBlur={(e) => {this.autocorrect(e.target, 0)}} type="text" className="ti-field"></input>
                <p className="ti-colon">:</p>
                <input defaultValue={minutes} placeholder="--" ref={this.minutes} onKeyDown={(e) => {this.switchPrev(e)}} onChange={(e) => {this.check(e.target)}} onBlur={(e) => {this.autocorrect(e.target, 1)}} type="text" className="ti-field"></input>
            </div>
        )
    }

}