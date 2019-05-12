import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import TripPreviewState from '../trip-preview-state';
import OverflowMenu from '../overflow-menu';
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
            //The third status (warning) is not implemented!
            status: this.props.status,
            duplicationDialog: false
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

    startDuplicate() {
        if (this.props.trip.locations.length == 0 || !this.props.trip.locations[0].departureDate || this.props.trip.locations[0].departureDate < 0) {
            this.duplicate(null);
        }
        else {
            this.setState({
                duplicationDialog: true
            });
        }
    }

    stopDuplicate() {
        this.setState({
            duplicationDialog: false
        })
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
                this.ref.current.style.opacity = "1";
                this.setState({
                    loading: false
                })
            }
        })
    }

    tryExport() {
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
            this.export();
        }
    }

    setNoExportWarning(value, callback) {
        this.props.activity.setNoExportWarning(value, callback);
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
                this.ref.current.style.opacity = "1";
                this.setState({
                    loading: false
                })
                //Deletion failed
            }
        })
    }

    setProp(property, input, output) {
        if (property == "altered") {
            output[property] = input[property];
        }
        else {
            output[property] = Math.round(input[property] * 100) / 100;
        }
    }

    set(input, output) {
        this.setProp("rate", input, output);
        this.setProp("defaultRate", input, output);
        this.setProp("altered", input, output);
    }

    render() {

        var usd = {amount: 0};
        var eur = {amount: 0};
        var gbp = {amount: 0};
        var chf = {amount: 0};
        var czk = {amount: 0, rate: 1};

        if (this.props.trip.exchange != null) {
            for (var i = 0; i < this.props.trip.exchange.rates.length; i++) {
                //rates.rates is indeed intentional
                if (this.props.trip.exchange.rates[i].currencyCode == 0) {
                    this.set(this.props.trip.exchange.rates[i], eur);
                }
                else if (this.props.trip.exchange.rates[i].currencyCode == 1) {
                    this.set(this.props.trip.exchange.rates[i], usd);
                }
                else if (this.props.trip.exchange.rates[i].currencyCode == 3) {
                    this.set(this.props.trip.exchange.rates[i], chf);
                }
                else if (this.props.trip.exchange.rates[i].currencyCode == 4) {
                    this.set(this.props.trip.exchange.rates[i], gbp);
                }
            }
        }

        if (this.props.trip.daySections) {
            for (var i = 0; i < this.props.trip.daySections.length; i++) {
                var a = this.props.trip.daySections[i].allowance;
                if (a == null) continue;
                if (a.currency == 0) {
                    if (eur.amount == undefined || eur.amount == null) {
                        eur.amount = a.moneyAmount + a.pocketMoney;
                    }
                    else {
                        eur.amount += a.moneyAmount + a.pocketMoney;
                    }
                }
                if (a.currency == 1) {
                    if (usd.amount == undefined || usd.amount == null) {
                        usd.amount = a.moneyAmount + a.pocketMoney;
                    }
                    else {
                        usd.amount += a.moneyAmount + a.pocketMoney;
                    }
                }
                if (a.currency == 2) {
                    if (czk.amount == undefined || czk.amount == null) {
                        czk.amount = a.moneyAmount + a.pocketMoney;
                    }
                    else {
                        czk.amount += a.moneyAmount + a.pocketMoney;
                    }
                }
                if (a.currency == 3) {
                    if (chf.amount == undefined || chf.amount == null) {
                        chf.amount = a.moneyAmount + a.pocketMoney;
                    }
                    else {
                        chf.amount += a.moneyAmount + a.pocketMoney;
                    }
                }
                if (a.currency == 4) {
                    if (gbp.amount == undefined || gbp.amount == null) {
                        gbp.amount = a.moneyAmount + a.pocketMoney;
                    }
                    else {
                        gbp.amount += a.moneyAmount + a.pocketMoney;
                    }
                }
            }
        }

        var total = Math.round((eur.amount * eur.rate + usd.amount * usd.rate + gbp.amount * gbp.rate + chf.amount * chf.rate + czk.amount) * 100) / 100;
        if (isNaN(total)) total = 0;

        return (
            <Fragment>
                {
                    this.state.duplicationDialog ? (
                        <DuplicationDateDialog parent={this} highlightDate={this.props.trip.locations[0].departureDate} tripName={this.props.trip.title} />
                    ) : null
                }
                <div className="trip-preview-wrap" ref={this.ref}>
                    {
                        this.state.loading ? (
                            <Spinner size={24} position={"absolute"}/>
                        ) : null
                    }
                    <div className="trip-preview-left">
                        <TripPreviewState status={this.state.status} />
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
                            <p className="trip-preview-money">{total == 0 ? "--" : total + " CZK"}</p>
                        </div>
                        <button disabled={!this.props.trip.exportable} className="trip-preview-button" ripplecolor="gray" onClick={() => {this.tryExport()}}><i className="material-icons">local_printshop</i></button>
                        <button className="trip-preview-button" ripplecolor="gray" onClick={(e) => {this.overflow(e)}}><i className="material-icons">more_vert</i></button>
                    </div>
                </div>
            </Fragment>
        )

    }

}