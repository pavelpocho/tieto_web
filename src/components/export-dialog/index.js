import css from './index.css';
import React, { Component, Fragment } from 'react';
import ObjectContainer from '../../utils/object-container';
import Overlay from '../overlay';
import { RippleManager } from '../ripple';

export default class ExportDialog extends Component {

    constructor(props) {
        super(props);

        this.wrap = React.createRef();
        this.overlay = React.createRef();
        this.content = React.createRef();

        this.state = {
            noWarnings: this.props.trip.noExportWarnings
        }
    }

    close() {
        this.wrap.current.style.opacity = "0";
        setTimeout(() => {
            this.props.container.closeLastDialog();
        }, 310);
    }

    disableWarnings() {
        this.props.parent.setNoExportWarning(!this.state.noWarnings, () => {
            this.setState((prevState) => {
                return {
                    noWarnings: !prevState.noWarnings
                }
            });
        });
    }

    componentDidMount() {
        RippleManager.setUp();
        setTimeout(() => {
            this.wrap.current.style.opacity = "1";
            this.content.current.style.marginTop = -this.content.current.offsetHeight / 2 + "px";
            this.overlay.current.div.current.style.opacity = "0.45";
        }, 50);
    }

    render() {

        var t = this.props.trip;

        return (
            <div ref={this.wrap} className="export-dialog-wrap">
                <Overlay ref={this.overlay} onClick={() => {this.close()}} />
                <div ref={this.content} className="export-dialog-content">
                    <div className="edc-topbar">
                        <button ripplecolor="gray" className="edc-back" onClick={() => {this.close()}}><i className="material-icons">arrow_back</i>Back</button>
                        <p className="edc-title">Before you export...</p>
                        <span className="edc-span"></span>
                    </div>
                    <p className="edc-list-title">We found some things you might want to check</p>
                    <ul className="edc-list">
                        {
                            t.purpose == "" ? (
                                <li className="edc-warning">Your trip doesn't have a purpose.</li>
                            ) : null
                        }
                        {
                            t.project == "" ? (
                                <li className="edc-warning">Your trip doesn't have a project number.</li>
                            ) : null
                        }
                        {
                            t.task == "" ? (
                                <li className="edc-warning">Your trip has no task number.</li>
                            ) : null
                        }
                        {
                            t.project != "" && t.project.length != 6 || isNaN(t.project) ? (
                                <li className="edc-warning">Your trip's project has a non-standard format</li>
                            ) : null
                        }
                        {
                            t.task != "" && (!t.task.includes(".") || t.task.split(".")[0].length != 2 || t.task.split(".")[1].length != 1 || 
                            isNaN(t.task.split(".")[0]) || isNaN(t.task.split(".")[1])) ? (
                                <li className="edc-warning">Your trip's task has a non-standard format</li>
                            ) : null
                        }
                    </ul>
                    <p className="edc-sorry">Sorry for the annoyance if it was intentional! :)</p>
                    <div className="edc-bottom-bar">
                        <button ripplecolor="gray" className="stay-signed-button" onClick={() => {this.disableWarnings()}}>
                            <div ripplecolor="gray" className={"fiw-checkbox uncheck-white" + (this.state.noWarnings ? " checked check-blue" : "")}>
                                <i className="material-icons">done</i>
                            </div>
                            <p className="no-again-text">Don't display this warning screen</p>
                        </button>
                        <button className="edc-export" onClick={() => {this.props.parent.confirmExport(); this.close()}}>Export</button>
                    </div>
                </div>
            </div>
        )
        
    }

}