import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import { RippleManager } from '../ripple';

export default class ReceiptItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            altered: null,
            rate: null
        }

        this.ref = React.createRef();
    }

    check(target) {
        target.value = target.value.replace(",", ".");
        var rate = this.state.rate ? this.state.rate : this.props.rate;
        if (isNaN(target.value)) {
            target.value = rate.toString().length == 2 ? rate + ".00" : rate.toString().length == 4 ? rate + "0" : rate;
        }
        if (target.value.length > 5) {
            target.value = rate.toString().length == 2 ? rate + ".00" : rate.toString().length == 4 ? rate + "0" : rate;
        }
        if (target.value != rate ? (rate.toString().length == 2 ? rate + ".00" : rate.toString().length == 4 ? rate + "0" : rate) : "") {
            this.props.parent.setRate(this.props.currency, parseFloat(target.value));
            this.setState({
                altered: true,
                rate: parseFloat(target.value)
            })
        }
    }

    componentDidMount() {
        RippleManager.setUp();
    }

    componentDidUpdate() {
        if (this.ref.current) this.ref.current.value = 
        this.state.rate ?
        (this.state.rate.toString().length == 2 ? this.state.rate + ".00" : this.state.rate.toString().length == 4 ? this.state.rate + "0" : this.state.rate)
        : this.props.rate ? 
        (this.props.rate.toString().length == 2 ? this.props.rate + ".00" : this.props.rate.toString().length == 4 ? this.props.rate + "0" : this.props.rate)
        : ""
    }

    resetRate() {
        this.setState({
            rate: this.props.defaultRate,
            altered: false
        })
        this.props.parent.resetRate(this.props.currency);
    }

    render() {
        var rate = this.state.rate ? this.state.rate : this.props.rate;
        if (this.props.amount == 0 || this.props.amount == null || this.props.amount == undefined) return null;
        return (
            <div className="receipt-item">
                <div>
                    <p className="ri-currency">{this.props.currency}</p>
                    {
                        this.props.currency == "CZK" ? (
                            <input defaultValue={"1.000"} type="text" className="ri-rate" disabled={true} style={{color: "#999"}}/>
                        ) : (
                            <Fragment>
                                <input disabled={!this.props.allowMods} ref={this.ref} onBlur={(e) => {this.check(e.target)}} defaultValue={rate ? (rate.toString().length == 2 ? rate + ".00" : rate.toString().length == 4 ? rate + "0" : rate) : ""} type="text" className="ri-rate"/>
                                {
                                    (this.state.altered != null ? this.state.altered : this.props.altered) ? (
                                        <button onClick={() => {this.resetRate()}} ripplecolor="gray" className="ri-refresh"><i className="material-icons">refresh</i></button>
                                    ) : null
                                }
                            </Fragment>
                        )
                    }
                </div>
                <p className="ri-amount">{Math.round(this.props.amount * 100) / 100}</p>
            </div>
        )
    }

}