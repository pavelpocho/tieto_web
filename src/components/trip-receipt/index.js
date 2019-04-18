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
        console.log("Updating the receipt");
        if (this.card.current != null && this.state.rotate) {
            setTimeout(() => {
                this.card.current.style.transform = "translateY(0px)";
                this.card.current.style.opacity = "1";
            }, 20);
        }
    }

    setRate(currency) {
        throw("Not implemented");
    }

    resetRate(currency) {
        throw("Not implemented");
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

    render() {

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

        console.log("Rates ->");
        console.log(this.state);

        console.log("Passing in this shit ->");
        console.log(this.state.rateEUR.rate);
        console.log(this.state.rateUSD.rate);


        var date = this.props.rates != null ? new Date(this.props.rates.date) : null;

        return (
            <div className="trip-receipt">
            {
                this.state.expand ? (
                    <div ref={this.card} className="tr-card">
                        <div className="tr-list">
                            <ReceiptItem currency="CZK" amount="0"/>
                            <ReceiptItem currency="EUR" amount="0" rate={eur.rate} altered={eur.altered} parent={this}/>
                            <ReceiptItem currency="USD" amount="0" rate={usd.rate} altered={usd.altered} parent={this}/>
                            <ReceiptItem currency="GBP" amount="0" rate={gbp.rate} altered={gbp.altered} parent={this}/>
                            <ReceiptItem currency="CHF" amount="0" rate={chf.rate} altered={chf.altered} parent={this}/>
                        </div>
                        {/*Is this displayed correctly?*/}
                        {
                            date != null && date != undefined && date.getDate != undefined ? (
                                <p className="tr-valid">Exchange rates for {(date.getUTCDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear())}</p>
                            ) : null
                        }
                        <div className="tr-separator"></div>
                        <div className="tr-total">
                            <p>Total</p>
                            <p>0 CZK</p>
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
                        <div className="tr-list">
                            <ReceiptItem currency="CZK" amount="0"/>
                            <ReceiptItem currency="EUR" amount="0" rate={eur.rate} altered={eur.altered} parent={this}/>
                            <ReceiptItem currency="USD" amount="0" rate={usd.rate} altered={usd.altered} parent={this}/>
                            <ReceiptItem currency="GBP" amount="0" rate={gbp.rate} altered={gbp.altered} parent={this}/>
                            <ReceiptItem currency="CHF" amount="0" rate={chf.rate} altered={chf.altered} parent={this}/>
                        </div>
                        {/*Is this displayed correctly?*/}
                        {
                            date != null && date != undefined && date.getDate != undefined ? (
                                <p className="tr-valid">Exchange rates for {(date.getUTCDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear())}</p>
                            ) : null
                        }
                        <div className="tr-separator"></div>
                        <div className="tr-total">
                            <p>Total</p>
                            <p>0 CZK</p>
                        </div>
                    </Fragment>
                )
            }
                
            </div>
        )
    }

}