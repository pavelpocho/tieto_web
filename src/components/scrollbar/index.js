import css from './index.css';
import React, { Component, Fragment } from 'react';
import ObjectContainer from '../../utils/object-container';

export default class Scrollbar extends Component {

    constructor(props) {
        super(props);

        this.scrollbar = React.createRef();
        this.moving = false;
        this.wrap = React.createRef();
    }

    setUpScrollbar(delay) {
        this.props.parent.current.style.marginRight = "-20px";
        this.props.parent.current.style.paddingRight = "20px";
        if (!this.moving) {
            if (delay) {
                setTimeout(() => {
                    this.update();
                }, delay);
            }
            else {
                this.update();
            }
        }
    }

    update() {
        this.scrollbar.current.style.transform = "translateY(" + (this.props.parent.current.offsetHeight - 16) / this.props.parent.current.childNodes[0].scrollHeight * this.props.parent.current.scrollTop + "px)";
        var theoreticalHeight = this.props.parent.current.offsetHeight * (this.props.parent.current.offsetHeight - 16) / this.props.parent.current.childNodes[0].scrollHeight;
        if (theoreticalHeight > (this.props.parent.current.offsetHeight - 16)) {
            this.scrollbar.current.style.display = "none";
        }
        else {
            this.scrollbar.current.style.height = theoreticalHeight + "px";
        }
    }

    moveStart(e) {
        this.moving = true;
        var subtractY = e.clientY - parseInt(this.scrollbar.current.style.transform.split("(")[1].split("px")[0]);
        document.body.onmousemove = (f) => {
            var max = (this.props.parent.current.offsetHeight - 16) - this.props.parent.current.offsetHeight * (this.props.parent.current.offsetHeight - 16) / this.props.parent.current.childNodes[0].scrollHeight;
            if (max < 0) max = 0;
            var base = ((f.clientY - subtractY) < 0 ? 0 : (f.clientY - subtractY) > (max) ? (max) : (f.clientY - subtractY));
            this.scrollbar.current.style.transform = "translateY(" + base + "px" + ")";
            this.props.parent.current.scrollTop = base / (this.props.parent.current.offsetHeight - 16) * this.props.parent.current.childNodes[0].scrollHeight;
        }
        document.body.onmouseup = () => {
            this.moving = false;
            document.body.onmousemove = null;
            document.body.onmouseup = null;
        }
    }

    render() {
        return (
            <div className="scrollbar-wrap" style={{ zIndex: this.props.zIndex }} >
                <div ref={this.scrollbar} className={"scrollbar" + (ObjectContainer.isDarkTheme() ? " dark" : "")} onMouseDown={(e) => {this.moveStart(e)}}></div>
            </div>
        )
        
    }

}