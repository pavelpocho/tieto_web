import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import { timingSafeEqual } from 'crypto';
import { RippleManager } from '../ripple';

export default class DayInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            months: [
                "January", "February", "March",
                "April", "May", "June",
                "July", "August", "September",
                "October", "November", "December"
            ],
            month: this.props.default == null || this.props.default == "Invalid Date" ? (this.props.highlight == null || this.props.highlight == "Invalid Date" ? new Date().getUTCMonth() : this.props.highlight.getUTCMonth()) : this.props.default.getUTCMonth(),
            year: this.props.default == null || this.props.default == "Invalid Date" ? (this.props.highlight == null || this.props.highlight == "Invalid Date" ? new Date().getUTCFullYear() : this.props.highlight.getUTCFullYear()) : this.props.default.getUTCFullYear(),
            days: [
                "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"
            ],
            monthLengths: [
                31, this.checkForLeapYear(this.props.default == null || this.props.default == "Invalid Date" ? new Date().getUTCFullYear() : this.props.default.getUTCFullYear()) ? 29 : 28, 31, 30,
                31, 30, 31, 31,
                30, 31, 30, 31
            ],
            selectedDay: this.props.default == null || this.props.default == "Invalid Date" ? undefined : this.props.default.getUTCDate(),
            selectedMonth: this.props.default == null || this.props.default == "Invalid Date" ? undefined : this.props.default.getUTCMonth(),
            selectedYear: this.props.default == null || this.props.default == "Invalid Date" ? undefined : this.props.default.getUTCFullYear()
        }

        this.ref = [];
        for (var i = 0; i < 32; i++) {
            this.ref[i] = React.createRef();
        }
    }

    checkForLeapYear(year) {
        return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
    }

    addMonth(i) {
        this.graphicalSelect(null);
        if (this.state.year == 1970 && i < 0) return;
        this.setState((prevState) => {
            var m = 0;
            var y = prevState.year;
            if (prevState.month + i < 0) {
                m = 11;
                y--;
            }
            else if (prevState.month + i > 11) {
                m = 0;
                y++;
            }
            else {
                m = prevState.month + i;
            }
            return {
                month: m,
                year: y,
                monthLengths: [
                    31, this.checkForLeapYear(y) ? 29 : 28, 31, 30,
                    31, 30, 31, 31,
                    30, 31, 30, 31
                ]
            }
        })
    }

    select(e) {
        if (e.currentTarget.getAttribute("class").includes("day-button db-selected")) {
            this.graphicalSelect(null);
            this.setState({
                selectedDay: undefined,
                selectedMonth: undefined,
                selectedYear: undefined
            });
            this.props.parent.selectDate(null, null, null);
        }
        else {
            this.graphicalSelect(e.currentTarget);
            this.setState({
                selectedDay: e.currentTarget.innerHTML,
                selectedMonth: this.state.month,
                selectedYear: this.state.year
            });
            this.props.parent.selectDate(e.currentTarget.innerHTML.split("<")[0], this.state.month, this.state.year);
        }
    }

    graphicalSelect(target) {
        if (target == null) {
            for (var i = 0; i < this.ref.length; i++) {
                if (this.ref[i].current != null && this.ref[i].current.getAttribute("class").includes("db-today")) {
                    this.ref[i].current.setAttribute("class", "day-button db-today" + (ObjectContainer.isDarkTheme() ? " dark" : ""));
                }
                else if (this.ref[i].current != null) {
                    this.ref[i].current.setAttribute("class", "day-button" + (ObjectContainer.isDarkTheme() ? " dark" : ""));
                }
            }
            return;
        }
        for (var i = 0; i < this.ref.length; i++) {
            if (this.ref[i].current != target && this.ref[i].current != null && this.ref[i].current.getAttribute("class").includes("db-today")) {
                this.ref[i].current.setAttribute("class", "day-button db-today" + (ObjectContainer.isDarkTheme() ? " dark" : ""));
            }
            else if (this.ref[i].current != target && this.ref[i].current != null) {
                this.ref[i].current.setAttribute("class", "day-button" + (ObjectContainer.isDarkTheme() ? " dark" : ""));
            }
            else if (this.ref[i].current == target) {
                target.setAttribute("class", "day-button db-selected" + (ObjectContainer.isDarkTheme() ? " dark" : ""));
            }
        }
    }

    componentDidMount() {
        RippleManager.setUp();
    }

    componentDidUpdate() {
        if (this.state.selectedYear == this.state.year && this.state.selectedMonth == this.state.month) {
            for (var j = 0; j < this.ref.length; j++) {
                if (this.ref[j].current != null && parseInt(this.ref[j].current.innerHTML) != NaN && this.ref[j].current.innerHTML == this.state.selectedDay) {
                    this.graphicalSelect(this.ref[j].current);
                }
            }
        }
    }

    render() {

        var days = [];

        var highlightDay = this.props.highlight == null || this.props.highlight == "Invalid Date" ? undefined : this.props.highlight.getUTCDate();
        var highlightMonth = this.props.highlight == null || this.props.highlight == "Invalid Date" ? undefined : this.props.highlight.getUTCMonth();
        var highlightYear = this.props.highlight == null || this.props.highlight == "Invalid Date" ? undefined : this.props.highlight.getUTCFullYear();

        for (var m = 0; m < 7; m++) {
            days[m] = [];
        }
        var d = new Date(this.state.year, this.state.month);
        d.setDate(1);
        let dayIndex = d.getDay() - 1;
        if (dayIndex == -1) dayIndex = 6;
        var x = 1;
        for (var i = 0; i < dayIndex; i++) {
            days[Math.floor(i / 7)][i] = <td key={i} style={{height: "24px", width: "24px"}}></td>
        }
        for (var i = dayIndex; i < this.state.monthLengths[this.state.month] + dayIndex; i++) {
            var buttonClass = ((this.state.selectedDay && this.state.selectedDay == x && this.state.selectedMonth == this.state.month && this.state.selectedYear == this.state.year) ? ("day-button db-selected") : (!this.state.selectedDay && highlightDay == x && this.state.month == highlightMonth && this.state.year == highlightYear) ? "day-button db-today" : "day-button");
            days[Math.floor(i / 7)][i] = (
                <td key={i}>
                    <button ref={this.ref[i - dayIndex]} 
                            onClick={(e) => {this.select(e)}}
                            //onTouchEnd={(e) => {this.select(e)}}
                            ripplecolor={this.props.color == "blue" ? "blue" : "orange"} 
                            className={buttonClass + (ObjectContainer.isDarkTheme() ? " dark" : "")}
                    >{x}</button>
                </td>
            );
            x++;
        }

        days.map((d, i) => {
            return d.map((f, j) => {
                if (f.props.children) {
                    return f.props.children.props.className;
                }
            });
        });

        return (
            <div className={"day-input" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                <div className="di-header">
                    <button ripplecolor="gray" className={"di-month-switch" + (ObjectContainer.isDarkTheme() ? " dark" : "")} onClick={() => {this.addMonth(-1)}} ><i className="material-icons">arrow_left</i></button>
                    <p className={"di-month-title" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>{this.state.months[this.state.month] + " " + this.state.year}</p>
                    <button ripplecolor="gray" className={"di-month-switch" + (ObjectContainer.isDarkTheme() ? " dark" : "")} onClick={() => {this.addMonth(1)}} ><i className="material-icons">arrow_right</i></button>
                </div>
                <div className={"di-separator" + (ObjectContainer.isDarkTheme() ? " dark" : "")}></div>
                <div className="di-number-wrap">
                    <table className={this.props.color == "blue" ? "blue" : ""}>
                        <thead>
                            <tr>
                                {
                                    this.state.days.map((t, i) => <th style={{color: ObjectContainer.isDarkTheme() ? "white" : "black" }}key={i}>{t}</th>)
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                days.map((a, i) => {
                                    return (
                                        <tr key={i}>
                                            {a.map(e => e)}
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

}