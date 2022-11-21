import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import TripPoint from '../trip-point';
import Location from '../../utils/location';
import Scrollbar from '../scrollbar';
import Spinner from '../spinner';
import MobileTripInfo from '../mobile-trip-info';

export default class PointSelector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: -1,
            removed: [],
            firstLoad: true
        }

        this.scrollState = 0;
        this.scroll = React.createRef();
        this.psComment = React.createRef();
        this.scrollbar = React.createRef();

    }

    componentDidMount() {
        if (this.psComment.current) {
            this.psComment.current.style.opacity = "1";
        }
        this.scrollbar.current.setUpScrollbar(1020);
        this.scroll.current.onscroll = (e) => {
            this.scrollbar.current.setUpScrollbar();
        }
        setTimeout(() => {
            this.setState({
                firstLoad: false
            })
        }, 510);
    }
    componentDidUpdate() {
        this.scrollTop = this.scrollState;
        if (this.psComment.current) {
            this.psComment.current.style.opacity = "1";
        }
    }

    addPoint() {
        this.props.parent.addLocation(-1);
        this.scrollbar.current.setUpScrollbar(510);
        return;
    }

    insertPoint(index) {
        this.props.parent.addLocation(index);
        return;
    }

    select(i, override) {
        this.props.parent.selectPoint(i, override);
        this.setState({
            selectedIndex: i
        })
    }

    getSelection() {
        return this.state.selectedIndex;
    }

    clearSelection() {
        this.setState({
            selectedIndex: -1
        })
    }

    removePoints(ids) {
        this.setState({
            removed: ids
        });
        this.scrollbar.current.setUpScrollbar(510);
    }

    resetPointRemoval() {
        this.setState({
            removed: []
        })
    }

    render() {
        return (
            <div className="point-selector-wrap">
                <div ref={this.scroll} className="point-list-wrap" onScroll={(e) => {this.scrollState = e.target.scrollTop}}>
                    <div className={"mobile-top-view" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                        <MobileTripInfo onClick={() => {this.props.parent.showMainContent()}} tripName={this.props.tripName} purpose={this.props.purpose} project={this.props.project} task={this.props.task} />
                    </div>
                    <div className="point-list">
                        {
                            this.props.locations.map((l, i) => {
                                return <TripPoint firstLoad={this.state.firstLoad} toBeRemoved={this.state.removed.includes(l.id)} key={l.id} parent={this} location={l} selected={this.state.selectedIndex == l.id || this.state.selectedIndex == l.id} index={i}/>
                            })
                        }
                        {
                            this.props.locations.length == 0 || !this.props.locations[0].onlyLocation ? (
                                <TripPoint firstLoad={this.state.firstLoad} toBeRemoved={this.state.removed.length != 0 && this.props.locations.length == 1} newPoint={true} parent={this}/>
                            ) : (
                                <p ref={this.psComment} className="ps-comment">The first point is set as "Only Point". Change this to add more points.</p>
                            )
                        }
                    </div>
                </div>
                <Scrollbar parent={this.scroll} ref={this.scrollbar} />
            </div>
        )
    }

}