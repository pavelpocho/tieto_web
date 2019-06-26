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
import FeedbackDialog from '../feedback-dialog';

export default class MainActivity extends Component {

    constructor(props) {
        super(props);

        this.ref = React.createRef();
        this.spinner = React.createRef();
        this.errorDisplay = React.createRef();

        this.state = {
            trips: [],
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
                if (r || ObjectContainer.isIgnoreWelcome()) {
                    this.getTripList();
                }
                else {
                    this.spinner.current.ref.current.style.display = "none";
                    this.props.container.openDialog(<WelcomeDialog container={this.props.container} parent={this} key={"welcomeDialog"}/>);
                }
                ObjectContainer.setIgnoreWelcome();
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
        this.props.container.openActivity(<TripActivity container={this.props.container} key="tripActivity" trip={null} http={ObjectContainer.getHttpCommunicator()} />);
    }

    editTrip(trip) {
        this.close();
        this.props.container.openActivity(<TripActivity container={this.props.container} key="tripActivity" trip={trip} http={ObjectContainer.getHttpCommunicator()} />);
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

    toggleNightMode() {
        ObjectContainer.toggleDarkMode();
        window.location.reload();
    }

    toggleAnimations() {
        ObjectContainer.toggleAnimations();
        window.location.reload();
    }

    openFeedback() {
        this.props.container.openDialog(<FeedbackDialog key={"feedbackDialog"} container={this.props.container} />)
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

    render() {

        this.state.trips.sort((a, b) => {
            if (this.state.sortBy == 0) {
                if (a.locations.length == 0 || !a.locations[0].departureDate || a.locations[0].departureDate == -1) return -1;
                if (b.locations.length == 0 || !b.locations[0].departureDate || b.locations[0].departureDate == -1) return 1;
                return b.locations[0].departureDate - a.locations[0].departureDate;
            }
            else if (this.state.sortBy == 1) {
                var tripManager = ObjectContainer.getTripManager();
                return tripManager.calculateTotal(b) - tripManager.calculateTotal(a);
            }
            else {
                let aStat = a.gettingOld ? 2 : a.exported ? 0 : 1;
                let bStat = b.gettingOld ? 2 : b.exported ? 0 : 1;
                return bStat - aStat;
            }
        })

        return (
            <Fragment>
                <Spinner ref={this.spinner} size={60} position={"fixed"} />
                <div className="activity" id="main-activity" ref={this.ref}>
                    <div className={"ma-topbar-content" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                        {/*<button ripplecolor="gray" className={"ma-settings-toggle" + (ObjectContainer.isDarkTheme() ? " dark" : "")} title="Toggle Animations" onClick={() => {this.toggleAnimations()}}><i className={ObjectContainer.isAnimations() ? "material-icons" : (ObjectContainer.isDarkTheme() ? "material-icons blue dark" : "material-icons blue")}>offline_bolt</i></button>*/}
                        <button ripplecolor="gray" className={"ma-settings-toggle" + (ObjectContainer.isDarkTheme() ? " dark" : "")} title="Toggle Night Mode" onClick={() => {this.toggleNightMode()}}><i className="material-icons" style={{color: ObjectContainer.isDarkTheme() ? "yellow" : "", transformOrigin: "center", transform: "rotate(135deg)"}} >brightness_3</i></button>
                        <div className="ma-toggle-separator"></div>
                        <button ripplecolor="gray" className={"ma-settings-toggle" + (ObjectContainer.isDarkTheme() ? " dark" : "")} title="Help" onClick={() => {this.openHelp()}}><i className="material-icons">help</i></button>
                        <button ripplecolor="gray" className={"ma-settings-toggle" + (ObjectContainer.isDarkTheme() ? " dark" : "")} title="Send Feedback" onClick={() => {this.openFeedback()}}><i className="material-icons">feedback</i></button>
                        <div className="ma-toggle-separator"></div>
                        <button ripplecolor="gray" className={"ma-settings-toggle" + (ObjectContainer.isDarkTheme() ? " dark" : "")} title="Log Out" onClick={() => {this.signOut()}}><i className="material-icons">exit_to_app</i></button>
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
                                                return <TripPreview status={t.exported ? 1 : t.gettingOld ? 2 : 0} key={t.id} container={this.props.container} trip={t} activity={this} />
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