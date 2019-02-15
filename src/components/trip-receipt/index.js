import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import ReceiptItem from '../receipt-item';

export default class TripReceipt extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="trip-receipt">
                <div className="tr-list">
                    <ReceiptItem />
                    <ReceiptItem />
                </div>
                <div className="tr-separator"></div>
                <div className="tr-total">
                    <p>Total</p>
                    <p>1250 CZK</p>
                </div>
            </div>
        )
    }

}