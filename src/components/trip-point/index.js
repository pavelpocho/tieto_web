import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import { RippleManager } from '../ripple';

export default class TripPoint extends Component {

    constructor(props) {
        super(props);

        this.master = React.createRef();
        this.button = React.createRef();
        this.circle = React.createRef();
        this.title = React.createRef();
        this.arrival = React.createRef();
        this.departure = React.createRef();

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
        else {
            this.circle.current.style.backgroundColor = "#62B3E4";
            if (this.title.current) this.title.current.style.color = "#62B3E4";
            if (this.arrival.current) this.arrival.current.style.color = "#62B3E4";
            if (this.departure.current) this.departure.current.style.color = "#62B3E4";
        }
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
                this.master.current.style.height = "218px";
                this.master.current.style.opacity = "1";
                RippleManager.setToButton(this.button.current);
            }
            else {
                setTimeout(() => {
                    this.master.current.style.height = "218px";
                    this.master.current.style.opacity = "1";
                    RippleManager.setToButton(this.button.current);
                }, 20);
            }   
        }
    }

    zeroBeforeText(t) {
        return t.toString().length < 2 ? "0" + t.toString() : t.toString();
    }

    render() {

        //Saves the inbound travel method of the next point, because the rendered line included is for outbound travels
        console.log("Travel");
        var travel = this.props.parent.props.locations[this.props.index + 2] ? this.props.parent.props.locations[this.props.index + 2].inboundTravelType : -1;
        console.log(travel);

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

            var arrivalDate = this.props.location.arrivalDate == null ? "" : (new Date(this.props.location.arrivalDate).getDate() + "." + (new Date(this.props.location.arrivalDate).getMonth() + 1) + ".");
            var departureDate = this.props.location.departureDate == null ? "" : (new Date(this.props.location.departureDate).getDate() + "." + (new Date(this.props.location.departureDate).getMonth() + 1) + ".");
            var arrivalTime = this.props.location.arrivalTime == null ? "" : this.zeroBeforeText(Math.floor(this.props.location.arrivalTime / 60000 / 60)) + ":" + this.zeroBeforeText(this.props.location.arrivalTime / 60000 % 60);
            var departureTime = this.props.location.departureTime == null ? "" : this.zeroBeforeText(Math.floor(this.props.location.departureTime / 60000 / 60)) + ":" + this.zeroBeforeText(this.props.location.departureTime / 60000 % 60);

            return (
                <div ref={this.master} className="trip-point-master-wrap">
                    <button ref={this.button} className="trip-point-wrap" onClick={() => {this.props.parent.select(this.props.index)}}>
                        <div className="trip-point-texts">
                            {
                                this.props.location.city.name == "" ? (
                                    null
                                ) : (
                                    <p ref={this.title} className="trip-point-text-first-line">{this.props.location.city.name}</p>
                                )
                            } {
                                this.props.index == 0 || this.props.location.city.name == "" ? (
                                    null
                                ) : (arrivalDate == "" && arrivalTime == "") ? (
                                    <p ref={this.arrival} className="trip-point-text-second-line"><span className="tp-gray-text">Arrival: </span> --</p>
                                ) : (
                                    <p ref={this.arrival} className="trip-point-text-second-line"><span className="tp-gray-text">Arrival: </span>{arrivalDate == "" ? "--.--" : arrivalDate} / {arrivalTime == "" ? "--:--" : arrivalTime}</p>
                                )
                            } {
                                this.props.location.city.name == "" ? (
                                    null
                                ) : (departureDate == "" && departureTime == "") ? (
                                    <p ref={this.departure} className="trip-point-text-second-line"><span className="tp-gray-text">Departure: </span> --</p>
                                ) : (
                                    <p ref={this.departure} className="trip-point-text-second-line"><span className="tp-gray-text">Departure: </span>{departureDate == "" ? "--.--" : departureDate} / {departureTime == "" ? "--:--" : departureTime}</p>
                                )
                            }
                        </div>
                        <div className="trip-point-button-circle" ref={this.circle}>
                        {
                            (this.props.location.city.country.code == null || this.props.location.city.country.code == "") ? (
                                <div className="trip-point-placeholder-circle"></div>
                            ) : (
                                <p className="trip-point-country-code">{this.props.location.city.country.code}</p>
                            )
                        }                
                        </div>
                    </button>
                    {
                        travel != null && travel > -1 ? (
                            <Fragment>
                                <div className="trip-point-travel-line-short"></div>
                                <i className="trip-point-travel-icon material-icons" style={{transform: travel == 2 ? "rotate(45deg)" : ""}}>
                                    {
                                        travel == 0 ? "directions_car" : travel == 1 ? "train" : "airplanemode_active"
                                    }
                                </i>
                                <div className="trip-point-travel-line-short"></div>        
                            </Fragment>
                        ) : (
                            <div className="trip-point-travel-line"></div>
                        )
                    }
                </div>
            )
        }

    }

}