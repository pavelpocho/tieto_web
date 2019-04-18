import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import { RippleManager } from '../ripple';
import { Transform } from 'stream';
import DateInput from '../date-input';
import FoodInputWidget from '../food-input-widget';
import CitySuggestions from '../city-suggestions';
import HttpCommunicator from '../../utils/http-communicator';

export default class PointDetailInfo extends Component {

    constructor(props) {
        super(props);

        this.wrap = React.createRef();

        if (this.props.location == undefined) return;
        
        this.state = {
            defaultCity: this.props.location && this.props.location.city ? this.props.location.city.name : "",
            travel: this.props.location.inboundTravelType,
            defaultArrivalTime: this.props.location.arrivalTime,
            defaultArrivalDate: this.props.location.arrivalDate,
            defaultDepartureTime: this.props.location.departureTime,
            defaultDepartureDate: this.props.location.departureDate,
            citySuggestions: null,
            lastCityEdit: Date.now()
        }

        this.city = React.createRef();
        this.cityPicker = React.createRef();
        this.country = React.createRef();
    }

    componentDidMount() {
        RippleManager.setUp();
        if (this.props.location == undefined) {
            this.props.parent.selectPoint(-1);
        }
        if (this.props.location.id > -1) {
            setTimeout(() => {
                this.animateIn();
            }, 20);
        }
    }

    componentDidUpdate() {
        if (this.props.location == undefined) {
            this.props.parent.selectPoint(-1);
        }
    }

    selectTravel(index) {
        if (index == this.state.travel) {
            this.setState({
                travel: -1
            })
            this.props.parent.setLocationField(this.props.location, "inboundTravelType", -1);
        }
        else {
            this.setState({
                travel: index
            })
            this.props.parent.setLocationField(this.props.location, "inboundTravelType", index);
        }
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

    setFood(dayIndex, foodIndex) {
        this.props.parent.setFood(this.props.location, dayIndex, foodIndex);
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
        if (this.wrap.current) {
            this.wrap.current.style.opacity = "0";
            this.wrap.current.style.transform = "translateX(40px)";
        }
    }

    selectCity(city) {
        console.log("Selecting a city ->");
        console.log(city);
        this.props.parent.setCity(this.props.location, city);
        this.city.current.value = city.name;
        this.country.current.innerHTML = city.country.name;
        setTimeout(() => {
            this.setState({
                citySuggestions: null
            })
        }, 310);
    }

    selectFirstCity(target) {
        if (target.value == this.state.defaultCity) {
            return;
        }
        this.cityPicker.current.select(0);
    }

    //Actually an autocomplete service
    validateCity(target) {
        if (this.state.lastCityEdit > Date.now() - 200) {
            return;
        }
        this.setState({
            lastCityEdit: Date.now()
        })
        if (target.value == "") {
            this.setState({
                citySuggestions: null
            });
            this.props.parent.setCity(this.props.location, { name: "", country: { name: "" } });
            return;
        }
        if (target.value == this.state.defaultCity) {
            return;
        }
        let h = ObjectContainer.getHttpCommunicator();
        h.validateCity(target.value, (v, s) => {
            if (s == 200) {
                this.setState({
                    citySuggestions: v
                });

                console.log("City validation successful");

                //Useful line...
                //this.props.parent.setCity(this.props.location, object);
            }
            else {
                console.log("City validation failed..");
                //City validation failed
            }
        });
    }

    render() {

        if (this.props.location == undefined) return null;

        if (this.props.location.transit) {
            return (
                <div className="pd-wrap" ref={this.wrap} style={!this.props.animate && this.props.location && this.props.location.id > -1 ? {opacity: 1, transform: "translateX(0px)", display: "block"} : {}}>
                    <div className="pd-topbar">
                        <button ripplecolor="gray" className="pd-back" onClick={() => {this.props.backFunctionTarget.select(-1)}}>
                            <i className="material-icons">arrow_back</i>
                            Back
                        </button>
                        <button ripplecolor="gray" className="pd-back pd-no-text" onClick={() => {this.props.parent.removePoint(this.props.location)}}>
                            <i className="material-icons">delete</i>
                            <p>Delete this point</p>
                        </button>
                    </div>
                    <div className="pd-transit-info">
                        <i className="material-icons">info</i><p>This is a country you passed through.</p>
                    </div>
                    <div className="gti-section no-left-margin above">
                        <p className="trip-property-label">Country</p>
                        {/*<div className="city-input">
                            <input onFocus={() => {this.setState({defaultCity: this.props.location && this.props.location.city ? this.props.location.city.name : ""})}} onBlur={(e) => {this.selectFirstCity(e.target)}} onKeyUp={(e) => {this.validateCity(e.target)}} defaultValue={this.props.location ? this.props.location.city ? this.props.location.city.name : "" : ""} ref={this.city} placeholder="City"></input>
                            <p ref={this.country} className="city-country-info">{this.props.location && this.props.location.city ? this.props.location.city.country.name : ""}</p>
                            <CitySuggestions ref={this.cityPicker} parent={this} suggestions={this.state.citySuggestions} />
                        </div> Replace with a similar suggestion thing but for countries*/}
                        <input placeholder={"Country"} defaultValue={this.props.location.city.country.name}/>
                    </div>
                </div>
            )
        }

        var foodWidgets = [];
        foodWidgets.push(<FoodInputWidget title={true} key={0}/>);
        if (this.props.location.departureDate / 24 / 60 / 60000 != 0 && this.props.location.arrivalDate / 24 / 60 / 60000 != 0 && this.props.location.food) {
            for (var i = 0; i < (this.props.location.departureDate / 24 / 60 / 60000) - (this.props.location.arrivalDate / 24 / 60 / 60000) + 1; i++) {
                let food;
                if (this.props.location.food.onlyDay != null) {
                    food = this.props.location.food.onlyDay;
                }
                else if (i == 0) {
                    food = this.props.location.food.firstDay;
                }
                else if (i == (this.props.location.departureDate / 24 / 60 / 60000) - (this.props.location.arrivalDate / 24 / 60 / 60000)) {
                    food = this.props.location.food.lastDay;
                }
                else {
                    food = this.props.location.food.middleDays[i - 1];
                }
                foodWidgets.push(<FoodInputWidget parent={this} index={i} key={i + 1} food={food} date={(this.props.location.arrivalDate / 24 / 60 / 60000 + i) * 60000 * 60 * 24} />);
            }
        }
        if (foodWidgets.length == 1) {
            foodWidgets.pop();
            foodWidgets.push(<FoodInputWidget key={0} error={true} />)
        }

        return (
            <div className="pd-wrap" ref={this.wrap} style={!this.props.animate && this.props.location && this.props.location.id > -1 ? {opacity: 1, transform: "translateX(0px)", display: "block"} : {}}>
                <div className="pd-topbar">
                    <button ripplecolor="gray" className="pd-back" onClick={() => {this.props.backFunctionTarget.select(-1)}}>
                        <i className="material-icons">arrow_back</i>
                        Back
                    </button>
                    <button ripplecolor="gray" className="pd-back pd-no-text" onClick={() => {this.props.parent.removePoint(this.props.location)}}>
                        <i className="material-icons">delete</i>
                        <p>Delete this point</p>
                    </button>
                </div>
                {/*Styles for gti-section and trip-property-label are in general-trip-info, because they are the same*/}
                <div className="gti-section no-left-margin above">
                    <p className="trip-property-label">City</p>
                    <div className="city-input">
                        <input onFocus={() => {this.setState({defaultCity: this.props.location && this.props.location.city ? this.props.location.city.name : ""})}} onBlur={(e) => {this.selectFirstCity(e.target)}} onKeyUp={(e) => {this.validateCity(e.target)}} defaultValue={this.props.location ? this.props.location.city ? this.props.location.city.name : "" : ""} ref={this.city} placeholder="City"></input>
                        <p ref={this.country} className="city-country-info">{this.props.location && this.props.location.city ? this.props.location.city.country.name : ""}</p>
                        <CitySuggestions ref={this.cityPicker} parent={this} suggestions={this.state.citySuggestions} />
                    </div>
                </div>
                {
                    !this.props.firstPoint ? (
                        <Fragment>
                            <div className="gti-section no-left-margin">
                                <p className="trip-property-label">Inbound travel</p>
                                <div className="travel-picker">
                                    <button onClick={() => {this.selectTravel(1)}} ripplecolor="gray" className={"tp-button" + (this.state.travel == 1 ? " tp-selected" : "")}><i className="material-icons">directions_car</i><p>Car</p></button>
                                    <button onClick={() => {this.selectTravel(2)}} ripplecolor="gray" className={"tp-button" + (this.state.travel == 2 ? " tp-selected" : "")}><i className="material-icons">train</i><p>Bus / Train</p></button>
                                    <button onClick={() => {this.selectTravel(4)}} ripplecolor="gray" className={"tp-button" + (this.state.travel == 4 ? " tp-selected" : "")}><i className="material-icons">directions_boat</i><p>Ship</p></button>
                                    <button onClick={() => {this.selectTravel(3)}} ripplecolor="gray" className={"tp-button" + (this.state.travel == 3 ? " tp-selected" : "")}><i className="material-icons" style={{transform: "rotate(45deg)"}}>airplanemode_active</i><p>Plane</p></button>
                                </div>
                            </div>
                            <div className="gti-section no-left-margin top-align">
                                <p className="trip-property-label">Provided food</p>
                                <div className="trip-point-food-wrap">
                                    { foodWidgets }
                                </div>
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