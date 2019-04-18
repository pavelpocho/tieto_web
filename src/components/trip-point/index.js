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
        this.borderInput = React.createRef();

    }

    componentDidUpdate() {
        if (!this.circle.current) {
            return;
        }
        if (this.props.selected) {
            this.circle.current.style.backgroundColor = "#FAA519";
            if (this.title.current) this.title.current.style.color = "#FAA519";
            if (this.arrival.current) this.arrival.current.style.color = "#FAA519";
            if (this.departure.current) this.departure.current.style.color = "#FAA519";
        }
        else if (this.props.location.transfer != true) {
            this.circle.current.style.backgroundColor = "#62B3E4";
            if (this.title.current) this.title.current.style.color = "#62B3E4";
            if (this.arrival.current) this.arrival.current.style.color = "#62B3E4";
            if (this.departure.current) this.departure.current.style.color = "#62B3E4";
        }
        var crossTime = this.props.parent.props.locations[this.props.index + 1] && this.props.parent.props.locations[this.props.index + 1].crossedAt != null ? this.props.parent.props.locations[this.props.index + 1].crossedAt : -2;
        crossTime += this.props.location && crossTime > -1 ? this.props.location.departureTime : 0;
        while (crossTime / 1000 / 60 / 60 >= 24) crossTime -= 24 * 60 * 60 * 1000;
        if (this.borderInput.current) this.borderInput.current.setValue(crossTime);
    }

    componentDidMount() {
        if (this.props.selected) {
            this.circle.current.style.backgroundColor = "#FAA519";
            if (this.title.current) this.title.current.style.color = "#FAA519";
            if (this.arrival.current) this.arrival.current.style.color = "#FAA519";
            if (this.departure.current) this.departure.current.style.color = "#FAA519";
        }
        if (!this.props.newPoint) {
            if (this.props.location.id > 0) {
                this.master.current.style.height = this.props.location && this.props.location.city && this.props.location.city.name == "Transit_Country" ? "174px" : "204px";
                this.master.current.style.opacity = "1";
                RippleManager.setToButton(this.button.current);
            }
            else {
                setTimeout(() => {
                    this.master.current.style.height = this.props.location && this.props.location.city && this.props.location.city.name == "Transit_Country" ? "174px" : "204px";
                    this.master.current.style.opacity = "1";
                    RippleManager.setToButton(this.button.current);
                }, 20);
            }   
        }
    }

    setBorderCross(hours, minutes) {
        var millis = minutes * 60000 + hours * 3600000;
        //Subtract the prevpoint departure from this and account for day crosses
        //Send to server
        var prevDepartureTime = this.props.location.departureTime;
        if (prevDepartureTime > millis) {
            //Crossed through midnight
            millis += 24 * 60 * 60000 - prevDepartureTime;
        }
        else {
            millis -= prevDepartureTime;
        }
        this.props.parent.setBorderCross(this.props.parent.props.locations[this.props.index + 1].id, millis);
    }

    addTransitPoint() {
        throw("Not implemented");
    }

    zeroBeforeText(t) {
        return t.toString().length < 2 ? "0" + t.toString() : t.toString();
    }

    render() {

        //Saves the inbound travel method of the next point, because the rendered line included is for outbound travels
        var travel = this.props.parent.props.locations[this.props.index + 2] ? this.props.parent.props.locations[this.props.index + 2].inboundTravelType : -1;
        var crossTime = this.props.parent.props.locations[this.props.index + 1] && this.props.parent.props.locations[this.props.index + 1].crossedAt != null && this.props.parent.props.locations[this.props.index + 1].crossedAt != -1 ? this.props.parent.props.locations[this.props.index + 1].crossedAt : -2;
        if (this.props.parent.props.locations[this.props.index + 2] && this.props.parent.props.locations[this.props.index + 2].transit) crossTime = -1;
        crossTime += this.props.location && crossTime > -1 ? this.props.location.departureTime : 0;

        while (crossTime / 1000 / 60 / 60 >= 24) crossTime -= 24 * 60 * 60 * 1000;

        if (this.props.newPoint) {
            return (
                <button className="trip-point-wrap add-point" onClick={() => {this.props.parent.addPoint()}}>
                    <p className="trip-point-text-first-line tp-add-point">Add Point</p>
                    <div className="trip-point-button-circle">
                        <i className="material-icons trip-point-plus">add</i>
                    </div>
                </button>
            )
        }
        else {

            var arrivalDate = this.props.location.arrivalDate == null || this.props.location.arrivalDate == -1 ? "" : (new Date(this.props.location.arrivalDate).getUTCDate() + "." + (new Date(this.props.location.arrivalDate).getMonth() + 1) + ".");
            var departureDate = this.props.location.departureDate == null || this.props.location.departureDate == -1 ? "" : (new Date(this.props.location.departureDate).getUTCDate() + "." + (new Date(this.props.location.departureDate).getMonth() + 1) + ".");
            var arrivalTime = this.props.location.arrivalTime == null ? "" : this.zeroBeforeText(Math.floor(this.props.location.arrivalTime / 60000 / 60)) + ":" + this.zeroBeforeText(this.props.location.arrivalTime / 60000 % 60);
            var departureTime = this.props.location.departureTime == null ? "" : this.zeroBeforeText(Math.floor(this.props.location.departureTime / 60000 / 60)) + ":" + this.zeroBeforeText(this.props.location.departureTime / 60000 % 60);

            return (
                <div ref={this.master} className="trip-point-master-wrap">
                    <button ref={this.button} className={this.props.location && this.props.location.city && this.props.location.city.name == "Transit_Country" ? "trip-point-wrap trip-point-short" : "trip-point-wrap"} onClick={() => {this.props.parent.select(this.props.index)}} disabled={/*this.props.location && this.props.location.city && this.props.location.city.name == "Transit_Country"*/false}>
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
                                !this.props.location.city || this.props.index == 0 || this.props.location.city.name == "" || this.props.location.city.name == "Transit_Country" ? (
                                    null
                                ) : (arrivalDate == "" && arrivalTime == "") ? (
                                    <p ref={this.arrival} className="trip-point-text-second-line"><span className="tp-gray-text">Arrival: </span> --</p>
                                ) : (
                                    <p ref={this.arrival} className="trip-point-text-second-line"><span className="tp-gray-text">Arrival: </span>{arrivalDate == "" ? "--.--" : arrivalDate} / {arrivalTime == "" ? "--:--" : arrivalTime}</p>
                                )
                            } {
                                !this.props.location.city || this.props.location.city.name == "" || this.props.location.city.name == "Transit_Country" ? (
                                    null
                                ) : (departureDate == "" && departureTime == "") ? (
                                    <p ref={this.departure} className="trip-point-text-second-line"><span className="tp-gray-text">Departure: </span> --</p>
                                ) : (
                                    <p ref={this.departure} className="trip-point-text-second-line"><span className="tp-gray-text">Departure: </span>{departureDate == "" ? "--.--" : departureDate} / {departureTime == "" ? "--:--" : departureTime}</p>
                                )
                            }
                        </div>
                        <div className="trip-point-button-circle" ref={this.props.location && this.props.location.city && this.props.location.city.name == "Transit_Country" ? null : this.circle} style={this.props.location && this.props.location.city && this.props.location.city.name == "Transit_Country" ? {backgroundColor: "#707070", height: "40px", borderRadius: "20px"} : {}}>
                        {
                            (this.props.location.city == null || this.props.location.city.country.code == null || this.props.location.city.country.code == "") ? (
                                <div className="trip-point-placeholder-circle"></div>
                            ) : (
                                <p className="trip-point-country-code">{this.props.location.city.country.code}</p>
                            )
                        }                
                        </div>
                    </button>
                    <div className="tp-travel-line-wrap">
                        {
                            crossTime > -2 ? (
                                <div className="tp-border-cross-wrap">
                                    <p className="tp-border-cross-title">Border crossed at</p>
                                    <TimeInput ref={this.borderInput} blue={true} default={crossTime} parent={this} />
                                </div>
                            ) : null
                        }
                            <div className="trip-point-travel-line-wrap">
                            {
                                (travel == 1 || travel == 2) && crossTime > -2 ? (
                                    <Fragment>
                                        {/*this.props.index + 1 because the new point needs to be inserted behind the current point*/}
                                        <button className="tp-add-transit-button" ripplecolor="gray" onClick={() => {this.props.parent.insertPoint(this.props.index + 1)}}><i className="material-icons" title={"Add a transit point"}>add</i></button>
                                        <i className="trip-point-travel-icon material-icons" style={{transform: travel == 3 ? "rotate(45deg)" : ""}}>
                                            {
                                                travel == 1 ? "directions_car" : travel == 2 ? "train" : travel == 3 ? "airplanemode_active" : ""
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

    }

}