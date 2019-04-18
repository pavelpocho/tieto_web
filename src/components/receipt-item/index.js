import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import { RippleManager } from '../ripple';

export default class ReceiptItem extends Component {

    constructor(props) {
        super(props);

        this.ref = React.createRef();
    }

    check(target) {
        if (isNaN(target.value)) {
            target.value = target.oldValue;
        }
        if (target.value.length > 5) {
            target.value = target.value.substring(0, 5);
        }
        if (target.value != target.oldValue) {
            this.props.parent.setRate(this.props.currency, parseInt(target.value));
        }
    }

    componentDidMount() {
        RippleManager.setUp();
    }

    componentDidUpdate() {
        if (this.ref.current) this.ref.current.value = 
        this.props.rate ? 
        (this.props.rate.toString().length == 2 ? this.props.rate + ".00" : this.props.rate.toString().length == 4 ? this.props.rate + "0" : this.props.rate) 
        : ""
    }

    resetRate() {
        this.props.parent.resetRate(this.props.currency);
    }

    render() {
        console.log("Reciept item props ->");
        console.log(this.props.rate);

        var rate = this.props.rate;

        return (
            <div className="receipt-item">
                <div>
                    <p className="ri-currency">{this.props.currency}</p>
                    {
                        this.props.currency == "CZK" ? (
                            <input defaultValue={"1.000"} type="text" className="ri-rate" disabled={true} style={{color: "#999"}}/>
                        ) : (
                            <Fragment>
                                <input ref={this.ref} onChange={(e) => {this.check(e.target)}} defaultValue={rate ? (rate.toString().length == 2 ? rate + ".00" : rate.toString().length == 4 ? rate + "0" : rate) : ""} type="text" className="ri-rate"/>
                                {
                                    this.props.altered ? (
                                        <button onClick={() => {this.resetRate()}} ripplecolor="gray" className="ri-refresh"><i className="material-icons">refresh</i></button>
                                    ) : null
                                }
                            </Fragment>
                        )
                    }
                </div>
                <p className="ri-amount">{this.props.amount}</p>
            </div>
        )
    }

}