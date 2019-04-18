import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import { RippleManager } from '../ripple';
import SaveIndicator from '../save-indicator';
import TripReceipt from '../trip-receipt';
import PointSelector from '../point-selector';
import Trip from '../../utils/trip';
import GeneralTripInfo from '../general-trip-info';
import PointDetailInfo from '../point-detail-info';
import Location from '../../utils/location';
import MainButton from '../main-button';

export default class TripActivity extends Component {

    constructor(props) {
        super(props);

        var trip = null;
        if (this.props.trip) {
            var locations = this.props.trip.locations;
            for (var i = 0; i < locations.length; i++) {
                if (locations[i].deleted) {
                    locations.splice(i, 1);
                    i--;
                }
            }

            locations.sort((a, b) => a.position - b.position);

            console.log("Opening trip");
            console.log(this.props.trip);

            trip = this.props.trip;
            trip.locations = locations;
        }

        this.state = {
            tripObject: trip ? trip : new Trip(0, "", "", "", "", []),
            selectedPoint: -1,
            animate: true
        }

        this.ref = React.createRef();
        this.saveIndicator = React.createRef();
        this.backFunctionTarget = React.createRef();
        this.pointDetails = React.createRef();
        this.receipt = React.createRef();
    }

    componentDidMount() {
        console.log("Saving this trip right now ->");
        console.log(this.props.trip);
        this.forceSave(this.props.trip, () => {
            this.ref.current.style.transform = "translateX(0px)";
            this.ref.current.style.opacity = "1";
            console.log("Opened trip ->");
            console.log(this.state.tripObject);
        });
        //This is crucial here, so that later saving can only save specific fields
        RippleManager.setUp();
        window.onkeydown = (stroke) => {
            if (stroke.keyCode == 83 && stroke.ctrlKey) {
                stroke.preventDefault();
                this.forceSave(null, () => {});
            }
        }
        window.onbeforeunload = e => {
            return "";
        }
    }

    saveChanges() {
        var http = ObjectContainer.getHttpCommunicator();
        http.saveTrip(this.state.tripObject);
    }

    setFood(location, dayIndex, foodIndex) {
        var h = ObjectContainer.getHttpCommunicator();
        this.saveIndicator.current.setStatus(1);
        h.saveFood(location.id, dayIndex, foodIndex, (r, s) => {
            if (s == 200) {
                console.log("Food saving successful");
                this.saveIndicator.current.setStatus(0);
                this.setState((prevState) => {
                    var t = prevState.tripObject;
                    var l = null;
                    for (var i = 0; i < t.locations.length; i++) {
                        if (t.locations[i].id == location.id) {
                            l = t.locations[i];
                            break;
                        }
                    }
                    if (l == null) return null;
                    if (dayIndex == 0 && l.food.onlyDay != null) {
                        l.food.onlyDay[foodIndex == 0 ? "breakfast" : foodIndex == 1 ? "lunch" : "dinner"] = !l.food.onlyDay[foodIndex == 0 ? "breakfast" : foodIndex == 1 ? "lunch" : "dinner"];
                    }
                    else if (dayIndex == 0 && l.food.firstDay != null) {
                        l.food.firstDay[foodIndex == 0 ? "breakfast" : foodIndex == 1 ? "lunch" : "dinner"] = !l.food.firstDay[foodIndex == 0 ? "breakfast" : foodIndex == 1 ? "lunch" : "dinner"]
                    }
                    else if (dayIndex == l.food.middleDays.length + 1) {
                        l.food.lastDay[foodIndex == 0 ? "breakfast" : foodIndex == 1 ? "lunch" : "dinner"] = !l.food.lastDay[foodIndex == 0 ? "breakfast" : foodIndex == 1 ? "lunch" : "dinner"]
                    }
                    else {
                        l.food.middleDays[dayIndex - 1][foodIndex == 0 ? "breakfast" : foodIndex == 1 ? "lunch" : "dinner"] = !l.food.middleDays[dayIndex - 1][foodIndex == 0 ? "breakfast" : foodIndex == 1 ? "lunch" : "dinner"]
                    }
                })
            }
            else {
                console.log("Food saving failed");
                this.saveIndicator.current.setStatus(2);
            }
        });
    }

    setLocationField(location, field, value) {
        this.saveIndicator.current.setStatus(1);
        var h = ObjectContainer.getHttpCommunicator();
        this.setState((prevState) => {
            var ls = prevState.tripObject.locations;
            for (var i = 0; i < ls.length; i++) {
                if (ls[i] == location) {
                    ls[i][field] = value;
                }
            }
            var tripObject = prevState.tripObject;
            tripObject.locations = ls;
            return {
                tripObject
            }
        });
        if (field == "inboundTravelType") {
            h.saveInboundTravel(location.id, (r, s) => {
                if (s == 200) {
                    this.saveIndicator.current.setStatus(0);
                    var realTrip = new Trip();
                    Object.assign(realTrip, JSON.parse(r));
                    var selection = this.backFunctionTarget.current.getSelection() + realTrip.locations.length - this.state.tripObject.locations.length;
                    if (selection < 0) {
                        this.backFunctionTarget.current.select(selection);
                        this.backFunctionTarget.current.forceUpdate();    
                    }
                    this.setState({tripObject: realTrip});
                    console.log("Saving this new trip as tripObject ->");
                    console.log(realTrip);
                    console.log("Travel type save successful");
                    if (selection >= 0) {
                        this.backFunctionTarget.current.select(selection);
                        this.backFunctionTarget.current.forceUpdate();
                    }
                }
                else {
                    this.saveIndicator.current.setStatus(2);
                    console.log("Travel type save failed");
                }
            }, value);
        }
        else if (field == "arrivalTime") {
            h.saveArrivalTime(location.id, (r, s) => {
                if (s == 200) {
                    this.saveIndicator.current.setStatus(0);
                    var realTrip = new Trip();
                    Object.assign(realTrip, JSON.parse(r));
                    var selection = this.backFunctionTarget.current.getSelection() + realTrip.locations.length - this.state.tripObject.locations.length;
                    if (selection < 0) {
                        this.backFunctionTarget.current.select(selection);
                        this.backFunctionTarget.current.forceUpdate();    
                    }
                    this.setState({tripObject: realTrip});
                    console.log("Saving this new trip as tripObject ->");
                    console.log(realTrip);
                    console.log("Arrival time save successful");
                    if (selection >= 0) {
                        this.backFunctionTarget.current.select(selection);
                        this.backFunctionTarget.current.forceUpdate();
                    }
                }
                else {
                    this.saveIndicator.current.setStatus(2);
                    console.log("Arrival time save failed");
                }
            }, value);
        }
        else if (field == "departureTime") {
            h.saveDepartureTime(location.id, (r, s) => {
                if (s == 200) {
                    this.saveIndicator.current.setStatus(0);
                    var realTrip = new Trip();
                    Object.assign(realTrip, JSON.parse(r));
                    var selection = this.backFunctionTarget.current.getSelection() + realTrip.locations.length - this.state.tripObject.locations.length;
                    if (selection < 0) {
                        this.backFunctionTarget.current.select(selection);
                        this.backFunctionTarget.current.forceUpdate();    
                    }
                    this.setState({tripObject: realTrip});
                    console.log("Saving this new trip as tripObject ->");
                    console.log(realTrip);
                    console.log("Departure time save successful");
                    if (selection >= 0) {
                        this.backFunctionTarget.current.select(selection);
                        this.backFunctionTarget.current.forceUpdate();
                    }
                }
                else {
                    this.saveIndicator.current.setStatus(2);
                    console.log("Departure time save failed");
                }
            }, value);
        }
        else if (field == "arrivalDate") {
            h.saveArrivalDate(location.id, (r, s) => {
                if (s == 200) {
                    this.saveIndicator.current.setStatus(0);
                    var realTrip = new Trip();
                    Object.assign(realTrip, JSON.parse(r));
                    var selection = this.backFunctionTarget.current.getSelection() + realTrip.locations.length - this.state.tripObject.locations.length;
                    if (selection < 0) {
                        this.backFunctionTarget.current.select(selection);
                        this.backFunctionTarget.current.forceUpdate();
                    }
                    this.setState({tripObject: realTrip});
                    console.log("Saving this new trip as tripObject ->");
                    console.log(realTrip);
                    console.log("Arrival date save successful");
                    if (selection >= 0) {
                        this.backFunctionTarget.current.select(selection);
                        this.backFunctionTarget.current.forceUpdate();
                    }
                }
                else {
                    this.saveIndicator.current.setStatus(2);
                    console.log("Arrival date save failed");
                }
            }, value);
        }
        else if (field == "departureDate") {
            h.saveDepartureDate(location.id, (r, s) => {
                if (s == 200) {
                    this.saveIndicator.current.setStatus(0);
                    var realTrip = new Trip();
                    Object.assign(realTrip, JSON.parse(r));
                    var selection = this.backFunctionTarget.current.getSelection() + realTrip.locations.length - this.state.tripObject.locations.length;
                    if (selection < 0) {
                        this.backFunctionTarget.current.select(selection);
                        this.backFunctionTarget.current.forceUpdate();
                    }
                    this.setState({tripObject: realTrip});
                    console.log("Saving this new trip as tripObject ->");
                    console.log(realTrip);
                    console.log("Departure date save successful");
                    if (selection >= 0) {
                        this.backFunctionTarget.current.select(selection);
                        this.backFunctionTarget.current.forceUpdate();
                    }
                    this.receipt.current.forceUpdate();
                }
                else {
                    this.saveIndicator.current.setStatus(2);
                    console.log("Departure date save failed");
                }
            }, value);
        }
    }

    setCity(location, city) {

        let h = ObjectContainer.getHttpCommunicator();

        h.saveCity(location.id, (r, s) => {
            if (s == 200) {
                this.saveIndicator.current.setStatus(0);
                console.log("saved the city");
            }
            else {
                this.saveIndicator.current.setStatus(2);
                console.log("city saving failed...")
            }
        }, [city.name, city.country.name, city.googlePlaceId]);
        
        this.setState((prevState) => {
            var ls = prevState.tripObject.locations;
            for (var i = 0; i < ls.length; i++) {
                if (ls[i] == location) {
                    if (ls[i].city == null) ls[i].city = {};
                    ls[i].city.country = city.country;
                    ls[i].city.name = city.name;
                    ls[i].city.googlePlaceId = city.googlePlaceId;
                    ls[i].city.countryID = city.country.id;
                }
            }
            var tripObject = prevState.tripObject;
            tripObject.locations = ls;
            return {
                tripObject
            }
        })
    }

    update(field, value) {
        this.setState((prevState) => {

            var tr = prevState.tripObject;
            tr[field] = value;

            return {
                tripObject: tr
            }
        });
    }

    setBorderCross(locationId, millis) {
        this.saveIndicator.current.setStatus(1);
        var h = ObjectContainer.getHttpCommunicator();
        h.setBorderCross(locationId, millis, (r, s) => {
            if (s == 200) {
                this.saveIndicator.current.setStatus(0);
                this.setState(prevState => {
                    var t = prevState.tripObject;
                    for (var i = 0; i < t.locations.length; i++) {
                        if (t.locations[i].id == locationId) {
                            t.locations[i].crossedAt = millis;
                        }
                    }
                    return {
                        tripObject: t
                    }
                })
                console.log("Border cross time save successful");
            }
            else {
                this.saveIndicator.current.setStatus(2);
                console.log("Border cross time save failed");
            }
        });
    }

    autoSave(field, value) {
        this.saveIndicator.current.setStatus(1);
        var h = ObjectContainer.getHttpCommunicator();
        if (field == "title") {
            h.saveTitle(this.state.tripObject.id, value, (r, s) => {
                if (s == 200) {
                    this.saveIndicator.current.setStatus(0);
                    this.setState((prevState) => {

                        var tr = prevState.tripObject;
                        tr[field] = value;
    
                        return {
                            tripObject: tr
                        }
                    });
                }
                else {
                    this.saveIndicator.current.setStatus(2)
                }
            })
        }
        if (field == "purpose") {
            h.savePurpose(this.state.tripObject.id, value, (r, s) => {
                if (s == 200) {
                    this.saveIndicator.current.setStatus(0);
                    this.setState((prevState) => {

                        var tr = prevState.tripObject;
                        tr[field] = value;
    
                        return {
                            tripObject: tr
                        }
                    });
                }
                else {
                    this.saveIndicator.current.setStatus(2)
                }
            })
        }
        if (field == "project") {
            h.saveProject(this.state.tripObject.id, value, (r, s) => {
                if (s == 200) {
                    this.saveIndicator.current.setStatus(0);
                    this.setState((prevState) => {

                        var tr = prevState.tripObject;
                        tr[field] = value;
    
                        return {
                            tripObject: tr
                        }
                    });
                }
                else {
                    this.saveIndicator.current.setStatus(2)
                }
            })
        }
        if (field == "task") {
            h.saveTask(this.state.tripObject.id, value, (r, s) => {
                if (s == 200) {
                    this.saveIndicator.current.setStatus(0);
                    this.setState((prevState) => {

                        var tr = prevState.tripObject;
                        tr[field] = value;
    
                        return {
                            tripObject: tr
                        }
                    });
                }
                else {
                    this.saveIndicator.current.setStatus(2)
                }
            })
        }
        if (field == "comment") {
            h.saveComment(this.state.tripObject.id, value, (r, s) => {
                if (s == 200) {
                    this.saveIndicator.current.setStatus(0);
                    this.setState((prevState) => {

                        var tr = prevState.tripObject;
                        tr[field] = value;
    
                        return {
                            tripObject: tr
                        }
                    });
                }
                else {
                    this.saveIndicator.current.setStatus(2)
                }
            })
        }
    }

    close() {
        window.onkeydown = null;
        window.onbeforeunload = null;
        this.forceSave(undefined, () => {
            this.ref.current.style.opacity = "0";
            this.ref.current.style.transform = "translateX(40px)";
            this.props.container.closeLastActivity();
        });
    }

    saveCreatedLocation(l, callback) {
        var h = ObjectContainer.getHttpCommunicator();
        this.saveIndicator.current.setStatus(1);
        var t = this.state.tripObject;
        t.locations = l;
        h.saveAndReturnTrip(t, (r, s) => {
            if (s == 200) {
                this.saveIndicator.current.setStatus(0);
                var realTrip = new Trip();
                Object.assign(realTrip, JSON.parse(r));
                this.setState({
                    tripObject: realTrip
                });
                console.log("Returned this trip from point creation ->");
                console.log(realTrip);
                callback(realTrip);
            }
            else {
                this.saveIndicator.current.setStatus(2)
            }
        })
    }

    forceSave(t, callback) {
        var h = ObjectContainer.getHttpCommunicator();
        this.saveIndicator.current.setStatus(1);
        h.saveTrip(t ? t : this.state.tripObject, (r, s) => {
            if (s == 200) {
                this.saveIndicator.current.setStatus(0);
                callback(r);
                this.setState((prevState) => {

                    var tr = prevState.tripObject;
                    tr.id = r;

                    return {
                        tripObject: tr
                    }
                })
            }
            else {
                this.saveIndicator.current.setStatus(2)
            }
        })
    }

    setPointArray(locationArray) {
        this.setState((prevState) => {

            let t = prevState.tripObject;
            t.locations = locationArray;

            return {
                tripObject: t
            }
        })
    }

    selectPoint(i) {
        if (i == this.state.selectedPoint) return;
        if (i == -1) {
            this.pointDetails.current.animateOut();
            setTimeout(() => {
                this.setState({
                    selectedPoint: i
                })
            }, 350);
        }
        else {

            this.setState((prevState) => {

                return {
                    selectedPoint: i,
                    animate: prevState.selectedPoint == -1
                }
            })
        }
        
    }

    export() {
        var h = ObjectContainer.getHttpCommunicator();
        this.forceSave(null, (id) => {
            h.getExportToken(id, (t, s) => {
                if (s == 200 && t != "") {
                    if (t == null) {
                        //Incomplete info.. handle gracefully
                        console.log("Incomplete trip info.. will not export");
                    }
                    h.exportTrip(t, (w) => {
                        if (w != null) {
                            this.state.tripObject.exported = true;
                            //Export successful
                            console.log("Export successful"); 
                        }
                        else {
                            console.log("Export failed");
                            //Export failed...
                        }
                    })
                }
                else {
                    console.log("Export failed");
                    //Export failed...
                }
            });
        });
    }

    removePoint(location) {
        this.selectPoint(-1);
        this.backFunctionTarget.current.clearSelection();
        var h = ObjectContainer.getHttpCommunicator();
        this.saveIndicator.current.setStatus(1);
        var ids = [];
        for (var i = 0; i < this.state.tripObject.locations.length; i++) {
            if (this.state.tripObject.locations[i].id == location.id) {
                var j = i;
                this.setState(prevState => {
                    var ls = prevState.tripObject.locations;
                    ids.push(prevState.tripObject.locations[j].id);
                    if (j != 0) {
                        //unshift because first must be first for the API to work
                        ids.unshift(prevState.tripObject.locations[j - 1].id);
                    }
                    else if (prevState.tripObject.locations.length == 1) {
                        //Nothing
                    }
                    else {
                        ids.push(prevState.tripObject.locations[j + 1].id);
                    }
                    h.deleteLocation(ids, (r, s) => {
                        if (s == 200) {
                            console.log("Location deleted...");
                            this.saveIndicator.current.setStatus(0);
                        }
                        else {
                            console.log("Deleting location failed");
                            this.saveIndicator.current.setStatus(2);
                        }
                    });
                    if (j != 0) {
                        ls.splice(j - 1, 2);
                    }
                    else if (prevState.tripObject.locations.length == 1) {
                        ls.splice(j, 1);
                    }
                    else {
                        ls.splice(j, 2);
                    }
                    var t = prevState.tripObject;
                    t.locations = ls;
                    return {
                        tripObject: t
                    }
                })
            }
        }
    }

    render() {

        console.log("Passing in locations right now");

        return (
            <div className="activity" id="trip-activity" ref={this.ref}>
                <div className="top-bar">
                    <button ripplecolor="gray" onClick={() => {this.close()}} className="back-button"><i className="material-icons back-icon">arrow_back</i>Trip list</button>
                    <SaveIndicator ref={this.saveIndicator} parent={this} name={this.state.tripObject.title}/>
                </div>
                <div className="trip-activity-content">
                    {
                        window.innerWidth >= 1550 ? (
                            <div className="receipt-content">
                                <TripReceipt ref={this.receipt} rates={this.state.tripObject.exchange}/>
                            </div>
                        ) : null
                    }
                    {
                        window.innerWidth < 1100 ? (
                            <Fragment>
                                <div className="main-content">
                                    {
                                        <Fragment>
                                            <GeneralTripInfo parent={this} title={this.state.tripObject.title} purpose={this.state.tripObject.purpose} project={this.state.tripObject.project} task={this.state.tripObject.task} comment={this.state.tripObject.comment} />
                                            <PointDetailInfo firstPoint={this.state.selectedPoint == 0} animate={this.state.animate} key={this.state.selectedPoint} parent={this} ref={this.pointDetails} backFunctionTarget={this.backFunctionTarget.current} location={this.state.selectedPoint == -1 ? new Location(-1, null, null, null, null, {name: "", country: { name: ""}}) : this.state.tripObject.locations[this.state.selectedPoint]}/>
                                            {
                                                window.innerWidth < 1550 ? (
                                                <div className="absolute-receipt-content">
                                                    <TripReceipt ref={this.receipt} collapsed={true} rates={this.state.tripObject.exchange}/>
                                                </div>
                                            ) : null}
                                        </Fragment>
                                    }
                                </div>
                                <div className="middle-content">
                                    <PointSelector parent={this} ref={this.backFunctionTarget} locations={this.state.tripObject.locations} />
                                </div>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <div className="middle-content">
                                    <PointSelector parent={this} ref={this.backFunctionTarget} locations={this.state.tripObject.locations} />
                                </div>
                                <div className="main-content">
                                    {
                                        <Fragment>
                                            <GeneralTripInfo parent={this} title={this.state.tripObject.title} purpose={this.state.tripObject.purpose} project={this.state.tripObject.project} task={this.state.tripObject.task} comment={this.state.tripObject.comment} />
                                            <PointDetailInfo firstPoint={this.state.selectedPoint == 0} animate={this.state.animate} key={this.state.selectedPoint} parent={this} ref={this.pointDetails} backFunctionTarget={this.backFunctionTarget.current} location={this.state.selectedPoint == -1 ? new Location(-1, null, null, null, null, {name: "", country: { name: ""}}) : this.state.tripObject.locations[this.state.selectedPoint]}/>
                                            {window.innerWidth < 1550 ? (
                                                <div className="absolute-receipt-content">
                                                    <TripReceipt ref={this.receipt} collapsed={true} rates={this.state.tripObject.exchange}/>
                                                </div>
                                            ) : null}
                                        </Fragment>
                                    }
                                </div>
                            </Fragment>
                        )
                    }
                    
                </div>
            </div>
        )

    }

}