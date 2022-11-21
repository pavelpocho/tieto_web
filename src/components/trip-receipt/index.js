import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import ReceiptItem from '../receipt-item';
import MainButton from '../main-button';
import AllowanceDialog from '../allowance-dialog';

export default class TripReceipt extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            expand: true,
            rotate: false,
            spinner: false
        }
        this.wrap = React.createRef();
        this.inner = React.createRef();
    }

    componentDidMount() {
        if (window.innerWidth <= 750 || (window.innerWidth > 1030 && window.innerWidth <= 1370)) {
        this.expandCollapse();
        }
    }

    componentDidUpdate() {
        if (this.wrap.current != null && this.state.rotate) {
            setTimeout(() => {
                this.wrap.current.style.transform = "translateX(0px)";
            }, 20);
        }
    }

    export() {
        this.setState({
            spinner: true
        })
        this.props.parent.export();
    }
    exportDone() {
        this.setState({
            spinner: false
        })
    }

    setRate(currency, value) {
        this.props.parent.editExchangeRate(currency, value);
    }

    resetRate(currency) {
        this.props.parent.resetExchangeRate(currency);
    }

    reverseExpand() {
        if (this.state.expand) {
            this.wrap.current.style.transform = "translateX(-300px)";
            setTimeout(() => {
                this.setState((prevState) => {
                    return {
                        expand: !prevState.expand
                    }
                });
            }, 350);
            this.setState((prevState) => {
                return {
                    rotate: !prevState.rotate
                }
            });
        }
        else {
            this.setState((prevState) => {
                return {
                    expand: !prevState.expand,
                    rotate: !prevState.rotate
                }
            });
        }
        //Rotate to control the button which expands and contracts it, so that it doesn't have an anoying delay when contracting
    }

    expandCollapse() {
        if (!this.state.expand) {
            this.wrap.current.parentElement.style.transform = "translateY(" + 0 + "px)";
        }
        else {
            this.wrap.current.parentElement.style.transform = "translateY(" + (this.inner.current.offsetHeight + 10) + "px)";
        }
        this.setState(prevState => {
            return {
                expand: !prevState.expand
            }
        });
    }

    render() {

        var tripManager = ObjectContainer.getTripManager();
        var money = tripManager.calculateTotal(this.props.trip, true);

        var date = this.props.rates != null ? new Date(this.props.rates.date) : null;
        if (this.props.rates != null && this.props.rates.date == -1) {
            date = -1;
        }

        return (
            <div ref={this.wrap} className={"trip-receipt" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                <button className={"tr-expand-collapse" + (ObjectContainer.isDarkTheme() ? " dark" : "")} ripplecolor="gray" onClick={() => {this.expandCollapse()}}>{this.state.expand ? "Collapse" : "Show Receipt"}<i className="material-icons" style={!this.state.expand ? {transform: "rotate(180deg)"} : {}}>expand_more</i></button>
                {
                    true ? (
                        <div className={"tr-inner"} ref={this.inner}>
                            <div className={"tr-card" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>                    
                                {
                                    money.total != 0 || (this.props.rates != null && this.props.rates.date == -1) ? (
                                        <Fragment>
                                            <div className="tr-list">
                                                <ReceiptItem currency="CZK" amount={money.czk.amount} allowMods={false} rate={1}/>
                                                <ReceiptItem currency="EUR" amount={money.eur.amount} allowMods={this.props.allowMods} rate={money.eur.rate} altered={money.eur.altered} parent={this}/>
                                                <ReceiptItem currency="USD" amount={money.usd.amount} allowMods={this.props.allowMods} rate={money.usd.rate} altered={money.usd.altered} parent={this}/>
                                                <ReceiptItem currency="GBP" amount={money.gbp.amount} allowMods={this.props.allowMods} rate={money.gbp.rate} altered={money.gbp.altered} parent={this}/>
                                                <ReceiptItem currency="CHF" amount={money.chf.amount} allowMods={this.props.allowMods} rate={money.chf.rate} altered={money.chf.altered} parent={this}/>
                                            </div>
                                            {
                                                date != -1 ? (
                                                    <p className={"tr-valid" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Exchange rates for {(date.getUTCDate() + "." + (date.getUTCMonth() + 1) + "." + date.getUTCFullYear())}</p>
                                                ) : <p style={{color: ObjectContainer.isDarkTheme() ? "#C32600" : "#FF4E0B"}}className={"tr-valid" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>No exchange rates for future dates!</p>
                                            }
                                            <div className={"tr-separator" + (ObjectContainer.isDarkTheme() ? " dark" : "")}></div>
                                        </Fragment>
                                    ) : null
                                }
                                <div className={"tr-total" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                    {
                                        !this.props.daySections || this.props.daySections.length == 0 ? (
                                            <p className={"tr-unfinished" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Unfinished Trip</p>
                                        ) : (
                                            <Fragment>
                                                <p>Total</p>
                                                <p>{Math.ceil(money.total)} CZK</p>
                                            </Fragment>
                                        )
                                    }
                                </div>
                            </div>
                            <div className={"export-wrap" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                <MainButton spinner={this.state.spinner} disabled={!this.props.exportable} text="Export" onClick={() => {this.export()}}/>
                            </div>
                        </div>
                    ) : null
                }
                {/*<button className={"tr-show-allowances" + (ObjectContainer.isDarkTheme() ? " dark" : "")} ripplecolor="gray" onClick={() => {this.props.parent.props.container.openDialog(<AllowanceDialog key={"allowanceDialog"} container={this.props.parent.props.container} />)}}>Show Allowance Rates</button>*/}
            </div>
        )
    }

}