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

export default class MainActivity extends Component {

    constructor(props) {
        super(props);

        this.ref = React.createRef();
        this.spinner = React.createRef();
        this.errorDisplay = React.createRef();

        this.state = {
            trips: []
        }
    }

    componentDidMount() {
        RippleManager.setUp();
        this.getTripList();
        setTimeout(() => {
            //this.props.container.openDialog(<WelcomeDialog key={"welcomeDialog"}/>);
        }, 500);
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
        let h = ObjectContainer.getHttpCommunicator();
        h.getTripList((tripList, status) => {
            if (status != 200) {
                this.errorDisplay.current.style.display = "block";
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
                trips: realTripList
            });
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

    render() {
        return (
            <Fragment>
                <Spinner ref={this.spinner} size={60} position={"fixed"}/>
                <div className="activity" id="main-activity" ref={this.ref}>
                    <div className="content-wrap">
                        <div className="top-content-wrap">
                            <SortWidget />
                            <MainButton text="New Trip" onClick={() => {this.newTrip()}}/>
                        </div>
                        <div className="error-display" ref={this.errorDisplay}>
                            <p>Something went wrong...</p>
                            <button onClick={() => {this.getTripList()}}>Retry</button>
                        </div>
                        <TripList container={this.props.container}>
                            {
                                this.state.trips.map((t, i) => {
                                    if (t.deleted) {
                                        return null;
                                    }
                                    else {
                                        //The third status (warning) is not implemented
                                        return <TripPreview status={t.exported ? 1 : 0} key={i} container={this.props.container} trip={t} activity={this}/>
                                    }
                                })
                            }
                        </TripList>
                    </div>
                </div>
            </Fragment>
        )
    }

}