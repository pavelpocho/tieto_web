import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import { RippleManager } from '../ripple';
import { Transform } from 'stream';
import DateInput from '../date-input';
import FoodInputWidget from '../food-input-widget';

export default class PointDetailInfo extends Component {

    constructor(props) {
        super(props);

        this.wrap = React.createRef();
        
        this.state = {
            defaultCity: this.props.location.city.name,
            travel: this.props.location.inboundTravelType,
            defaultArrivalTime: this.props.location.arrivalTime,
            defaultArrivalDate: this.props.location.arrivalDate,
            defaultDepartureTime: this.props.location.departureTime,
            defaultDepartureDate: this.props.location.departureDate
        }

        this.city = React.createRef();
        this.country = React.createRef();
    }

    componentDidMount() {
        RippleManager.setUp();
        if (this.props.location.id > -1) {
            setTimeout(() => {
                this.animateIn();
            }, 20);
        }
    }

    selectTravel(index) {
        this.setState({
            travel: index
        })
        this.props.parent.setLocationField(this.props.location, "inboundTravelType", index);
    }

    setArrivalTime(time) {
        this.props.parent.setLocationField(this.props.location, "arrivalTime", time);
    }
    setArrivalDate(date) {
        this.props.parent.setLocationField(this.props.location, "arrivalDate", date);
    }
    
    setDepartureTime(time) {
        this.props.parent.setLocationField(this.props.location, "departureTime", time);
    }
    setDepartureDate(date) {
        this.props.parent.setLocationField(this.props.location, "departureDate", date);
    }

    animateIn() {
        this.wrap.current.style.display = "block";
        if (this.props.animate) {
            setTimeout(() => {
                this.wrap.current.style.opacity = "1";
                this.wrap.current.style.transform = "translateX(0px)";
            }, 20);
        }
    }

    animateOut() {
        this.wrap.current.style.opacity = "0";
        this.wrap.current.style.transform = "translateX(40px)";
    }

    validateCity(target) {
        if (target.value == "") {
            this.props.parent.saveIndicator.current.setStatus(1);
            this.props.parent.setCity(this.props.location, { name: "", country: { name: "" } });
            return;
        }
        if (target.value == this.state.defaultCity) {
            return;
        }
        this.props.parent.saveIndicator.current.setStatus(1);
        let h = ObjectContainer.getHttpCommunicator();
        h.validateCity(target.value, (v, s) => {
            if (s == 200) {
                var object = JSON.parse(v);
                target.value = object.name;
                this.country.current.innerHTML = object.country.name;

                this.props.parent.setCity(this.props.location, object);
            }
            else {
                console.log("City validation failed..");
                //City validation failed
                this.props.parent.saveIndicator.current.setStatus(2);
            }
        });
    }

    render() {
        return (
            <div className="pd-wrap" ref={this.wrap} style={!this.props.animate && this.props.location.id > -1 ? {opacity: 1, transform: "translateX(0px)", display: "block"} : {}}>
                <div className="pd-topbar">
                    <button ripplecolor="gray" className="pd-back" onClick={() => {this.props.backFunctionTarget.select(-1)}}>
                        <i className="material-icons">arrow_back</i>
                        Back
                    </button>
                    <button ripplecolor="gray" className="pd-back pd-no-text" onClick={() => {this.props.parent.removePoint(this.props.location)}}>
                        <i className="material-icons">delete</i>
                    </button>
                </div>
                {/*Styles for gti-section and trip-property-label are in general-trip-info, because they are the same*/}
                <div className="gti-section no-left-margin">
                    <p className="trip-property-label">City</p>
                    <div className="city-input">
                        <input onFocus={() => {this.setState({defaultCity: this.props.location.city.name})}} onBlur={(e) => {this.validateCity(e.target)}} defaultValue={this.props.location.city ? this.props.location.city.name : ""} ref={this.city} placeholder="City"></input>
                        <p ref={this.country} className="city-country-info">{this.props.location.city.country.name}</p>
                    </div>
                </div>
                {
                    !this.props.firstPoint ? (
                        <Fragment>
                            <div className="gti-section no-left-margin">
                                <p className="trip-property-label">Inbound travel</p>
                                <div className="travel-picker">
                                    <button onClick={() => {this.selectTravel(0)}} ripplecolor="gray" className={"tp-button" + (this.state.travel == 0 ? " tp-selected" : "")}><i className="material-icons">directions_car</i><p>Car</p></button>
                                    <button onClick={() => {this.selectTravel(1)}} ripplecolor="gray" className={"tp-button" + (this.state.travel == 1 ? " tp-selected" : "")}><i className="material-icons">train</i><p>Public Transport</p></button>
                                    <button onClick={() => {this.selectTravel(2)}} ripplecolor="gray" className={"tp-button" + (this.state.travel == 2 ? " tp-selected" : "")}><i className="material-icons" style={{transform: "rotate(45deg)"}}>airplanemode_active</i><p>Airplane</p></button>
                                </div>
                            </div>
                            <div className="gti-section no-left-margin top-align">
                                <p className="trip-property-label">Provided food</p>
                                <FoodInputWidget />
                            </div>
                            <div className="gti-section no-left-margin top-align">
                                <p className="trip-property-label">Arrival</p>
                                <DateInput setTime={(time) => {this.setArrivalTime(time)}} setDate={(date) => {this.setArrivalDate(date)}} parent={this} defaultDate={this.state.defaultArrivalDate} defaultTime={this.state.defaultArrivalTime} />
                            </div>
                        </Fragment>
                    ) : null
                }
                <div className="gti-section no-left-margin top-align">
                    <p className="trip-property-label">Departure</p>
                    <DateInput setTime={(time) => {this.setDepartureTime(time)}} setDate={(date) => {this.setDepartureDate(date)}} parent={this} defaultDate={this.state.defaultDepartureDate} defaultTime={this.state.defaultDepartureTime} />
                </div>
            </div>
        )
    }
}