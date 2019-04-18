import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import TimeInput from '../time-input';
import DayInput from '../day-input';

export default class DateInput extends Component {

    constructor(props) {
        super(props);

        var d = this.props.defaultDate == null || this.props.defaultDate == -1 ? null : new Date(this.props.defaultDate);
        var t = this.props.defaultTime;

        this.state = {
            defaultDate: d,
            defaultTime: t
        }
    }

    selectDate(day, month, year) {
        if (day == null && month == null && year == null) {
            this.props.setDate(undefined);
        }
        else {
            let d = new Date(year, month, day);
            d.setUTCDate(day);
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
        return (
            <div>
                <TimeInput parent={this} default={this.state.defaultTime} />
                <DayInput parent={this} default={this.state.defaultDate} />
            </div>
        )
    }

}