import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import MainActivity from '../main-activity';
import { RippleManager } from '../ripple';
import logo from '../../../assets/images/trippi_logo_blue_text_360p.png';
import HttpCommunicator from '../../utils/http-communicator';

export default class LoginActivity extends Component {

    constructor(props) {
        super(props);

        this.ref = React.createRef();
        this.username = React.createRef();
        this.password = React.createRef();
    }

    componentDidMount() {
        RippleManager.setUp();
        setTimeout(() => {
            this.ref.current.style.transform = "translate(0px, 0px)";
            this.ref.current.style.opacity = "1";
        }, 50);
    }

    close() {
        this.ref.current.style.opacity = "0";
        this.ref.current.style.transform = "translate(0px, 40px)";
    }

    login() {
        this.close();
        var http = ObjectContainer.getHttpCommunicator();
        http.login(this.username.current.value, this.password.current.value, (response) => {
            if (response == null) {
                console.log("wrong password or email");
            }
            else {
                HttpCommunicator.token = response.Token;
                this.props.container.openActivity(<MainActivity container={this.props.container} key="mainActivity" />);
            }
        });
    }
    
    render() {
        return (
            <div className="activity" id="login-activity" ref={this.ref}>
                <div className="content-wrap">
                    <img src={logo} className="blue-text-logo"/>
                    <input ref={this.username} className="login-input" placeholder="Username"></input>
                    <input ref={this.password} className="login-input" placeholder="Password" type="password"></input>
                    <button className="login-button" onClick={() => {this.login()}}>Login</button>
                </div>
            </div>
        )
    }

}