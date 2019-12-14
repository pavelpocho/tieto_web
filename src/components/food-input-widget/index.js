import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import { RippleManager } from '../ripple';

export default class FoodInputWidget extends Component {

    constructor(props) {
        super(props);

        if (this.props.all) {
            var b = true;
            var l = true;
            var d = true;
            for (var i = 0; i < this.props.foods.length; i++) {
                if (!this.props.foods[i].breakfast) b = false;
                if (!this.props.foods[i].lunch) l = false;
                if (!this.props.foods[i].dinner) d = false;
            }
            this.state = {
                breakfastChecked: b,
                lunchChecked: l,
                dinnerChecked: d
            }
        }
        else {
            this.state = {
                breakfastChecked: this.props.food ? this.props.food.breakfast : false,
                lunchChecked: this.props.food ? this.props.food.lunch : false,
                dinnerChecked: this.props.food ? this.props.food.dinner : false
            }
        }

        this.letters = [];
        for (var i = 0; i < 3; i++) {
            this.letters[i] = React.createRef();
        }
    }

    changeState(i) {
        this.setState(prevState => {
            this.props.parent.setFood(this.props.index, i, i == 0 ? !prevState.breakfastChecked : i == 1 ? !prevState.lunchChecked : !prevState.dinnerChecked); //i says which food
            if (i == 0) {
                return {
                    breakfastChecked: !prevState.breakfastChecked
                }
            }
            if (i == 1) {
                return {
                    lunchChecked: !prevState.lunchChecked
                }
            }
            if (i == 2) {
                return {
                    dinnerChecked: !prevState.dinnerChecked
                }
            }
        })
    }

    changeStateNoUpdate(i) {
        this.setState(prevState => {
            if (i == 0) {
                return {
                    breakfastChecked: !prevState.breakfastChecked
                }
            }
            if (i == 1) {
                return {
                    lunchChecked: !prevState.lunchChecked
                }
            }
            if (i == 2) {
                return {
                    dinnerChecked: !prevState.dinnerChecked
                }
            }
        })
    }

    render() {

        if (this.props.error) {
            return (
                <div className="food-input-widget">
                    <div className="fiw-row" style={{width: "326px"}}>
                        <p className={"food-type-title" + (ObjectContainer.isDarkTheme() ? " dark" : "")} style={{paddingTop: "4px", paddingBottom: "0px", width: "100%", color: "#777"}}>Set {this.props.onlyPoint ? "start" : "arrival"} & {this.props.onlyPoint ? "end" : "departure"} dates</p>
                    </div>
                </div>
            )
        }
        else if (this.props.title) {
            return (
                <div className="food-input-widget">
                    <div className="fiw-row">
                        <p style={{color: "#f1f1f1", opacity: "0", width: "62px", margin: "0px"}}>Hi :0</p>
                        <p className={"food-type-title" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Breakfast</p>
                        <p className={"food-type-title" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Lunch</p>
                        <p className={"food-type-title" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Dinner</p>
                    </div>
                </div>
            )
        }
        else if (this.props.all) {
            return (
                <div className="food-input-widget">
                    <div className="fiw-row">
                        <p className="fiw-title">All</p>
                        <div className="fiw-checkbox-wrap">
                            <button ripplecolor="gray" onClick={() => {this.changeState(0)}} className={"fiw-checkbox" + (this.state.breakfastChecked ? " checked" : "") + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                <i className="material-icons">done</i>
                            </button>
                        </div>
                        <div className="fiw-checkbox-wrap">
                            <button ripplecolor="gray" onClick={() => {this.changeState(1)}} className={"fiw-checkbox" + (this.state.lunchChecked ? " checked" : "") + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                <i className="material-icons">done</i>
                            </button>
                        </div>
                        <div className="fiw-checkbox-wrap">
                            <button ripplecolor="gray" onClick={() => {this.changeState(2)}} className={"fiw-checkbox" + (this.state.dinnerChecked ? " checked" : "") + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                <i className="material-icons">done</i>
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="food-input-widget">
                    <div className="fiw-row">
                        <p className="fiw-title">{new Date(this.props.date).getUTCDate() + "." + (new Date(this.props.date).getUTCMonth() + 1)}</p>
                        <div className="fiw-checkbox-wrap">
                            <button ripplecolor="gray" onClick={() => {this.changeState(0)}} className={"fiw-checkbox" + (this.state.breakfastChecked ? " checked" : "") + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                <i className="material-icons">done</i>
                            </button>
                        </div>
                        <div className="fiw-checkbox-wrap">
                            <button ripplecolor="gray" onClick={() => {this.changeState(1)}} className={"fiw-checkbox" + (this.state.lunchChecked ? " checked" : "") + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                <i className="material-icons">done</i>
                            </button>
                        </div>
                        <div className="fiw-checkbox-wrap">
                            <button ripplecolor="gray" onClick={() => {this.changeState(2)}} className={"fiw-checkbox" + (this.state.dinnerChecked ? " checked" : "") + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                <i className="material-icons">done</i>
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
    }

}