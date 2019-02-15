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
                    <p className="ri-currency">EUR</p>
                    <input type="text" className="ri-rate"/>
                </div>
                <p className="ri-amount">50</p>
            </div>
        )
    }

}