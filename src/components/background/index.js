import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import Logo from '../logo';

export default class Background extends Component {

    constructor(props) {
        super(props);

        this.shape = React.createRef();
        this.shape2 = React.createRef();
        this.shapeWrap = React.createRef();
        this.receipt = React.createRef();
        this.topStrip = React.createRef();
        this.logoWrap = React.createRef();

    }

    componentDidMount() {
        this.initialSetup();
    }

    initialSetup() {

        var diffFromFull = (1920 - window.innerWidth) / 3;

        //var coords = [1500 + diffFromFull, 0, 1920, 0, 1920, 1080, 1400 + diffFromFull, 1080, 1220 + diffFromFull, 777];

        var coords = [1800, 1080, 1800, 500, 1920, 400, 1920, 420, 1814, 514, 1814, 1080];
        var coords2 = [120, 1080, 120, 500, 0, 400, 0, 420, 106, 514, 106, 1080];
    
        var points = [];
        var points2 = [];
    
        for (var i = 0; i < coords.length; i += 2) {
            this.pushPoints(coords, points, i);
            this.pushPoints(coords2, points2, i);
        }
    
        //this.shape.current.setAttribute("points", points[0] + " " + points[1] + " " + points[2] + " " + points[3] + " " + points[4] + " " + points[5]);
        //this.shape2.current.setAttribute("points", points2[0] + " " + points2[1] + " " + points2[2] + " " + points2[3] + " " + points2[4] + " " + points2[5]);
    
    }

    loginAction() {
        //this.topStrip.current.style.width = "100%";
        this.logoWrap.current.style.display = "block";
        setTimeout(() => {
            this.logoWrap.current.style.opacity = "1";
        }, 50);
        //this.shapeWrap.current.style.opacity = "1";
        if (ObjectContainer.isDarkTheme()) {
            document.body.style.backgroundColor = "#0f0f0f";
            //this.shape.current.style.fill = "#1d1d1d";
            //this.shape2.current.style.fill = "#1d1d1d";

        } else {
            document.body.style.backgroundColor = "#f1f1f1";
            //this.shape.current.style.fill = "#e2e2e2";
            //this.shape2.current.style.fill = "#e2e2e2";
        }
        //this.shapeWrap.current.style.transform = "translateX(0px)";
    }

    welcomeMode() {
        /*setTimeout(() => {
            this.shapeWrap.current.style.opacity = "1";
        }, 100);*/
    }
    
    pushPoints(coords, points, i) {
        points.push(coords[i] + "," + coords[i + 1] / 1080 * window.innerHeight);
    }
    
    homeScreen() {
        //this.shapeWrap.current.style.opacity = "1";
    }
    
    tripEdit() {
        //this.shapeWrap.current.style.opacity = "0";
    }

    render() {

        return (
            <Fragment>
                {/*<div ref={this.topStrip} id="background-top-strip" className={(ObjectContainer.isDarkTheme() ? " dark" : "")}></div>*/}
                <div ref={this.logoWrap} id="background-logo-wrap">
                    <svg id="background-logo-background-wrap">
                        <defs>
                            <filter id="f1" x="0" y="0" width="150%" height="150%">
                                <feColorMatrix in="SourceGraphic"
                                    type="matrix"
                                    values="0 0 0 0 0
                                            0 0 0 0 0
                                            0 0 0 0 0
                                            0 0 0 0.07 0" result="alphaOut"/>
                                <feOffset result="offOut" in="alphaOut" dx="1" dy="1" />
                                <feGaussianBlur result="blurOut" in="offOut" stdDeviation="3" />
                                <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                            </filter>
                        </defs>
                        <polygon id="background-logo-background" className={ObjectContainer.isDarkTheme() ? "dark" : ""} points="0,0 194,0 97,98 0,77" filter="url(#f1)"/>
                    </svg>
                    <Logo />
                </div>
                {/*<svg ref={this.shapeWrap} id="background-shape-wrap">
                    <polygon ref={this.shape} className={(ObjectContainer.isDarkTheme() ? " dark" : "")} id="background-shape" points="" />
                    <polygon ref={this.shape2} className={(ObjectContainer.isDarkTheme() ? " dark" : "")} id="background-shape" points="" />
                </svg>*/}
            </Fragment>
        )
        
    }

}