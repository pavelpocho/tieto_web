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
            locations: this.props.locations,
            selectedIndex: -1
        }

        this.scroll = React.createRef();

    }

    addPoint() {
        this.setState((prevState) => {
            let l = prevState.locations;
            if (l.length == 0) {
                l.push(new Location(0, false, undefined, undefined, undefined, { country: { name: "" }, name: "", countryId: 0 }, undefined, undefined, undefined));
            }
            else {
                l.push(new Location(0, true));
                l.push(new Location(0, false, undefined, undefined, undefined, { country: { name: "" }, name: "", countryId: 0 }, undefined, undefined, undefined));
            }
            this.props.parent.setPointArray(l);
            this.props.parent.saveCreatedLocation(() => {}); //This actually forceSaves the trip and saves the returned result, which should contain all IDs and stuff
            this.props.parent.selectPoint(l.length - 1);
            return {
                locations: l,
                selectedIndex: l.length - 1
            }
        });
    }

    setLocationArray(arr) {
        this.setState({
            locations: arr
        })
    }

    select(i) {
        this.props.parent.selectPoint(i);
        this.setState({
            selectedIndex: i
        })
    }

    render() {
        return (
            <div className="point-selector-wrap">
                <div ref={this.scroll} className="point-list-wrap">
                    <div className="point-list">
                        {
                            this.state.locations.map((l, i) => {
                                if (i % 2 == 0) {
                                    return <TripPoint key={i} parent={this} location={l} selected={this.state.selectedIndex == i} index={i}/>
                                }
                                else {
                                    return null;
                                }
                            })
                        }
                        <TripPoint newPoint={true} parent={this}/>
                    </div>
                </div>
                <div className="export-wrap">
                    <MainButton text="Export" onClick={() => {this.props.parent.export()}}/>
                </div>
            </div>
        )
    }

}