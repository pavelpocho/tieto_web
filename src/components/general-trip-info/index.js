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
            defaultTask: ""
        }
    }

    render() {
        return (
            <div className="gti-wrap">
                <div className="gti-section">
                    <p className="trip-property-label">Title</p>
                    <input onFocus={() => {this.setState({defaultTitle: this.props.title})}} defaultValue={this.props.title} onChange={(e) => {this.props.parent.update("title", e.target.value)}} onBlur={(e) => {if (e.target.value !== this.state.defaultTitle) this.props.parent.autoSave("title", e.target.value)}} ref={this.title} placeholder="Title"></input>
                </div>
                <div className="gti-section">
                    <p className="trip-property-label">Purpose</p>
                    <input onFocus={() => {this.setState({defaultPurpose: this.props.purpose})}} defaultValue={this.props.purpose} onChange={(e) => {this.props.parent.update("purpose", e.target.value)}} onBlur={(e) => {if (e.target.value !== this.state.defaultPurpose) this.props.parent.autoSave("purpose", e.target.value)}} ref={this.purpose} placeholder="Purpose"></input>
                </div>
                <div className="gti-section">
                    <p className="trip-property-label">{"Project & Task"}</p>
                    <input onFocus={() => {this.setState({defaultProject: this.props.project})}} id="gti-project" defaultValue={this.props.project} onChange={(e) => {this.props.parent.update("project", e.target.value)}} onBlur={(e) => {if (e.target.value !== this.state.defaultProject) this.props.parent.autoSave("project", e.target.value)}} ref={this.purpose} placeholder="123456"></input>
                    <input onFocus={() => {this.setState({defaultTask: this.props.task})}} id="gti-task" defaultValue={this.props.task} onChange={(e) => {this.props.parent.update("task", e.target.value)}} onBlur={(e) => {if (e.target.value !== this.state.defaultTask) this.props.parent.autoSave("task", e.target.value)}} ref={this.purpose} placeholder="78.9"></input>
                </div>
                <div className="gti-section">
                    <p className="trip-property-label">Comment</p>
                    <input onFocus={() => {this.setState({defaultComment: this.props.comment})}} defaultValue={this.props.comment} onChange={(e) => {this.props.parent.update("comment", e.target.value)}} onBlur={(e) => {if (e.target.value !== this.state.defaultComment) this.props.parent.autoSave("comment", e.target.value)}} ref={this.comment} placeholder="Comment"></input>
                </div>
            </div>
        )
    }

}