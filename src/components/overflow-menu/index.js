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
            this.props.container.closeFirstDialog();
        }, 310);
    }

    componentDidMount() {

        this.ref.current.style.left = this.props.x - this.ref.current.offsetWidth + 44 + "px";
        this.ref.current.style.top = Math.min(this.props.y - 8, window.innerHeight - this.ref.current.childNodes.length * 50) + "px";

        setTimeout(() => {
            this.ref.current.style.height = this.ref.current.childNodes.length * 50 + "px";
            this.ref.current.style.opacity = "1";
        }, 50);
        RippleManager.setUp();
    }

    render() {
        return (
            <Fragment>
                <div ref={this.ref} className={"overflow-menu" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                    { this.props.children }
                </div>
                <Overlay onClick={() => {this.close()}}/>
            </Fragment>
        )
    }

}