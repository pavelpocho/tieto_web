import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';

export default class ReceiptItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="receipt-item">
                <div>
                    <p className="ri-currency">{this.props.currency}</p>
                    {
                        this.props.currency == "CZK" ? (
                            null
                        ) : (
                            <input defaultValue={this.props.rate} type="text" className="ri-rate"/>
                        )
                    }
                </div>
                <p className="ri-amount">{this.props.amount}</p>
            </div>
        )
    }

}