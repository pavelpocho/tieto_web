import css from './index.css';
import ObjectContainer from '../../utils/object-container';
export class RippleManager {
    static setUp() {
        if (this.ripple == undefined) this.ripple = [];
        var array = Array.from(document.getElementsByTagName('button')).concat(Array.from(document.getElementsByTagName("a")));
        for (var x = 0; x < array.length; x++) {
            var button = document.getElementsByTagName('button')[x];
            this.setUpButton(button);
        }
    }
    static setUpButton(button) {
        button.onmousedown = ((button, e) => { this.setClick(e, button) }).bind(undefined, button);
        button.ontouchstart = ((button, e) => { this.setTouch(e, button) }).bind(undefined, button);
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
    static setToButton(button) {
        if (this.ripple == undefined) this.ripple = [];
        this.setUpButton(button);
    }
}
class Ripple {
	constructor(btn,f,color) {
        var e = f.clientY ? f : f.touches[f.touches.length - 1];
        this.btn = btn;
        var btnSize = this.btn.getBoundingClientRect();
        this.start = Date.now();
        this.span = document.createElement("span");
        this.span.setAttribute("class", "ripple" + ((color != "none" && color != "" && color != null) ? (" ripple-" + color) : "") + (ObjectContainer.isDarkTheme() ? " dark" : ""));
        this.btn.appendChild(this.span);
		this.span.style.left = e.clientX - btnSize.left - 20 + 'px';
        this.span.style.top = e.clientY - btnSize.top - 20 + 'px';
        var decider = btnSize.height > btnSize.width ? e.clientY - btnSize.top : e.clientX - btnSize.left;
        var final = Math.max(decider, (Math.max(btnSize.width, btnSize.height) - decider)) / 20 + 0.5;
        setTimeout(() => {
            this.span.style.opacity = '0.3';
		    this.span.style.transform = 'scale('+ final + ')';
        }, 50);
	}
	hide() {
        setTimeout(() => {
            this.span.style.transition = 'transform 5s, opacity 1s';
		    this.span.style.opacity = '0';
            setTimeout(() => { if (this.span.parentElement == this.btn) this.btn.removeChild(this.span) }, 1000);
        }, Math.max(350 - (Date.now() - this.start), 0));
	}
}
