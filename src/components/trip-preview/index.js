import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import TripPreviewState from '../trip-preview-state';
import OverflowMenu from '../overflow-menu';
import OverflowButton from '../overflow-button';
import Trip from '../../utils/trip';
import Spinner from '../spinner';
import { RippleManager } from '../ripple';
import DuplicationDateDialog from '../duplication-date-dialog';
import ExportDialog from '../export-dialog';

export default class TripPreview extends Component {

    constructor(props) {
        super(props);

        this.ref = React.createRef();

        this.state = {
            loading: false,
            status: this.props.status
        }

        this.openButton = React.createRef();
        this.prevButtonOne = React.createRef();
        this.prevButtonTwo = React.createRef();
        this.overflowMenu = React.createRef();
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
        this.openButton.current.onmouseover = () => {
            if (window.innerWidth > 550) this.openButton.current.style.borderColor = ObjectContainer.isDarkTheme() ? "#3f3f3f" : "#ccc";
        }
        this.openButton.current.onmouseout = () => {
            this.openButton.current.style.borderColor = "transparent";
        }
        this.prevButtonOne.current.onmouseover = () => {
            if (window.innerWidth > 550) this.openButton.current.style.borderColor = ObjectContainer.isDarkTheme() ? "#3f3f3f" : "#ccc";
        }
        this.prevButtonTwo.current.onmouseover = () => {
            if (window.innerWidth > 550) this.openButton.current.style.borderColor = ObjectContainer.isDarkTheme() ? "#3f3f3f" : "#ccc";
        }
    }

    overflow(e, right) {
        var bounding = e.currentTarget.getBoundingClientRect();
        this.props.container.openDialog(
            <OverflowMenu ref={this.overflowMenu} parent={this} key="overflow-menu" container={this.props.container} x={right ? e.clientX : bounding.left} y={right ? e.clientY : bounding.top}>
                {
                    window.innerWidth <= 550 ? (
                        <OverflowButton disabled={!this.props.trip.exportable} onClick={() => {this.tryExport()}} menu={this.overflowMenu} text={"Export"} icon={"local_printshop"} />        
                    ) : null
                }
                <OverflowButton menu={this.overflowMenu} text={"Edit"} icon={"edit"} onClick={() => {this.props.activity.editTrip(this.props.trip)}}/>
                <OverflowButton menu={this.overflowMenu} text={"Duplicate"} icon={"queue"} onClick={() => {this.startDuplicate()}}/>
                <OverflowButton menu={this.overflowMenu} text={"Delete"} icon={"delete"} onClick={() => {this.delete()}}/>
            </OverflowMenu>
        );
    }

    startDuplicate() {
        if (this.props.trip.locations.length == 0 || !this.props.trip.locations[0].departureDate || this.props.trip.locations[0].departureDate < 0) {
            this.duplicate(null);
        }
        else {
            this.props.activity.props.container.openDialog(<DuplicationDateDialog key={"duplicationDialog"} parent={this} highlightDate={this.props.trip.locations[0].departureDate} tripName={this.props.trip.title} />);
        }
    }

    stopDuplicate() {
        this.props.activity.props.container.closeLastDialog();
    }

    duplicate(date) {
        var time = Date.now();
        let h = ObjectContainer.getHttpCommunicator();
        this.setState({
            loading: true
        });
        this.ref.current.style.opacity = "0.6";
        var duplicateObject = { tripId: this.props.trip.id, date: date == null ? -1 : date };
        h.duplicateTrip(duplicateObject, (t, s) => {
            if (s == 200 || s == 204) {
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
                this.ref.current.style.opacity = "1";
                this.setState({
                    loading: false
                })
            }
        })
    }

    tryExport() {
        this.ref.current.style.opacity = "0.6";
        this.setState({
            loading: true
        })
        //Missing info || Wrong formats
        if (
            (this.props.trip.purpose == "" || this.props.trip.project == "" || this.props.trip.task == "") ||
            (this.props.trip.project.length != 6 || isNaN(this.props.trip.project) || !this.props.trip.task.includes(".") ||
            this.props.trip.task.split(".")[0].length != 2 || this.props.trip.task.split(".")[1].length != 1 ||
            isNaN(this.props.trip.task.split(".")[0]) || isNaN(this.props.trip.task.split(".")[1])) && !this.props.trip.noExportWarnings
        ) {
            this.props.container.openDialog(<ExportDialog parent={this} key={"exportDialog"} container={this.props.container} trip={this.props.trip} />);
        }
        else {
            this.confirmExport();
        }
    }

    stopExport() {
        this.ref.current.style.opacity = "1";
        this.setState({
            loading: false
        })
    }

    setNoExportWarning(value, callback) {
        this.props.activity.setNoExportWarning(value, callback);
    }

    confirmExport() {
        var time = Date.now();
        this.setState({
            loading: true
        });
        var h = ObjectContainer.getHttpCommunicator();
        h.getExportToken(this.props.trip.id, (t, s) => {
            if (s == 200 || s == 204 && t != "") {
                if (t == null) {
                    //Incomplete info.. handle gracefully
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
                        this.setState({
                            loading: false
                        });
                        this.ref.current.style.opacity = "1";
                        //Export failed...
                    }
                })
            }
            else {
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
            if (s == 200 || s == 204) {
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
                this.ref.current.style.opacity = "1";
                this.setState({
                    loading: false
                })
                //Deletion failed
            }
        })
    }

    render() {

        var tripManager = ObjectContainer.getTripManager();
        var total = tripManager.calculateTotal(this.props.trip);

        return (
            <Fragment>
                <div className={"trip-preview-wrap" + (ObjectContainer.isDarkTheme() ? " dark" : "")} ref={this.ref}>
                    {
                        this.state.loading ? (
                            <Spinner size={24} position={"absolute"}/>
                        ) : null
                    }
                    <button ref={this.openButton} className={"trip-open-button" + (ObjectContainer.isDarkTheme() ? " dark" : "")} ripplecolor="gray" onContextMenu={(e) => {e.preventDefault(); this.overflow(e, true)}} onClick={(e) => {this.props.activity.editTrip(this.props.trip)}}></button>
                    <div className="trip-preview-left">
                        <TripPreviewState status={this.state.status} />
                        <div className="trip-preview-text-wrap">
                            <p className={"trip-preview-title" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>{this.props.trip.title ? this.props.trip.title : <i>Unnamed trip</i>}</p>
                            <p className={"trip-preview-purpose" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>{this.props.trip.purpose ? this.props.trip.purpose : <i>No purpose</i>}</p>
                        </div>
                    </div>
                    <div className="trip-preview-right">
                        <div className="trip-preview-text-wrap margin">
                            <p className={"trip-preview-date" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>{
                                this.props.trip.locations && this.props.trip.locations[0] && this.props.trip.locations[0].departureDate && this.props.trip.locations[0].departureDate > -1 ? new Date(this.props.trip.locations[0].departureDate).getUTCDate() + "." + (new Date(this.props.trip.locations[0].departureDate).getUTCMonth() + 1) + "." + new Date(this.props.trip.locations[0].departureDate).getUTCFullYear() : <i>No date</i>
                            }</p>
                            <p className={"trip-preview-money" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>{total == 0 ? "--" : total + " CZK"}</p>
                        </div>
                        <button ref={this.prevButtonOne} disabled={!this.props.trip.exportable} className={"trip-preview-export trip-preview-button" + (ObjectContainer.isDarkTheme() ? " dark" : "")} ripplecolor="gray" onClick={() => {this.tryExport()}}><i className="material-icons">local_printshop</i></button>
                        <button ref={this.prevButtonTwo} className={"trip-preview-button" + (ObjectContainer.isDarkTheme() ? " dark" : "")} ripplecolor="gray" onClick={(e) => {this.overflow(e, false)}}><i className="material-icons">more_vert</i></button>
                    </div>
                </div>
            </Fragment>
        )

    }

}