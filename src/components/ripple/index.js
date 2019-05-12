import css from './index.css';

export class RippleManager {
    static checkForRipple() {
        if (this.ripple == undefined) this.ripple = [];
    }
	static setUp() {
        this.checkForRipple();
        RippleManager.setUpClick();
        RippleManager.setUpTouch();
    }
    static setClick(e, button) {
        if (!button.touched) {
            RippleManager.ripple[RippleManager.ripple.length] = new Ripple(button,e,button.getAttribute("ripplecolor"));
            document.body.onmouseup = () => {
                if (!document.body.touched) {
                    RippleManager.ripple[RippleManager.ripple.length - 1].hide();
                    document.body.onmouseup = undefined;
                }
                else {
                    document.body.touched = false;
                }
            };
        }
        else {
            button.touched = false;
        }
    }
    static setTouch(e, button) {
        button.touched = true;
        document.body.touched = true;
        RippleManager.ripple[RippleManager.ripple.length] = new Ripple(button,e,button.getAttribute("ripplecolor"));
        document.body.ontouchend = () => {
            RippleManager.ripple[RippleManager.ripple.length - 1].hide();
            document.body.onmouseup = undefined;
        };
    }
    static setUpClick() {
        var array = Array.from(document.getElementsByTagName('button')).concat(Array.from(document.getElementsByTagName("a")));
        for (var x = 0; x < array.length; x++) {
            var button = document.getElementsByTagName('button')[x];
            button.onmousedown = ((button, e) => {
                this.setClick(e, button);
            }).bind(undefined, button);
        }
    }
    static setUpTouch() {
        var array = Array.from(document.getElementsByTagName('button')).concat(Array.from(document.getElementsByTagName("a")));
        for (var x = 0; x < array.length; x++) {
            var button = document.getElementsByTagName('button')[x];
            button.ontouchstart = ((button, e) => {
                this.setTouch(e, button);
            }).bind(undefined, button);
        }
	}
    static setToButton(button) {
        this.checkForRipple();
        button.onmousedown = ((button, e) => {
            this.setClick(e, button);
        }).bind(undefined, button);
        button.ontouchstart = ((button, e) => {
            this.setTouch(e, button);
        }).bind(undefined, button);
    }
}
class Ripple {
	constructor(btn,f,color) {
        console.log("Creating ripple");
        var e = f.clientY ? f : f.touches[f.touches.length - 1];
        this.btn = btn;
        var btnSize = this.btn.getBoundingClientRect();
        this.start = Date.now();
        this.span = document.createElement("span");
        this.span.setAttribute("class", "ripple" + ((color != "none" && color != "" && color != null) ? (" ripple-" + color) : ""));
        this.btn.appendChild(this.span);
		if (!this.btn.numberOfRipples) this.btn.numberOfRipples = 0;
        this.btn.numberOfRipples ++;
		this.span.style.left = e.clientX - btnSize.left - 20 + 'px';
        this.span.style.top = e.clientY - btnSize.top - 20 + 'px';
        var dimen = Math.max(btnSize.width, btnSize.height);
        var decider = btnSize.height > btnSize.width ? e.clientY - btnSize.top : e.clientX - btnSize.left;
        var final = Math.max(decider, (dimen - decider));
        setTimeout(() => {
            this.span.style.opacity = '0.3';
		    this.span.style.transform = 'scale('+ (final / 20 + 0.5) + ',' + (final / 20 + 0.5) + ')';
        }, 50);
	}
	hide() {
        const duration = Math.max(350 - (Date.now() - this.start), 0);
        setTimeout(() => {
            this.span.style.transition = 'transform 5s,opacity 1s';
		    this.span.style.opacity = '0';
            setTimeout(this.remove, 1000, this.btn);
        }, duration);
	}
	remove(elem) {
        if (elem.childNodes[elem.childNodes.length - elem.numberOfRipples] && elem.childNodes[elem.childNodes.length - elem.numberOfRipples].getAttribute("class") == "ripple") {
            elem.removeChild(elem.childNodes[elem.childNodes.length - elem.numberOfRipples]);
        }
        elem.numberOfRipples --;
	}
}
