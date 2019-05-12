import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import MainActivity from '../main-activity';
import { RippleManager } from '../ripple';
import logo from '../../../assets/images/trippi_logo_blue_text_360p.png';
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

        this.state = {
            texts: ["Reimbursement of traveling expenses. Redefined.", "Welcome to the 21st century.", "Excel. Reinvented.", "Here to save your time. And nerves."],
            selected: Math.floor(Math.random() * 4),
            loginExpanded: false,
            registerExpanded: false,
            expansionCoords: [],
            allowRegister: true,
            longSign: false,
            passError: false
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
            this.windowWrap.current.style.display = "block";
            this.windowBackdrop.current.style.display = "block";
            var left = this.state.expansionCoords[0] - this.windowBackground.current.parentElement.offsetLeft;
            var top = this.state.expansionCoords[1] - this.windowBackground.current.parentElement.offsetTop;
            var totalTop = this.windowWrap.current.offsetHeight;
            var totalLeft = this.windowWrap.current.offsetWidth;
            this.windowBackground.current.style.left = left - 5 + "px";
            this.windowBackground.current.style.top = top - 5 + "px";
            var largestTop = top > totalTop - top ? top : totalTop - top;
            var largestLeft = left > totalLeft - left ? left : totalLeft - left;
            var largest = largestTop > largestLeft ? largestTop : largestLeft;
            setTimeout(() => {
                this.windowWrap.current.style.opacity = "1";
                this.windowBackground.current.style.transform = "scale(" + largest / 5 * Math.SQRT2 + ")";
                setTimeout(() => {
                    this.windowContent.current.style.opacity = "1";
                    this.windowWrap.current.style.boxShadow = "1px 1px 10px -4px #aaa";
                }, 410);
                this.windowBackdrop.current.style.opacity = "0.45";
            }, 50);
            RippleManager.setUp();
        }
    }

    close() {
        this.ref.current.style.opacity = "0";
        this.ref.current.style.transform = "translate(0px, 40px)";
    }

    login() {
        if (this.username.current.value == "" || this.password.current.value == "") {
            this.forceLoginFail();
            return;
        }
        var http = ObjectContainer.getHttpCommunicator();
        this.spinner.current.ref.current.style.display = "block";
        //Domain config
        http.login(this.username.current.value + "@tieto.com", this.password.current.value, this.state.longSign, (response) => {
            this.loginCallback(response);
        });
    }

    checkEmail(email) {
        var http = ObjectContainer.getHttpCommunicator();
        //Config domain
        http.checkEmail(email + "@tieto.com", (r, s) => {
            if (s == 200) {
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
        http.register(this.username.current.value + "@tieto.com", this.password.current.value, this.fullname.current.value, this.superiorEmail.current.value, (response) => {
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
            HttpCommunicator.token = response.Token;
            this.close();
            if (response.admin) {
                this.props.container.openActivity(<AdminActivity container={this.props.container} key="adminActivity" />);
            }
            else {
                this.props.container.openActivity(<MainActivity container={this.props.container} key="mainActivity" />);
            }
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
        this.setState(prevState => {
            return {
                loginExpanded: !prevState.loginExpanded,
                expansionCoords: [x, y]
            }
        })
    }

    expandRegister(x, y) {
        this.setState(prevState => {
            return {
                registerExpanded: !prevState.registerExpanded,
                expansionCoords: [x, y]
            }
        })
    }

    closeWindow() {
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
    
    render() {
        return (
            <div className="activity" id="login-activity" ref={this.ref}>
                <Spinner ref={this.spinner} size={60} position={"fixed"}/>
                {/*<div className="content-wrap">
                    <img src={logo} className="blue-text-logo"/>
                    <input ref={this.username} className="login-input" placeholder="Username"></input>
                    <input ref={this.password} className="login-input" placeholder="Password" type="password"></input>
                    <button className="login-button" onClick={() => {this.login()}}>Login</button>
                </div>*/}
                <img src={logo} className="blue-text-logo"/>
                <div className="la-icons">
                    <i className="material-icons">business</i>
                    <svg className="la-svg" height="200" width="150" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 150 C 10 150, 50 190, 140 135" strokeDasharray="12" stroke="#e4e4e4" strokeWidth="8" fill="transparent"/>
                    </svg>
                    <i className="material-icons" style={{transform: "rotate(52deg)"}}>airplanemode_active</i>
                    <svg className="la-svg" height="200" width="150" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 55 C 10 55, 50 20, 140 70" strokeDasharray="12" stroke="#e4e4e4" strokeWidth="8" fill="transparent"/>
                    </svg>
                    <i className="material-icons">location_on</i>
                </div>
                <div className="la-content-wrap">
                    <p className="la-content-title">{this.state.texts[0]}</p>
                    <div className="la-separator"></div>
                    <div className="la-main-button-wrap">
                        <button className="la-login-expand" onClick={(e) => {this.expandLogin(e.clientX, e.clientY)}}>LOGIN</button>
                        <button ripplecolor="gray" className="la-register-expand" onClick={(e) => {this.expandRegister(e.clientX, e.clientY)}}>SET UP ACCOUNT</button>
                    </div>
                </div>
                {
                    this.state.loginExpanded || this.state.registerExpanded ? (
                        <div ref={this.windowBackdrop} className="la-backdrop"></div>
                    ) : null
                }
                {
                    this.state.loginExpanded ? (
                        <div className="la-login-wrap" ref={this.windowWrap} onKeyDown={(e) => {if (e.keyCode == 13) {this.login()}}}>
                            <div className="la-login-register-background" ref={this.windowBackground}></div>
                            <div ref={this.windowContent} className="la-login-register-content">
                                <div className="la-window-topbar">
                                    <button onClick={() => {this.closeWindow(0)}} ripplecolor="gray" ref={this.closeButton} className="la-window-close"><i className="material-icons">arrow_back</i>Back</button>
                                    <span></span> {/*This is here so that I can use justify-content space-between*/}
                                </div>
                                <p>Sign into your account</p>
                                <div className="email-input-wrap">
                                    <input className="email-specific" ref={this.username} placeholder="Email" /><p>@tieto.com</p>
                                </div>
                                <input ref={this.password} className="login-input" placeholder="Password" type="password" />
                                <div className="long-sign-wrap">
                                    <button ripplecolor="gray" className="stay-signed-button" onClick={() => {this.changeLongSign()}}>
                                        <div ripplecolor="gray" className={"fiw-checkbox uncheck-white" + (this.state.longSign ? " checked check-blue" : "")}>
                                            <i className="material-icons">done</i>
                                        </div>
                                        <p>Stay signed in</p>
                                    </button>
                                </div>
                                <button ref={this.rippleHere} className="login-button" onClick={() => {this.login()}}>Login</button>
                                {
                                    this.state.passError ? (
                                        <p className="la-info" style={{paddingTop: "12px"}}><span style={{color: "#FF4E0B"}}>Incorrect or missing email or password</span></p>
                                    ) : null
                                }
                            </div>
                        </div>
                    ) : null
                }
                {
                    this.state.registerExpanded ? (
                        <div ref={this.windowWrap} className="la-register-wrap" onKeyDown={(e) => {if (e.keyCode == 13) {this.register()}}}>
                            <div ref={this.windowBackground} className="la-login-register-background"></div>
                            <div ref={this.windowContent} className="la-login-register-content">
                                <div className="la-window-topbar">
                                    <button onClick={() => {this.closeWindow(1)}} ripplecolor="gray" ref={this.closeButton} className="la-window-close"><i className="material-icons">arrow_back</i>Back</button>
                                    <span></span> {/*This is here so that I can use justify-content space-between*/}
                                </div>
                                <p className="la-less-margin">Set up a new account</p>
                                <div className="email-input-wrap">
                                    <input ref={this.username} className="email-specific" placeholder="Email" onChange={(e) => {this.checkEmail(e.target.value)}}></input><p>@tieto.com</p>
                                </div>
                                <p ref={this.emailText} className="la-info">Unique email to sign in and identify you</p>
                                <input ref={this.fullname} className="login-input" placeholder="Full Name" ></input>
                                <p className="la-info">Your full name displayed on Trip Reports</p>
                                <input ref={this.password} className="login-input" placeholder="Password" type="password" onChange={() => {this.checkPasswords()}}></input>
                                <input ref={this.passwordConfirm} className="login-input" placeholder="Confirm Password" onChange={() => {this.checkPasswords()}} type="password"></input>
                                <p ref={this.passText} className="la-info"></p>
                                <div className="email-input-wrap">
                                    <input className="email-specific" ref={this.superiorEmail} placeholder="Superior's Email" ></input><p>@tieto.com</p>
                                </div>
                                <p className="la-info">The email of the person, who approves your Trip Reports</p>
                                <button disabled={!this.state.allowRegister} ref={this.rippleHere} className="login-button" onClick={() => {this.register()}}>Register</button>
                                {
                                    this.state.passError ? (
                                        <p className="la-info" style={{paddingTop: "12px"}}><span style={{color: "#FF4E0B"}}>Please fill in all the fields</span></p>
                                    ) : null
                                }
                            </div>
                        </div>
                    ) : null
                }
                
            </div>
        )
    }

}