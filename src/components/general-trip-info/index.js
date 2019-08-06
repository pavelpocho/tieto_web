import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';

export default class GeneralTripInfo extends Component {

    constructor(props) {
        super(props);

        this.title = React.createRef();
        this.purpose = React.createRef();

        this.state = {
            defaultTitle: "",
            defaultPurpose: "",
            defaultProject: "",
            defaultTask: "",
            titlePlaceholder: "",
            purposePlaceholder: "",
            projectPlaceholder: "",
            taskPlaceholder: "",
            commentPlaceholder: ""
        }
    }

    componentDidMount() {
        this.setState({
            titlePlaceholder: this.randomTitlePlaceholder(),
            purposePlaceholder: this.randomPurposePlaceholder(),
            projectPlaceholder: this.randomProjectPlaceholder(),
            taskPlaceholder: this.randomTaskPlaceholder(),
            commentPlaceholder: this.randomCommentPlaceholder()
        })
    }

    randomTitlePlaceholder() {
        var titles = ["Name", "Name", "Name", "Vacation", "Best Trip Ever", "Life's Journey", "More Travels", "To The Moon And Back"]
        var random = Math.random();
        var max = 1;
        for (var i = 1; i < 8; i++) {
            if (random > (Math.pow(2, i) - 1) / (Math.pow(2, i))) {
                max = i;
            }
        }
        return titles[max - 1];
    }

    randomPurposePlaceholder() {
        var purposes = ["Purpose", "Purpose", "Purpose", "Salvation", "Get The Deal", "Rescue Mission", "Relax", "To Travel The World"]
        var random = Math.random();
        var max = 1;
        for (var i = 1; i < 8; i++) {
            if (random > (Math.pow(2, i) - 1) / (Math.pow(2, i))) {
                max = i;
            }
        }
        return purposes[max - 1];
    }

    randomProjectPlaceholder() {
        var projects = ["123456", "123456", "123456", "654321", "314159", "271828", "141421", "161803"]
        var random = Math.random();
        var max = 1;
        for (var i = 1; i < 8; i++) {
            if (random > (Math.pow(2, i) - 1) / (Math.pow(2, i))) {
                max = i;
            }
        }
        return projects[max - 1];
    }

    randomTaskPlaceholder() {
        var tasks = ["78.9", "78.9", "78.9", "98.7", "98.1", "27.4", "16.2", "24.8"]
        var random = Math.random();
        var max = 1;
        for (var i = 1; i < 8; i++) {
            if (random > (Math.pow(2, i) - 1) / (Math.pow(2, i))) {
                max = i;
            }
        }
        return tasks[max - 1];
    }

    randomCommentPlaceholder() {
        var comments = ["Comment", "Comment", "Comment", "Hi There ;)", "First!", "Don't leave me empty :C", "F", "E"]
        var random = Math.random();
        var max = 1;
        for (var i = 1; i < 8; i++) {
            if (random > (Math.pow(2, i) - 1) / (Math.pow(2, i))) {
                max = i;
            }
        }
        return comments[max - 1];
    }
    //Can make one function for getting the number (also in point detail info)

    render() {
        return (
            <div className="gti-wrap">
                <div className="gti-section less-top">
                    <p className="trip-property-label">Trip Name*<i style={{fontSize: "20px", marginLeft: "8px", color: "#888"}}className="material-icons" title="This will not be shown in the Trip Report">info_outline</i></p>
                    <input className={ObjectContainer.isDarkTheme() ? "dark" : ""} autoComplete="off" onFocus={() => {this.setState({defaultTitle: this.props.title})}} defaultValue={this.props.title} onChange={(e) => {this.props.parent.update("title", e.target.value)}} onBlur={(e) => {if (e.target.value !== this.state.defaultTitle) this.props.parent.autoSave("title", e.target.value)}} ref={this.title} placeholder={this.state.titlePlaceholder} ></input>
                </div>
                <div className="gti-section">
                    <p className="trip-property-label">Purpose*</p>
                    <input className={ObjectContainer.isDarkTheme() ? "dark" : ""} autoComplete="off" onFocus={() => {this.setState({defaultPurpose: this.props.purpose})}} defaultValue={this.props.purpose} onChange={(e) => {this.props.parent.update("purpose", e.target.value)}} onBlur={(e) => {if (e.target.value !== this.state.defaultPurpose) this.props.parent.autoSave("purpose", e.target.value)}} ref={this.purpose} placeholder={this.state.purposePlaceholder} ></input>
                </div>
                <div className="gti-section">
                    <p className="trip-property-label">{"Project & Task*"}</p>
                    <input className={ObjectContainer.isDarkTheme() ? "dark" : ""} autoComplete="off" onFocus={() => {this.setState({defaultProject: this.props.project})}} id="gti-project" defaultValue={this.props.project} onChange={(e) => {this.props.parent.update("project", e.target.value)}} onBlur={(e) => {if (e.target.value !== this.state.defaultProject) this.props.parent.autoSave("project", e.target.value)}} ref={this.purpose} placeholder={this.state.projectPlaceholder} ></input>
                    <input className={ObjectContainer.isDarkTheme() ? "dark" : ""} autoComplete="off" onFocus={() => {this.setState({defaultTask: this.props.task})}} id="gti-task" defaultValue={this.props.task} onChange={(e) => {this.props.parent.update("task", e.target.value)}} onBlur={(e) => {if (e.target.value !== this.state.defaultTask) this.props.parent.autoSave("task", e.target.value)}} ref={this.purpose} placeholder={this.state.taskPlaceholder} ></input>
                </div>
                <div className="gti-section">
                    <p className="trip-property-label">Comment</p>
                    <input className={ObjectContainer.isDarkTheme() ? "dark" : ""} autoComplete="off" onFocus={() => {this.setState({defaultComment: this.props.comment})}} defaultValue={this.props.comment} onChange={(e) => {this.props.parent.update("comment", e.target.value)}} onBlur={(e) => {if (e.target.value !== this.state.defaultComment) this.props.parent.autoSave("comment", e.target.value)}} ref={this.comment} placeholder={this.state.commentPlaceholder} ></input>
                </div>
                <p className={"mandatory-text " + (ObjectContainer.isDarkTheme() ? " dark" : "")}>*Mandatory fields</p>
            </div>
        )
    }

}