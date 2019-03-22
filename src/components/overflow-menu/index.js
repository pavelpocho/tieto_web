import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import Overlay from '../overlay';
import OverflowButton from '../overflow-button';
import { RippleManager } from '../ripple';

export default class OverflowMenu extends Component {

    constructor(props) {
        super(props);

        this.ref = React.createRef();
    }

    close() {
        this.ref.current.style.height = "0px";
        this.ref.current.style.opacity = "0";
        setTimeout(() => {
            this.props.container.closeLastDialog();
        }, 510);
    }

    componentDidMount() {

        this.ref.current.style.left = this.props.x - this.ref.current.offsetWidth + 44 + "px";
        this.ref.current.style.top = this.props.y - 8 + "px";

        setTimeout(() => {
            this.ref.current.style.height = this.ref.current.childNodes.length * 50 + "px";
            this.ref.current.style.opacity = "1";
        }, 50);
        RippleManager.setUp();
    }

    render() {
        return (
            <Fragment>
                <div ref={this.ref} className="overflow-menu">
                    <OverflowButton menu={this} text={"Duplicate"} icon={"queue"} onClick={() => {this.props.parent.duplicate()}}/>
                    <OverflowButton menu={this} text={"Delete"} icon={"delete"} onClick={() => {this.props.parent.delete()}}/>
                </div>
                <Overlay onClick={() => {this.close()}}/>
            </Fragment>
        )
    }

}