import css from './index.css';
import React, { Component, Fragment } from 'react';
import { RippleManager } from '../ripple';
import ObjectContainer from '../../utils/object-container';

export default class WelcomeDialog extends Component {

    constructor(props) {
        super(props);

        this.wrap = React.createRef();
        this.inner = React.createRef();
        this.backdrop = React.createRef();

        this.firstPage = React.createRef();
        this.secondPage = React.createRef();
        this.thirdPage = React.createRef();

        this.firstPageLarge = React.createRef();
        this.firstPageMedium = React.createRef();

        this.prevButton = React.createRef();
        this.nextButton = React.createRef();

        this.dot = React.createRef();

        this.state = {
            selection: 0,
            count: 3
        }
    }

    componentDidMount() {
        RippleManager.setUp();
        this.firstPage.current.style.opacity = "1";
        this.firstPage.current.style.transform = "translateY(0px)";
        setTimeout(() => {
            this.dot.current.style.transform = "scale(1)";
            this.dot.current.style.opacity = "1";
            this.wrap.current.style.opacity = "1";
            this.backdrop.current.style.opacity = "1";
            for (var i = 0; i < document.getElementsByClassName("wd-point").length; i++) {
                setTimeout((j) => {
                    if (j == 0) {
                        this.firstPageLarge.current.style.opacity = "1";
                    }
                    if (j == 1) {
                        this.firstPageMedium.current.style.opacity = "1";
                    }
                    if (j == 2) {
                        this.nextButton.current.style.opacity = "1";
                    }
                    document.getElementsByClassName("wd-point")[j].style.transform = "scale(1)";
                }, (i + 1) * 1020, i);
                if (i < document.getElementsByClassName("wd-line").length) {
                    setTimeout((j) => {
                            document.getElementsByClassName("wd-line")[j].style.height = "72px";
                            document.getElementsByClassName("wd-line")[j].style.opacity = "1";
                    }, (i + 1) * 1020 + 510, i);
                }
            }
        }, 50);
    }

    close() {
        this.wrap.current.style.opacity = "0";
        this.backdrop.current.style.opacity = "0";
        var h = ObjectContainer.getHttpCommunicator();
        h.setWelcomeDone();
        this.props.parent.getTripList();
        setTimeout(() => {
            this.props.container.closeLastDialog();
        }, 310);
    }

    componentDidUpdate() {
        RippleManager.setUp();
        if (this.prevButton.current) {
            setTimeout(() => {
                if (this.state.selection == 1) {
                    this.secondPage.current.style.transform = "translateY(0px)";
                    this.secondPage.current.style.opacity = "1";
                }
                else if (this.state.selection == 2) {
                    this.thirdPage.current.style.transform = "translateY(0px)";
                    this.thirdPage.current.style.opacity = "1";
                }
                this.dot.current.style.transform = "scale(1)";
                this.dot.current.style.opacity = "1";
                this.prevButton.current.style.width = "130px";
                this.prevButton.current.style.marginLeft = "10px";
                this.prevButton.current.style.opacity = "1";
            }, 50);
        }
        else {
            setTimeout(() => {
                if (this.state.selection == 0) {
                    this.firstPage.current.style.transform = "translateY(0px)";
                    this.firstPage.current.style.opacity = "1";
                    this.dot.current.style.transform = "scale(1)";
                    this.dot.current.style.opacity = "1";
                }
                this.firstPageLarge.current.style.opacity = "1";
                this.firstPageMedium.current.style.opacity = "1";
            }, 50);
        }
    }

    changeSelection(i) {
        if ((this.state.selection == 0 && i == -1)) return;
        if (this.state.selection == this.state.count - 1 && i == 1) {
            this.close();
            return;
        }
        if (this.state.selection == 0) {
            this.firstPage.current.style.transform = "translateY(20px)";
            this.firstPage.current.style.opacity = "0";
        }
        else if (this.state.selection == 1) {
            this.secondPage.current.style.transform = "translateY(20px)";
            this.secondPage.current.style.opacity = "0";
        }
        else if (this.state.selection == 2) {
            this.thirdPage.current.style.transform = "translateY(20px)";
            this.thirdPage.current.style.opacity = "0";
        }
        if (this.state.selection + i == 0) {
            this.prevButton.current.style.width = "0px";
            this.prevButton.current.style.margin = "0px";
            this.prevButton.current.style.opacity = "0";
        }
        this.dot.current.style.transform = "scale(0)";
        this.dot.current.style.opacity = "0";
        setTimeout((j) => {
            this.setState(prevState => {
                return {
                    selection: prevState.selection + j,
                    updateDirectionPlus: j == 1
                }
            })
        }, this.state.selection + i == 0 ? 510 : 210, i)
    }

    render() {

        var dots = [];
        for (var i = 0; i < this.state.count; i++) {
            dots.push(<div className={i == this.state.selection ? "wd-dot wd-selected" : "wd-dot"} key={i}></div>);
        }

        return (
            <Fragment>
                <div className="welcome-dialog-backdrop" ref={this.backdrop}></div>
                <div className="welcome-dialog-wrap" ref={this.wrap}>
                    <p className="main-welcome">Welcome</p>
                    <div className="wd-inner" ref={this.inner}>
                        <div className="wd-left-section">
                            <div className="wd-main-content">
                                {
                                    this.state.selection == 0 ? (
                                        <div ref={this.firstPage} className="wd-page">
                                            <p className="large-text" ref={this.firstPageLarge}>In Trippi,<br/>your business trip is a series of points</p>
                                            <p className="medium-text" ref={this.firstPageMedium}>Each point is a place that is important to your trip</p>
                                        </div>
                                    ) : this.state.selection == 1 ? (
                                        <div ref={this.secondPage} className="wd-page">
                                            <p className="wd-slide-title">Create a point for every place, where you:</p>
                                            <ul>
                                                <li>Changed your mode of transportation</li>
                                                <li>Stayed for a prolonged period of time</li>
                                                <li>Received food paid for by the company</li>
                                            </ul>
                                        </div>
                                    ) : this.state.selection == 2 ? (
                                        <div ref={this.thirdPage} className="wd-page">
                                            <p className="wd-slide-title">You should note down when you:</p>
                                            <ul>
                                                <li>Arrived at each point</li>
                                                <li>Departed from each point</li>
                                                <li>Crossed country borders</li>
                                            </ul>
                                        </div>
                                    ) : null
                                }
                            </div>
                            <div className="wd-bottom-bar">
                                {
                                    this.state.selection != 0 ? (
                                        <button ref={this.prevButton} ripplecolor="gray" className="wd-direction wd-prev" onClick={() => {this.changeSelection(-1)}}><i className="material-icons">keyboard_arrow_left</i><span>Back</span></button>
                                    ) : null
                                }
                                <button ref={this.nextButton} className="wd-direction wd-next" onClick={() => {this.changeSelection(1)}}><span>{this.state.selection == this.state.count - 1 ? "Done" : "Next"}</span><i className="material-icons">keyboard_arrow_right</i></button>
                            </div>
                        </div>
                        <div className="wd-right-section">
                            <div className="wd-point">
                            {
                                this.state.selection == 0 ? <div className="wd-dot" ref={this.dot}></div> : null
                            }
                            </div>
                            <div className="wd-line"></div>
                            <div className="wd-point">
                                {
                                    this.state.selection == 1 ? <div className="wd-dot" ref={this.dot}></div> : null
                                }
                            </div>
                            <div className="wd-line"></div>
                            <div className="wd-point">
                                {
                                    this.state.selection == 2 ? <div className="wd-dot" ref={this.dot}></div> : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
        
    }

}