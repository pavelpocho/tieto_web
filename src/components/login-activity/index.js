import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import MainActivity from '../main-activity';
import { RippleManager } from '../ripple';
import logo from '../../../assets/images/trippi_logo_blue_text_360p.png';
import logoDark from '../../../assets/images/trippi_logo_blue_text_dark_360p.png';
import HttpCommunicator from '../../utils/http-communicator';
import Spinner from '../spinner';
import AdminActivity from '../admin-activity';

export default class LoginActivity extends Component {

    constructor(props) {
        super(props);

        this.ref = React.createRef();
        this.username = React.createRef();
        this.password = React.createRef();
        this.passwordConfirm = React.createRef();
        this.fullname = React.createRef();
        this.superiorEmail = React.createRef();
        this.emailText = React.createRef();
        this.passText = React.createRef();
        this.pwdRecoveryEmail = React.createRef();

        this.state = {
            texts: ["Reimbursement of traveling expenses. Redefined.", "Welcome to the 21st century.", "Excel. Reinvented.", "Here to save your time. And nerves."],
            selected: Math.floor(Math.random() * 4),
            loginExpanded: false,
            registerExpanded: false,
            expansionCoords: [],
            allowRegister: true,
            longSign: false,
            passError: false,
            pwdRecovery: false,
            pwdRecoveryFail: false,
            pwdRecoverySuccess: false
        }

        this.windowWrap = React.createRef();
        this.windowBackground = React.createRef();
        this.windowBackdrop = React.createRef();
        this.closeButton = React.createRef();
        this.windowContent = React.createRef();
        this.spinner = React.createRef();
        this.rippleHere = React.createRef();
    }

    componentDidMount() {
        RippleManager.setUp();
        this.spinner.current.ref.current.style.display = "none";
        setTimeout(() => {
            this.ref.current.style.transform = "translate(0px, 0px)";
            this.ref.current.style.opacity = "1";
        }, 50);
    }
    
    componentDidUpdate() {
        if (this.windowWrap.current && this.windowBackdrop.current && this.windowBackground.current && this.closeButton.current && this.windowContent.current) {
            this.windowBackdrop.current.style.display = "block";
            this.windowWrap.current.style.display = "block";
            /*var left = this.state.expansionCoords[0] - this.windowBackground.current.parentElement.offsetLeft;
            var top = this.state.expansionCoords[1] - this.windowBackground.current.parentElement.offsetTop;
            var totalTop = this.windowWrap.current.offsetHeight;
            var totalLeft = this.windowWrap.current.offsetWidth;
            this.windowBackground.current.style.left = left - 5 + "px";
            this.windowBackground.current.style.top = top - 5 + "px";
            var largestTop = top > totalTop - top ? top : totalTop - top;
            var largestLeft = left > totalLeft - left ? left : totalLeft - left;
            var largest = largestTop > largestLeft ? largestTop : largestLeft;*/
            setTimeout(() => {
                this.windowWrap.current.style.opacity = "1";
                //this.windowBackground.current.style.transform = "scale(" + largest / 5 * Math.SQRT2 + ")";
                this.windowBackground.current.style.transform = "scaleY(1)";
                setTimeout(() => {
                    this.windowContent.current.style.opacity = "1";
                    if (ObjectContainer.isDarkTheme()) {
                        this.windowWrap.current.style.boxShadow = "0px 0px 10px -4px #444";
                    }
                    else {
                        this.windowWrap.current.style.boxShadow = "0px 0px 10px -4px #aaa";    
                    }
                }, 250);
                this.windowBackdrop.current.style.opacity = "0.45";
            }, 50);
            RippleManager.setUp();
        }
    }

    close() {
        this.ref.current.style.opacity = "0";
        this.ref.current.style.transform = "scale(1.05)";
    }

    login() {
        if (this.username.current.value == "" || this.password.current.value == "") {
            this.forceLoginFail();
            return;
        }
        var http = ObjectContainer.getHttpCommunicator();
        this.spinner.current.ref.current.style.display = "block";
        //Domain config
        var username = this.username.current.value;
        if (!username.includes("@")) {
            username = username + "@tieto.com";
        }
        http.login(username, this.password.current.value, this.state.longSign, (response) => {
            this.loginCallback(response);
        });
    }

    checkEmail(email) {
        var http = ObjectContainer.getHttpCommunicator();
        //Config domain
        http.checkEmail(email + "@tieto.com", (r, s) => {
            if (s == 200 || s == 204) {
                //Check successful
                if (r) {
                    //Okay..
                    this.emailText.current.innerHTML = "A unique email to sign in and identify you";
                    this.setState({
                        allowRegister: true
                    });
                }
                else {
                    //Email taken
                    this.setState({
                        allowRegister: false
                    });
                    this.emailText.current.innerHTML = "<span style='color: #FF4E0B'>This email is already taken</span>";
                }
            }
            else {
                //Check failed
            }
        })
    }

    checkPasswords() {
        if (this.password.current.value != this.passwordConfirm.current.value) {
            this.passText.current.innerHTML = "<span style='color: #FF4E0B'>Passwords don't match</span>";
            this.setState({
                allowRegister: false
            });
        }
        else {
            this.passText.current.innerHTML = "";
            this.setState({
                allowRegister: true
            });
        }
    }

    register() {
        if (this.username.current.value == "" || this.password.current.value == "" || this.passwordConfirm.current.value == "" ||
            this.fullname.current.value == "" || this.superiorEmail.current.value == "") {
                this.forceLoginFail();
                return;
        }
        var http = ObjectContainer.getHttpCommunicator();
        this.spinner.current.ref.current.style.display = "block";
        //Put this in a config file as companyDomain
        var username = this.username.current.value;
        if (!username.includes("@")) {
            username = username + "@tieto.com";
        }
        http.register(username, this.password.current.value, this.fullname.current.value, this.superiorEmail.current.value + "@tieto.com", (response) => {
            this.loginCallback(response);
        });
    }

    forceLoginFail() {
        this.setState({
            passError: true
        });
        this.spinner.current.ref.current.style.display = "none";
    }

    loginCallback(response) {
        if (response == null || response == "") {
            this.setState({
                passError: true
            });
            this.spinner.current.ref.current.style.display = "none";
        }
        else {
            if (this.state.loginExpanded) {
                this.closeWindow(0);
            }
            if (this.state.registerExpanded) {
                this.closeWindow(1);
            }
            setTimeout(() => {
                HttpCommunicator.authenticated = true;
                if (response.admin) {
                    this.props.container.openActivity(<AdminActivity container={this.props.container} key="adminActivity" />);
                }
                else {
                    this.props.container.openActivity(<MainActivity container={this.props.container} key="mainActivity" />);
                }
                this.close();
            }, 350);
        }
    }

    changeLongSign() {
        this.setState(prevState => {
            return {
                longSign: !prevState.longSign
            }
        })
    }

    expandLogin(x, y) {
        document.getElementsByClassName("bottom-strip")[0].style.transform = "translateY(30px)";
        this.ref.current.style.overflowY = "hidden";
        this.setState(prevState => {
            return {
                loginExpanded: !prevState.loginExpanded,
                expansionCoords: [x, y]
            }
        })
    }

    expandRegister(x, y) {
        document.getElementsByClassName("bottom-strip")[0].style.transform = "translateY(30px)";
        this.ref.current.style.overflowY = "hidden";
        this.setState(prevState => {
            return {
                registerExpanded: !prevState.registerExpanded,
                expansionCoords: [x, y]
            }
        })
    }

    closeWindow() {
        document.getElementsByClassName("bottom-strip")[0].style.transform = "translateY(0px)";
        this.ref.current.style.overflowY = "scroll";
        this.windowWrap.current.style.opacity = "0";
        this.windowBackdrop.current.style.opacity = "0";
        this.windowWrap.current.style.transform = "translateY(20px)";
        setTimeout(() => {
            this.setState({
                registerExpanded: false,
                loginExpanded: false,
                passError: false            
            })
        }, 510);
    }
    
    expandPwdRecovery() {
        this.setState(prevState => {
            return {
                pwdRecovery: !prevState.pwdRecovery
            }
        })
    }

    resetPassword() {
        var http = ObjectContainer.getHttpCommunicator();
        http.resetPassword(this.pwdRecoveryEmail.current.value, (success) => {
            if (success) {
                this.setState({
                    pwdRecoveryFail: false,
                    pwdRecoverySuccess: true
                });
            }
            else {
                this.setState({
                    pwdRecoveryFail: true,
                    pwdRecoverySuccess: false
                });
            }
        })
    }
    
    render() {
        return (
            <Fragment>
                <div className={"activity" + (ObjectContainer.isDarkTheme() ? " dark" : "")} id="login-activity" ref={this.ref}>
                    <Spinner ref={this.spinner} size={60} position={"fixed"}/>
                    <div className="la-top-content">
                        <img src={ObjectContainer.isDarkTheme() ? logoDark : logo} className="blue-text-logo"/>
                    </div>
                    <div className={"la-icons" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                        <i className="material-icons">business</i>
                        <svg className="la-svg" height="200" width="150" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 150 C 10 150, 50 190, 140 135" strokeDasharray="12" stroke={ObjectContainer.isDarkTheme() ? "#1b1b1b" : "#e4e4e4"} strokeWidth="8" fill="transparent"/>
                        </svg>
                        <i className="material-icons" style={{transform: "rotate(52deg)"}}>airplanemode_active</i>
                        <svg className="la-svg" height="200" width="150" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 55 C 10 55, 50 20, 140 70" strokeDasharray="12" stroke={ObjectContainer.isDarkTheme() ? "#1b1b1b" : "#e4e4e4"} strokeWidth="8" fill="transparent"/>
                        </svg>
                        <i className="material-icons">location_on</i>
                    </div>
                    <p className={"la-content-title" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>{this.state.texts[0]}</p>
                    <div className="la-content-wrap">
                        <div className="la-main-button-wrap">
                            <button className={"la-login-expand" + (ObjectContainer.isDarkTheme() ? " dark" : "")} onClick={(e) => {this.expandLogin(e.clientX, e.clientY)}}>LOGIN</button>
                            <button ripplecolor="gray" className={"la-register-expand" + (ObjectContainer.isDarkTheme() ? " dark" : "")} onClick={(e) => {this.expandRegister(e.clientX, e.clientY)}}>SET UP ACCOUNT</button>
                        </div>
                    </div>
                    {
                        this.state.loginExpanded || this.state.registerExpanded ? (
                            <div ref={this.windowBackdrop} className={"la-backdrop" + (ObjectContainer.isDarkTheme() ? " dark" : "")}></div>
                        ) : null
                    }
                </div>
                {
                    this.state.loginExpanded ? (
                        <div className="la-login-wrap" ref={this.windowWrap} onKeyDown={(e) => {if (e.keyCode == 13) {this.login()}}}>
                            <div className={"la-login-register-background" + (ObjectContainer.isDarkTheme() ? " dark" : "")} ref={this.windowBackground}></div>
                            <div ref={this.windowContent} className={"la-login-register-content" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                <div className={"la-window-topbar" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                    <button onClick={() => {this.closeWindow(0)}} ripplecolor="gray" ref={this.closeButton} className="la-window-close"><i className="material-icons">arrow_back</i>Back</button>
                                    <span></span> {/*This is here so that I can use justify-content space-between*/}
                                </div>
                                <div className={"la-window-content"}>
                                    <p>Sign into your account</p>
                                    {
                                        !this.state.pwdRecovery ? (
                                            <Fragment>
                                                <div className={"email-input-wrap" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                                    <input name="email" autoComplete="off" className={"email-specific" + (ObjectContainer.isDarkTheme() ? " dark" : "")} ref={this.username} placeholder="Email" />{/*<p>@tieto.com</p>*/}
                                                </div>
                                                <input autoComplete="off" ref={this.password} className={"login-input" + (ObjectContainer.isDarkTheme() ? " dark" : "")} placeholder="Password" type="password" />
                                                <div className="long-sign-wrap">
                                                    <button ripplecolor="gray" className={"stay-signed-button" + (ObjectContainer.isDarkTheme() ? " dark" : "")} onClick={() => {this.changeLongSign()}}>
                                                        <div ripplecolor="gray" className={"fiw-checkbox uncheck-white" + (this.state.longSign ? " checked check-blue" : "") + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                                            <i className="material-icons">done</i>
                                                        </div>
                                                        <p>Stay signed in</p>
                                                    </button>
                                                </div>
                                                <button ripplecolor="gray" className={"pwd-recovery-open" + (ObjectContainer.isDarkTheme() ? " dark" : "")} onClick={() => {this.expandPwdRecovery()}}>Forgot your password?</button>
                                            </Fragment>
                                        ) : null
                                    }
                                    {
                                        this.state.pwdRecovery ? (
                                            <div className={"pwd-recovery-wrap"}>
                                                <p>Enter your email address below to recover your password</p>
                                                <input placeholder="Email" type="text" ref={this.pwdRecoveryEmail} />
                                                <button className={"pwd-reset"} onClick={() => {this.resetPassword()}}>Reset password</button>
                                                <button ripplecolor="gray" className={"pwd-recovery-open" + (ObjectContainer.isDarkTheme() ? " dark" : "")} onClick={() => {this.expandPwdRecovery()}}>Go Back</button>
                                                {
                                                    this.state.pwdRecoveryFail ? (
                                                        <p className={"la-info" + (ObjectContainer.isDarkTheme() ? " dark" : "")} style={{paddingTop: "12px"}}><span style={{color: ObjectContainer.isDarkTheme() ? "#c32600" : "#FF4E0B"}}>Email not found</span></p>
                                                    ) : this.state.pwdRecoverySuccess ? (
                                                        <p className={"la-info" + (ObjectContainer.isDarkTheme() ? " dark" : "")} style={{paddingTop: "12px"}}><span style={{color: ObjectContainer.isDarkTheme() ? "#1f6e00" : "#338200"}}>Password recovery email sent</span></p>
                                                    ) : null
                                                }
                                            </div>
                                        ) : null
                                    }
                                    {
                                        !this.state.pwdRecovery ? (
                                            <button ref={this.rippleHere} className={"login-button" + (ObjectContainer.isDarkTheme() ? " dark" : "")} onClick={() => {this.login()}}>Login</button>
                                        ) : null
                                    }                                    
                                    {
                                        this.state.passError && !this.state.pwdRecovery ? (
                                            <p className={"la-info" + (ObjectContainer.isDarkTheme() ? " dark" : "")} style={{paddingTop: "12px"}}><span style={{color: ObjectContainer.isDarkTheme() ? "#c32600" : "#FF4E0B"}}>Incorrect or missing email or password</span></p>
                                        ) : null
                                    }
                                </div>
                            </div>
                        </div>
                    ) : null
                }
                {
                    this.state.registerExpanded ? (
                        <div ref={this.windowWrap} className={"la-register-wrap" + (ObjectContainer.isDarkTheme() ? " dark" : "")} onKeyDown={(e) => {if (e.keyCode == 13) {this.register()}}}>
                            <div ref={this.windowBackground} className={"la-login-register-background" + (ObjectContainer.isDarkTheme() ? " dark" : "")}></div>
                            <div ref={this.windowContent} className={"la-login-register-content" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                <div className={"la-window-topbar" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                    <button onClick={() => {this.closeWindow(1)}} ripplecolor="gray" ref={this.closeButton} className="la-window-close"><i className="material-icons">arrow_back</i>Back</button>
                                    <span></span> {/*This is here so that I can use justify-content space-between*/}
                                </div>
                                <div className="la-window-content">
                                    <p className="la-less-margin">Set up a new account</p>
                                    <div className={"email-input-wrap" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                        <input name="email" autoComplete="new-password" ref={this.username} className={"email-specific" + (ObjectContainer.isDarkTheme() ? " dark" : "")} placeholder="Email" onChange={(e) => {this.checkEmail(e.target.value)}}></input>{/*<p>@tieto.com</p>*/}
                                    </div>
                                    <p ref={this.emailText} className={"la-info" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Unique email to sign in and identify you</p>
                                    <input autoComplete="new-password" ref={this.fullname} className={"login-input" + (ObjectContainer.isDarkTheme() ? " dark" : "")} placeholder="Full Name" ></input>
                                    <p className={"la-info" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Your full name displayed on Trip Reports</p>
                                    <input autoComplete="new-password" ref={this.password} className={"login-input" + (ObjectContainer.isDarkTheme() ? " dark" : "")} placeholder="Password" type="password" onChange={() => {this.checkPasswords()}}></input>
                                    <input autoComplete="new-password" ref={this.passwordConfirm} className={"login-input" + (ObjectContainer.isDarkTheme() ? " dark" : "")} placeholder="Confirm Password" onChange={() => {this.checkPasswords()}} type="password"></input>
                                    <p ref={this.passText} className={"la-info" + (ObjectContainer.isDarkTheme() ? " dark" : "")}></p>
                                    <div className={"email-input-wrap" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                        <input autoComplete="new-password" className={"email-specific" + (ObjectContainer.isDarkTheme() ? " dark" : "")} ref={this.superiorEmail} placeholder="Superior's Email" ></input>{/*<p>@tieto.com</p>*/}
                                    </div>
                                    <p className={"la-info" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>The email of the person, who approves your Trip Reports</p>
                                    <button disabled={!this.state.allowRegister} ref={this.rippleHere} className={"login-button" + (ObjectContainer.isDarkTheme() ? " dark" : "")} onClick={() => {this.register()}}>Register</button>
                                    {
                                        this.state.passError ? (
                                            <p className={"la-info" + (ObjectContainer.isDarkTheme() ? " dark" : "")} style={{paddingTop: "12px"}}><span style={{color: ObjectContainer.isDarkTheme() ? "#c32600" : "#FF4E0B"}}>Please fill in all the fields</span></p>
                                        ) : null
                                    }
                                </div>
                            </div>
                        </div>
                    ) : null
                }
            </Fragment>
        )
    }

}