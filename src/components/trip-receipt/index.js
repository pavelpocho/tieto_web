import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import ReceiptItem from '../receipt-item';

export default class TripReceipt extends Component {

    constructor(props) {
        super(props);

        var usd = {};
        var eur = {};
        var gbp = {};
        var chf = {};

        if (this.props.rates != null) {
            for (var i = 0; i < this.props.rates.rates.length; i++) {
                //rates.rates is indeed intentional
                if (this.props.rates.rates[i].currencyCode == 0) {
                    eur["rate"] = Math.round(this.props.rates.rates[i].rate * 100) / 100;
                    eur["altered"] = this.props.rates.rates[i].altered;
                }
                else if (this.props.rates.rates[i].currencyCode == 1) {
                    usd["rate"] = Math.round(this.props.rates.rates[i].rate * 100) / 100;
                    usd["altered"] = this.props.rates.rates[i].altered;
                }
                else if (this.props.rates.rates[i].currencyCode == 3) {
                    chf["rate"] = Math.round(this.props.rates.rates[i].rate * 100) / 100;
                    chf["altered"] = this.props.rates.rates[i].altered;
                }
                else if (this.props.rates.rates[i].currencyCode == 4) {
                    gbp["rate"] = Math.round(this.props.rates.rates[i].rate * 100) / 100;
                    gbp["altered"] = this.props.rates.rates[i].altered;
                }
            }
        }
        
        this.state = {
            rateUSD: usd,
            rateEUR: eur,
            rateGBP: gbp,
            rateCHF: chf,
            expand: false,
            rotate: false
        }

        this.card = React.createRef();
    }

    componentDidUpdate() {
        if (this.card.current != null && this.state.rotate) {
            setTimeout(() => {
                this.card.current.style.transform = "translateY(0px)";
                this.card.current.style.opacity = "1";
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
            this.card.current.style.transform = "translateY(40px)";
            this.card.current.style.opacity = "0";
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

        if (this.props.rates != null) {
            for (var i = 0; i < this.props.rates.rates.length; i++) {
                //rates.rates is indeed intentional
                if (this.props.rates.rates[i].currencyCode == 0) {
                    this.set(this.props.rates.rates[i], eur);
                }
                else if (this.props.rates.rates[i].currencyCode == 1) {
                    this.set(this.props.rates.rates[i], usd);
                }
                else if (this.props.rates.rates[i].currencyCode == 3) {
                    this.set(this.props.rates.rates[i], chf);
                }
                else if (this.props.rates.rates[i].currencyCode == 4) {
                    this.set(this.props.rates.rates[i], gbp);
                }
            }
        }

        if (this.props.daySections) {
            for (var i = 0; i < this.props.daySections.length; i++) {
                var a = this.props.daySections[i].allowance;
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

        var date = this.props.rates != null ? new Date(this.props.rates.date) : null;

        var total = Math.round((eur.amount * eur.rate + usd.amount * usd.rate + gbp.amount * gbp.rate + chf.amount * chf.rate + czk.amount) * 100) / 100;
        if (isNaN(total)) {
            total = 0;
        }

        return (
            <div className="trip-receipt" style={{paddingBottom: total == 0 ? "28px" : "12px"}}>
            {
                this.state.expand ? (
                    <div ref={this.card} className="tr-card">
                        {
                            total == 0 ? null :
                                (
                                    <Fragment>
                                        <div className="tr-list">
                                            <ReceiptItem currency="CZK" amount={czk.amount} rate={1}/>
                                            <ReceiptItem currency="EUR" amount={eur.amount} rate={eur.rate} altered={eur.altered} parent={this}/>
                                            <ReceiptItem currency="USD" amount={usd.amount} rate={usd.rate} altered={usd.altered} parent={this}/>
                                            <ReceiptItem currency="GBP" amount={gbp.amount} rate={gbp.rate} altered={gbp.altered} parent={this}/>
                                            <ReceiptItem currency="CHF" amount={chf.amount} rate={chf.rate} altered={chf.altered} parent={this}/>
                                        </div>
                                        {
                                            date != null && date != undefined && date.getDate != undefined ? (
                                                <p className="tr-valid">Exchange rates for {(date.getUTCDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear())}</p>
                                            ) : null
                                        }
                                        <div className="tr-separator"></div>
                                    </Fragment>
                                )
                        }
                        <div className="tr-total">
                            {
                                !this.props.daySections || this.props.daySections.length == 0 ? (
                                    <p className="tr-unfinished">Unfinished Trip</p>
                                ) : (
                                    <Fragment>
                                        <p>Total</p>
                                        <p>{total} CZK</p>
                                    </Fragment>
                                )
                            }
                        </div>
                    </div>
                ) : (
                    null
                )
            }
            {
                this.props.collapsed ? (
                    <div className="tr-expand-wrap">
                        <p className="tr-expand-text">Billing Information</p>
                        <button onClick={() => {this.reverseExpand()}} ripplecolor="gray" className="tr-expand-button"><i className="material-icons" style={{transform: this.state.rotate ? "rotate(180deg)" : ""}}>keyboard_arrow_up</i></button>
                    </div>
                ) : (
                    <Fragment>
                        {
                            total == 0 ? null :
                                (
                                    <Fragment>
                                        <div className="tr-list">
                                            <ReceiptItem currency="CZK" amount={czk.amount} rate={1}/>
                                            <ReceiptItem currency="EUR" amount={eur.amount} rate={eur.rate} altered={eur.altered} parent={this} allowMods={this.props.allowMods} />
                                            <ReceiptItem currency="USD" amount={usd.amount} rate={usd.rate} altered={usd.altered} parent={this} allowMods={this.props.allowMods} />
                                            <ReceiptItem currency="GBP" amount={gbp.amount} rate={gbp.rate} altered={gbp.altered} parent={this} allowMods={this.props.allowMods} />
                                            <ReceiptItem currency="CHF" amount={chf.amount} rate={chf.rate} altered={chf.altered} parent={this} allowMods={this.props.allowMods} />
                                        </div>
                                        {
                                            date != null && date != undefined && date.getDate != undefined ? (
                                                <p className="tr-valid">Exchange rates for {(date.getUTCDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear())}</p>
                                            ) : null
                                        }
                                        <div className="tr-separator"></div>
                                    </Fragment>
                                )
                        }
                        <div className="tr-total">
                            {
                                !this.props.daySections || this.props.daySections.length == 0 ? (
                                    <p className="tr-unfinished">Unfinished Trip</p>
                                ) : (
                                    <Fragment>
                                        <p>Total</p>
                                        <p>{total} CZK</p>
                                    </Fragment>
                                )
                            }
                        </div>
                    </Fragment>
                )
            }
                
            </div>
        )
    }

}