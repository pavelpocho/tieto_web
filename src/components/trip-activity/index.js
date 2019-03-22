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

        this.state = {
            tripObject: this.props.trip ? this.props.trip : new Trip(0, "", "", "", "", []),
            selectedPoint: -1,
            animate: true
        }

        this.ref = React.createRef();
        this.saveIndicator = React.createRef();
        this.backFunctionTarget = React.createRef();
        this.pointDetails = React.createRef();
    }

    componentDidMount() {
        this.forceSave(this.props.trip, () => {});
        //This is crucial here, so that later saving can only save specific fields
        RippleManager.setUp();
        setTimeout(() => {
            this.ref.current.style.transform = "translateX(0px)";
            this.ref.current.style.opacity = "1";
        }, 50);
        window.onkeydown = (stroke) => {
            if (stroke.keyCode == 83 && stroke.ctrlKey) {
                stroke.preventDefault();
                this.forceSave(null, () => {});
            }
        }
    }

    saveChanges() {
        var http = ObjectContainer.getHttpCommunicator();
        http.saveTrip(this.state.tripObject);
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
                    console.log("Travel type save successful");
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
                    console.log("Arrival time save successful");
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
                    console.log("Departure time save successful");
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
                    console.log("Arrival date save successful");
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
                    console.log("Departure date save successful");
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
                    ls[i].city.country = city.country;
                    ls[i].city.name = city.name;
                    ls[i].city.googlePlaceId = city.googlePlaceId;
                    ls[i].city.countryID = city.country.id;
                }
            }
            var tripObject = prevState.tripObject;
            tripObject.locations = ls;
            this.backFunctionTarget.current.setLocationArray(ls);
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
        this.forceSave(undefined, () => {
            this.ref.current.style.opacity = "0";
            this.ref.current.style.transform = "translateX(40px)";
            this.props.container.closeLastActivity();
        });
    }

    saveCreatedLocation(callback) {
        var h = ObjectContainer.getHttpCommunicator();
        this.saveIndicator.current.setStatus(1);
        h.saveAndReturnTrip(this.state.tripObject, (r, s) => {
            if (s == 200) {
                this.saveIndicator.current.setStatus(0);
                callback(r);
                this.setState({
                    tripObject: r
                })
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
        console.log("Removing location");
        console.log(location);
        for (var i = 0; i < this.state.tripObject.locations.length; i++) {
            if (location.id == this.state.tripObject.locations[i].id) {
                var j = i;
                console.log("Found what to remove");
                this.setState(prevState => {
                    var arr = prevState.tripObject.locations;
                    console.log(arr.splice(j, 2)); //2, because there is a crossing point as well
                    var trip = prevState.tripObject;
                    trip.locations = arr;
                    console.log("New location array");
                    console.log(arr);
                    this.forceSave(trip, () => {});
                    return {
                        tripObject: trip
                    }    
                });
            }
        }
    }

    render() {
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
                                <TripReceipt />
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
                                                    <TripReceipt collapsed={true}/>
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
                                                    <TripReceipt collapsed={true}/>
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