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

    back() {
        this.props.parent.stopExport();
        this.close();
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

    moveStart(e) {
        var t = this.content.current.style.transform;
        var subtractX = e.clientX - this.content.current.offsetLeft - (t == "" ? 0 : parseInt(t.split("(")[1].split("px")[0]));
        var subtractY = e.clientY - this.content.current.offsetTop - (t == "" ? 0 : parseInt(t.split(",")[1].split("px")[0]));
        document.body.onmousemove = (f) => {
            this.content.current.style.marginTop = "0px";
            this.content.current.style.marginLeft = "0px";
            this.content.current.style.top = "0px";
            this.content.current.style.left = "0px";
            this.content.current.style.transform = "translate(" + (f.clientX - subtractX) + "px" + "," + (f.clientY - subtractY) + "px" + ")";
        }
        document.body.onmouseup = () => {
            document.body.onmousemove = null;
            document.body.onmouseup = null;
        }
    }

    render() {

        var t = this.props.trip;

        return (
            <div ref={this.wrap} className="export-dialog-wrap">
                <Overlay ref={this.overlay} onClick={() => {this.back()}} />
                <div ref={this.content} className={"export-dialog-content" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                    <div className="edc-topbar" onMouseDown={(e) => {this.moveStart(e)}}>
                        <button ripplecolor="gray" className={"edc-back" + (ObjectContainer.isDarkTheme() ? " dark" : "")} onClick={() => {this.back()}}><i className="material-icons">arrow_back</i>Back</button>
                        <p className={"edc-title" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Before you export...</p>
                        <span className="edc-span"></span>
                    </div>
                    <p className={"edc-list-title" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>We found some things you might want to check</p>
                    <ul className="edc-list">
                        {
                            t.purpose == "" ? (
                                <li className={"edc-warning" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Your trip doesn't have a purpose.</li>
                            ) : null
                        }
                        {
                            t.project == "" ? (
                                <li className={"edc-warning" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Your trip doesn't have a project number.</li>
                            ) : null
                        }
                        {
                            t.task == "" ? (
                                <li className={"edc-warning" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Your trip has no task number.</li>
                            ) : null
                        }
                        {
                            t.project != "" && t.project.length != 6 || isNaN(t.project) ? (
                                <li className={"edc-warning" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Your trip's project has a non-standard format</li>
                            ) : null
                        }
                        {
                            t.task != "" && (!t.task.includes(".") || t.task.split(".")[0].length != 2 || t.task.split(".")[1].length != 1 || 
                            isNaN(t.task.split(".")[0]) || isNaN(t.task.split(".")[1])) ? (
                                <li className={"edc-warning" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Your trip's task has a non-standard format</li>
                            ) : null
                        }
                    </ul>
                    <p className={"edc-sorry" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Sorry for the annoyance if it was intentional! :)</p>
                    <div className="edc-bottom-bar">
                        <button ripplecolor="gray" className={"stay-signed-button" + (ObjectContainer.isDarkTheme() ? " dark" : "")} onClick={() => {this.disableWarnings()}}>
                            <div ripplecolor="gray" className={"fiw-checkbox uncheck-white" + (this.state.noWarnings ? " checked check-blue" : "") + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                <i className="material-icons">done</i>
                            </div>
                            <p className={"no-again-text" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Don't display this warning screen</p>
                        </button>
                        <button className={"edc-export" + (ObjectContainer.isDarkTheme() ? " dark" : "")} onClick={() => {this.props.parent.confirmExport(); this.close()}}>Export</button>
                    </div>
                </div>
            </div>
        )
        
    }

}