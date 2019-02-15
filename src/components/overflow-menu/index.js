import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import Overlay from '../overlay';

export default class OverflowMenu extends Component {

    constructor(props) {
        super(props);
    }

    close() {
        this.props.container.closeLastDialog();
    }

    render() {
        return (
            <Fragment>
                <div className="overflow-menu">OVERFLOW MENU</div>
                <Overlay onClick={() => {this.close()}}/>
            </Fragment>
        )
    }

}