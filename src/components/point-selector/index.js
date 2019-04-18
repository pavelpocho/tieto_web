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
            selectedIndex: -1
        }

        this.scroll = React.createRef();

    }

    componentDidUpdate() {
        console.log("Updating point list with this array ->");
        /*this.setState({
            locations: this.props.locations
        })*/
    }

    addPoint() {
        var l = this.props.locations;
        if (l.length == 0) {
            l.push(new Location(0, false, undefined, undefined, undefined, { country: { name: "" }, name: "", countryId: 0 }, undefined, undefined, undefined, undefined, this.props.parent.state.tripObject.id, false, false, undefined));
        }
        else {
            l.push(new Location(0, true, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.props.parent.state.tripObject.id, false, false, undefined));
            l.push(new Location(0, false, undefined, undefined, undefined, { country: { name: "" }, name: "", countryId: 0 }, undefined, undefined, undefined, undefined, this.props.parent.state.tripObject.id, false, false, undefined));
        }
        this.props.parent.setPointArray(l);
        this.props.parent.saveCreatedLocation(l, () => {
            this.props.parent.selectPoint(l.length - 1);
        }); //This actually forceSaves the trip and saves the returned result, which should contain all IDs and stuff
        this.setState({
            selectedIndex: l.length - 1
        });
    }

    insertPoint(index) {
        var l = this.props.locations;
        //The points are reversed because of the splice
        l.splice(index, 0, new Location(0, false, undefined, undefined, 1, { country: { name: "" }, name: "Transit_Country", countryId: 0 }, undefined, undefined, undefined, undefined, this.props.parent.state.tripObject.id, false, true, undefined));
        l.splice(index, 0, new Location(0, true, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.props.parent.state.tripObject.id, true, false, -1));
        this.props.parent.setPointArray(l);
        this.props.parent.saveCreatedLocation(l, () => {
            this.props.parent.selectPoint(l.length - 1);
        }); //This actually forceSaves the trip and saves the returned result, which should contain all IDs and stuff
        this.setState({
            selectedIndex: l.length - 1
        });
    }

    /*setLocationArray(arr) {
        this.setState({
            locations: arr
        })
    }*/

    select(i) {
        console.log("Selecting point --> " + i);
        this.props.parent.selectPoint(i);
        this.setState({
            selectedIndex: i
        })
    }

    setBorderCross(locationId, millis) {
        this.props.parent.setBorderCross(locationId, millis);
    }

    getSelection() {
        return this.state.selectedIndex;
    }

    clearSelection() {
        this.setState({
            selectedIndex: -1
        })
    }

    render() {
        return (
            <div className="point-selector-wrap">
                <div ref={this.scroll} className="point-list-wrap">
                    <div className="point-list">
                        {
                            this.props.locations.map((l, i) => {
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