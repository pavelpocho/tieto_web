import css from './index.css';
import React, { Component, Fragment } from 'react';
import ObjectContainer from '../../utils/object-container';
import Spinner from '../spinner';
import Overlay from '../overlay';
import { RippleManager } from '../ripple';
import TripPreviewState from '../trip-preview-state';
import Scrollbar from '../scrollbar';
const preval = require('preval.macro');

export default class FeedbackDialog extends Component {

    constructor(props) {
        super(props);

        this.wrap = React.createRef();
        this.overlay = React.createRef();
        this.content = React.createRef();
        this.feedbackText = React.createRef();

        this.state = {
            feedbacks: null,
            isLike: true,
            isImprovement: false,
            isError: false,
            maximized: "left"
        }

        this.leftPart = React.createRef();
        this.rightPart = React.createRef();
        this.scrollbar = React.createRef();
        this.scroll = React.createRef();
    }

    componentDidMount() {
        var h = ObjectContainer.getHttpCommunicator();
        h.getFeedbackList((r, s) => {
            if (s == 200 || s == 204) {
                //List fetch successful
                setTimeout(() => {
                    RippleManager.setUp();
                }, 150);
                r.sort((a, b) => {return b.postedAt - a.postedAt});
                this.setState({
                    feedbacks: r
                })
            }
            else {
                //List fetch failed
            }
        });
        setTimeout(() => {
            this.wrap.current.style.opacity = "1";
            this.content.current.style.marginTop = -this.content.current.offsetHeight / 2 + "px";
            this.overlay.current.div.current.style.opacity = "0.45";
        }, 50);

        this.scrollbar.current.setUpScrollbar(550);
        this.scroll.current.onscroll = () => {
            this.scrollbar.current.setUpScrollbar();
        }
    }

    isError() {
        this.setState((prevState) => {
            return {
                isError: !prevState.isError,
                isLike: false,
                isImprovement: false
            }
        });
    }

    isLike() {
        this.setState((prevState) => {
            return {
                isError: false,
                isLike: !prevState.isLike,
                isImprovement: false
            }
        });
    }

    isImprovement() {
        this.setState((prevState) => {
            return {
                isError: false,
                isLike: false,
                isImprovement: !prevState.isImprovement
            }
        });
    }

    likeFeedback(id) {
        var http = ObjectContainer.getHttpCommunicator();
        http.likeFeedback(id, (r, s) => {
            if (s == 200 || s == 204) {
                this.setState(prevState => {
                    let f = prevState.feedbacks;
                    for (var i = 0; i < f.length; i++) {
                        if (f[i].id == id) {
                            if (f[i].liked) {
                                f[i].likeNumber --;
                            }
                            else {
                                f[i].likeNumber ++;
                            }
                            f[i].liked = !f[i].liked;
                        }
                    }
                    return {
                        feedbacks: f
                    }
                })
                //Like success
            }
            else {
                //Like fail
            }
        })
    }

    close() {
        this.wrap.current.style.opacity = "0";
        setTimeout(() => {
            this.props.container.closeLastDialog();
        }, 310);
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

    //The feedback stuff gets updated in parallel with the server posts, but is not updated from the server!

    maximizeLeft() {
        this.leftPart.current.style.display = "block";
        this.rightPart.current.style.display = "none";
        this.setState({
            maximized: "left"
        })
    }

    maximizeRight() {
        this.leftPart.current.style.display = "none";
        this.rightPart.current.style.display = "block";
        this.setState({
            maximized: "right"
        })
    }

    sendFeedback() {
        var h = ObjectContainer.getHttpCommunicator();
        var object = {
            text: this.feedbackText.current.value,
            isError: this.state.isError,
            isImprovement: this.state.isImprovement,
            isLike: this.state.isLike,
            postedAt: Date.now()
        }
        h.sendFeedback(object, (r, s) => {
            if (s == 200 || s == 204) {
                this.feedbackText.current.value = "";
                this.setState(prevState => {
                    let f = prevState.feedbacks;
                    f.push(r);
                    f.sort((a, b) => {return b.postedAt - a.postedAt});
                    return {
                        feedbacks: f,
                        isError: false,
                        isLike: false,
                        isImprovement: false
                    }
                })
                //Feedback successfully sent
            }
            else {
                //Feedback send failed
            }
        });
    }

    updateParentText(value) {
        this.props.parent.defaultFeedbackValue = value;
    }

    render() {
        return (
            <div ref={this.wrap} className="feedback-dialog-wrap">
                <Overlay ref={this.overlay} onClick={() => {this.close()}} />
                <div ref={this.content} className={"feedback-dialog-content" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                    <div className={"ma-window-topbar" + (ObjectContainer.isDarkTheme() ? " dark" : "")} onMouseDown={(e) => {this.moveStart(e)}}>
                        <button onClick={() => {this.close()}} ripplecolor="gray" ref={this.closeButton} className="ma-window-close"><i className="material-icons">arrow_back</i>Back</button>
                        <p>Feedback</p>
                        <span></span> {/*This is here so that I can use justify-content space-between*/}
                    </div>
                    <div className={"ma-window-sub-topbar" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                        <button ripplecolor="gray" className={this.state.maximized == "left" ? "selected" : ""} onClick={() => {this.maximizeLeft()}} >View Feedback</button>
                        <button ripplecolor="gray" className={this.state.maximized == "right" ? "selected" : ""} onClick={() => {this.maximizeRight()}} >Write Feedback</button>
                    </div>
                    <div className="ma-window-main">
                        <div className="ma-window-left" ref={this.leftPart}>
                            <div className="ma-window-left-scroll" ref={this.scroll}>
                                <div className="ma-window-left-inner-scroll">
                                    <p className={"feedback-section-title" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Published Feedback</p>
                                    {
                                        this.state.feedbacks == null ? (
                                            <Spinner position={"absolute"} size={40} />
                                        ) : this.state.feedbacks.length == 0 ? (
                                            <p className={"feedback-empty" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Wow, such empty ( ͠° ͟ʖ ͠°)</p>
                                        ) : this.state.feedbacks.map((f, i) => {
                                            return (
                                                /*<div key={i} className={"feedback-wrap" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                                    <div>
                                                        <div className="feedback-type-icon" style={{backgroundColor: f.type == 1 ? (ObjectContainer.isDarkTheme() ? "#E79206" : "#FAA519") : "", transform: f.type == 2 || f.type == 0 ? "scale(0.782608)" : ""}}>
                                                            {
                                                                f.type == 1 ? (
                                                                    <i className="material-icons">add</i>
                                                                ) : f.type == 2 ? (
                                                                    <TripPreviewState status={1} />
                                                                ) : f.type == 0 ? (
                                                                    <TripPreviewState status={2} />
                                                                ) : null
                                                            }
                                                        </div>
                                                        <p className={"feedback-text" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>{f.text} {(f.reply != "" && f.reply != null && f.reply != undefined) ? <Fragment><br></br><span className={"feedback-response-title" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Response: </span><span className={"feedback-response-body" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>{f.reply}</span></Fragment> : ""}</p>
                                                    </div>
                                                    <div>
                                                        <p className={"feedback-date" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>{new Date(f.postedAt).getUTCDate() + "." + (new Date(f.postedAt).getUTCMonth() + 1) + "." + new Date(f.postedAt).getUTCFullYear()}</p>
                                                        <button ripplecolor="gray" title={f.liked ? "Unlike this feedback" : "Like this feedback"} onClick={() => {this.likeFeedback(f.id)}} className="feedback-like"><i className={"material-icons " + (f.liked ? "f-liked" : "f-not-liked")}>thumb_up</i><span className={(f.liked ? "f-liked" : "f-not-liked")}>{f.likeNumber}</span></button>
                                                    </div>
                                                </div>*/
                                                <div key={i} className={"feedback-wrap" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                                    <div className={"feedback-topbar" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                                        <span>
                                                            <div className="feedback-type-icon" style={{backgroundColor: f.type == 1 ? (ObjectContainer.isDarkTheme() ? "#E79206" : "#FAA519") : "", transform: f.type == 2 || f.type == 0 ? "scale(0.782608)" : ""}}>
                                                                {
                                                                    f.type == 1 ? (
                                                                        <i className="material-icons">add</i>
                                                                    ) : f.type == 2 ? (
                                                                        <TripPreviewState status={1} />
                                                                    ) : f.type == 0 ? (
                                                                        <TripPreviewState status={2} />
                                                                    ) : null
                                                                }
                                                            </div>
                                                            <p className={"feedback-name" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>{f.author.fullName}</p>
                                                        </span>
                                                        <span>
                                                            <p className={"feedback-date" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>{new Date(f.postedAt).getUTCDate() + "." + (new Date(f.postedAt).getUTCMonth() + 1) + "." + new Date(f.postedAt).getUTCFullYear()}, ver. {(f.version != null && f.version != "") ? f.version : "< 1.0.10.0"}</p>
                                                        </span>
                                                    </div>
                                                    {
                                                        f.text.split(/(\r\n|\n|\r)/gm).map((t, i) => {
                                                            return (
                                                                <p key={i} className={"feedback-text" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>{t}</p>
                                                            )
                                                        })
                                                    }
                                                    {/*<p className={"feedback-text" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>{f.text}</p>*/}
                                                    <div className={"feedback-button-row" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                                        <div>
                                                            <button onClick={() => {this.likeFeedback(f.id)}} ripplecolor="white" title={f.liked ? "Unlike this feedback" : "Like this feedback"} className={"feedback-button feedback-left-button " + (f.liked ? "f-liked " : "f-not-liked ") + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Like<i className={"material-icons"}>thumb_up</i>({f.likeNumber})</button>
                                                            {/*<button className={"feedback-button feedback-left-button" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Comment<i className="material-icons">add_comment</i></button>
                                                        </div>
                                                        <div>
                                                            <button className={"feedback-button feedback-right-button" + (ObjectContainer.isDarkTheme() ? " dark" : "")}><i className="material-icons">edit</i></button>
                                                            <button className={"feedback-button feedback-right-button" + (ObjectContainer.isDarkTheme() ? " dark" : "")}><i className="material-icons">delete</i></button>*/}
                                                        </div>
                                                    </div>
                                                    {/*<div className={"feedback-comment-section" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                                        <div className={"feedback-comment-wrap" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                                            <div className={"feedback-comment-topbar" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                                                <span>
                                                                    <div className={"feedback-comment-dot" + (ObjectContainer.isDarkTheme() ? " dark" : "")}></div>
                                                                    <p className={"feedback-comment-name" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>John Newman</p>
                                                                </span>
                                                                <span>
                                                                    <p className={"feedback-comment-date" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>6.8.2019</p>
                                                                </span>
                                                            </div>
                                                            <p className={"feedback-comment-text" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>I very much agree</p>
                                                        </div>
                                                    </div>*/}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <Scrollbar parent={this.scroll} ref={this.scrollbar} />
                            </div>
                        </div>
                        <div className="ma-window-right" ref={this.rightPart} >
                            <p className="feedback-section-title">Submit Feedback</p>
                            <button ripplecolor="gray" onClick={() => {this.isLike()}} className={"feedback-type-wrap" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                <div className={"fiw-checkbox uncheck-white" + (this.state.isLike ? " checked check-blue" : "") + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                    <i className="material-icons">done</i>
                                </div>
                                <p>I like something</p>
                                <div className="feedback-type-icon" style={{transform: "scale(0.62608)", transformOrigin: "center"}}>
                                    <TripPreviewState status={1} />
                                </div>
                            </button>
                            <button ripplecolor="gray" onClick={() => {this.isImprovement()}} className={"feedback-type-wrap" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                <div className={"fiw-checkbox uncheck-white" + (this.state.isImprovement ? " checked check-blue" : "") + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                    <i className="material-icons">done</i>
                                </div>
                                <p>I want to suggest somehing</p>
                                <div className="feedback-type-icon" style={{backgroundColor: (ObjectContainer.isDarkTheme() ? "#E79206" : "#FAA519"), transform: "scale(0.8)", transformOrigin: "center"}}>
                                    <i className="material-icons">{"add"}</i>
                                </div>
                            </button>
                            <button ripplecolor="gray" onClick={() => {this.isError()}} className={"feedback-type-wrap" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                <div className={"fiw-checkbox uncheck-white" + (this.state.isError ? " checked check-blue" : "") + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                                    <i className="material-icons">done</i>
                                </div>
                                <p>I found an error</p>
                                <div className="feedback-type-icon" style={{transform: "scale(0.62608)", transformOrigin: "center"}}>
                                    <TripPreviewState status={2} />
                                </div>
                            </button>
                            <p className="feedback-specify">Please specify further:</p>
                            <textarea defaultValue={this.props.defaultValue} ref={this.feedbackText} className={"feedback-text-input" + (ObjectContainer.isDarkTheme() ? " dark" : "")} onChange={(e) => {this.forceUpdate(); this.updateParentText(e.currentTarget.value)}}/>
                            <p className="feedback-warning">All feedback is also available for other users to see.</p>
                            <button disabled={(!this.state.isLike && !this.state.isImprovement && !this.state.isError) || this.feedbackText.current != null && this.feedbackText.current.value == ""} onClick={() => {this.sendFeedback()}} className={"send-feedback" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>Send feedback</button>
                        </div>
                    </div>
                </div>
            </div>
        )
        
    }

}