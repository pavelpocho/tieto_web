import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';

export default class FoodInputWidget extends Component {

    constructor(props) {
        super(props);

        this.state = {
            breakfastChecked: this.props.food ? this.props.food.breakfast : false,
            lunchChecked: this.props.food ? this.props.food.lunch : false,
            dinnerChecked: this.props.food ? this.props.food.dinner : false
        }

        this.letters = [];
        for (var i = 0; i < 3; i++) {
            this.letters[i] = React.createRef();
        }
    }

    changeState(i) {
        this.setState(prevState => {
            this.props.parent.setFood(this.props.index, i); //i says which food
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
                    <div className="fiw-row" style={{width: "300px"}}>
                        <p className="food-type-title" style={{paddingTop: "4px", paddingBottom: "0px", width: "100%", color: "#777"}}>Set arrival & departure times</p>
                    </div>
                </div>
            )
        }
        else if (this.props.title) {
            return (
                <div className="food-input-widget">
                    <div className="fiw-row">
                        <p style={{color: "#f1f1f1", opacity: "0", width: "60px", margin: "0px"}}>Hi :0</p>
                        <p className="food-type-title">Breakfast</p>
                        <p className="food-type-title">Lunch</p>
                        <p className="food-type-title">Dinner</p>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="food-input-widget">
                    <div className="fiw-row">
                        <p className="fiw-title">{new Date(this.props.date).getUTCDate() + "." + (new Date(this.props.date).getMonth() + 1)}</p>
                        <div className="fiw-checkbox-wrap">
                            <button onClick={() => {this.changeState(0)}} className={"fiw-checkbox" + (this.state.breakfastChecked ? " checked" : "")}>
                                <i className="material-icons">done</i>
                            </button>
                        </div>
                        <div className="fiw-checkbox-wrap">
                            <button onClick={() => {this.changeState(1)}} className={"fiw-checkbox" + (this.state.lunchChecked ? " checked" : "")}>
                                <i className="material-icons">done</i>
                            </button>
                        </div>
                        <div className="fiw-checkbox-wrap">
                            <button onClick={() => {this.changeState(2)}} className={"fiw-checkbox" + (this.state.dinnerChecked ? " checked" : "")}>
                                <i className="material-icons">done</i>
                            </button>
                        </div>
                    </div>
                </div>
            )
        }
    }

}