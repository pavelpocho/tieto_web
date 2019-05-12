import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import { RippleManager } from '../ripple';
import { Transform } from 'stream';
import DateInput from '../date-input';
import FoodInputWidget from '../food-input-widget';
import CitySuggestions from '../city-suggestions';
import CountrySuggestions from '../country-suggestions';
import HttpCommunicator from '../../utils/http-communicator';

export default class PointDetailInfo extends Component {

    constructor(props) {
        super(props);

        this.wrap = React.createRef();

        if (this.props.location == undefined) return;
        
        this.state = {
            defaultCity: this.props.location && this.props.location.city ? this.props.location.city.name : "",
            defaultCountry: this.props.location && this.props.location.city ? this.props.location.city.country.name : "",
            travel: this.props.location.inboundTravelType,
            citySuggestions: null,
            countrySuggestions: null,
            disableCitySuggestor: false,
            disableCountrySuggestor: false,
            lastCityEdit: Date.now(),
            lastCountryEdit: Date.now()
        }

        this.city = React.createRef();
        this.cityPicker = React.createRef();
        this.countryPicker = React.createRef();
        this.country = React.createRef();
        this.borderCrossRef = React.createRef();
        this.reset = React.createRef();
        this.foodWrap = React.createRef();
        this.inner = React.createRef();
    }

    componentDidMount() {
        RippleManager.setUp();
        if (this.props.location != undefined && this.props.location.id > -1) {
            setTimeout(() => {
                this.animateIn();
            }, 50);
        }
        setTimeout(() => {
            if (this.foodWrap && this.foodWrap.current) {
                var offset = this.foodWrap.current.childNodes[0].offsetHeight;
                offset = offset > 186 ? 186 : offset;
                this.foodWrap.current.style.height = offset + "px";
                if (offset == 186) {
                    this.foodWrap.current.style.overflowY = "scroll";
                }
            }
        }, 50);
    }

    componentDidUpdate() {
        if (this.reset && this.reset.current) RippleManager.setToButton(this.reset.current);
        setTimeout(() => {
            if (this.foodWrap && this.foodWrap.current) {
                var offset = this.foodWrap.current.childNodes[0].offsetHeight;
                offset = offset > 186 ? 186 : offset;
                this.foodWrap.current.style.height = offset + "px";
                if (offset == 186) {
                    this.foodWrap.current.style.overflowY = "scroll";
                }
            }
        }, 50);
        //Needs to be here as well
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

    setCrossTime(time) {
        this.props.parent.setLocationField(this.props.location, "crossedAtTime", time);
    }
    setCrossDate(date) {
        this.props.parent.setLocationField(this.props.location, "crossedAtDate", date);
    }

    setFood(dayIndex, foodIndex) {
        this.props.parent.setFood(this.props.location, dayIndex, foodIndex);
    }

    changeOnlyLocation() {
        this.props.parent.changeOnlyLocation(this.props.location);
    }

    animateIn() {
        if (this.wrap.current) this.wrap.current.style.display = "block";
        if (this.props.animate && this.props.zIndex > 1 && this.wrap.current) {
            this.wrap.current.style.transform = "translateX(0px)";
        }
        if (this.props.animate) {
            setTimeout(() => {
                if (this.wrap.current) {
                    this.wrap.current.style.opacity = "1";
                    this.wrap.current.style.transform = "translateX(0px)";
                }
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
        this.props.parent.setCity(this.props.location, city);
        this.city.current.value = city.name;
        this.country.current.innerHTML = city.country.name;
        setTimeout(() => {
            this.setState({
                citySuggestions: null,
                disableCitySuggestor: true
            })
            setTimeout(() => {
                this.setState({
                    disableCitySuggestor: false
                })
            }, 800);
        }, 310);
    }

    selectFirstCity(target) {
        if (target.value == this.state.defaultCity) {
            return;
        }
        this.cityPicker.current.select(0, true);
    }

    selectCountry(country) {
        if (country == undefined) return;
        this.props.parent.setCountry(this.props.location, country);
        this.country.current.value = country.name;
        setTimeout(() => {
            this.setState({
                countrySuggestions: null,
                disableCountrySuggestor: true
            });
            setTimeout(() => {
                this.setState({
                    disableCountrySuggestor: false
                })
            }, 800);
        }, 310);
    }

    selectFirstCountry(target) {
        if (target.value == this.state.defaultCountry) {
            return;
        }
        this.countryPicker.current.select(0, true);
    }

    //Actually an autocomplete service
    validateCity(target) {
        if (document.activeElement != this.city.current) {
            this.setState({
                citySuggestions: null
            });
            return;
        }
        if (target.value == "") {
            this.setState({
                citySuggestions: null,
                defaultCity: ""
            });
            this.props.parent.setCity(this.props.location, { name: "", country: { name: "" } });
            return;
        }
        if (target.value == this.state.defaultCity) {
            return;
        }
        if (document.activeElement == this.city.current && target.value != "" && target.value != this.state.defaultCity) {
            if (!this.state.disableCitySuggestor) {
                this.setState({
                    citySuggestions: "loading"
                });
            }
        }
        let h = ObjectContainer.getHttpCommunicator();
        h.validateCity(target.value, (v, s) => {
            if (s == 200) {
                if (!this.state.disableCitySuggestor && target.value != "" && target.value != this.state.defaultCity) {
                    this.setState({
                        citySuggestions: v
                    });
                }

                //Validation successful

                //Useful line...
                //this.props.parent.setCity(this.props.location, object);
            }
            else {
                //City validation failed
            }
        });
    }

    //Actually an autocomplete service
    validateCountry(target) {
        if (document.activeElement != this.country.current) {
            this.setState({
                countrySuggestions: null
            });
            return;
        }
        if (target.value == "") {
            this.setState({
                countrySuggestions: null,
                defaultCountry: ""
            });
            this.props.parent.setCountry(this.props.location, { name: "", country: { name: "" } });
            return;
        }
        if (target.value == this.state.defaultCountry) {
            return;
        }
        console.log("Will now set loading");
        if (document.activeElement == this.country.current && target.value != "" && target.value != this.state.defaultCountry) {
            if (!this.state.disableCountrySuggestor) {
                this.setState({
                    countrySuggestions: "loading"
                });
            }
        }
        let h = ObjectContainer.getHttpCommunicator();
        h.validateCountry(target.value, (v, s) => {
            if (s == 200) {
                if (!this.state.disableCountrySuggestor && target.value != "" && target.value != this.state.defaultCountry) {
                    this.setState({
                        countrySuggestions: v
                    });
                }
                //Country validation successful
            }
            else {
                //Country validation failed
            }
        });
    }

    resetModifications() {
        this.props.parent.resetModifications(this.props.location.id);
    }

    render() {

        if (this.props.location == undefined) return null;

        var defaultArrivalTime = this.props.location.arrivalTime;
        var defaultArrivalDate = this.props.location.arrivalDate;
        console.log("Default arrival time is ->");
        console.log(defaultArrivalTime);
        var defaultDepartureTime = this.props.location.departureTime;
        var defaultDepartureDate = this.props.location.departureDate;
        var defaultCrossedAtTime = this.props.location.crossedAtTime;
        var defaultCrossedAtDate = this.props.location.crossedAtDate;
        var previousCrossedAtDate = this.props.location.id > -1 && this.props.location.position > 0 ? this.props.parent.state.tripObject.locations[this.props.location.position - 1] ? this.props.parent.state.tripObject.locations[this.props.location.position - 1].crossedAtDate : null : null;
        var previousDepartureDate = this.props.location.id > -1 && this.props.location.position > 0 ? this.props.parent.state.tripObject.locations[this.props.location.position - 1] ? this.props.parent.state.tripObject.locations[this.props.location.position - 1].departureDate : null : null;
        var twobackDepartureDate = this.props.location.id > -1 && this.props.location.position > 1 ? this.props.parent.state.tripObject.locations[this.props.location.position - 2] ? this.props.parent.state.tripObject.locations[this.props.location.position - 2].departureDate : null : null;

        if (this.props.location.isCrossing) {

            var locs = this.props.parent.state.tripObject.locations;
            var from = "";
            var to = "";
            for (var i = this.props.parent.state.selectedPoint; i < locs.length; i++) {
                if (!locs[i].transit && locs[i].city && locs[i].city.name != "Transit_Country" && !locs[i].isCrossing) {
                    to = locs[i].city.name;
                    break;
                }
            }
            for (var i = this.props.parent.state.selectedPoint; i >= 0; i--) {
                if (!locs[i].transit && locs[i].city && locs[i].city.name != "Transit_Country" && !locs[i].isCrossing) {
                    from = locs[i].city.name;
                    break;
                }
            }
            if (from == "") {
                from = "unnamed city";
            }
            if (to == "") {
                to = "unnamed city";
            }
            //This finds what are the nearest blue points (The code is here twice)

            if (this.props.parent.state.selectedPoint > 0 && this.props.parent.state.selectedPoint < this.props.parent.state.tripObject.locations.length - 1) {
                if (this.props.parent.state.tripObject.locations[this.props.parent.state.selectedPoint - 1].city && this.props.parent.state.tripObject.locations[this.props.parent.state.selectedPoint + 1].city) {
                    this.fromCross = this.props.parent.state.tripObject.locations[this.props.parent.state.selectedPoint - 1].city.country.name;
                    if (this.fromCross == "") from = "unnamed transit country";
                    this.toCross = this.props.parent.state.tripObject.locations[this.props.parent.state.selectedPoint + 1].city.country.name;
                    if (this.toCross == "") to = "unnamed transit country";
                }
            }

            return (
                <div className="pd-wrap" ref={this.wrap} style={!this.props.animate && this.props.location && this.props.location.id > -1 ? {opacity: 1, transform: "translateX(0px)", display: "block", zIndex: this.props.zIndex.toString()} : {zIndex: this.props.zIndex.toString()}}>
                    <span ref={this.inner}>
                        <div className="pd-topbar">
                            <button ripplecolor="gray" className="pd-back" onClick={() => {this.props.pointSelector.select(-1)}}>
                                <i className="material-icons">arrow_back</i>
                                Back
                            </button>
                        </div>
                        <div className="gti-section no-left-margin top-align">
                            <p className="trip-property-label">Border crossing *</p>
                            <DateInput dateKey={"crossedAtDate" + this.props.location.id} timeKey={"crossedAtTime" + this.props.location.id} ref={this.borderCrossRef} setTime={(time) => {this.setCrossTime(time)}} setDate={(date) => {this.setCrossDate(date)}} parent={this} highlightDate={(defaultCrossedAtDate == null || defaultCrossedAtDate == -1) ? (previousDepartureDate == null || previousDepartureDate == -1 ? null : previousDepartureDate) : null} defaultDate={defaultCrossedAtDate} defaultTime={defaultCrossedAtTime} />
                        </div>
                        <div className="pd-transit-info">
                            <p>* Time of border crossing from {this.fromCross} to {this.toCross}</p>
                        </div>
                        {
                            this.props.location.sectionModified ? (
                                <Fragment>
                                    <div className="pdi-reset-separator"></div>
                                    <div className="pdi-reset-wrap">
                                        <p className="pdi-reset-text">You manually changed some info about your travel from {from} to {to}. You can reset the values here.</p>
                                        <button ref={this.reset} ripplecolor="gray" className="pdi-reset-button" onClick={() => {this.resetModifications()}}><i className="material-icons">refresh</i>Reset travel between {from} and {to}</button>
                                    </div>
                                </Fragment>
                            ) : null
                        }
                    </span>
                </div>
            )
        }

        if (this.props.location.transit) {

            var locs = this.props.parent.state.tripObject.locations;
            var from = "";
            var to = "";
            for (var i = this.props.parent.state.selectedPoint; i < locs.length; i++) {
                if (!locs[i].transit && locs[i].city && locs[i].city.name != "Transit_Country" && !locs[i].isCrossing) {
                    to = locs[i].city.name;
                    break;
                }
            }
            for (var i = this.props.parent.state.selectedPoint; i >= 0; i--) {
                if (!locs[i].transit && locs[i].city && locs[i].city.name != "Transit_Country" && !locs[i].isCrossing) {
                    from = locs[i].city.name;
                    break;
                }
            }
            if (from == "") {
                from = "nameless point";
            }
            if (to == "") {
                to = "nameless point";
            }
            //This finds what are the nearest blue points (The code is here twice)

            return (
                <div className="pd-wrap" ref={this.wrap} style={!this.props.animate && this.props.location && this.props.location.id > -1 ? {opacity: 1, transform: "translateX(0px)", display: "block", zIndex: this.props.zIndex.toString()} : {zIndex: this.props.zIndex.toString()}}>
                    <span ref={this.inner}>
                        <div className="pd-topbar">
                            <button ripplecolor="gray" className="pd-back" onClick={() => {this.props.pointSelector.select(-1)}}>
                                <i className="material-icons">arrow_back</i>
                                Back
                            </button>
                            <button title={"Delete this point"} ripplecolor="gray" className="pd-back pd-del" onClick={() => {this.props.parent.removePoint(this.props.location)}}>
                                <i className="material-icons">delete</i>
                                Delete
                            </button>
                        </div>
                        <div className="gti-section no-left-margin above top-align">
                            <p className="trip-property-label">Country *</p>
                            <div className="city-input">
                                <input key={this.props.location && this.props.location.city ? this.props.location.city.country.name : "country_name"} onFocus={() => {this.setState({defaultCountry: this.props.location && this.props.location.city ? this.props.location.city.country.name : ""})}} onBlur={(e) => {this.selectFirstCountry(e.target)}} onKeyUp={(e) => {this.validateCountry(e.target)}} defaultValue={this.props.location ? this.props.location.city ? this.props.location.city.country.name : "" : ""} ref={this.country} placeholder="Country"></input>
                                <CountrySuggestions ref={this.countryPicker} parent={this} suggestions={this.state.disableCountrySuggestor ? null : this.state.countrySuggestions} />
                            </div>
                        </div>
                        <div className="pd-transit-info">
                            <p>* This is a country you passed through when going from {from} to {to}</p>
                        </div>
                        {
                            this.props.location.sectionModified ? (
                                <Fragment>
                                    <div className="pdi-reset-separator"></div>
                                    <div className="pdi-reset-wrap">
                                        <p className="pdi-reset-text">You manually changed some info about your travel from {from} to {to}. You can reset the values here.</p>
                                        <button ref={this.reset} ripplecolor="gray" className="pdi-reset-button" onClick={() => {this.resetModifications()}}><i className="material-icons">refresh</i>Reset travel between {from} and {to}</button>
                                    </div>
                                </Fragment>
                            ) : null
                        }
                    </span>
                </div>
            )
        }

        var foodWidgets = [];
        foodWidgets.push(<FoodInputWidget title={true} key={0}/>);
        if (this.props.location.departureDate != null && this.props.location.departureDate != -1 && this.props.location.arrivalDate != null && this.props.location.arrivalDate != -1 && this.props.location.food) {
            for (var i = 0; i < (this.props.location.departureDate / 24 / 60 / 60000) - (this.props.location.arrivalDate / 24 / 60 / 60000) + 1; i++) {
                let food = this.props.location.food.days[i];
                foodWidgets.push(<FoodInputWidget parent={this} index={i} key={i + 1} food={food} date={(this.props.location.arrivalDate / 24 / 60 / 60000 + i) * 60000 * 60 * 24} />);
            }
        }
        if (foodWidgets.length == 1) {
            foodWidgets.pop();
            foodWidgets.push(<FoodInputWidget key={0} error={true} onlyPoint={this.props.location.onlyLocation} />)
        }

        var arrivalHighlightDate = (defaultArrivalDate == null || defaultArrivalDate == -1) ? (previousCrossedAtDate == null || previousCrossedAtDate == -1 ? (twobackDepartureDate == null || twobackDepartureDate == -1 ? null : twobackDepartureDate) : previousCrossedAtDate) : null;

        var departureHighlightDate = (defaultDepartureDate == null || defaultDepartureDate == -1) ? (defaultArrivalDate == null || defaultArrivalDate == -1 ? null : defaultArrivalDate) : null;

        return (
            <div className="pd-wrap" ref={this.wrap} style={!this.props.animate && this.props.location && this.props.location.id > -1 ? {opacity: 1, transform: "translateX(0px)", display: "block", zIndex: this.props.zIndex.toString()} : {zIndex: this.props.zIndex.toString()}}>
                <span ref={this.inner}>
                    <div className="pd-topbar">
                        <button ripplecolor="gray" className="pd-back" onClick={() => {this.props.pointSelector.select(-1)}}>
                            <i className="material-icons">arrow_back</i>
                            Back
                        </button>
                        <button title={"Delete this point"} ripplecolor="gray" className="pd-back pd-del" onClick={() => {this.props.parent.removePoint(this.props.location)}}>
                            <i className="material-icons">delete</i>
                            Delete
                        </button>
                    </div>
                    {/*Styles for gti-section and trip-property-label are in general-trip-info, because they are the same*/}
                    <div className="gti-section no-left-margin above">
                        <p className="trip-property-label">City</p>
                        <div className="city-input">
                            <input onFocus={() => {this.setState({defaultCity: this.props.location && this.props.location.city ? this.props.location.city.name : ""})}} onBlur={(e) => {this.selectFirstCity(e.target)}} onKeyUp={(e) => {this.validateCity(e.target)}} defaultValue={this.props.location ? this.props.location.city ? this.props.location.city.name : "" : ""} ref={this.city} placeholder="City"></input>
                            <p ref={this.country} className="city-country-info">{this.props.location && this.props.location.city ? this.props.location.city.country.name : ""}</p>
                            <CitySuggestions ref={this.cityPicker} parent={this} suggestions={this.state.disableCitySuggestor ? null : this.state.citySuggestions} />
                        </div>
                    </div>
                    {
                        !this.props.firstPoint || this.props.location.onlyLocation ? (
                            <Fragment>
                                {
                                    !this.props.location.onlyLocation ? (
                                        <div className="gti-section no-left-margin">
                                            <p className="trip-property-label">Inbound travel</p>
                                            <div className="travel-picker">
                                                <button onClick={() => {this.selectTravel(1)}} ripplecolor="gray" className={"tp-button" + (this.state.travel == 1 ? " tp-selected" : "")}><i className="material-icons">directions_car</i><p>Car</p></button>
                                                <button onClick={() => {this.selectTravel(2)}} ripplecolor="gray" className={"tp-button" + (this.state.travel == 2 ? " tp-selected" : "")}><i className="material-icons">train</i><p>Bus / Train</p></button>
                                                <button onClick={() => {this.selectTravel(4)}} ripplecolor="gray" className={"tp-button" + (this.state.travel == 4 ? " tp-selected" : "")}><i className="material-icons">directions_boat</i><p>Ship</p></button>
                                                <button onClick={() => {this.selectTravel(3)}} ripplecolor="gray" className={"tp-button" + (this.state.travel == 3 ? " tp-selected" : "")}><i className="material-icons" style={{transform: "rotate(45deg)"}}>airplanemode_active</i><p>Plane</p></button>
                                            </div>
                                        </div>
                                    ) : null
                                }
                                <div className="gti-section no-left-margin top-align">
                                    <p className="trip-property-label">Provided food</p>
                                    <div ref={this.foodWrap} className="trip-point-food-wrap">
                                        <div>
                                            { foodWidgets }
                                        </div>
                                    </div>
                                </div>
                                <div className="gti-section no-left-margin top-align">
                                    <p className="trip-property-label">{this.props.location.onlyLocation ? "Start" : "Arrival"}</p>
                                    <DateInput dateKey={"arrivalDate" + this.props.location.id} timeKey={"arrivalTime" + this.props.location.id} setTime={(time) => {this.setArrivalTime(time)}} setDate={(date) => {this.setArrivalDate(date)}} parent={this} highlightDate={arrivalHighlightDate} defaultDate={defaultArrivalDate} defaultTime={defaultArrivalTime} />
                                </div>
                            </Fragment>
                        ) : null
                        //Here it is
                    }
                    <div className="gti-section no-left-margin top-align">
                        <p className="trip-property-label">{this.props.location.onlyLocation ? "End" : "Departure"}</p>
                        <DateInput dateKey={"departureDate" + this.props.location.id} timeKey={"departureTime" + this.props.location.id} setTime={(time) => {this.setDepartureTime(time)}} setDate={(date) => {this.setDepartureDate(date)}} parent={this} highlightDate={departureHighlightDate} defaultDate={defaultDepartureDate} defaultTime={defaultDepartureTime} />
                    </div>
                    {
                        this.props.firstPoint && this.props.parent.state.tripObject.locations.length == 1 ? (
                            <div className="gti-section no-left-margin top-align" style={{marginTop: "30px"}}>
                                <p className="trip-property-label">Only Point</p>
                                <button ripplecolor="gray" className="pd-only-point-button" onClick={() => {this.changeOnlyLocation()}}>
                                    <div className={"fiw-checkbox" + (this.props.location.onlyLocation ? " checked" : "")}>
                                        <i className="material-icons">done</i>
                                    </div>
                                    <p>Set as Only Point</p>
                                </button>
                            </div>
                        ) : null
                    }
                </span>
            </div>
        )
    }
}