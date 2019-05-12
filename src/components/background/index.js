import css from './index.css';
import React, { Fragment, Component } from 'react';
import ObjectContainer from '../../utils/object-container';
import Logo from '../logo';

export default class Background extends Component {

    constructor(props) {
        super(props);

        this.shape = React.createRef();
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

        var coords = [1500 + diffFromFull, 0, 1920, 0, 1920, 1080, 1400 + diffFromFull, 1080, 1220 + diffFromFull, 777];
    
        var points = [];
    
        for (var i = 0; i < coords.length; i += 2) {
            this.pushPoints(coords, points, i);
        }
    
        this.shape.current.setAttribute("points", points[0] + " " + points[1] + " " + points[2] + " " + points[3] + " " + points[4]);
    
    }

    loginAction() {
        this.topStrip.current.style.width = "100%";
        this.logoWrap.current.style.opacity = "1";
        this.shapeWrap.current.style.opacity = "1";
        this.shape.current.style.fill = "#e6e6e6";
        document.body.style.backgroundColor = "#f1f1f1";
        this.shapeWrap.current.style.transform = "translateX(0px)";
        this.logoWrap.current.style.transform = "translate(0px, 0px)";
    }

    welcomeMode() {
        setTimeout(() => {
            this.shapeWrap.current.style.opacity = "1";
        }, 100);
    }
    
    pushPoints(coords, points, i) {
        points.push(coords[i] + "," + coords[i + 1] / 1080 * window.innerHeight);
    }
    
    homeScreen() {
        this.shapeWrap.current.style.opacity = "1";
    }
    
    tripEdit() {
        this.shapeWrap.current.style.opacity = "0";
    }

    render() {

        return (
            <Fragment>
                <div ref={this.topStrip} id="background-top-strip"></div>
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
                        <polygon id="background-logo-background" points="0,0 215,0 108,109 0,86" filter="url(#f1)"/>
                    </svg>
                    <Logo />
                </div>
                <svg ref={this.shapeWrap} id="background-shape-wrap">
                    <polygon ref={this.shape} id="background-shape" points="" />
                </svg>
                <div ref={this.receipt} id="background-receipt"></div>
            </Fragment>
        )
        
    }

}