import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import ReceiptItem from '../receipt-item';

export default class TripReceipt extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            expand: false,
            rotate: false
        }
        this.wrap = React.createRef();
    }

    componentDidUpdate() {
        if (this.wrap.current != null && this.state.rotate) {
            setTimeout(() => {
                this.wrap.current.style.transform = "translateX(0px)";
            }, 20);
        }
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

    render() {

        var tripManager = ObjectContainer.getTripManager();
        var money = tripManager.calculateTotal(this.props.trip, true);

        var date = this.props.rates != null ? new Date(this.props.rates.date) : null;

        return (
            <div ref={this.wrap} className={"trip-receipt" + (ObjectContainer.isDarkTheme() ? " dark" : "")} style={{paddingBottom: money.total == 0 ? "28px" : "12px"}}>
                <div className="tr-card">
                    {
                        money.total != 0 ? (
                            <Fragment>
                                <div className="tr-list">
                                    <ReceiptItem currency="CZK" amount={money.czk.amount} allowMods={false} rate={1}/>
                                    <ReceiptItem currency="EUR" amount={money.eur.amount} allowMods={this.props.allowMods} rate={money.eur.rate} altered={money.eur.altered} parent={this}/>
                                    <ReceiptItem currency="USD" amount={money.usd.amount} allowMods={this.props.allowMods} rate={money.usd.rate} altered={money.usd.altered} parent={this}/>
                                    <ReceiptItem currency="GBP" amount={money.gbp.amount} allowMods={this.props.allowMods} rate={money.gbp.rate} altered={money.gbp.altered} parent={this}/>
                                    <ReceiptItem currency="CHF" amount={money.chf.amount} allowMods={this.props.allowMods} rate={money.chf.rate} altered={money.chf.altered} parent={this}/>
                                </div>
                                <p className="tr-valid">Exchange rates for {(date.getUTCDate() + "." + (date.getUTCMonth() + 1) + "." + date.getUTCFullYear())}</p>
                                <div className="tr-separator"></div>
                            </Fragment>
                        ) : null
                    }
                    <div className="tr-total">
                        {
                            !this.props.daySections || this.props.daySections.length == 0 ? (
                                <p className="tr-unfinished">Unfinished Trip</p>
                            ) : (
                                <Fragment>
                                    <p>Total</p>
                                    <p>{money.total} CZK</p>
                                </Fragment>
                            )
                        }
                    </div>
                </div>
                <div className="tr-expand-wrap">
                    <button onClick={() => {this.reverseExpand()}} ripplecolor="gray" className="tr-expand-button">
                        <p className="tr-expand-text">Billing Information</p>
                        <i className="material-icons" style={{transform: this.state.rotate ? "rotate(270deg)" : "rotate(90deg)"}}>keyboard_arrow_up</i>
                    </button>
                </div> 
            </div>
        )
    }

}