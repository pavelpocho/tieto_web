import css from './index.css';

export class RippleManager {
	static setUp() {
        if (this.ripple == undefined) {
            this.ripple = [];
        }
		this.rAS = 1;
        for (var x = 0; x < document.getElementsByTagName('button').length; x++) {
            document.getElementsByTagName('button')[x].onmousedown = function(e) {
			    if (!this.touched) {
				    RippleManager.ripple[RippleManager.ripple.length] = new Ripple(this,e,this.getAttribute("ripplecolor"));
                    document.body.onmouseup = function () {
                        if (!this.touched) {
                            RippleManager.ripple[RippleManager.ripple.length - 1].hide();
                            document.body.onmouseup = undefined;
                        }
                        else {
                            this.touched = false;
                        }
				    }
			    }
			    else {
				    this.touched = false;
			    }
		    }
        }
        for (var x = 0; x < document.getElementsByTagName('a').length; x++) {
            document.getElementsByTagName('a')[x].onmousedown = function (e) {
                if (!this.touched) {
                    RippleManager.ripple[RippleManager.ripple.length] = new Ripple(this, e);
                    document.body.onmouseup = function () {
                        if (!this.touched) {
                            RippleManager.ripple[RippleManager.ripple.length - 1].hide();
                            document.body.onmouseup = undefined;
                        }
                        else {
                            this.touched = false;
                        }
                    }
                }
                else {
                    this.touched = false;
                }
            }
        }
    }

    static setToButton(button) {
        if (this.ripple == undefined) {
            this.ripple = [];
        }
        button.onmousedown = function (e) {
            if (!this.touched) {
                RippleManager.ripple[RippleManager.ripple.length] = new Ripple(this, e);
                document.body.onmouseup = function () {
                    if (!this.touched) {
                        RippleManager.ripple[RippleManager.ripple.length - 1].hide();
                        document.body.onmouseup = undefined;
                    }
                    else {
                        this.touched = false;
                    }
                }
            }
            else {
                this.touched = false;
            }
        }
    }
}

class Ripple {
	constructor(btn,e,color) {
        this.btn = btn;
        this.start = Date.now();
        this.span = document.createElement("span");
        this.span.setAttribute("class", "ripple");
        if (color == "gray") {
            this.span.setAttribute("class", "ripple gray");
        }
		this.btn.appendChild(this.span);
		if (!this.btn.numberOfRipples) {
			this.btn.numberOfRipples = 0;
		}
		this.btn.numberOfRipples ++;
		this.span.style.left = e.clientX - btn.getBoundingClientRect().left - 20 + 'px';
		this.span.style.top = e.clientY - btn.getBoundingClientRect().top - 20 + 'px';
        this.span.style.opacity = '0.3';
		this.span.style.transform = 'scale(8,8)';
	}
	hide() {

        const dur = 350 - (Date.now() - this.start) < 0 ? 0 : 350 - (Date.now() - this.start);

        setTimeout(() => {
            this.span.style.transition = 'transform 5s,opacity 1s';
		    this.span.style.opacity = '0';
		    setTimeout(this.remove, 1000, this.btn);
        }, dur);
	}
	remove(elem) {
        if (elem.childNodes[elem.childNodes.length - elem.numberOfRipples].getAttribute("class") == "ripple") {
            elem.removeChild(elem.childNodes[elem.childNodes.length - elem.numberOfRipples]);
        }
        elem.numberOfRipples --;
	}
}


export class RippleTouchManager {
    static setUp() {
        if (this.ripple == undefined) {
            this.ripple = [];
        }
		this.rAS = 1;
        for (var x = 0; x < document.getElementsByTagName('button').length; x++) {
            document.getElementsByTagName('button')[x].ontouchstart = function(e) {
                this.touched = true;
                document.body.touched = true;
                RippleTouchManager.ripple[RippleTouchManager.ripple.length] = new RippleTouch(this, e);
                console.log(RippleTouchManager.ripple);
                setTimeout(function () {
                    RippleTouchManager.ripple[RippleTouchManager.ripple.length - 1].hide();
				}, 200);
			}
        }
        for (var x = 0; x < document.getElementsByTagName('a').length; x++) {
            document.getElementsByTagName('a')[x].ontouchstart = function (e) {
                this.touched = true;
                document.body.touched = true;
                RippleTouchManager.ripple[RippleTouchManager.ripple.length] = new RippleTouch(this, e);
                setTimeout(function () {
                    RippleTouchManager.ripple[RippleTouchManager.ripple.length - 1].hide();
                }, 200);
            }
        }
	}
}

class RippleTouch {
	constructor(btn,e) {
		console.log('creating');
        this.btn = btn;
        this.start = Date.now();
		this.span = document.createElement('span');
		this.span.setAttribute("class","ripple");
		this.btn.appendChild(this.span);
		if (!this.btn.numberOfRipples) {
			this.btn.numberOfRipples = 0;
		}
		this.btn.numberOfRipples ++;
		setTimeout(function(x,r,f) {
			x.expand(f,r);
		},20,this,btn,e);
	}
	expand(e,btn) {
		this.span.style.left = e.touches[0].clientX - btn.getBoundingClientRect().left - 5 + 'px';
		this.span.style.top = e.touches[0].clientY - btn.getBoundingClientRect().top - 5 + 'px';
		this.span.style.height = '10px';
		this.span.style.width = '10px';
		this.span.style.opacity = '0.4';
		this.span.style.transform = 'scale(20,20)';
	}
	hide() {

        const dur = 350 - (Date.now() - this.start) < 0 ? 0 : 350 - (Date.now() - this.start);

        setTimeout(() => {
            this.span.style.transition = 'transform 5s,opacity 0.4s';
            setTimeout(function(e) {
                e.span.style.opacity = '0';
            },20,this);
            setTimeout(this.remove,1000,this.btn);
        }, dur);	
	}
	remove(elem) {
        if (elem.childNodes[elem.childNodes.length - elem.numberOfRipples].getAttribute("class") == "ripple") {
            elem.removeChild(elem.childNodes[elem.childNodes.length - elem.numberOfRipples]);
        }
		elem.numberOfRipples --;
	}
}
