import css from './index.css';
import React, { Component, Fragment } from 'react';
import ObjectContainer from '../../utils/object-container';
import SaveIndicator from '../save-indicator';
import CookieManager from '../../utils/cookie-manager';
import { RippleManager } from '../ripple';
import TripPreviewState from '../trip-preview-state';
import Spinner from '../spinner';
import { readFile } from 'fs';

export default class AdminActivity extends Component {

    constructor(props) {
        super(props);

        this.state = {
            countries: [],
            countries2020: [],
            configuration: [],
            statistics: [],
            pendingRequests: 0,
            doneLoading: false,
            ripple: false,
            feedbacks: null
        }

        this.saveIndicator = React.createRef();
    }

    componentDidMount() {
        let h = ObjectContainer.getHttpCommunicator();
        h.getCountryList((r, s) => {
            if (s == 200 || s == 204) {
                //Success
                this.setState({
                    countries: r
                })
                this.checkDone(() => {
                    RippleManager.setUp();
                });
            }
            else {
                //Failed...
            }
        });
        h.getCountryList2020((r, s) => {
            if (s == 200 || s == 204) {
                //Success
                this.setState({
                    countries2020: r
                })
                this.checkDone(() => {
                    RippleManager.setUp();
                });
            }
            else {
                //Failed...
            }
        });
        h.getConfigurationList((r, s) => {
            if (s == 200 || s == 204) {
                //Success
                this.setState({
                    configuration: r
                });
                this.checkDone(() => {
                    RippleManager.setUp();
                });
            }
            else {
                //Failed...
            }
        });
        h.getFeedbackList((r, s) => {
            if (s == 200 || s == 204) {
                //List fetch successful
                r.sort((a, b) => {return b.postedAt - a.postedAt});
                this.setState({
                    feedbacks: r
                })
            }
            else {
                //List fetch failed
            }
        });
        h.getStatistics((r, s) => {
            if (s == 200 || s == 204) {
                //List fetch successful
                this.setState({
                    statistics: r
                })
            }
            else {
                //List fetch failed
            }
        })
    }

    checkDone() {
        if (this.state.countries != [] && this.state.configuration != []) {
            this.setState({
                doneLoading: true
            });
            RippleManager.setUp();
        }
    }

    checkNumber(target) {
        var string = target.value;
        string = string.replace(",", ".");
        if (isNaN(string)) {
            var foundDot = false;
            for (var i = string.length; i >=0; i--) {
                if (string[i] == "." && foundDot) {
                    string = string.replace(string.charAt(i), "");
                }
                else if (string[i] == ".") {
                    foundDot = true;
                }
                else if (isNaN(string[i])) {
                    string = string.replace(string.charAt(i), "");
                }
            }
        }
        target.value = string;
    }

    saveAllowance(target) {
        this.saveIndicator.current.setStatus(1);
        this.setState(prevState => {
            return {
                pendingRequests: prevState.pendingRequests + 1
            }
        });

        var objectId = target.getAttribute("allowanceid");
        var objectCurrency = target.getAttribute("allowancecurrency");
        var newMoney = parseFloat(target.value);
        var allowance = {
            id: objectId,
            currency: objectCurrency,
            moneyAmount: newMoney
        }

        var h = ObjectContainer.getHttpCommunicator();
        h.saveCountryAllowance(allowance, (r, s) => {
            if (s == 200 || s == 204) {
                if (this.state.pendingRequests == 1) {
                    this.saveIndicator.current.setStatus(0);
                }
            }
            else {
                this.saveIndicator.current.setStatus(2);
            }
            this.setState(prevState => {
                return {
                    pendingRequests: prevState.pendingRequests - 1
                }
            });
        });
    }

    saveAllowance2020(target) {
        this.saveIndicator.current.setStatus(1);
        this.setState(prevState => {
            return {
                pendingRequests: prevState.pendingRequests + 1
            }
        });

        var objectId = target.getAttribute("allowanceid");
        var objectCurrency = target.getAttribute("allowancecurrency");
        var newMoney = parseFloat(target.value);
        var allowance = {
            id: objectId,
            currency: objectCurrency,
            moneyAmount: newMoney
        }

        var h = ObjectContainer.getHttpCommunicator();
        h.saveCountryAllowance2020(allowance, (r, s) => {
            if (s == 200 || s == 204) {
                if (this.state.pendingRequests == 1) {
                    this.saveIndicator.current.setStatus(0);
                }
            }
            else {
                this.saveIndicator.current.setStatus(2);
            }
            this.setState(prevState => {
                return {
                    pendingRequests: prevState.pendingRequests - 1
                }
            });
        });
    }

    saveConfig(target) {
        var id = target.getAttribute("configid");
        var name = target.getAttribute("configname");

        var reduced = target.getAttribute("reduced");

        var config = { id, name, value: reduced == "true" ? target.value * 3600000 : target.value };

        this.saveIndicator.current.setStatus(1);
        this.setState(prevState => {
            return {
                pendingRequests: prevState.pendingRequests + 1
            }
        });

        var h = ObjectContainer.getHttpCommunicator();
        h.saveConfiguration(config, (r, s) => {
            if (s == 200 || s == 204) {
                if (this.state.pendingRequests == 1) {
                    this.saveIndicator.current.setStatus(0);
                }
            }
            else {
                this.saveIndicator.current.setStatus(2);
            }
            this.setState(prevState => {
                return {
                    pendingRequests: prevState.pendingRequests - 1
                }
            });
        })

    }

    setCurrency(target) {
        var ids = target.getAttribute("allowanceids").split(";");
        var moneyValues = target.getAttribute("moneyvalues").split(";");
        var currency = target.getAttribute("currency");

        this.saveIndicator.current.setStatus(1);

        this.setState(prevState => {
            return {
                pendingRequests: prevState.pendingRequests + 1
            }
        });

        var allowances = [];

        for (var i = 0; i < ids.length; i++) {
            allowances[i] = { id: ids[i], moneyAmount: moneyValues[i], currency: currency }
        }

        var h = ObjectContainer.getHttpCommunicator();
        h.saveCountryAllowances(allowances, (r, s) => {
            if (s == 200 || s == 204) {
                if (this.state.pendingRequests == 1) {
                    this.saveIndicator.current.setStatus(0);
                }
                this.setState({
                    countries: r
                })
            }
            else {
                this.saveIndicator.current.setStatus(2);
            }
            this.setState(prevState => {
                return {
                    pendingRequests: prevState.pendingRequests - 1
                }
            });
        });
    }

    setCurrency2020(target) {
        var ids = target.getAttribute("allowanceids").split(";");
        var moneyValues = target.getAttribute("moneyvalues").split(";");
        var currency = target.getAttribute("currency");

        this.saveIndicator.current.setStatus(1);

        this.setState(prevState => {
            return {
                pendingRequests: prevState.pendingRequests + 1
            }
        });

        var allowances = [];

        for (var i = 0; i < ids.length; i++) {
            allowances[i] = { id: ids[i], moneyAmount: moneyValues[i], currency: currency }
        }

        var h = ObjectContainer.getHttpCommunicator();
        h.saveCountryAllowances2020(allowances, (r, s) => {
            if (s == 200 || s == 204) {
                if (this.state.pendingRequests == 1) {
                    this.saveIndicator.current.setStatus(0);
                }
                this.setState({
                    countries: r
                })
            }
            else {
                this.saveIndicator.current.setStatus(2);
            }
            this.setState(prevState => {
                return {
                    pendingRequests: prevState.pendingRequests - 1
                }
            });
        });
    }

    resetWelcomeDone() {

        this.saveIndicator.current.setStatus(1);

        this.setState(prevState => {
            return {
                pendingRequests: prevState.pendingRequests + 1
            }
        });

        var h = ObjectContainer.getHttpCommunicator();
        h.resetWelcomeDone(() => {
            if (this.state.pendingRequests == 1) {
                this.saveIndicator.current.setStatus(0);
            }
            this.setState(prevState => {
                return {
                    pendingRequests: prevState.pendingRequests - 1
                }
            });
        });
    }

    signOut() {
        CookieManager.deleteCookie("token");
        CookieManager.deleteCookie("refreshToken");
        CookieManager.deleteCookie("tokenExpirationUTC");
        window.location.reload();
    }

    //Feedback stuff updated in parallel with server, but not from server!

    replyToFeedback(id, text) {

        var h = ObjectContainer.getHttpCommunicator();

        this.saveIndicator.current.setStatus(1);

        h.addFeedbackReply(id, text, (r, s) => {
            if (s == 200 || s == 204) {
                this.setState((prevState) => {
                    let f = prevState.feedbacks;
                    for (var i = 0; i < f.length; i++) {
                        if (f[i].id == id) {
                            f[i].reply = text;
                            break;
                        }
                    }
                    return {
                        feedbacks: f
                    }
                });
                this.saveIndicator.current.setStatus(0);
            }
            else {
                this.saveIndicator.current.setStatus(2);
            }
        });
    }

    resolveFeedback(id) {

        var h = ObjectContainer.getHttpCommunicator();

        this.saveIndicator.current.setStatus(1);

        h.resolveFeedback(id, (r, s) => {
            if (s == 200 || s == 204) {
                this.setState((prevState) => {
                    let f = prevState.feedbacks;
                    for (var i = 0; i < f.length; i++) {
                        if (f[i].id == id) {
                            f.splice(i, 1);
                            break;
                        }
                    }
                    return {
                        feedbacks: f
                    }
                });
                this.saveIndicator.current.setStatus(0);
            }
            else {
                this.saveIndicator.current.setStatus(2);
            }
        });
    }

    deleteFeedback(id) {

        var h = ObjectContainer.getHttpCommunicator();

        this.saveIndicator.current.setStatus(1);

        h.deleteFeedback(id, (r, s) => {
            if (s == 200 || s == 204) {
                this.setState((prevState) => {
                    let f = prevState.feedbacks;
                    for (var i = 0; i < f.length; i++) {
                        if (f[i].id == id) {
                            f.splice(i, 1);
                            break;
                        }
                    }
                    return {
                        feedbacks: f
                    }
                });
                this.saveIndicator.current.setStatus(0);
            }
            else {
                this.saveIndicator.current.setStatus(2);
            }
        });
    }

    render() {
        var countries = this.state.countries.map((c, i) => {
            return (
                <div key={i} className="aa-country-item">
                    <p>{c.name}</p>
                    <input allowanceid={c.rate100.id} allowancecurrency={c.rate100.currency} defaultValue={c.rate100.moneyAmount} onChange={(e) => {this.checkNumber(e.target)}} onBlur={(e) => {this.saveAllowance(e.target)}} />
                    <input allowanceid={c.rate66.id} allowancecurrency={c.rate66.currency} defaultValue={c.rate66.moneyAmount} onChange={(e) => {this.checkNumber(e.target)}} onBlur={(e) => {this.saveAllowance(e.target)}} />
                    <input allowanceid={c.rate33.id} allowancecurrency={c.rate33.currency} defaultValue={c.rate33.moneyAmount} onChange={(e) => {this.checkNumber(e.target)}} onBlur={(e) => {this.saveAllowance(e.target)}} />
                    <div className="aa-currency-wrap">
                        <button onClick={(e) => {this.setCurrency(e.target)}} allowanceids={c.rate33.id + ";" + c.rate66.id + ";" + c.rate100.id} moneyvalues={c.rate33.moneyAmount + ";" + c.rate66.moneyAmount + ";" + c.rate100.moneyAmount} className={"aa-currency-button" + (c.rate33.currency == 2 ? " aa-cb-selected" : "")} currency={2}>CZK</button>
                        <button onClick={(e) => {this.setCurrency(e.target)}} allowanceids={c.rate33.id + ";" + c.rate66.id + ";" + c.rate100.id} moneyvalues={c.rate33.moneyAmount + ";" + c.rate66.moneyAmount + ";" + c.rate100.moneyAmount} className={"aa-currency-button" + (c.rate33.currency == 0 ? " aa-cb-selected" : "")} currency={0}>EUR</button>
                        <button onClick={(e) => {this.setCurrency(e.target)}} allowanceids={c.rate33.id + ";" + c.rate66.id + ";" + c.rate100.id} moneyvalues={c.rate33.moneyAmount + ";" + c.rate66.moneyAmount + ";" + c.rate100.moneyAmount} className={"aa-currency-button" + (c.rate33.currency == 4 ? " aa-cb-selected" : "")} currency={4}>GBP</button>
                        <button onClick={(e) => {this.setCurrency(e.target)}} allowanceids={c.rate33.id + ";" + c.rate66.id + ";" + c.rate100.id} moneyvalues={c.rate33.moneyAmount + ";" + c.rate66.moneyAmount + ";" + c.rate100.moneyAmount} className={"aa-currency-button" + (c.rate33.currency == 3 ? " aa-cb-selected" : "")} currency={3}>CHF</button>
                        <button onClick={(e) => {this.setCurrency(e.target)}} allowanceids={c.rate33.id + ";" + c.rate66.id + ";" + c.rate100.id} moneyvalues={c.rate33.moneyAmount + ";" + c.rate66.moneyAmount + ";" + c.rate100.moneyAmount} className={"aa-currency-button" + (c.rate33.currency == 1 ? " aa-cb-selected" : "")} currency={1}>USD</button>
                        {
                            /*
                              0 = EUR,
                              1 = USD,
                              2 = CZK,
                              3 = CHF,
                              4 = GBP
                            */
                        }
                    </div>
                </div>
            )
        });

        var countries2020 = this.state.countries2020.map((c, i) => {
            return (
                <div key={i} className="aa-country-item">
                    <p>{c.name}</p>
                    <input allowanceid={c.rate100.id} allowancecurrency={c.rate100.currency} defaultValue={c.rate100.moneyAmount} onChange={(e) => {this.checkNumber(e.target)}} onBlur={(e) => {this.saveAllowance2020(e.target)}} />
                    <input allowanceid={c.rate66.id} allowancecurrency={c.rate66.currency} defaultValue={c.rate66.moneyAmount} onChange={(e) => {this.checkNumber(e.target)}} onBlur={(e) => {this.saveAllowance2020(e.target)}} />
                    <input allowanceid={c.rate33.id} allowancecurrency={c.rate33.currency} defaultValue={c.rate33.moneyAmount} onChange={(e) => {this.checkNumber(e.target)}} onBlur={(e) => {this.saveAllowance2020(e.target)}} />
                    <div className="aa-currency-wrap">
                        <button onClick={(e) => {this.setCurrency2020(e.target)}} allowanceids={c.rate33.id + ";" + c.rate66.id + ";" + c.rate100.id} moneyvalues={c.rate33.moneyAmount + ";" + c.rate66.moneyAmount + ";" + c.rate100.moneyAmount} className={"aa-currency-button" + (c.rate33.currency == 2 ? " aa-cb-selected" : "")} currency={2}>CZK</button>
                        <button onClick={(e) => {this.setCurrency2020(e.target)}} allowanceids={c.rate33.id + ";" + c.rate66.id + ";" + c.rate100.id} moneyvalues={c.rate33.moneyAmount + ";" + c.rate66.moneyAmount + ";" + c.rate100.moneyAmount} className={"aa-currency-button" + (c.rate33.currency == 0 ? " aa-cb-selected" : "")} currency={0}>EUR</button>
                        <button onClick={(e) => {this.setCurrency2020(e.target)}} allowanceids={c.rate33.id + ";" + c.rate66.id + ";" + c.rate100.id} moneyvalues={c.rate33.moneyAmount + ";" + c.rate66.moneyAmount + ";" + c.rate100.moneyAmount} className={"aa-currency-button" + (c.rate33.currency == 4 ? " aa-cb-selected" : "")} currency={4}>GBP</button>
                        <button onClick={(e) => {this.setCurrency2020(e.target)}} allowanceids={c.rate33.id + ";" + c.rate66.id + ";" + c.rate100.id} moneyvalues={c.rate33.moneyAmount + ";" + c.rate66.moneyAmount + ";" + c.rate100.moneyAmount} className={"aa-currency-button" + (c.rate33.currency == 3 ? " aa-cb-selected" : "")} currency={3}>CHF</button>
                        <button onClick={(e) => {this.setCurrency2020(e.target)}} allowanceids={c.rate33.id + ";" + c.rate66.id + ";" + c.rate100.id} moneyvalues={c.rate33.moneyAmount + ";" + c.rate66.moneyAmount + ";" + c.rate100.moneyAmount} className={"aa-currency-button" + (c.rate33.currency == 1 ? " aa-cb-selected" : "")} currency={1}>USD</button>
                        {
                            /*
                              0 = EUR,
                              1 = USD,
                              2 = CZK,
                              3 = CHF,
                              4 = GBP
                            */
                        }
                    </div>
                </div>
            )
        });

        var config = this.state.configuration.map((c, i) => {
            return (
                <span key={i}>
                    <div className="aa-config-wrap">
                        <p>{c.name == "ReducedMillisForThird" ? "Nr. of hours for 1/3 allowance abroad when no allowance paid for CZ in the same day" : 
                            c.name == "MillisForThird" ? "Nr. of hours for 1/3 allowance in all other cases" :
                            c.name == "MillisForTwoThirds" ? "Nr. of hours for 2/3 allowance" : 
                            c.name == "MillisForFull" ? "Nr. of hours for full allowance" :
                            c.name == "PerFoodSubtractForThird" ? "Fraction of allowance subtracted per each food when 1/3 allowance is paid" : 
                            c.name == "PerFoodSubtractForTwoThirds" ? "Fraction of allowance subtracted per each food when 2/3 allowance is paid" :
                            c.name == "PerFoodSubtractForFull" ? "Fraction of allowance subtracted per each food when full allowance is paid" :
                            c.name == "AllowExchangeRateMods" ? "Allow users to modify exchange rates (1 = YES, 0 = NO)" :
                            c.name == "PocketMoneyPercentage" ? "The percentage of full allowance paid as pocket money" :
                            c.name == "PocketMoneyThreshold" ? "The required length of a trip in days for pocket money to be paid for each day abroad" : ""}</p>
                        <input reduced={(c.value > 1000000).toString()} configid={c.id} configname={c.name} defaultValue={c.value > 1000000 ? c.value / 3600000 : c.value} onChange={(e) => {this.checkNumber(e.target)}} onBlur={(e) => {this.saveConfig(e.target)}}/>
                    </div>
                    {
                        i == 3 || i == 6 || i == 7 || i == 9 ? (
                            <p>---------------------------------------</p>
                        ) : null
                    }
                </span>
            )
        })

        var stats = this.state.statistics.map((s, i) => {
            return (
                <div key={i}>
                    <p>{s.name} --> {s.value}</p>
                </div>
            )
        })

        return (
            this.state.doneLoading ? (
                <Fragment>
                    <div className="aa-top-bar">
                        <button ripplecolor="gray" onClick={() => {this.signOut()}} className="back-button"><i className="material-icons back-icon">exit_to_app</i>Log Out</button>
                        <SaveIndicator defaultStatus={3} ref={this.saveIndicator} admin={true} parent={this} name={"Trippi Configuration"} />
                    </div>
                    <div className="aa-wrap">
                        <div className="aa-welcome-reset-wrap">
                            <p>Show all users the welcome screen on their next login</p>
                            <button ripplecolor="gray" onClick={() => {this.resetWelcomeDone()}}>Reset WelcomeDone Flag</button>
                        </div>
                        <p>---------------------------------------</p>
                        {
                            config
                        }
                        <div className={"feedback-wrap-admin" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                            {
                                this.state.feedbacks == null ? (
                                    <Spinner position={"absolute"} size={40} />
                                ) : this.state.feedbacks.length == 0 ? (
                                    <p className="feedback-empty">Wow, such empty ( ͠° ͟ʖ ͠°)</p>
                                ) : this.state.feedbacks.map((f, i) => {
                                    return (
                                        <div key={i} className="feedback-wrap feedback-wrap-a">
                                            <div>
                                                <div className="feedback-type-icon" style={{backgroundColor: f.type == 1 ? (ObjectContainer.isDarkTheme() ? "#E79206" : "#FAA519") : "", transform: f.type == 2 || f.type == 0 ? "scale(0.782608)" : ""}}>
                                                    {
                                                        f.type == 1 ? (
                                                            <i className="material-icons">add</i>
                                                        ) : f.type == 2 ? (
                                                            <TripPreviewState status={1} />
                                                        ) : f.type == 0 ? (
                                                            <TripPreviewState status={2} />
                                                        ) : null
                                                    }
                                                </div>
                                                <p className="feedback-text">{f.text} {f.reply != "" ? <Fragment><br></br><span className="feedback-response-title">Response: </span>{f.reply}</Fragment> : ""}</p>
                                            </div>
                                            <div>
                                                <p className="feedback-date">{new Date(f.postedAt).getUTCDate() + "." + (new Date(f.postedAt).getUTCMonth() + 1) + "." + new Date(f.postedAt).getUTCFullYear()}</p>
                                                <span className={"f-liked-number"}>Liked by {f.likeNumber} {f.likeNumber == 1 ? "person" : "people"}.</span>
                                                <div className="feedback-reply-box">
                                                    <input className="feedback-reply-input" placeholder="Comment on feedback"/>
                                                    <button ripplecolor="gray" title={"Reply to this feedback (visible to all users)"} onClick={(e) => {this.replyToFeedback(f.id, e.currentTarget.parentElement.childNodes[0].value)}} className="feedback-like"><i className={"material-icons " + (f.liked ? "f-liked" : "f-not-liked")}>reply</i></button>
                                                </div>
                                                <button ripplecolor="gray" title={"Mark this as resolved"} onClick={() => {this.resolveFeedback(f.id)}} className="feedback-like"><i className={"material-icons " + (f.liked ? "f-liked" : "f-not-liked")}>done</i></button>
                                                <button ripplecolor="gray" title={"Delete"} onClick={() => {this.deleteFeedback(f.id)}} className="feedback-like"><i className={"material-icons " + (f.liked ? "f-liked" : "f-not-liked")}>delete</i></button>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <p>---------------------------------------</p>
                        {
                            countries
                        }
                        <p>---------------------------------------</p>
                        {
                            countries2020
                        }
                        <p>---------------------------------------</p>
                        <p>Statistics</p>
                        {
                            stats
                        }
                    </div>
                </Fragment>
            ) : (
                <Spinner size={60} position={"fixed"} />
            )
        )
    }

}