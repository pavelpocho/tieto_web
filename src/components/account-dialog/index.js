import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import Overlay from '../overlay';
import { RippleManager } from '../ripple';
import { timingSafeEqual } from 'crypto';

export default class AccountDialog extends Component {

    constructor(props) {

        super(props);

        this.wrap = React.createRef();
        this.content = React.createRef();
        this.overlay = React.createRef();

        this.state = {
            fullName: undefined,
            superiorEmail: undefined,
            success: false,
            fail: false
        }

        this.fullName = React.createRef();
        this.superiorEmail = React.createRef();

        this.http = ObjectContainer.getHttpCommunicator();

    }

    close() {
        this.wrap.current.style.opacity = "0";
        setTimeout(() => {
            this.props.container.closeLastDialog();
        }, 310);
    }

    componentDidMount() {
        this.http.getUserAccountData((r, s) => {
            if (s == 200 || s == 204) {
                //List fetch successful
                setTimeout(() => {
                    RippleManager.setUp();
                }, 150);
                this.setState({
                    fullName: r.fullName,
                    superiorEmail: r.superiorEmail.includes("@tieto.com") ? r.superiorEmail : r.superiorEmail + "@tieto.com"
                })
            }
            else {
                //List fetch failed
            }
        });
        setTimeout(() => {
            this.wrap.current.style.opacity = "1";
            this.content.current.style.marginTop = -this.content.current.offsetHeight / 2 + "px";
            this.overlay.current.div.current.style.opacity = "0.45";
        }, 50);

        //this.scrollbar.current.setUpScrollbar(550);
        /*this.scroll.current.onscroll = () => {
            this.scrollbar.current.setUpScrollbar();
        }*/
    }

    moveStart(e) {
        var t = this.content.current.style.transform;
        var subtractX = e.clientX - this.content.current.offsetLeft - (t == "" ? 0 : parseInt(t.split("(")[1].split("px")[0]));
        var subtractY = e.clientY - this.content.current.offsetTop - (t == "" ? 0 : parseInt(t.split(",")[1].split("px")[0]));
        document.body.onmousemove = (f) => {
            this.content.current.style.marginTop = "0px";
            this.content.current.style.marginLeft = "0px";
            this.content.current.style.top = "0px";
            this.content.current.style.left = "0px";
            this.content.current.style.transform = "translate(" + (f.clientX - subtractX) + "px" + "," + (f.clientY - subtractY) + "px" + ")";
        }
        document.body.onmouseup = () => {
            document.body.onmousemove = null;
            document.body.onmouseup = null;
        }
    }

    setUserAccountData() {
        this.http.setUserAccountData(this.fullName.current.value, this.superiorEmail.current.value, (r, s) => {
            if (s == 200 || s == 204) {
                //Success
                if (r) {
                    this.setState({
                        success: true
                    });
                    setTimeout(() => {
                        this.setState({
                            success: false
                        });
                    }, 1500);
                }
            }
            else {
                this.setState({
                    fail: true
                });
                setTimeout(() => {
                    this.setState({
                        fail: false
                    });
                }, 1500);
            }
        });
    }

    render() {
        return (
            <div ref={this.wrap} className="account-dialog-wrap">
                <Overlay ref={this.overlay} onClick={() => {this.close()}} />
                <div ref={this.content} className={"account-dialog-content" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                    <div className={"ma-window-topbar" + (ObjectContainer.isDarkTheme() ? " dark" : "")} onMouseDown={(e) => {this.moveStart(e)}}>
                        <button onClick={() => {this.close()}} ripplecolor="gray" ref={this.closeButton} className="ma-window-close"><i className="material-icons">arrow_back</i>Back</button>
                        <p>Account Settings</p>
                        <span></span> {/*This is here so that I can use justify-content space-between*/}
                    </div>
                    <div className={"ma-window-main" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                        <div className={"account-dialog-section" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                            <p>Your Full Name</p>
                            <input className={"account-dialog-input" + (ObjectContainer.isDarkTheme() ? " dark" : "")} defaultValue={this.state.fullName} ref={this.fullName} />
                        </div>
                        <div className={"account-dialog-section" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                            <p>Superior Email</p>
                            <input className={"account-dialog-input" + (ObjectContainer.isDarkTheme() ? " dark" : "")} defaultValue={this.state.superiorEmail} ref={this.superiorEmail} />
                        </div>
                        {
                            this.state.success ? (
                                <p className={"account-dialog-info" + (ObjectContainer.isDarkTheme() ? " dark" : "")} style={{color: "#338200"}}>Successfully saved!</p>
                            ) : this.state.fail ? (
                                <p className={"account-dialog-info" + (ObjectContainer.isDarkTheme() ? " dark" : "")} style={{color: "#ff4e0b"}}>Save failed.</p>
                            ) : null
                        }
                        <button className={"account-dialog-save main-button-wrap" + (ObjectContainer.isDarkTheme() ? " dark" : "")} onClick={() => {this.setUserAccountData()}}><span>Save</span></button>
                    </div>
                </div>
            </div>
        )
    }
    
}