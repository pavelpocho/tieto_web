import css from './index.css';
import React, { Component, Fragment } from 'react';
import ObjectContainer from '../../utils/object-container';
import Background from '../background';
import MainActivity from '../main-activity';
import TripActivity from '../trip-activity';
import LoginActivity from '../login-activity';
import CookieManager from '../../utils/cookie-manager';
import HttpCommunicator from '../../utils/http-communicator';
import AdminActivity from '../admin-activity';
const preval = require('preval.macro');

export default class Container extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activityHistory: [],
            dialogHistory: [],
            outActivity: null,
            transitioningForward: false,
            transitioningBackward: false,
            apiVersion: -1,
            apiBuildDate: -1
        }

        this.background = React.createRef();

        if (ObjectContainer.isDarkTheme()) document.body.style.backgroundColor = "black";

    }

    startApp() {

        var h = ObjectContainer.getHttpCommunicator();
        
        document.body.removeChild(document.getElementById("init-loader"));

        if (CookieManager.getCookie("token") != undefined && CookieManager.getCookie("token") != "") {
            h.tokenCheck(CookieManager.getCookie("token"), (r) => {
                //True r means admin account
                if (r == "true") {
                    this.openActivity(<AdminActivity key="adminActivity" container={this} />);
                }
                else {
                    this.openActivity(<MainActivity key="mainActivity" container={this} />);
                }
                this.background.current.loginAction();
            }, () => {
                this.openActivity(<LoginActivity key="loginActivity" container={this} />);
            })
        }
        else {
            this.openActivity(<LoginActivity key="loginActivity" container={this} />);
        }

        h.getApiVersion((r, s) => {
            if (s == 200) {
                this.setState({
                    apiVersion: r.split(";")[0],
                    apiBuildDate: r.split(";")[1]
                })
            }
            else {
                //Failed...
            }
        })
    }

    componentDidMount() {
        this.startApp();
    }

    openActivity(activity) {

        if (activity.key == "loginActivity") {
            this.background.current.welcomeMode();
        }

        this.setState((prevState) => {

            var a = prevState.activityHistory;
            a.push(activity);

            return {
                activityHistory: a,
                outActivity: a[a.length - 2],
                position: prevState.position + 1
            }

        })
    }

    closeLastActivity() {
        this.setState((prevState) => {

            var a = prevState.activityHistory;
            var o = a[a.length - 1];
            a.splice(a.length - 1, 1);

            return {
                activityHistory: a,
                outActivity: o
            }

        })
    }

    openDialog(dialog) {
        this.setState((prevState) => {

            var d = prevState.dialogHistory;
            d.push(dialog);

            return {
                dialogHistory: d
            }

        })
    }

    closeLastDialog() {
        this.setState((prevState) => {

            var d = prevState.dialogHistory;
            d.splice(d.length - 1, 1);

            return {
                dialogHistory: d
            }

        })
    }

    closeFirstDialog() {
        this.setState((prevState) => {

            var d = prevState.dialogHistory;
            d.splice(0, 1);

            return {
                dialogHistory: d
            }

        })
    }

    componentDidUpdate() {
        if (this.state.outActivity) {
            if (this.state.outActivity.key == "mainActivity") {
                this.background.current.tripEdit();
            }
            else if (this.state.outActivity.key == "loginActivity") {
                this.background.current.loginAction();
            }
            else {
                this.background.current.homeScreen();
            }
            setTimeout(() => {
                this.setState({
                    outActivity: null
                })
            }, 510);
        }
    }

    zeroBeforeText(text) {
        if (parseInt(text) < 10) {
            return "0" + text;
        }
        else return text;
    }

    render() {

        const buildDate = new Date(preval`module.exports = new Date()`);

        const version = preval`
        var version = require('../../../package.json').version;
        var build = require('fs').readFileSync('./build.txt', 'utf-8');
        var buildVersion = build.split('#')[0];
        var buildNumber = build.split('#')[1];
        var newData;
        if (buildVersion == version) {
            var newBuildNumber = (parseInt(buildNumber) + 1).toString();
        }
        else {
            var newBuildNumber = 1;
        }
        newData = version + '#' + newBuildNumber;
        require('fs').writeFileSync('./build.txt', newData, 'utf-8');
        module.exports = newData;
        `;

        var dateString = buildDate.getDate() + "." + 
        (buildDate.getMonth() + 1) + "." + 
        buildDate.getFullYear() + " " + 
        this.zeroBeforeText(buildDate.getHours()) + ":" + 
        this.zeroBeforeText(buildDate.getMinutes())

        let dateObject = new Date(parseInt(this.state.apiBuildDate));

        var apiDateString = dateObject.getDate() + "." + 
        (dateObject.getMonth() + 1) + "." + 
        dateObject.getFullYear() + " " + 
        this.zeroBeforeText(dateObject.getHours()) + ":" + 
        this.zeroBeforeText(dateObject.getMinutes())

        return (
            <Fragment>
                <Background ref={this.background} />
                {
                    this.state.outActivity
                }
                {
                    this.state.activityHistory[this.state.activityHistory.length - 1]
                }
                {
                    this.state.dialogHistory.map(v => v)
                }
                {
                    this.state.activityHistory.length == 0 || this.state.activityHistory[this.state.activityHistory.length - 1].key != "tripActivity" ? (
                        <Fragment>
                            <p className={"web-app-version" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Trippi WebApp Alpha {version} - Build Date: {dateString}</p>
                            <p className={"api-version" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Trippi API Alpha {this.state.apiVersion} - Build Date: {apiDateString}</p>
                            <a ripple="none" href="./changelog.html" target="_blank" className={"changelog-link" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Changelog</a>
                        </Fragment>
                    ) : null
                }
            </Fragment>
        )
        
    }

}
