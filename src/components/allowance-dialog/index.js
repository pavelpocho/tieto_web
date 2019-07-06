import css from './index.css';
import React, { Component, Fragment } from 'react';
import ObjectContainer from '../../utils/object-container';
import Spinner from '../spinner';
import Overlay from '../overlay';
import { RippleManager } from '../ripple';
import TripPreviewState from '../trip-preview-state';
import Scrollbar from '../scrollbar';

export default class AllowanceDialog extends Component {

    constructor(props) {
        super(props);

        this.wrap = React.createRef();
        this.content = React.createRef();
        this.overlay = React.createRef();
        this.scrollbar = React.createRef();
        this.scroll = React.createRef();

        this.state = {
            loading: true,
            countries: null
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.wrap.current.style.opacity = "1";
            this.content.current.style.marginTop = -this.content.current.offsetHeight / 2 + "px";
            this.overlay.current.div.current.style.opacity = "0.45";
        }, 50);
        var h = ObjectContainer.getHttpCommunicator();
        h.getCountryList((r, s) => {
            if (s != 200) {
                //failed...
            }
            else {
                this.setState({
                    loading: false,
                    countries: r
                });
                RippleManager.setUp();
                this.scrollbar.current.setUpScrollbar();
                this.scroll.current.onscroll = (e) => {
                    this.scrollbar.current.setUpScrollbar();
                }
            }
        });
    }

    close() {
        this.wrap.current.style.opacity = "0";
        setTimeout(() => {
            this.props.container.closeLastDialog();
        }, 310);
    }

    moveStart(e) {
        var subtractX = e.clientX - this.content.current.offsetLeft;
        var subtractY = e.clientY - this.content.current.offsetTop;
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
        return (
            <div ref={this.wrap} className="allowance-dialog-wrap">
                <Overlay ref={this.overlay} onClick={() => {this.close()}} />
                <div ref={this.content} className={"allowance-dialog-content" + (ObjectContainer.isDarkTheme() ? " dark" : "")}>
                    {
                        this.state.loading ? (
                            <Spinner size={30} position="absolute"/>
                        ) : null
                    }
                    {
                        !this.state.loading && this.state.countries == null ? (
                            <p style={{marginTop: "100px", textAlign: "center"}}>Something went wrong...</p>
                        ) : null
                    }
                    {
                        !this.state.loading && this.state.countries != null && this.state.countries != undefined && this.state.countries != [] ? (
                            <div ref={this.scroll} className="ad-country-scroll">
                                <div className="ad-country-list">
                                    <div className={"ad-country" + (ObjectContainer.isDarkTheme() ? " dark" : "")} key={0} style={{borderBottom: ObjectContainer.isDarkTheme() ? "1px solid #444" : "1px solid #ccc", paddingBottom: "15px"}}>
                                        <button ripplecolor="gray" onClick={() => {this.close()}}><i className="material-icons">clear</i></button>
                                        <p style={{color: (ObjectContainer.isDarkTheme() ? "#ccc" : "#444"), fontSize: "18px"}}>Name</p>
                                        <p style={{color: (ObjectContainer.isDarkTheme() ? "#ccc" : "#444"), fontSize: "18px"}}>1/3 Rate</p>
                                        <p style={{color: (ObjectContainer.isDarkTheme() ? "#ccc" : "#444"), fontSize: "18px"}}>2/3 Rate</p>
                                        <p style={{color: (ObjectContainer.isDarkTheme() ? "#ccc" : "#444"), fontSize: "18px"}}>Full Rate</p>
                                    </div>
                                    {
                                        this.state.countries.map((c, i) => {
                                            return (
                                                <div className={"ad-country" + (ObjectContainer.isDarkTheme() ? " dark" : "")} key={i + 1} >
                                                    <p>{c.code}</p>
                                                    <p>{c.name}</p>
                                                    <p>{c.rate33.moneyAmount + " " + (c.rate33.currency == 0 ? "EUR" : c.rate33.currency == 1 ? "USD" : c.rate33.currency == 2 ? "CZK" : c.rate33.currency == 3 ? "CHF" : "GBP")}</p>
                                                    <p>{c.rate66.moneyAmount + " " + (c.rate33.currency == 0 ? "EUR" : c.rate33.currency == 1 ? "USD" : c.rate33.currency == 2 ? "CZK" : c.rate33.currency == 3 ? "CHF" : "GBP")}</p>
                                                    <p>{c.rate100.moneyAmount + " " + (c.rate33.currency == 0 ? "EUR" : c.rate33.currency == 1 ? "USD" : c.rate33.currency == 2 ? "CZK" : c.rate33.currency == 3 ? "CHF" : "GBP")}</p>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <Scrollbar ref={this.scrollbar} parent={this.scroll} />
                            </div>
                        ) : null
                    }
                </div>
            </div>
        )
        
    }

}