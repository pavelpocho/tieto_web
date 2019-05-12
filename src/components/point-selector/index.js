import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import MainButton from '../main-button';
import TripPoint from '../trip-point';
import Location from '../../utils/location';

export default class PointSelector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: -1,
            removed: []
        }

        this.scrollState = 0;
        this.scroll = React.createRef();

    }

    componentDidUpdate() {
        this.scrollTop = this.scrollState;
    }

    addPoint() {
        this.props.parent.addLocation(-1);
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
                    <div className="point-list">
                        {
                            this.props.locations.map((l, i) => {
                                return <TripPoint toBeRemoved={this.state.removed.includes(l.id)} key={l.id} parent={this} location={l} selected={this.state.selectedIndex == l.id || this.state.selectedIndex == l.id} index={i}/>
                            })
                        }
                        {
                            this.props.locations.length == 0 || !this.props.locations[0].onlyLocation ? (
                                <TripPoint toBeRemoved={this.state.removed.length != 0 && this.props.locations.length == 1} newPoint={true} parent={this}/>
                            ) : (
                                <p className="ps-comment">The first point is set as "Only Point". Change this to add more points.</p>
                            )
                        }
                    </div>
                </div>
                <div className="export-wrap">
                    <MainButton disabled={!this.props.exportable} text="Export" onClick={() => {this.props.parent.export()}}/>
                </div>
            </div>
        )
    }

}