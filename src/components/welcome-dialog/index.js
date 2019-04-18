import css from './index.css';
import React, { Component, Fragment } from 'react';
import { RippleManager } from '../ripple';

export default class WelcomeDialog extends Component {

    constructor(props) {
        super(props);

        this.wrap = React.createRef();
        this.backdrop = React.createRef();
        this.page = React.createRef();

        this.state = {
            selection: 0,
            count: 3
        }
    }

    componentDidMount() {
        RippleManager.setUp();
        this.wrap.current.style.marginLeft = - this.wrap.current.offsetWidth / 2 + "px";
        this.wrap.current.style.marginTop = - this.wrap.current.offsetHeight / 2 + "px";
        setTimeout(() => {
            this.wrap.current.style.transform = "scale(1.0)";
            this.wrap.current.style.opacity = "1";
            this.backdrop.current.style.opacity = "0.55";
        }, 50);
    }

    componentDidUpdate() {
        setTimeout(() => {
            this.page.current.style.transform = "translateX(0px)";
        }, 50);
    }

    changeSelection(i) {
        if ((this.state.selection == this.state.count - 1 && i == 1) || (this.state.selection == 0 && i == -1)) return;
        this.setState(prevState => {
            return {
                selection: prevState.selection + i
            }
        })
    }

    render() {

        var dots = [];
        for (var i = 0; i < this.state.count; i++) {
            dots.push(<div className={i == this.state.selection ? "wd-dot wd-selected" : "wd-dot"} key={i}></div>);
        }

        return (
            <Fragment>
                <div className="welcome-dialog-backdrop" ref={this.backdrop} ></div>
                <div className="welcome-dialog-wrap" ref={this.wrap} >
                    <div className="wd-main-content">
                        {
                            this.state.selection == 0 ? (
                                <div ref={this.page} className="wd-page" style={{transform: "translateX(20px)"}}>Hello world</div>
                            ) : this.state.selection == 1 ? (
                                <div ref={this.page} className="wd-page" style={{transform: "translateX(20px)"}}>Second page</div>
                            ) : this.state.selection == 2 ? (
                                <div ref={this.page} className="wd-page" style={{transform: "translateX(20px)"}}>Final words</div>
                            ) : null
                        }
                    </div>
                    <div className="wd-bottom-bar">
                        <button disabled={this.state.selection == 0} ripplecolor="gray" className="wd-direction" onClick={() => {this.changeSelection(-1)}}><i className="material-icons">keyboard_arrow_left</i>Back</button>
                        <div className="wd-indicator-wrap">
                            {dots}
                        </div>
                        <button ripplecolor="gray" className="wd-direction" onClick={() => {this.changeSelection(1)}}>{this.state.selection == this.state.count - 1 ? "Done" : "Next"}<i className="material-icons">keyboard_arrow_right</i></button>
                    </div>
                </div>
            </Fragment>
        )
        
    }

}