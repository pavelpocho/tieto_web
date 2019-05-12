import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import SortWidget from '../sort-widget';
import MainButton from '../main-button';
import { RippleManager } from '../ripple';
import TripList from '../trip-list';
import TripActivity from '../trip-activity';
import TripPreview from '../trip-preview';
import Trip from '../../utils/trip';
import Spinner from '../spinner';
import TripPoint from '../trip-point';
import WelcomeDialog from '../welcome-dialog';
import CookieManager from '../../utils/cookie-manager';

export default class MainActivity extends Component {

    constructor(props) {
        super(props);

        this.ref = React.createRef();
        this.spinner = React.createRef();
        this.errorDisplay = React.createRef();

        this.windowWrap = React.createRef();
        this.windowBackdrop = React.createRef();
        this.windowBackground = React.createRef();
        this.windowContent = React.createRef();
        this.closeButton = React.createRef();

        this.feedbackText = React.createRef();

        this.state = {
            trips: [],
            feedbackOpen: false,
            settingsOpen: false,
            feedbacks: [],
            isError: false,
            isImprovement: false,
            isLike: false,
            feedbacks: null,
            displayWelcome: false,
            error: true,
            sortBy: CookieManager.getCookie("sortBy") != "" ? parseInt(CookieManager.getCookie("sortBy")) : 0
        }
    }

    componentDidMount() {
        RippleManager.setUp();
        var http = ObjectContainer.getHttpCommunicator();
        http.getWelcomeDone((r, s) => {
            if (s == 200) {
                if (r) {
                    this.getTripList();
                }
                else {
                    this.spinner.current.ref.current.style.display = "none";
                    this.props.container.openDialog(<WelcomeDialog container={this.props.container} parent={this} key={"welcomeDialog"}/>);
                }
            }
            else {
                //Getting welcome info failed... attempting to fetch trips
                this.getTripList();
            }
        });
    }

    componentDidUpdate() {
        if (this.state.displayWelcome) {
            //setTimeout(() => {
            //}, 400);
        }
        if (this.windowWrap.current && this.windowBackdrop.current && this.windowBackground.current && this.closeButton.current && this.windowContent.current) {
            this.windowWrap.current.style.display = "block";
            this.windowBackdrop.current.style.display = "block";
            setTimeout(() => {
                this.windowWrap.current.style.opacity = "1";
                this.windowBackdrop.current.style.opacity = "0.45";
                RippleManager.setToButton(this.closeButton.current);
            }, 50);
        }
    }

    //Used when duplicating
    addTrip(trip) {
        this.setState((prevState) => {

            let l = prevState.trips;
            trip.duplicated = true;
            l.push(trip);

            return {
                trips: l
            }
        })
    }

    getTripList() {
        this.spinner.current.ref.current.style.display = "block";
        let h = ObjectContainer.getHttpCommunicator();
        this.errorDisplay.current.style.display = "none";
        h.getTripList((tripList, status) => {
            if (status != 200) {
                this.errorDisplay.current.style.display = "block";
                this.setState({
                    error: true
                });
            }
            else {
                this.setState({
                    error: false
                });
            }
            var realTripList = [];
            for (var i = 0; i < tripList.length; i++) {
                realTripList.push(new Trip());
                Object.assign(realTripList[i], tripList[i]);
            }
            setTimeout(() => {
                //this.ref.current.style.transform = "translateX(0px)";
                this.ref.current.style.opacity = "1";
                this.spinner.current.ref.current.style.display = "none";
            }, 50);
            this.setState({
                displayWelcome: true,
                trips: realTripList
            });
            setTimeout(() => {
                this.setState({
                    displayWelcome: false,
                    trips: realTripList
                });
            }, 100);
        });
    }

    close() {
        this.ref.current.style.opacity = "0";
    }

    newTrip() {
        this.close();
        this.props.container.openActivity(<TripActivity container={this.props.container} key="tripActivity" trip={null}/>);
    }

    editTrip(trip) {
        this.close();
        this.props.container.openActivity(<TripActivity container={this.props.container} key="tripActivity" trip={trip}/>);
    }

    removeTrip(trip) {
        this.setState((prevState) => {
            let arr = prevState.trips;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].id == trip.id) {
                    arr[i].deleted = true;
                }
            }
            return {
                trips: arr
            }
        })
    }

    signOut() {
        this.spinner.current.ref.current.style.display = "block";
        CookieManager.deleteCookie("token");
        window.location.reload();
    }

    openHelp() {
        var h = ObjectContainer.getHttpCommunicator();
        window.open(h.genUrl + "help.html", "_blank");
    }

    openFeedback() {
        this.setState({
            feedbackOpen: true,
            isError: false,
            isLike: false,
            isImprovement: false
        });
        //Last three state properties reset the checkboxes
        var h = ObjectContainer.getHttpCommunicator();
        h.getFeedbackList((r, s) => {
            if (s == 200) {
                //List fetch successful
                RippleManager.setUp();
                r.sort((a, b) => {return b.postedAt - a.postedAt});
                this.setState({
                    feedbacks: r
                })
            }
            else {
                //List fetch failed
            }
        })
    }

    openSettings() {
        this.setState({
            settingsOpen: true
        });
    }

    closeWindow() {
        this.windowWrap.current.style.opacity = "0";
        this.windowBackdrop.current.style.opacity = "0";
        setTimeout(() => {
            this.windowWrap.current.style.display = "none";
            this.windowBackdrop.current.style.display = "none";
            this.setState({
                feedbackOpen: false,
                settingsOpen: false
            })
        }, 310);        
    }

    setSortBy(t) {
        CookieManager.setCookie("sortBy", t.toString(), 1000);
        this.setState({
            sortBy: t
        })
    }

    //The feedback stuff gets updated in parallel with the server posts, but is not updated from the server!

    sendFeedback() {
        var h = ObjectContainer.getHttpCommunicator();
        var object = {
            text: this.feedbackText.current.value,
            isError: this.state.isError,
            isImprovement: this.state.isImprovement,
            isLike: this.state.isLike,
            postedAt: Date.now()
        }
        h.sendFeedback(object, (r, s) => {
            if (s == 200) {
                this.feedbackText.current.value = "";
                this.setState(prevState => {
                    let f = prevState.feedbacks;
                    f.push({likeNumber: 1, text: object.text, id: r, liked: true, postedAt: object.postedAt, type: object.isError ? 0 : object.isImprovement ? 1 : 2});
                    f.sort((a, b) => {return b.postedAt - a.postedAt});
                    return {
                        feedbacks: f,
                        isError: false,
                        isLike: false,
                        isImprovement: false
                    }
                })
                //Feedback successfully sent
            }
            else {
                //Feedback send failed
            }
        });
    }

    isError() {
        this.setState((prevState) => {
            return {
                isError: !prevState.isError,
                isLike: false,
                isImprovement: false
            }
        });
    }

    isLike() {
        this.setState((prevState) => {
            return {
                isError: false,
                isLike: !prevState.isLike,
                isImprovement: false
            }
        });
    }

    isImprovement() {
        this.setState((prevState) => {
            return {
                isError: false,
                isLike: false,
                isImprovement: !prevState.isImprovement
            }
        });
    }

    likeFeedback(id) {
        var http = ObjectContainer.getHttpCommunicator();
        http.likeFeedback(id, (r, s) => {
            if (s == 200) {
                this.setState(prevState => {
                    let f = prevState.feedbacks;
                    for (var i = 0; i < f.length; i++) {
                        if (f[i].id == id) {
                            if (f[i].liked) {
                                f[i].likeNumber --;
                            }
                            else {
                                f[i].likeNumber ++;
                            }
                            f[i].liked = !f[i].liked;
                        }
                    }
                    return {
                        feedbacks: f
                    }
                })
                //Like success
            }
            else {
                //Like fail
            }
        })
    }

    setNoExportWarning(value, callback) {
        this.setState((prevState) => {
            let trips = prevState.trips;
            for (var i = 0; i < trips.length; i++) {
                trips[i].noExportWarnings = value;
            }
            return {
                trips
            }
        });
        var h = ObjectContainer.getHttpCommunicator();
        h.setNoExportWarnings(value, callback);
    }

    setProp(property, input, output) {
        if (property == "altered") {
            output[property] = input[property];
        }
        else {
            output[property] = Math.round(input[property] * 100) / 100;
        }
    }

    set(input, output) {
        this.setProp("rate", input, output);
        this.setProp("defaultRate", input, output);
        this.setProp("altered", input, output);
    }

    getTripTotalMoney(trip) {
        var usd = {amount: 0};
        var eur = {amount: 0};
        var gbp = {amount: 0};
        var chf = {amount: 0};
        var czk = {amount: 0, rate: 1};

        if (trip.exchange != null) {
            for (var i = 0; i < trip.exchange.rates.length; i++) {
                //rates.rates is indeed intentional
                if (trip.exchange.rates[i].currencyCode == 0) {
                    this.set(trip.exchange.rates[i], eur);
                }
                else if (trip.exchange.rates[i].currencyCode == 1) {
                    this.set(trip.exchange.rates[i], usd);
                }
                else if (trip.exchange.rates[i].currencyCode == 3) {
                    this.set(trip.exchange.rates[i], chf);
                }
                else if (trip.exchange.rates[i].currencyCode == 4) {
                    this.set(trip.exchange.rates[i], gbp);
                }
            }
        }

        if (trip.daySections) {
            for (var i = 0; i < trip.daySections.length; i++) {
                var a = trip.daySections[i].allowance;
                if (a == null) continue;
                if (a.currency == 0) {
                    if (eur.amount == undefined || eur.amount == null) {
                        eur.amount = a.moneyAmount + a.pocketMoney;
                    }
                    else {
                        eur.amount += a.moneyAmount + a.pocketMoney;
                    }
                }
                if (a.currency == 1) {
                    if (usd.amount == undefined || usd.amount == null) {
                        usd.amount = a.moneyAmount + a.pocketMoney;
                    }
                    else {
                        usd.amount += a.moneyAmount + a.pocketMoney;
                    }
                }
                if (a.currency == 2) {
                    if (czk.amount == undefined || czk.amount == null) {
                        czk.amount = a.moneyAmount + a.pocketMoney;
                    }
                    else {
                        czk.amount += a.moneyAmount + a.pocketMoney;
                    }
                }
                if (a.currency == 3) {
                    if (chf.amount == undefined || chf.amount == null) {
                        chf.amount = a.moneyAmount + a.pocketMoney;
                    }
                    else {
                        chf.amount += a.moneyAmount + a.pocketMoney;
                    }
                }
                if (a.currency == 4) {
                    if (gbp.amount == undefined || gbp.amount == null) {
                        gbp.amount = a.moneyAmount + a.pocketMoney;
                    }
                    else {
                        gbp.amount += a.moneyAmount + a.pocketMoney;
                    }
                }
            }
        }

        var total = Math.round((eur.amount * eur.rate + usd.amount * usd.rate + gbp.amount * gbp.rate + chf.amount * chf.rate + czk.amount) * 100) / 100;
        if (isNaN(total)) total = 0;
        return total;
    }

    render() {

        this.state.trips.sort((a, b) => {
            if (this.state.sortBy == 0) {
                if (a.locations.length == 0 || !a.locations[0].departureDate || a.locations[0].departureDate == -1) return -1;
                if (b.locations.length == 0 || !b.locations[0].departureDate || b.locations[0].departureDate == -1) return 1;
                return b.locations[0].departureDate - a.locations[0].departureDate;
            }
            else if (this.state.sortBy == 1) {
                return this.getTripTotalMoney(b) - this.getTripTotalMoney(a);
            }
            else {
                let aStat = a.gettingOld ? 2 : a.exported ? 0 : 1;
                let bStat = b.gettingOld ? 2 : b.exported ? 0 : 1;
                return bStat - aStat;
            }
        })

        return (
            <Fragment>
                {
                    this.state.settingsOpen || this.state.feedbackOpen ? (
                        <div ref={this.windowBackdrop} className="la-backdrop"></div>
                    ) : null
                }
                {
                    this.state.settingsOpen ? (
                        <div className="ma-window-wrap" ref={this.windowWrap}>
                            <div className="ma-window-background" ref={this.windowBackground}></div>
                            <div ref={this.windowContent} className="ma-window-content">
                                <div className="ma-window-topbar">
                                    <button onClick={() => {this.closeWindow(0)}}ripplecolor="gray" ref={this.closeButton} className="la-window-close"><i className="material-icons">arrow_back</i>Back</button>
                                    <span></span> {/*This is here so that I can use justify-content space-between*/}
                                </div>
                                <p>Wow, such empty ( ͠° ͟ʖ ͠°)</p>
                            </div>
                        </div>
                    ) : this.state.feedbackOpen ? (
                        <div className="ma-window-wrap" ref={this.windowWrap}>
                            <div className="ma-window-background" ref={this.windowBackground}></div>
                            <div ref={this.windowContent} className="ma-window-content">
                                <div className="ma-window-topbar">
                                    <button onClick={() => {this.closeWindow()}} ripplecolor="gray" ref={this.closeButton} className="ma-window-close"><i className="material-icons">arrow_back</i>Back</button>
                                    <p>Feedback</p>
                                    <span></span> {/*This is here so that I can use justify-content space-between*/}
                                </div>
                                <div className="ma-window-main">
                                    <div className="ma-window-left">
                                        <p className="feedback-section-title">Other Users' Feedback</p>
                                    {
                                        this.state.feedbacks == null ? (
                                            <p>Loading...</p>
                                        ) : this.state.feedbacks.map((f, i) => {
                                            return (
                                                <div key={i} className="feedback-wrap">
                                                    <div>
                                                        <div className="feedback-type-icon" style={{backgroundColor: f.type == 0 ? "#FF4E0B" : f.type == 1 ? "#FAA519" : "338200"}}>
                                                            <i className="material-icons">{f.type == 0 ? "priority_high" : f.type == 1 ? "add" : "done"}</i>
                                                        </div>
                                                        <p className="feedback-text">{f.text}</p>
                                                    </div>
                                                    <div>
                                                        <p className="feedback-date">{new Date(f.postedAt).getDate() + "." + (new Date(f.postedAt).getMonth() + 1) + "." + new Date(f.postedAt).getFullYear()}</p>
                                                        <button ripplecolor="gray" title={f.liked ? "Unlike this feedback" : "Like this feedback"} onClick={() => {this.likeFeedback(f.id)}} className="feedback-like"><i className={"material-icons " + (f.liked ? "f-liked" : "f-not-liked")}>thumb_up</i><span className={(f.liked ? "f-liked" : "f-not-liked")}>{f.likeNumber}</span></button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    </div>
                                    <div className="ma-window-right">
                                        <p className="feedback-section-title">Submit Feedback</p>
                                        <div className="feedback-type-wrap">
                                            <button ripplecolor="gray" onClick={() => {this.isLike()}} className={"fiw-checkbox uncheck-white" + (this.state.isLike ? " checked check-blue" : "")}>
                                                <i className="material-icons">done</i>
                                            </button>
                                            <p>I like something</p>
                                            <div className="feedback-type-icon" style={{backgroundColor: "#338200", transform: "scale(0.8)", transformOrigin: "center"}}>
                                                <i className="material-icons">{"done"}</i>
                                            </div>
                                        </div>
                                        <div className="feedback-type-wrap">
                                            <button ripplecolor="gray" onClick={() => {this.isImprovement()}} className={"fiw-checkbox uncheck-white" + (this.state.isImprovement ? " checked check-blue" : "")}>
                                                <i className="material-icons">done</i>
                                            </button>
                                            <p>I want to suggest somehing</p>
                                            <div className="feedback-type-icon" style={{backgroundColor: "#FAA519", transform: "scale(0.8)", transformOrigin: "center"}}>
                                                <i className="material-icons">{"add"}</i>
                                            </div>
                                        </div>
                                        <div className="feedback-type-wrap">
                                            <button ripplecolor="gray" onClick={() => {this.isError()}} className={"fiw-checkbox uncheck-white" + (this.state.isError ? " checked check-blue" : "")}>
                                                <i className="material-icons">done</i>
                                            </button>
                                            <p>I found an error</p>
                                            <div className="feedback-type-icon" style={{backgroundColor: "#FF4E0B", transform: "scale(0.8)", transformOrigin: "center"}}>
                                                <i className="material-icons">{"priority_high"}</i>
                                            </div>
                                        </div>
                                        <p className="feedback-specify">Please specify further:</p>
                                        <textarea ref={this.feedbackText} className="feedback-text-input" onChange={() => {this.forceUpdate()}}/>
                                        <p className="feedback-warning">All feedback is also available for other users to see.</p>
                                        <button disabled={(!this.state.isLike && !this.state.isImprovement && !this.state.isError) || this.feedbackText.current.value == ""} onClick={() => {this.sendFeedback()}} className="send-feedback">Send feedback</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null
                }
                <Spinner ref={this.spinner} size={60} position={"fixed"}/>
                <div className="activity" id="main-activity" ref={this.ref}>
                    <div className="ma-topbar-content">
                        {/*<button className="ma-settings-toggle" title="Settings" onClick={() => {this.openSettings()}}><i className="material-icons">settings</i></button>*/}
                        <button ripplecolor="gray" className="ma-settings-toggle" title="Help" onClick={() => {this.openHelp()}}><i className="material-icons">help</i></button>
                        <button ripplecolor="gray" className="ma-settings-toggle" title="Send Feedback" onClick={() => {this.openFeedback()}}><i className="material-icons">feedback</i></button>
                        <div className="ma-toggle-separator"></div>
                        <button ripplecolor="gray" className="ma-settings-toggle" title="Log Out" onClick={() => {this.signOut()}}><i className="material-icons">exit_to_app</i></button>
                    </div>
                    <div className="content-wrap">
                        <div className="top-content-wrap">
                            <SortWidget position={this.state.sortBy} parent={this}/>
                            <MainButton text="New Trip" onClick={() => {this.newTrip()}}/>
                        </div>
                        <div className="error-display" ref={this.errorDisplay}>
                            <p>Something went wrong...</p>
                            <button ripplecolor="gray" onClick={() => {this.getTripList()}}><i className="material-icons">refresh</i>Retry</button>
                        </div>
                        {
                            !this.state.error ? (
                                <TripList container={this.props.container}>
                                    {
                                        this.state.trips.map(t => {
                                            if (t.deleted) {
                                                return null;
                                            }
                                            else {
                                                //The third status (warning) is not implemented
                                                return <TripPreview status={t.exported ? 1 : t.gettingOld ? 2 : 0} key={t.id} container={this.props.container} trip={t} activity={this}/>
                                            }
                                        })
                                    }
                                </TripList>
                            ) : null
                        }
                        
                    </div>
                </div>
            </Fragment>
        )
    }

}