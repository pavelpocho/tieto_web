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

    }

    componentDidMount() {
        this.initialSetup();
    }

    initialSetup() {

        var coords = [745, 0, 1037, 0, 1037, 1080, 476, 1080, 317, 777];
    
        var points = [];
    
        for (var i = 0; i < coords.length; i += 2) {
            this.pushPoints(coords, points, i);
        }
    
        this.shape.current.setAttribute("points", points[0] + " " + points[1] + " " + points[2] + " " + points[3] + " " + points[4]);
    
        this.shapeWrap.current.style.height = window.innerHeight + "px";
        this.shapeWrap.current.style.width = window.innerWidth - 870 + "px";
    
    }
    
    pushPoints(coords, points, i) {
        if (coords[i] == 1037 && window.innerWidth <= 1180) {
            points.push(1180 + "," + coords[i + 1] / 1080 * window.innerHeight);
        }
        else if (coords[i] == 1037 && coords[i] / 1920 * window.innerWidth < 710) {
            points.push(710 + "," + coords[i + 1] / 1080 * window.innerHeight);
        }
        else {
            points.push(coords[i] / 1920 * window.innerWidth + "," + coords[i + 1] / 1080 * window.innerHeight);
        }
    }
    
    homeScreen() {
    
        ObjectContainer.getAnimator().animateBackground([0, 745 / 1920 * window.innerWidth], [0, 476 / 1920 * window.innerWidth], [0, 317 / 1920 * window.innerWidth], this.shape.current, this.receipt.current);
    
        setTimeout(() => {
            this.receipt.current.style.display = "none";
        }, 500);
    
        return;
        
    }
    
    tripEdit() {

        ObjectContainer.getAnimator().animateBackground([745 / 1920 * window.innerWidth, 0], [476 / 1920 * window.innerWidth, 0], [317 / 1920 * window.innerWidth, 0], this.shape.current, this.receipt.current);
    
        if (window.innerWidth > 1580) {
            this.receipt.current.style.height = 838 / 1080 * window.innerHeight + "px";
            this.receipt.current.style.display = "block";
        }
        
        return;
        
    }

    render() {

        return (
            <Fragment>
                <div id="background-top-strip"></div>
                    <div id="background-logo-wrap">
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
                        <Logo/>
                    </div>
                    <svg ref={this.shapeWrap} id="background-shape-wrap">
                        <polygon ref={this.shape} id="background-shape" points="" />
                    </svg>
                <div ref={this.receipt} id="background-receipt"></div>
            </Fragment>
        )
        
    }

}