import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import ReceiptItem from '../receipt-item';

export default class TripReceipt extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            rateUSD: "",
            rateEUR: "",
            expand: false,
            rotate: false
        }

        this.card = React.createRef();
    }

    componentDidMount() {
        //For now, this gets rates for current day, change later for date of first point
        let h = ObjectContainer.getHttpCommunicator();
        h.getExchangeRates(new Date(), (rates, s) => {
            if (s == 200) {
                for (var i = 0; i < rates.length; i++) {
                    var eur;
                    var usd;
                    if (rates[i].currencyCode == 0) {
                        eur = Math.round(rates[i].rate * 100) / 100;
                    }
                    else if (rates[i].currencyCode == 1) {
                        usd = Math.round(rates[i].rate * 100) / 100;
                    }
                    this.setState({
                        rateEUR: eur,
                        rateUSD: usd
                    });
                }
            }
            else {
                //Getting rates failed
                console.log("Getting exchange rates failed");
            }
        })
    }

    componentDidUpdate() {
        if (this.card.current != null && this.state.rotate) {
            setTimeout(() => {
                this.card.current.style.transform = "translateY(0px)";
                this.card.current.style.opacity = "1";
            }, 20);
        }
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
        return (
            <div className="trip-receipt">
            {
                this.state.expand ? (
                    <div ref={this.card} className="tr-card">
                        <div className="tr-list">
                            <ReceiptItem currency="CZK" amount="0"/>
                            <ReceiptItem currency="EUR" amount="0" rate={this.state.rateEUR}/>
                            <ReceiptItem currency="USD" amount="0" rate={this.state.rateUSD}/>
                        </div>
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
                            <ReceiptItem currency="EUR" amount="0" rate={this.state.rateEUR}/>
                            <ReceiptItem currency="USD" amount="0" rate={this.state.rateUSD}/>
                        </div>
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