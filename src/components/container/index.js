import css from './index.css';
import React, { Component, Fragment } from 'react';
import ObjectContainer from '../../utils/object-container';
import Background from '../background';
import MainActivity from '../main-activity';

export default class Container extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activityHistory: [],
            dialogHistory: [],
            outActivity: null,
            transitioningForward: false,
            transitioningBackward: false
        }

        this.background = React.createRef();

    }

    startApp() {
        this.openActivity(<MainActivity key="mainActivity" container={this} />);
    }

    componentDidMount() {
        this.startApp();
    }

    openActivity(activity) {
        this.setState((prevState) => {

            var a = prevState.activityHistory;
            a.push(activity);

            return {
                activityHistory: a,
                outActivity: a[a.length - 2]
            }

        })
    }

    closeLastActivity() {
        this.setState((prevState) => {

            var a = prevState.activityHistory;
            var o = a[a.length - 1];
            a.splice(a.length - 1, 1);

            console.log(a);

            return {
                activityHistory: a,
                outActivity: o
            }

        })
    }

    openDialog(dialog) {
        this.setState((prevState) => {

            var d = prevState.dialogHistory;
            d.push(dialog);

            return {
                dialogHistory: d
            }

        })
    }

    closeLastDialog() {
        this.setState((prevState) => {

            var d = prevState.dialogHistory;
            var o = d[d.length - 1];
            d.splice(d.length - 1, 1);

            return {
                dialogHistory: d
            }

        })
    }

    componentDidUpdate() {
        if (this.state.outActivity) {
            if (this.state.outActivity.key == "mainActivity") {
                this.background.current.tripEdit();
            }
            else {
                this.background.current.homeScreen();
            }
            setTimeout(() => {
                this.setState({
                    outActivity: null
                })
            }, 510);
        }
    }

    render() {

        return (
            <Fragment>
                <Background ref={this.background} />
                {
                    this.state.outActivity
                }
                {
                    this.state.activityHistory[this.state.activityHistory.length - 1]
                }
                {
                    this.state.dialogHistory.map(v => v)
                }
            </Fragment>
        )
        
    }

}
