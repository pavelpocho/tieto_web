import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import { RippleManager } from '../ripple';
import TimeInput from '../time-input';

export default class TripPoint extends Component {

    constructor(props) {
        super(props);

        this.master = React.createRef();
        this.button = React.createRef();
        this.circle = React.createRef();
        this.title = React.createRef();
        this.arrival = React.createRef();
        this.departure = React.createRef();
        this.newPointLine = React.createRef();
        this.crossWrap = React.createRef();

    }

    componentDidUpdate() {
        setTimeout(() => {
            if (this.crossWrap.current) {
                this.crossWrap.current.style.opacity = "1"
            }
        }, 50);
        if (this.props.toBeRemoved && !this.props.newPoint) {
            setTimeout(() => {
                if (this.master && this.master.current) {
                    this.master.current.style.opacity = "0";
                    this.master.current.style.height = "0px";   
                }
            }, 50);
        }
        if (this.props.parent.props.locations.length == 1 && this.props.newPoint && this.props.toBeRemoved) {
            this.newPointLine.current.style.opacity = "0";
            this.newPointLine.current.style.height = "0px";
        }
        if (this.props.newPoint && !this.props.toBeRemoved) {
            setTimeout(() => {
                if (this.newPointLine.current != null) {
                    this.newPointLine.current.style.opacity = "1";
                    this.newPointLine.current.style.height = "120px";
                }
            }, 50);
        }
        if (this.props.location == undefined) return;
        if (this.props.selected) {
            if (this.circle.current) this.circle.current.style.backgroundColor = "#FAA519";
            if (this.title.current) this.title.current.style.color = "#FAA519";
            if (this.arrival.current) this.arrival.current.style.color = "#FAA519";
            if (this.departure.current) this.departure.current.style.color = "#FAA519";
        }
        else if (this.props.location.transit != true) {
            if (this.circle.current) this.circle.current.style.backgroundColor = "#62B3E4";
            if (this.title.current) this.title.current.style.color = "#62B3E4";
            if (this.arrival.current) this.arrival.current.style.color = "#62B3E4";
            if (this.departure.current) this.departure.current.style.color = "#62B3E4";
        }
        else {
            this.circle.current.style.backgroundColor = "#777";
            if (this.title.current) this.title.current.style.color = "#5F5F5F";
        }
        var crossTime = this.props.parent.props.locations[this.props.index + 1] && this.props.parent.props.locations[this.props.index + 1].crossedAt != null ? this.props.parent.props.locations[this.props.index + 1].crossedAt : -2;
        crossTime += this.props.location && crossTime > -1 ? this.props.location.departureTime : 0;
        while (crossTime / 1000 / 60 / 60 >= 24) crossTime -= 24 * 60 * 60 * 1000;
    }

    componentDidMount() {
        setTimeout(() => {
            if (this.crossWrap.current) {
                this.crossWrap.current.style.opacity = "1"
            }
        }, 50);
        if (this.props.newPoint) {
            setTimeout(() => {
                if (this.newPointLine.current != null) {
                    this.newPointLine.current.style.opacity = "1";
                    this.newPointLine.current.style.height = "120px";
                }
            }, 50);
        }
        if (this.props.selected) {
            if (this.circle.current) this.circle.current.style.backgroundColor = "#FAA519";
            if (this.title.current) this.title.current.style.color = "#FAA519";
            if (this.arrival.current) this.arrival.current.style.color = "#FAA519";
            if (this.departure.current) this.departure.current.style.color = "#FAA519";
        }
        if (!this.props.newPoint) {
            setTimeout(() => {
                this.master.current.style.opacity = "1";
                if (this.props.location.transit) {
                    this.master.current.style.height = "52px";
                }
                else if (this.props.location.isCrossing) {
                    this.master.current.style.height = "120px";
                }
                else {
                    this.master.current.style.height = "82px";
                }
            }, 50);
            if (this.button.current) RippleManager.setToButton(this.button.current); 
        }
    }

    addTransitPoint() {
        throw("Not implemented");
    }

    zeroBeforeText(t) {
        return t.toString().length < 2 ? "0" + t.toString() : t.toString();
    }

    render() {

        while (crossTime / 1000 / 60 / 60 >= 24) crossTime -= 24 * 60 * 60 * 1000;

        if (this.props.newPoint) {
            return (
                <Fragment>
                    {
                        (this.props.parent.props.locations != undefined && this.props.parent.props.locations != null && this.props.parent.props.locations.length > 0) ? (
                            <div className="tp-travel-line-wrap">
                                <div ref={this.newPointLine} className="trip-point-travel-line-wrap tptl-new">
                                    <div className="trip-point-travel-line"></div>
                                </div>
                            </div>
                        ) : null
                    }
                    <button className="trip-point-wrap add-point" onClick={() => {this.props.parent.addPoint()}}>
                        <p className="trip-point-text-first-line tp-add-point">Add Point</p>
                        <div className="trip-point-button-circle">
                            <i className="material-icons trip-point-plus">add</i>
                        </div>
                    </button>
                </Fragment>
            )
        }
        else if (this.props.location.isCrossing) {

            //Saves the inbound travel method of the next point, because the rendered line included is for outbound travels
            //NOPE
            //Saves the inbound travel of the direct next point, because it's saved there and not on the cross point
            var travel = this.props.parent.props.locations[this.props.index + 1] ? this.props.parent.props.locations[this.props.index + 1].inboundTravelType : -1;
            var crossTime = this.props.location && this.props.location.crossedAtTime != null && this.props.location.crossedAtTime != -1 ? this.props.location.crossedAtTime : this.props.parent.props.locations[this.props.index + 1].transit || this.props.location.sectionModified ? -1 : -2;
            var crossDate = this.props.location && this.props.location.crossedAtDate != null && this.props.location.crossedAtDate != -1 ? this.props.location.crossedAtDate : this.props.parent.props.locations[this.props.index + 1].transit || this.props.location.sectionModified ? -1 : -2;

            var prevLocation = this.props.parent.props.locations[this.props.index - 1];
            var nextLocation = this.props.parent.props.locations[this.props.index + 1];

            var wrongTimesWarning = nextLocation.city.country.name != "" && 
                                    prevLocation.city.country.name != "" && 
                                    nextLocation.arrivalDate && nextLocation.arrivalTime &&
                                    prevLocation.departureTime && prevLocation.departureDate &&
                                    nextLocation.arrivalDate != -1 && nextLocation.arrivalTime != -1 &&
                                    prevLocation.departureDate != -1 && prevLocation.departureTime != -1 &&
                                    prevLocation.departureDate + prevLocation.departureTime >= nextLocation.arrivalDate + nextLocation.arrivalTime;

            var displayDate = (crossDate != -2 && crossTime != -2) ? (
                this.props.parent.props.locations[this.props.index - 1].departureDate != this.props.parent.props.locations[this.props.index + 1].arrivalDate ||
                this.props.location.crossedAtDate != this.props.parent.props.locations[this.props.index + 1].arrivalDate ||
                this.props.parent.props.locations[this.props.index - 1].departureDate != this.props.location.crossedAtDate
            ) : false;

            var crossFrom = (crossDate != -2 && crossTime != -2 && this.props.parent.props.locations[this.props.index - 1].city.country.code != null) ? (
                this.props.parent.props.locations[this.props.index - 1].city.country.code
            ) : <span className="tp-country-dot-departure"></span>;
            var crossTo = (crossDate != -2 && crossTime != -2 && this.props.parent.props.locations[this.props.index + 1].city.country.code != null) ? (
                this.props.parent.props.locations[this.props.index + 1].city.country.code
            ) : <span className="tp-country-dot-arrival"></span>;

            var display = (crossDate < 0 && crossTime < 0) ? (
                "--"
            ) : (crossDate < 0 && crossTime >= 0) ? (
                (((displayDate || this.props.selected) ? ("--.--") : ("")) + " / " + this.zeroBeforeText(Math.floor(crossTime / 60000 / 60)) + ":" + this.zeroBeforeText(Math.floor(crossTime / 60000 % 60)))
            ) : (crossDate >= 0 && crossTime < 0) ? (
                (displayDate || this.props.selected ? (new Date(crossDate).getUTCDate() + "." + (new Date(crossDate).getMonth() + 1) + " / ") : "") + "--:--"
            ) : (displayDate || this.props.selected ? (new Date(crossDate).getUTCDate() + "." + (new Date(crossDate).getMonth() + 1) + " / ") : "") + this.zeroBeforeText(Math.floor(crossTime / 60000 / 60)) + ":" + this.zeroBeforeText(Math.floor(crossTime / 60000 % 60))

            var iconToDisplay = (prevLocation.departureDate + prevLocation.departureTime > this.props.location.crossedAtDate + this.props.location.crossedAtTime) ||
                                (nextLocation.arrivalDate + nextLocation.arrivalTime < this.props.location.crossedAtDate + this.props.location.crossedAtTime) ||
                                (prevLocation.transit && prevLocation.departureDate + prevLocation.departureTime < prevLocation.arrivalDate + prevLocation.arrivalTime) ? "priority_high" : "edit"

            return (
                <div ref={this.master} className="trip-point-master-wrap">
                    <div className="tp-travel-line-wrap">
                        {
                            crossTime > -2 ? (
                                <button ripplecolor="gray" onClick={() => {this.props.parent.select(this.props.location.id)}} className="tp-border-cross-wrap" ref={this.crossWrap}>
                                    <p className="tp-border-cross-title">{crossFrom} <i className="material-icons">keyboard_arrow_right</i> {crossTo}: <span ref={this.title}>{display}</span></p>
                                    <div className="tp-separator"></div>
                                    <i className="material-icons tp-edit-icon" style={iconToDisplay == "priority_high" ? {color: "#FF4E0B"} : {}}>{iconToDisplay}</i>
                                </button>
                            ) : wrongTimesWarning ? (
                                <div className="tp-border-cross-wrap" ref={this.crossWrap}>
                                    <p className="tp-border-cross-title">Timeline error</p>
                                    <div className="tp-separator"></div>                                
                                    <i className="material-icons tp-edit-icon" style={iconToDisplay == "priority_high" ? {color: "#FF4E0B"} : {}}>priority_high</i>
                                </div>
                            ) : null
                        }
                            <div className="trip-point-travel-line-wrap">
                            {
                                (travel == 1 || travel == 2) && crossTime > -2 ? (
                                    <Fragment>
                                        {/*this.props.index + 1 because the new point needs to be inserted behind the current point*/}
                                        <button className="tp-add-transit-button" ripplecolor="gray" onClick={() => {this.props.parent.insertPoint(this.props.index)}}><i className="material-icons" title={"Add a transit point"}>add</i></button>
                                        <i className="trip-point-travel-icon material-icons" style={{transform: travel == 3 ? "rotate(45deg)" : ""}}>
                                            {
                                                travel == 1 ? "directions_car" : travel == 2 ? "train" : travel == 3 ? "airplanemode_active" : travel == 4 ? "directions_boat" : ""
                                            }
                                        </i>
                                        <div className="trip-point-travel-line-short"></div>
                                    </Fragment>
                                ) : travel != null && travel > -1 ? (
                                    <Fragment>
                                        <div className="trip-point-travel-line-short"></div>
                                            <i className="trip-point-travel-icon material-icons" style={{transform: travel == 3 ? "rotate(45deg)" : ""}}>
                                                {
                                                    travel == 1 ? "directions_car" : travel == 2 ? "train" : travel == 3 ? "airplanemode_active" : travel == 4 ? "directions_boat" : ""
                                                }
                                            </i>
                                        <div className="trip-point-travel-line-short"></div>
                                    </Fragment>
                                    
                                ) : (
                                    <div className="trip-point-travel-line"></div>
                                )
                            }
                            </div>
                            {/*<div className="tp-add-transit-wrap">
                                {
                                    (travel == 1 || travel == 2) && crossTime > -2 ? (
                                        <button ripplecolor="gray"><i className="material-icons" title={"Add a transit point"}>add</i></button>   
                                    ) : null
                                }
                            </div>*/}
                    </div>
                </div>
            )
        }
        else if (this.props.location.transit) {
            return (
                <div ref={this.master} className="trip-point-master-wrap">
                    <button ref={this.button} className="trip-point-wrap trip-point-short" onClick={() => {this.props.parent.select(this.props.location.id)}}>
                        <div className="trip-point-texts">
                            {
                                !this.props.location.city || this.props.location.city.name == "" || this.props.location.city.country.name == ""  ? (
                                    null
                                ) : <p ref={this.title} className="trip-point-text-only-line tpt-gray">{this.props.location.city.country.name}</p>
                            }
                        </div>
                        <div className="trip-point-button-circle tpb-transit" ref={this.circle}>
                        {
                            (this.props.location.city == null || this.props.location.city.country.code == null || this.props.location.city.country.code == "") ? (
                                <div className="trip-point-placeholder-circle"></div>
                            ) : (
                                <p className="trip-point-country-code">{this.props.location.city.country.code}</p>
                            )
                        }                
                        </div>
                    </button>
                </div>
            )
        }
        else {

            var arrivalDate = this.props.location.arrivalDate == null || this.props.location.arrivalDate == -1 ? "" : (new Date(this.props.location.arrivalDate).getUTCDate() + "." + (new Date(this.props.location.arrivalDate).getUTCMonth() + 1) + ".");
            var departureDate = this.props.location.departureDate == null || this.props.location.departureDate == -1 ? "" : (new Date(this.props.location.departureDate).getUTCDate() + "." + (new Date(this.props.location.departureDate).getUTCMonth() + 1) + ".");
            var arrivalTime = this.props.location.arrivalTime == null ? "" : this.zeroBeforeText(Math.floor(this.props.location.arrivalTime / 60000 / 60)) + ":" + this.zeroBeforeText(this.props.location.arrivalTime / 60000 % 60);
            var departureTime = this.props.location.departureTime == null ? "" : this.zeroBeforeText(Math.floor(this.props.location.departureTime / 60000 / 60)) + ":" + this.zeroBeforeText(this.props.location.departureTime / 60000 % 60);

            return (
                <div ref={this.master} className="trip-point-master-wrap">
                    <button ref={this.button} className="trip-point-wrap" onClick={() => {this.props.parent.select(this.props.location.id)}}>
                        <div className="trip-point-texts">
                            {
                                !this.props.location.city || this.props.location.city.name == "" ? (
                                    null
                                ) : this.props.location.city.name == "Transit_Country" && this.props.location.city.country.name && this.props.location.city.country.name != "" ? (
                                    <p className="trip-point-text-only-line" style={this.props.location && this.props.location.city && this.props.location.city.name == "Transit_Country" ? {color: "#5F5F5F"} : {}}>{this.props.location.city.country.name}</p>
                                ) : this.props.location.city && this.props.location.city.name != "" && this.props.location.city.name != "Transit_Country" ? (
                                    <p ref={this.title} className="trip-point-text-first-line">{this.props.location.city.name}</p>
                                ) : null
                            } {
                                !this.props.location.city || (this.props.index == 0 && !this.props.location.onlyLocation) || this.props.location.city.name == "" ? (
                                    null
                                ) : (arrivalDate == "" && arrivalTime == "") ? (
                                    <p ref={this.arrival} className="trip-point-text-second-line"><span className="tp-gray-text">{this.props.location.onlyLocation ? "Start" : "Arrival"}: </span> --</p>
                                ) : (
                                    <p ref={this.arrival} className="trip-point-text-second-line"><span className="tp-gray-text">{this.props.location.onlyLocation ? "Start" : "Arrival"}: </span>{arrivalDate == "" ? "--.--" : arrivalDate} / {arrivalTime == "" ? "--:--" : arrivalTime}</p>
                                )
                            } {
                                !this.props.location.city || this.props.location.city.name == "" ? (
                                    null
                                ) : (departureDate == "" && departureTime == "") ? (
                                    <p ref={this.departure} className="trip-point-text-second-line"><span className="tp-gray-text">{this.props.location.onlyLocation ? "End" : "Departure"}: </span> --</p>
                                ) : (
                                    <p ref={this.departure} className="trip-point-text-second-line"><span className="tp-gray-text">{this.props.location.onlyLocation ? "End" : "Departure"}: </span>{departureDate == "" ? "--.--" : departureDate} / {departureTime == "" ? "--:--" : departureTime}</p>
                                )
                            }
                        </div>
                        <div className="trip-point-button-circle" ref={this.circle} style={this.props.location && this.props.location.city && this.props.location.city.name == "Transit_Country" ? {backgroundColor: "#707070", height: "40px", borderRadius: "20px"} : {}}>
                        {
                            (this.props.location.city == null || this.props.location.city.country.code == null || this.props.location.city.country.code == "") ? (
                                <div className="trip-point-placeholder-circle"></div>
                            ) : (
                                <p className="trip-point-country-code">{this.props.location.city.country.code}</p>
                            )
                        }                
                        </div>
                    </button>
                </div>
            )
        }

    }

}