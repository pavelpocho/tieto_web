import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';

export default class FoodInputWidget extends Component {

    constructor(props) {
        super(props);

        this.state = {
            breakfastChecked: true,
            lunchChecked: false,
            dinnerChecked: false
        }
    }

    changeState(i) {
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
        //DISPLAY NUMBER OF EACH FOOD NEXT TO THE BOX IF CHECKED
        return (
            <div className="food-input-widget">
                <div className="fiw-row">
                    <p className="fiw-title">Breakfast</p>
                    <button onClick={() => {this.changeState(0)}} className={"fiw-checkbox" + (this.state.breakfastChecked ? " checked" : "")}>
                        <i className="material-icons">done</i>
                    </button>
                </div>
                <div className="fiw-row">
                    <p className="fiw-title">Lunch</p>
                    <button onClick={() => {this.changeState(1)}} className={"fiw-checkbox" + (this.state.lunchChecked ? " checked" : "")}>
                        <i className="material-icons">done</i>
                    </button>
                </div>
                <div className="fiw-row">
                    <p className="fiw-title">Dinner</p>
                    <button onClick={() => {this.changeState(2)}} className={"fiw-checkbox" + (this.state.dinnerChecked ? " checked" : "")}>
                        <i className="material-icons">done</i>
                    </button>
                </div>
            </div>
        )
    }

}