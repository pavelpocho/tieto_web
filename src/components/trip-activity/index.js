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
import Spinner from '../spinner';
import ExportDialog from '../export-dialog';

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

            trip = this.props.trip;
            trip.locations = locations;
        }

        this.state = {
            tripObject: trip ? trip : new Trip(0, "", "", "", "", []),
            firstSelectedPoint: -1,
            secondSelectedPoint: -2,
            selectedPoint: -1,
            //This is the last and therefore currently active point (for the other parts of the app), it's the INDEX
            lastSelect: 2,
            animate: true,
            pendingRequests: 0,
            highestZ: 0,
            firstZ: 0,
            secondZ: 0
        }

        this.ref = React.createRef();
        this.saveIndicator = React.createRef();
        this.pointSelector = React.createRef();
        this.firstPointDetails = React.createRef();
        this.secondPointDetails = React.createRef();
        this.receipt = React.createRef();
        this.spinner = React.createRef();
    }

    componentDidMount() {
        if (this.state.tripObject.id == 0) {
            this.forceSave(this.state.tripObject, () => {
                this.spinner.current.ref.current.style.display = "none";
                this.ref.current.style.transform = "translateX(0px)";
                this.ref.current.style.opacity = "1";
            });
        }
        else {
            this.spinner.current.ref.current.style.display = "none";
            setTimeout(() => {                
                this.ref.current.style.transform = "translateX(0px)";
                this.ref.current.style.opacity = "1";
            }, 50);
        }
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

    setFood(location, dayIndex, foodIndex) {
        var h = ObjectContainer.getHttpCommunicator();
        this.saveIndicator.current.setStatus(1);
        this.setState(prevState => {
            return {
                pendingRequests: prevState.pendingRequests + 1
            }
        })
        h.saveFood(location.id, dayIndex, foodIndex, (r, s) => {
            this.locFieldCallback(r, s);
        });
    }

    setLocationField(location, field, value) {
        this.saveIndicator.current.setStatus(1);
        this.setState(prevState => {
            return {
                pendingRequests: prevState.pendingRequests + 1
            }
        })
        var h = ObjectContainer.getHttpCommunicator();
        if (field == "inboundTravelType") {
            h.saveInboundTravel(location.id, (r, s) => {this.locFieldCallback(r, s)}, value);
        }
        else if (field == "arrivalTime") {
            h.saveArrivalTime(location.id, (r, s) => {this.locFieldCallback(r, s)}, value);
        }
        else if (field == "departureTime") {
            h.saveDepartureTime(location.id, (r, s) => {this.locFieldCallback(r, s)}, value);
        }
        else if (field == "arrivalDate") {
            console.log("Setting arrival date");
            h.saveArrivalDate(location.id, (r, s) => {this.locFieldCallback(r, s)}, value);
        }
        else if (field == "departureDate") {
            h.saveDepartureDate(location.id, (r, s) => {this.locFieldCallback(r, s)}, value);
        }
        else if (field == "crossedAtDate") {
            h.saveCrossedAtDate(location.id, (r, s) => {this.locFieldCallback(r, s)}, value);
        }
        else if (field == "crossedAtTime") {
            h.saveCrossedAtTime(location.id, (r, s) => {this.locFieldCallback(r, s)}, value);
        }
    }

    locFieldCallback(r, s) {
        console.log("Getting a locFieldCallback");
        if (s == 200) {
            if (this.state.pendingRequests == 1) {
                this.saveIndicator.current.setStatus(0);
            }
            var realTrip = new Trip();
            Object.assign(realTrip, r);
            console.log(realTrip);

            var oldIds = this.state.tripObject.locations.map(l => l.id);
            var newIds = realTrip.locations.map(l => l.id);

            if (newIds.length < oldIds.length) {

                var lookingFor;
                var startDeleteAt;
                var deletedIds = [];

                for (var i = 0; i < newIds.length; i++) {
                    if (newIds[i] != oldIds[i]) {
                        startDeleteAt = i;
                        lookingFor = newIds[i];
                        break;
                    }
                    if (i == newIds.length - 1) {
                        startDeleteAt = i + 1;
                    }
                }
                for (var i = startDeleteAt; i < oldIds.length; i++) {
                    if (oldIds[i] == lookingFor) break;
                    deletedIds.push(oldIds[i]);
                }

                this.pointSelector.current.removePoints(deletedIds);

                if (this.state.lastSelect == 1 && deletedIds.includes(this.state.firstSelectedPoint) || this.state.lastSelect == 2 && deletedIds.includes(this.state.secondSelectedPoint)) {
                    this.pointSelector.current.select(-1);
                }

                setTimeout(() => {
                    this.pointSelector.current.resetPointRemoval();
                    this.setState((prevState) => {
                        return {
                            tripObject: realTrip,
                            pendingRequests: prevState.pendingRequests - 1
                        }
                    });
                }, 350);
            }
            else {
                this.setState((prevState) => {
                    return {
                        tripObject: realTrip,
                        pendingRequests: prevState.pendingRequests - 1
                    }
                });
            }
            this.pointSelector.current.forceUpdate();
            this.receipt.current.forceUpdate();
        }
        else {
            this.saveIndicator.current.setStatus(2);
        }
    }

    setCity(location, city) {
        this.setState(prevState => {
            return {
                pendingRequests: prevState.pendingRequests + 1
            }
        })
        let h = ObjectContainer.getHttpCommunicator();
        this.saveIndicator.current.setStatus(1);
        h.saveCity(location.id, (r, s) => {
            this.locFieldCallback(r, s);
        }, [city.name, city.country.name, city.googlePlaceId]);
    }

    setCountry(location, country) {
    
        let h = ObjectContainer.getHttpCommunicator();
        this.setState(prevState => {
            return {
                pendingRequests: prevState.pendingRequests + 1
            }
        });
        this.saveIndicator.current.setStatus(1);
        h.saveCountry(location.id, (r, s) => {
            this.locFieldCallback(r, s);
        }, country);
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
    //Used for instant local updating of general trip info

    resetModifications(locationId) {
        var h = ObjectContainer.getHttpCommunicator();
        this.saveIndicator.current.setStatus(1);
        this.setState(prevState => {
            return {
                pendingRequests: prevState.pendingRequests + 1
            }
        });
        h.resetSectionModifications(locationId, (r, s) => {
            this.locFieldCallback(r, s);
        });
    }

    autoSave(field, value) {
        this.saveIndicator.current.setStatus(1);
        this.setState(prevState => {
            return {
                pendingRequests: prevState.pendingRequests + 1
            }
        });
        var h = ObjectContainer.getHttpCommunicator();
        if (field == "title") {
            h.saveTitle(this.state.tripObject.id, value, (r, s) => {this.locFieldCallback(r, s)})
        }
        if (field == "purpose") {
            h.savePurpose(this.state.tripObject.id, value, (r, s) => {this.locFieldCallback(r, s)})
        }
        if (field == "project") {
            h.saveProject(this.state.tripObject.id, value, (r, s) => {this.locFieldCallback(r, s)})
        }
        if (field == "task") {
            h.saveTask(this.state.tripObject.id, value, (r, s) => {this.locFieldCallback(r, s)})
        }
        if (field == "comment") {
            h.saveComment(this.state.tripObject.id, value, (r, s) => {this.locFieldCallback(r, s)})
        }
    }

    changeOnlyLocation(location) {
        this.saveIndicator.current.setStatus(1);
        this.setState(prevState => {
            return {
                pendingRequests: prevState.pendingRequests + 1
            }
        });
        var h = ObjectContainer.getHttpCommunicator();
        h.changeOnlyLocation(location.id, (r, s) => {
            this.locFieldCallback(r, s);
            this.pointSelector.current.select(this.state.tripObject.locations[0].id, true);
        })
    }

    close() {
        window.onkeydown = null;
        window.onbeforeunload = null;
        this.ref.current.style.opacity = "0";
        this.ref.current.style.transform = "translateX(40px)";
        this.props.container.closeLastActivity();
    }

    addLocation(index) {
        var h = ObjectContainer.getHttpCommunicator();
        this.saveIndicator.current.setStatus(1);
        this.setState(prevState => {
            return {
                pendingRequests: prevState.pendingRequests + 1
            }
        });
        h.addLocation(index, this.state.tripObject.id, (r, s) => {
            this.locFieldCallback(r, s);
            this.pointSelector.current.select(index == -1 ? this.state.tripObject.locations[this.state.tripObject.locations.length - 1].id : this.state.tripObject.locations[index + 1].id);
        });
    }

    forceSave(t, callback) {
        var h = ObjectContainer.getHttpCommunicator();
        this.saveIndicator.current.setStatus(1);
        this.setState(prevState => {
            return {
                pendingRequests: prevState.pendingRequests + 1
            }
        });
        h.saveTrip(t ? t : this.state.tripObject, (r, s) => {
            if (s == 200) {
                if (this.state.pendingRequests == 1) {
                    this.saveIndicator.current.setStatus(0);
                }
                callback(r);
                this.setState((prevState) => {

                    var tr = prevState.tripObject;
                    tr.id = r;

                    return {
                        pendingRequests: prevState.pendingRequests - 1,
                        tripObject: tr
                    }
                })
            }
            else {
                this.saveIndicator.current.setStatus(2)
            }
        })
    }

    selectPoint(i, override) {
        var position = -1;
        console.log("Setting -> " + i);
        console.log("Override? -> " + override);
        for (var j = 0; j < this.state.tripObject.locations.length; j++) {
            if (this.state.tripObject.locations[j].id == i) position = j;
        }
        if (((i == this.state.firstSelectedPoint && this.state.lastSelect == 1) || (i == this.state.secondSelectedPoint && this.state.lastSelect == 2)) && !override) return;
        if (i < 0) {
            if (this.state.lastSelect == 1) {
                if (this.firstPointDetails.current) this.firstPointDetails.current.animateOut();
                setTimeout(() => {
                    this.setState({
                        firstSelectedPoint: -1,
                        selectedPoint: -1,
                        highestZ: 0
                    })
                }, 350);
            }
            else if (this.state.lastSelect == 2) {
                if (this.secondPointDetails.current) this.secondPointDetails.current.animateOut();
                setTimeout(() => {
                    this.setState({
                        secondSelectedPoint: -2,
                        selectedPoint: -1,
                        highestZ: 0
                    })
                }, 350);
            }
        }
        else {
            if (this.state.lastSelect == 1) {
                this.setState(prevState => {
                    var realI = i;
                    console.log(i);
                    console.log(prevState.firstSelectedPoint);
                    if (prevState.firstSelectedPoint == i) {
                        realI = i + "only";
                    }
                    console.log(realI);
                    return {
                        secondSelectedPoint: realI,
                        selectedPoint: position,
                        animate: true,
                        lastSelect: 2,
                        highestZ: prevState.highestZ + 1,
                        secondZ: prevState.highestZ + 1,
                    }
                })
                setTimeout(() => {
                    if (this.state.lastSelect == 2) {
                        this.setState({
                            firstSelectedPoint: -1
                        })
                    }
                }, 350);
            }
            else if (this.state.lastSelect == 2) {
                this.setState(prevState => {
                    var realI = i;
                    if (prevState.secondSelectedPoint == i) {
                        realI = i + "only";
                    }
                    return {
                        firstSelectedPoint: realI,
                        selectedPoint: position,
                        animate: true,
                        lastSelect: 1,
                        highestZ: prevState.highestZ + 1,
                        firstZ: prevState.highestZ + 1,
                    }
                })
                setTimeout(() => {
                    if (this.state.lastSelect == 1) {
                        this.setState({
                            secondSelectedPoint: -2
                        })
                    }
                }, 350);
            }
        }
    }

    editExchangeRate(currency, value) {
        var cc = currency == "EUR" ? 0 : currency == "USD" ? 1 : currency == "CZK" ? 2 : currency == "CHF" ? 3 : 4;
        var h = ObjectContainer.getHttpCommunicator();
        this.saveIndicator.current.setStatus(1);
        this.setState(prevState => {
            return {
                pendingRequests: prevState.pendingRequests + 1
            }
        });
        h.editExchangeRate(this.state.tripObject.id, currency, value, (r, s) => {
            if (s == 200) {
                //Success
                if (this.state.pendingRequests == 1) {
                    this.saveIndicator.current.setStatus(0);
                }
                this.setState((prevState) => {
                    var t = prevState.tripObject;
                    for (var i = 0; i < t.exchange.rates.length; i++) {
                        if (t.exchange.rates[i].currencyCode == cc) {
                            if (!t.exchange.rates[i].altered) {
                                t.exchange.rates[i].defaultRate = t.exchange.rates[i].rate;
                            }
                            t.exchange.rates[i].rate = value;
                            t.exchange.rates[i].altered = true;
                        }
                    }
                    return {
                        tripObject: t,
                        pendingRequests: prevState.pendingRequests - 1
                    }
                })
            }
            else {
                //Failed to edit currency
                this.saveIndicator.current.setStatus(2);
            }
        })
    }

    resetExchangeRate(currency) {
        var cc = currency == "EUR" ? 0 : currency == "USD" ? 1 : currency == "CZK" ? 2 : currency == "CHF" ? 3 : 4;
        var h = ObjectContainer.getHttpCommunicator();
        this.saveIndicator.current.setStatus(1);
        this.setState(prevState => {
            return {
                pendingRequests: prevState.pendingRequests + 1
            }
        });
        h.resetExchangeRate(this.state.tripObject.id, currency, (r, s) => {
            if (s == 200) {
                //Success
                if (this.state.pendingRequests == 1) {
                    this.saveIndicator.current.setStatus(0);
                }
                this.setState((prevState) => {
                    var t = prevState.tripObject;
                    for (var i = 0; i < t.exchange.rates.length; i++) {
                        if (t.exchange.rates[i].currencyCode == cc) {
                            t.exchange.rates[i].rate = t.exchange.rates[i].defaultRate;
                            t.exchange.rates[i].altered = false;
                        }
                    }
                    return {
                        tripObject: t,
                        pendingRequests: prevState.pendingRequests - 1
                    }
                })
            }
            else {
                //Failed to edit currency
                this.saveIndicator.current.setStatus(2);
            }
        })
    }

    export() {
        //Missing info || Wrong formats
        if (
            (this.state.tripObject.purpose == "" || this.state.tripObject.project == "" || this.state.tripObject.task == "") ||
            (this.state.tripObject.project.length != 6 || isNaN(this.state.tripObject.project) || !this.state.tripObject.task.includes(".") ||
            this.state.tripObject.task.split(".")[0].length != 2 || this.state.tripObject.task.split(".")[1].length != 1 ||
            isNaN(this.state.tripObject.task.split(".")[0]) || isNaN(this.state.tripObject.task.split(".")[1])) && !this.state.tripObject.noExportWarnings
        ) {
            this.props.container.openDialog(<ExportDialog parent={this} key={"exportDialog"} container={this.props.container} trip={this.state.tripObject} />);
        }
        else {
            this.confirmExport();
        }
    }

    confirmExport() {
        var h = ObjectContainer.getHttpCommunicator();
        h.getExportToken(this.state.tripObject.id, (t, s) => {
            if (s == 200 && t != "") {
                if (t == null) {
                    //Incomplete info.. handle gracefully
                }
                h.exportTrip(t, (w) => {
                    if (w != null) {
                        this.state.tripObject.exported = true;
                        //Export successful
                    }
                    else {
                        //Export failed...
                    }
                })
            }
            else {
                //Export failed...
            }
        });
    }

    setNoExportWarning(value, callback) {
        this.setState((prevState) => {
            var t = prevState.tripObject;
            t.noExportWarnings = value;
            return {
                tripObject: t
            }
        })
        var h = ObjectContainer.getHttpCommunicator();
        h.setNoExportWarnings(value, callback);
    }

    removePoint(location) {
        var h = ObjectContainer.getHttpCommunicator();
        this.saveIndicator.current.setStatus(1);
        this.setState(prevState => {
            return {
                pendingRequests: prevState.pendingRequests + 1
            }
        });
        h.deleteLocation(location.id, (r, s) => {
                this.locFieldCallback(r, s);
        });
    }

    render() {

        var firstLocation;
        if ((isNaN(this.state.firstSelectedPoint) ? parseInt(this.state.firstSelectedPoint.split("o")[0]) : (this.state.firstSelectedPoint)) >= 0) {
            for (var i = 0; i < this.state.tripObject.locations.length; i++) {
                if (this.state.tripObject.locations[i].id == (isNaN(this.state.firstSelectedPoint) ? parseInt(this.state.firstSelectedPoint.split("o")[0]) : (this.state.firstSelectedPoint))) {
                    firstLocation = this.state.tripObject.locations[i];
                    break;
                }
            }
        }
        else {
            firstLocation = new Location(-1, null, null, null, null, {name: "", country: { name: ""}});
        }
        if (!firstLocation) firstLocation = new Location(-1, null, null, null, null, {name: "", country: { name: ""}});

        var secondLocation;
        if ((isNaN(this.state.secondSelectedPoint) ? parseInt(this.state.secondSelectedPoint.split("o")[0]) : (this.state.secondSelectedPoint)) >= 0) {
            for (var i = 0; i < this.state.tripObject.locations.length; i++) {
                if (this.state.tripObject.locations[i].id == (isNaN(this.state.secondSelectedPoint) ? parseInt(this.state.secondSelectedPoint.split("o")[0]) : (this.state.secondSelectedPoint))) {
                    secondLocation = this.state.tripObject.locations[i];
                    break;
                }
            }
        }
        else {
            secondLocation = new Location(-1, null, null, null, null, {name: "", country: { name: ""}});
        }
        if (!secondLocation) secondLocation = new Location(-1, null, null, null, null, {name: "", country: { name: ""}});

        return (
            //Spinner must be outside of this.ref
            <Fragment>
                <Spinner ref={this.spinner} size={60} position={"fixed"}/>
                <div className="activity" id="trip-activity" ref={this.ref}>
                    <div className="top-bar">
                        <button ripplecolor="gray" onClick={() => {this.close()}} className="back-button"><i className="material-icons back-icon">arrow_back</i>Trip list</button>
                        <SaveIndicator ref={this.saveIndicator} parent={this} name={this.state.tripObject.title} />
                    </div>
                    <div className="trip-activity-content">
                        {
                            window.innerWidth >= 1550 ? (
                                <div className="receipt-content">
                                    <TripReceipt daySections={this.state.tripObject.daySections} parent={this} ref={this.receipt} rates={this.state.tripObject.exchange} allowMods={this.state.tripObject.allowExchangeRateMods} />
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
                                                <PointDetailInfo zIndex={this.state.firstZ} firstPoint={firstLocation.position == 0} animate={this.state.animate} key={this.state.firstSelectedPoint} parent={this} ref={this.firstPointDetails} pointSelector={this.pointSelector.current} location={firstLocation} />
                                                <PointDetailInfo zIndex={this.state.secondZ} firstPoint={secondLocation.position == 0} animate={this.state.animate} key={this.state.secondSelectedPoint} parent={this} ref={this.secondPointDetails} pointSelector={this.pointSelector.current} location={secondLocation} />
                                                {
                                                    window.innerWidth < 1550 ? (
                                                    <div className="absolute-receipt-content">
                                                        <TripReceipt daySections={this.state.tripObject.daySections} parent={this} ref={this.receipt} collapsed={true} rates={this.state.tripObject.exchange} allowMods={this.state.tripObject.allowExchangeRateMods} />
                                                    </div>
                                                ) : null}
                                            </Fragment>
                                        }
                                    </div>
                                    <div className="middle-content">
                                        <PointSelector exportable={this.state.tripObject.exportable} parent={this} ref={this.pointSelector} locations={this.state.tripObject.locations} />
                                    </div>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <div className="middle-content">
                                        <PointSelector exportable={this.state.tripObject.exportable} parent={this} ref={this.pointSelector} locations={this.state.tripObject.locations} />
                                    </div>
                                    <div className="main-content">
                                        {
                                            <Fragment>
                                                <GeneralTripInfo parent={this} title={this.state.tripObject.title} purpose={this.state.tripObject.purpose} project={this.state.tripObject.project} task={this.state.tripObject.task} comment={this.state.tripObject.comment} />
                                                <PointDetailInfo zIndex={this.state.firstZ} firstPoint={firstLocation.position == 0} animate={this.state.animate} key={this.state.firstSelectedPoint} parent={this} ref={this.firstPointDetails} pointSelector={this.pointSelector.current} location={firstLocation} />
                                                <PointDetailInfo zIndex={this.state.secondZ} firstPoint={secondLocation.position == 0} animate={this.state.animate} key={this.state.secondSelectedPoint} parent={this} ref={this.secondPointDetails} pointSelector={this.pointSelector.current} location={secondLocation} />
                                                {window.innerWidth < 1550 ? (
                                                    <div className="absolute-receipt-content">
                                                        <TripReceipt daySections={this.state.tripObject.daySections} parent={this} ref={this.receipt} collapsed={true} rates={this.state.tripObject.exchange} allowMods={this.state.tripObject.allowExchangeRateMods} />
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
            </Fragment>
        )

    }

}