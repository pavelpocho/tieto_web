import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import TimeInput from '../time-input';
import DayInput from '../day-input';

export default class DateInput extends Component {

    constructor(props) {
        super(props);
    }

    selectDate(day, month, year) {
        if (day == null && month == null && year == null) {
            this.props.setDate(undefined);
        }
        else {
            let d = new Date(year, month, day);
            d.setUTCDate(day);
            d.setUTCMonth(month);
            d.setUTCHours(0);
            this.props.setDate(d.getTime());
        }
    }

    selectTime(hour, minute) {
        if (hour == "" && minute == "") {
            this.props.setTime(undefined);
        }
        else {
            this.props.setTime(minute * 60000 + hour * 3600000);
        }
    }

    render() {
        console.log("Default arrival time is ->");
        console.log(this.props.defaultTime);
        return (
            <div>
                <TimeInput key={this.props.defaultTime ? this.props.defaultTime : this.props.timeKey} parent={this} default={this.props.defaultTime} />
                <DayInput key={this.props.defaultDate ? this.props.defaultDate : this.props.dateKey} parent={this} default={this.props.defaultDate == null || this.props.defaultDate == -1 ? null : new Date(this.props.defaultDate)} highlight={this.props.highlightDate == null || this.props.highlightDate == -1 ? null : new Date(this.props.highlightDate)} />
            </div>
        )
    }

}