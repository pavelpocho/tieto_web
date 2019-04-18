import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import TripPreviewState from '../trip-preview-state';
import OverflowMenu from '../overflow-menu';
import Trip from '../../utils/trip';
import Spinner from '../spinner';
import { RippleManager } from '../ripple';

export default class TripPreview extends Component {

    constructor(props) {
        super(props);

        this.ref = React.createRef();

        this.state = {
            loading: false,
            //The third status (warning) is not implemented!
            status: this.props.status
        }
    }

    componentDidMount() {
        RippleManager.setUp();
        if (this.props.trip.duplicated) {
            this.ref.current.style.height = "0px";
            this.ref.current.style.marginBottom = "0px";
            this.ref.current.style.opacity = "0";
            setTimeout(() => {
                this.ref.current.style.height = "72px";
                this.ref.current.style.marginBottom = "20px";
                this.ref.current.style.opacity = "1";
            }, 20);
            this.props.trip.duplicated = undefined;
        }
        /*if (this.ref.current.childNodes[0].offsetWidth + this.ref.current.childNodes[1].offsetWidth) {
            this.ref.current.childNodes[0].style.maxWidth = this.ref.current.offsetWidth - this.ref.current.childNodes[1].offsetWidth - 80 + "px";
        }*/
    }

    overflow(e) {
        var bounding = e.target.getBoundingClientRect();
        this.props.container.openDialog(<OverflowMenu parent={this} key="overflow-menu" container={this.props.container} x={bounding.left} y={bounding.top}/>);
    }

    duplicate() {
        var time = Date.now();
        let h = ObjectContainer.getHttpCommunicator();
        this.setState({
            loading: true
        });
        this.ref.current.style.opacity = "0.6";
        h.duplicateTrip(this.props.trip.id, (t, s) => {
            if (s == 200) {
                setTimeout(() => {
                    var newTrip = new Trip();
                    Object.assign(newTrip, t);
                    this.props.activity.addTrip(newTrip);
                    this.setState({
                        loading: false
                    });
                    this.ref.current.style.opacity = "1";
                }, Date.now() - time < 250 ? 250 - (Date.now() - time) : 0)
            }
            else {
                //Duplication failed
                console.log("Duplication failed...");
                this.ref.current.style.opacity = "1";
                this.setState({
                    loading: false
                })
            }
        })
    }

    export() {
        var time = Date.now();
        this.setState({
            loading: true
        });
        this.ref.current.style.opacity = "0.6";
        var h = ObjectContainer.getHttpCommunicator();
        h.getExportToken(this.props.trip.id, (t, s) => {
            if (s == 200 && t != "") {
                if (t == null) {
                    //Incomplete info.. handle gracefully
                    console.log("Incomplete trip info.. will not export");
                }
                h.exportTrip(t, (w) => {
                    if (w != null) {
                        setTimeout(() => {
                            this.setState({
                                status: 1,
                                loading: false
                            });
                            this.ref.current.style.opacity = "1";
                            this.props.trip.exported = true;
                        }, Date.now() - time < 250 ? 250 - (Date.now() - time) : 0)
                    }
                    else {
                        console.log("Export failed");
                        this.setState({
                            loading: false
                        });
                        this.ref.current.style.opacity = "1";
                        //Export failed...
                    }
                })
            }
            else {
                console.log("Export failed");
                this.setState({
                    loading: false
                });
                this.ref.current.style.opacity = "1";
                //Export failed...
            }
        })
    }

    delete() {
        var time = Date.now();
        let h = ObjectContainer.getHttpCommunicator();
        this.ref.current.style.opacity = "0.6";
        this.setState({
            loading: true
        })
        h.deleteTrip(this.props.trip.id, (v, s) => {
            if (s == 200) {
                setTimeout(() => {
                    this.ref.current.style.height = "0px";
                    this.ref.current.style.opacity = "0";
                    this.ref.current.style.marginBottom = "0px";
                    setTimeout(() => {
                        this.ref.current.style.display = "none";
                        this.props.activity.removeTrip(this.props.trip);
                    }, 600);
                }, Date.now() - time < 250 ? 250 - (Date.now() - time) : 0)
            }
            else {
                console.log("Delete failed...");
                this.ref.current.style.opacity = "1";
                this.setState({
                    loading: false
                })
                //Deletion failed
            }
        })
    }

    render() {

        console.log("Trip date for preview ->");
        console.log(this.props.trip.locations);

        return (
            <div className="trip-preview-wrap" ref={this.ref}>
                {
                    this.state.loading ? (
                        <Spinner size={24} position={"absolute"}/>
                    ) : null
                }
                <div className="trip-preview-left">
                    <TripPreviewState status={this.state.status}/>
                    <div className="trip-preview-text-wrap">
                        <button onClick={() => {this.props.activity.editTrip(this.props.trip)}} className="trip-preview-title">{this.props.trip.title ? this.props.trip.title : <i>Unnamed trip</i>}</button>
                        <p className="trip-preview-purpose">{this.props.trip.purpose ? this.props.trip.purpose : <i>No purpose</i>}</p>
                    </div>
                </div>
                <div className="trip-preview-right">
                    <div className="trip-preview-text-wrap margin">
                        <p className="trip-preview-date">{
                            this.props.trip.locations && this.props.trip.locations[0] && this.props.trip.locations[0].departureDate && this.props.trip.locations[0].departureDate > -1 ? new Date(this.props.trip.locations[0].departureDate).getUTCDate() + "." + (new Date(this.props.trip.locations[0].departureDate).getUTCMonth() + 1) + "." + new Date(this.props.trip.locations[0].departureDate).getUTCFullYear() : <i>No date</i>
                        }</p>
                        <p className="trip-preview-money">??? CZK</p>
                    </div>
                    <button className="trip-preview-button" ripplecolor="gray" onClick={() => {this.export()}}><i className="material-icons">local_printshop</i></button>
                    <button className="trip-preview-button" ripplecolor="gray" onClick={(e) => {this.overflow(e)}}><i className="material-icons">more_vert</i></button>
                </div>
            </div>
        )

    }

}